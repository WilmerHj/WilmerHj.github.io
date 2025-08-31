# WilmerHj.github.io
Portfolio Site and FEM tool.

The FEM-tool solves $\nabla(-c\nabla u -\alpha u + \gamma) + \beta \nabla u + au = f$ for $u(x)$ with linear elements in 1D.

The solver computes a scalar field  on a 1D domain  using linear finite elements and two‑point Gaussian quadrature. The assembled weak form is (TODO).

The process follows as such:
1. Create uniform mesh (x-domain) by dividing [x_left ; x_right] into \(nd=nel+1\) number of elements.
2. Create k-matrix (Global Assembly Matrix) as $nd\times nd$-matrix.
3. Create RHS vector.
4. Define Gauss Quadrature points $\xi=\pm 1/\sqrt{3}$, weights $w=1$.
5. For each emenet:
    1. Compute Jacobian as $\tfrac{x_2 - x_1}{2}$
    2. For each Gauss-point we evaluate the shape functions $N_1(\xi)=\tfrac{1-\xi}{2}, N_2(\xi)=\tfrac{1+\xi}{2}$; derivatives $dN/dx=(dN/d\xi)/J$.
    3. At each Gauss point:
    - Matrix:

        $\vec{k_e} = \begin{bmatrix} W & X \\\ Y & Z\end{bmatrix}$
     - Vector:

        $\vec{f} = \begin{bmatrix} X \\\ Y\end{bmatrix}$
    4. Assemble \(K^e\) and \(F^e\) into global \(K\) and \(F\).
    5. (TODO) Explain how each term diffusion $(c)$, couplings $(\alpha, \beta)$, reaction $(a)$, body load $(f)$, and gradient load $\gamma$. affects assembly matrix.
6. Apply Boundry Conditions (BC).
  - (TODO) Explain how each BC affects assembly matrix and RHS.
7. Solve the linear system.
  - (TODO) Explain how the linear system is solved in RUST.
8. Return $(x, u)$.

