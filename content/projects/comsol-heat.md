**PDE.** $\nabla \cdot(-c\nabla u - \alpha u + \gamma) + \beta \nabla u + au = f$. In 1D: $$\frac{d}{dx}\left(k \frac{dT}{dx}\right) - 25T + 25T_{air} = 0.$$

**Mapping.** $c=-K, u=T, a=-25, f=-25T_{air}$. Dirichlet + zero-flux on boundaries.
$$
\begin{align}
N_i &= \frac{x - x_j}{x_i-x_j} \quad N_j = \frac{x_i-x}{x_i-x_j} \newline
F_r &= \int_{x_1}^{x_2} 25 T_{air} N_r \, dx \newline
K_{rc} &= \int_{x_1}^{x_2} -\frac{d}{dx}\left(K \frac{d N_c}{dx}\right) N_r + 25 N_r N_c \, dx\newline
&= \int_{x_1}^{x_2} K \frac{d N_r}{dx} \frac{d N_c}{dx} + 25 N_r N_c \, dx\newline
\mathbf{T} &= K^{-1} \mathbf{F}
\end{align}
$$

**Result.** Temperature decays along the fin; MATLAB computations correspond to Comsol.
