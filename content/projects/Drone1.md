**Overview.** An accurate controlled robot that can move on ground and in air.

**Odometry.** Designed & built a balancing drone robot including both mechanical parts and control algorithms for automated navigation system using MATLAB and Simulink.
For wheel i, the velocity is calculated as
$$
V_i = \bar{V} + \overline{r_{i/C}} \times \bar{\omega}
= V\hat{y} + \det\left| \begin{bmatrix}
    \hat{x} & \hat{y} & \hat{z} \newline
    r_x & r_y & r_z \newline
    0 & 0 & \omega_z
\end{bmatrix} \right|
= (V - r_x \omega_z) \hat{y}
$$

The left wheel has a directed distance of $+\frac{L}{2}$
and the right wheel a directed distance of $-\frac{L}{2}$ in the x-direction relative to C.
We obtain the equations:

$$
\begin{cases}
V_l = V - \frac{L}{2}\,\omega_z
  = \begin{bmatrix} 1 & -\frac{L}{2} \end{bmatrix}\begin{bmatrix} V \newline \omega_z \end{bmatrix} \newline
V_r = V + \frac{L}{2}\,\omega_z
  = \begin{bmatrix} 1 & +\frac{L}{2} \end{bmatrix}\begin{bmatrix} V \newline \omega_z \end{bmatrix}
\end{cases}
$$
