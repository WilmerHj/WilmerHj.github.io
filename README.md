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
       \[
       K^e += c,(dN\times dN)\,Jw
       + \alpha\,(N\times dN)\,Jw
       + \beta\,(dN\times N)\,Jw
       + a\,(N\times N)\,Jw.
       \]
     - Vector:
       \[
       F^e {+}{=} f\,N\,Jw - \gamma\,dN\,Jw.
       \]  
    4. Assemble \(K^e\) and \(F^e\) into global \(K\) and \(F\).
    5. (TODO) Explain how each term diffusion $(c)$, couplings $(\alpha, \beta)$, reaction $(a)$, body load $(f)$, and gradient load $\gamma$. affects assembly matrix.
6. Apply Boundry Conditions (BC).
7. Solve the linear system.
8. Return $(x, u)$.

      ```
      Ke += c   (dN ⊗ dN) Jw
          + α   (N  ⊗ dN) Jw
          + β   (dN ⊗ N ) Jw
          + a   (N  ⊗ N ) Jw

      Fe += f N Jw - γ dN Jw
      ```