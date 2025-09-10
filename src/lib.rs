use wasm_bindgen::prelude::*;
use serde::Serialize;

#[derive(Serialize)]
struct Solution { x: Vec<f64>, u: Vec<f64> }

#[derive(Clone, Copy)]
enum Bc { Natural, Flux(f64), Dirichlet(f64) }

#[wasm_bindgen]
pub fn solve_constant_coeffs(
    // domain & mesh
    x_left: f64, x_right: f64, nel: usize,
    // coefficients (constants)
    c: f64, alpha: f64, beta: f64, a: f64, gamma: f64, f: f64,
    // left BC
    left_kind: &str, left_value: f64,
    // right BC
    right_kind: &str, right_value: f64
) -> Result<JsValue, JsValue> {
    if nel < 1 {
        return Err(JsValue::from_str("nel must be >= 1"));
    }

    let bc_left = parse_bc(left_kind, left_value)?; // Get BC from page.
    let bc_right = parse_bc(right_kind, right_value)?;

    let (x, u) = fem1d_flux_form( // This is what we return.
        x_left, x_right, nel,
        c, alpha, beta, a, gamma, f,
        bc_left, bc_right
    )?;

    let sol = Solution { x, u };
    serde_wasm_bindgen::to_value(&sol).map_err(|e| JsValue::from_str(&format!("{e}")))
}

fn parse_bc(kind: &str, value: f64) -> Result<Bc, JsValue> {
    match kind.to_lowercase().as_str() {
        "natural"   => Ok(Bc::Natural),
        "flux"      => Ok(Bc::Flux(value)),
        "dirichlet" => Ok(Bc::Dirichlet(value)),
        _ => Err(JsValue::from_str("BC type must be natural, flux, or dirichlet")),
    }
}

// FEM solver core
fn fem1d_flux_form(
    x_left: f64, x_right: f64, nel: usize,
    c: f64, alpha: f64, beta: f64, a: f64, gamma: f64, f: f64,
    bc_left: Bc, bc_right: Bc
) -> Result<(Vec<f64>, Vec<f64>), JsValue> {
    let nd = nel + 1;
    let mut x = Vec::with_capacity(nd);
    for i in 0..nd { // Create domain "x = linspace(x_left, x_right, nel+1)".
        let t = i as f64 / nel as f64;
        x.push(x_left + t * (x_right - x_left));
    }

    let mut k = vec![0.0f64; nd*nd];  // k = nd x nd matrix
    let mut fglob = vec![0.0f64; nd]; // f = 1 x nd matrix

    let xi = [ -1.0f64 / 3.0f64.sqrt(),  1.0f64 / 3.0f64.sqrt() ]; // Gaussian 
    let w  = [ 1.0f64, 1.0f64 ];

    for e in 0..nel {   // For each element:
        let n1 = e;     // First node
        let n2 = e+1;   // Second element
        let x1 = x[n1]; // x @ 1st element
        let x2 = x[n2]; // x @ 2nd element
        let (ke, fe) = element_p1(x1, x2, &xi, &w, c, alpha, beta, a, gamma, f); // k for element, f for element
        add22(&mut k, nd, n1, n2, &ke); // Add 2x2 matrix to bigg assembly.
        fglob[n1] += fe[0];
        fglob[n2] += fe[1];
    }

    apply_bc(&mut k, &mut fglob, nd, 0, bc_left);
    apply_bc(&mut k, &mut fglob, nd, nd-1, bc_right);

    let u = solve_dense(k, fglob, nd)?;
    Ok((x, u))
}

