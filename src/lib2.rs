// src/lib.rs
use wasm_bindgen::prelude::*;
use js_sys::Float64Array;
use std::f64::consts::PI;

#[wasm_bindgen]
pub struct FemSolver1D {
    nodes: Vec<f64>,
    elements: Vec<[usize; 3]>,
    global_matrix: Vec<Vec<f64>>,
    global_rhs: Vec<f64>,
    solution: Vec<f64>,
}

#[wasm_bindgen]
impl FemSolver1D {
    #[wasm_bindgen(constructor)]
    pub fn new(x_start: f64, x_end: f64, num_elements: usize) -> FemSolver1D { // x-start, x-end, number of elements
        let element_length = (x_end - x_start) / num_elements as f64;
        let mut nodes = Vec::with_capacity(2 * num_elements + 1);

        for i in 0..=(2 * num_elements) {
            nodes.push(x_start + i as f64 * element_length / 2.0);
        }

        let mut elements = Vec::with_capacity(num_elements);
        for i in 0..num_elements {
            elements.push([2 * i, 2 * i + 1, 2 * i + 2]);
        }

        let num_nodes = nodes.len();
        FemSolver1D {
            nodes,
            elements,
            global_matrix: vec![vec![0.0; num_nodes]; num_nodes],
            global_rhs: vec![0.0; num_nodes],
            solution: vec![0.0; num_nodes],
        }
    }

    pub fn assemble_poisson(&mut self) {
        let a = |_x: f64| 1.0; // 
        let b = |_x: f64| 0.0;
        let f = |x: f64| PI * PI * (PI * x).sin();
        self.assemble_system(a, b, f);
    }

    pub fn apply_dirichlet_zero(&mut self) {
        self.apply_boundary_conditions(Some(0.0), Some(0.0));
    }

    pub fn solve_system(&mut self) {
        self.solve();
    }

    pub fn assemble_pressure_problem(&mut self, eta: f64, u_velocity: f64) {
        let h0 = 60e-6;
        let h_func = move |x: f64| h0 * (-10.0 * x).exp(); // h0 e^-10x
        let dh_dx  = move |x: f64| -10.0 * h0 * (-10.0 * x).exp(); // -10 h0 e^-10x


        // Solving: d/dx[ h^3/(12 eta) dp/dx ] = d/dx[ U/2 h ] for p.
        let a = move |x: f64| {
            let h = h_func(x);
            h * h * h / (12.0 * eta)    // a = h^3/(12*eta)
        };

        let f = move |x: f64| {
            let dh = dh_dx(x);
            -u_velocity * dh / 2.0      // f = -u/2 * dh/dx
        };

        self.assemble_system(a, |_x| 0.0, f);
    }

    #[wasm_bindgen]
    pub fn solve_pressure_problem(&mut self, eta: f64, u_velocity: f64) {
        self.assemble_pressure_problem(eta, u_velocity);
        self.apply_boundary_conditions(Some(0.0), Some(0.0));
        self.solve();
    }

    #[wasm_bindgen]
    pub fn get_nodes(&self) -> Float64Array {
        Float64Array::from(&self.nodes[..])
    }

    #[wasm_bindgen]
    pub fn get_solution(&self) -> Float64Array {
        Float64Array::from(&self.solution[..])
    }
}

impl FemSolver1D {
    fn shape_functions(xi: f64) -> [f64; 3] {
        [
            0.5 * xi * (xi - 1.0),
            1.0 - xi * xi,
            0.5 * xi * (xi + 1.0),
        ]
    }

    fn shape_function_derivatives(xi: f64) -> [f64; 3] {
        [
            xi - 0.5,
            -2.0 * xi,
            xi + 0.5,
        ]
    }

    fn gauss_points() -> [(f64, f64); 3] {
        [
            (-0.7745966692414834, 0.5555555555555556),
            (0.0, 0.8888888888888889),
            (0.7745966692414834, 0.5555555555555556),
        ]
    }

    fn assemble_system<F1, F2, F3>(&mut self, coeff_a: F1, coeff_b: F2, source_f: F3)
    where
        F1: Fn(f64) -> f64,
        F2: Fn(f64) -> f64,
        F3: Fn(f64) -> f64,
    {
        for i in 0..self.global_matrix.len() {
            for j in 0..self.global_matrix[i].len() {
                self.global_matrix[i][j] = 0.0;
            }
            self.global_rhs[i] = 0.0;
        }

        for &element in &self.elements {
            let x1 = self.nodes[element[0]];
            let x3 = self.nodes[element[2]];
            let jacobian = (x3 - x1) / 2.0;

            let mut local_matrix = [[0.0; 3]; 3];
            let mut local_rhs = [0.0; 3];

            for &(xi, weight) in &Self::gauss_points() {
                let x = x1 + jacobian * (xi + 1.0);
                let n = Self::shape_functions(xi);
                let dn_dxi = Self::shape_function_derivatives(xi);

                let a_val = coeff_a(x);
                let b_val = coeff_b(x);
                let f_val = source_f(x);

                for i in 0..3 {
                    for j in 0..3 {
                        local_matrix[i][j] += a_val * (dn_dxi[i] / jacobian) * (dn_dxi[j] / jacobian) * jacobian * weight;
                        local_matrix[i][j] += b_val * n[i] * n[j] * jacobian * weight;
                    }
                    local_rhs[i] += f_val * n[i] * jacobian * weight;
                }
            }

            for i in 0..3 {
                for j in 0..3 {
                    self.global_matrix[element[i]][element[j]] += local_matrix[i][j];
                }
                self.global_rhs[element[i]] += local_rhs[i];
            }
        }
    }

    fn apply_boundary_conditions(&mut self, left_bc: Option<f64>, right_bc: Option<f64>) {
        let n = self.nodes.len();
        if let Some(val) = left_bc {
            for j in 0..n {
                self.global_matrix[0][j] = 0.0;
            }
            self.global_matrix[0][0] = 1.0;
            self.global_rhs[0] = val;
        }
        if let Some(val) = right_bc {
            for j in 0..n {
                self.global_matrix[n - 1][j] = 0.0;
            }
            self.global_matrix[n - 1][n - 1] = 1.0;
            self.global_rhs[n - 1] = val;
        }
    }

    fn solve(&mut self) {
        let n = self.global_matrix.len();
        let mut matrix = self.global_matrix.clone();
        let mut rhs = self.global_rhs.clone();

        for i in 0..n {
            let mut max_row = i;
            for k in (i + 1)..n {
                if matrix[k][i].abs() > matrix[max_row][i].abs() {
                    max_row = k;
                }
            }
            matrix.swap(i, max_row);
            rhs.swap(i, max_row);

            let diag = matrix[i][i];
            for j in i..n {
                matrix[i][j] /= diag;
            }
            rhs[i] /= diag;

            for k in (i + 1)..n {
                let factor = matrix[k][i];
                for j in i..n {
                    matrix[k][j] -= factor * matrix[i][j];
                }
                rhs[k] -= factor * rhs[i];
            }
        }

        self.solution = vec![0.0; n];
        for i in (0..n).rev() {
            self.solution[i] = rhs[i];
            for j in (i + 1)..n {
                self.solution[i] -= matrix[i][j] * self.solution[j];
            }
        }
    }
}