fn element_p1(
    x1: f64, x2: f64,
    xi: &[f64;2], w: &[f64;2],
    c: f64, alpha: f64, beta: f64, a: f64, gamma: f64, f: f64
) -> ([f64;4], [f64;2]) {
    let j = 0.5*(x2 - x1);                  // Jacobian determinant
    let dndxi = [-0.5, 0.5];               // dn/dxi
    let dndx  = [dndxi[0]/j, dndxi[1]/j]; // 1/J * dn/dxi
    let mut ke = [0.0; 4]; //!!!!!!!!!!!!!!!
    let mut fe = [0.0; 2]; //!!!!!!!!!!!!!!!

    for q in 0..2 { // for each
        let xiq = xi[q]; //!!!!!!!!!!!!!!!
        let wj = w[q]*j; ///!!!!!!!!!!!!!!!
        let n = [ (1.0 - xiq)*0.5, (1.0 + xiq)*0.5 ];

        add22_scaled(&mut ke, &crossProd(&dndx, &dndx), c * wj);
        add22_scaled(&mut ke, &crossProd(&n, &dndx), alpha * wj);
        add22_scaled(&mut ke, &crossProd(&dndx, &n), beta * wj);
        add22_scaled(&mut ke, &crossProd(&n, &n), a * wj);

        fe[0] += n[0] * f * wj; //!!!!!!!!!!!!!!!
        fe[1] += n[1] * f * wj;
        fe[0] += -dndx[0] * gamma * wj;
        fe[1] += -dndx[1] * gamma * wj;
    }
    (ke, fe)
}

// Each element in a x b
fn crossProd(a: &[f64;2], b: &[f64;2]) -> [f64;4] { 
    [a[0]*b[0], a[0]*b[1],
    a[1]*b[0], a[1]*b[1]]
}
// Puts each element in a x b into a 2x2 matrix.
fn add22(dst: &mut [f64], n: usize, i: usize, j: usize, m: &[f64;4]) {
    dst[i*n + i] += m[0]; dst[i*n + j] += m[1];
    dst[j*n + i] += m[2]; dst[j*n + j] += m[3];
}
// Puts 2x2 matrix into larger "ke (m) into k (dst)".
fn add22_scaled(dst: &mut [f64;4], m: &[f64;4], s: f64) {
    dst[0]+=s*m[0]; dst[1]+=s*m[1];
    dst[2]+=s*m[2]; dst[3]+=s*m[3];
}

fn apply_bc(k:&mut [f64], f:&mut [f64], n:usize, node:usize, bc:Bc){
    match bc {
        Bc::Natural => {}
        Bc::Flux(qb) => { f[node] += qb; }
        Bc::Dirichlet(g) => enforce_dirichlet(k, f, n, node, g),
    }
}
fn enforce_dirichlet(k:&mut [f64], f:&mut [f64], n:usize, i:usize, g:f64){
    for r in 0..n { f[r] -= k[r*n + i]*g; }
    for c in 0..n { k[i*n + c] = 0.0; }
    for r in 0..n { k[r*n + i] = 0.0; }
    k[i*n + i] = 1.0; f[i] = g;
}

fn solve_dense(mut k:Vec<f64>, mut f:Vec<f64>, n:usize) -> Result<Vec<f64>, JsValue>{
    for i in 0..n {
        let mut piv = i; let mut maxv = k[i*n+i].abs();
        for r in (i+1)..n { let v = k[r*n+i].abs(); if v>maxv {maxv=v; piv=r;} }
        if maxv==0.0 { return Err(JsValue::from_str("Singular matrix")); }
        if piv!=i { for c in 0..n { k.swap(i*n+c, piv*n+c); } f.swap(i,piv); }
        let kii = k[i*n+i];
        for r in (i+1)..n {
            let m = k[r*n+i]/kii; if m==0.0 {continue;}
            for c in i..n { k[r*n+c] -= m*k[i*n+c]; }
            f[r] -= m*f[i];
        }
    }
    let mut u = vec![0.0; n];
    for i in (0..n).rev() {
        let mut s = f[i];
        for c in (i+1)..n { s -= k[i*n+c]*u[c]; }
        u[i] = s / k[i*n+i];
    }
    Ok(u)
}
