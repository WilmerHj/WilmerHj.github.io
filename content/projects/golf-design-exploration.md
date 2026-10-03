**Overview.** The project consists of two parts: constructing a prediction model for a golf ball's trajectory and optimizing the geometry of a parametric golf club head to maximize carry distance.

**Part 1: Trajectory Prediction.**
The goal was to build a model to predict the carry and apex of a golf ball using simulator data. The ball is subject to drag and lift forces, modeled as proportional to the square of the velocity:
$$
F_D = k_{Drag} \cdot v^2, \quad F_L = k_{Lift} \cdot v^2
$$

The system is modeled in 2D, where the acceleration components are derived from Newton's second law:
$$
\begin{align}
a_x &= -\frac{1}{m} \left[ k_{Lift}\sin(\alpha) + k_{Drag}\cos(\alpha) \right] \cdot \|v\|^2 \newline
a_y &= +\frac{1}{m} \left[ k_{Lift}\cos(\alpha) - k_{Drag}\sin(\alpha) \right] \cdot \|v\|^2 - g
\end{align}
$$

**Parameter Estimation.**
Using the `fminsearch` function in MATLAB, a non-linear least square error optimization was performed to estimate $k_{Drag}$ and $k_{Lift}$ by minimizing the difference between predicted and actual carry.

* **Results:** The calculated coefficients were $C_D \approx 0.34$ and $C_L \approx 0.32$, which aligns with standard literature.
* **Accuracy:** 8 out of 11 hits had an error below 2%, though apex error reached up to 16.8% for inexperienced shots.

**Part 2: Geometry Optimization.**
The second objective was to optimize a fully parametric golf club head to maximize carry distance for a beginner level player.

**Method.**
To solve the unknown relationships between design variables and club velocity, a **Latin Hypercube Sampling (LHS)** was used to generate initial points, followed by a gradient-based optimization (`fmincon`) to minimize the negative carry.

**Optimal Design.**
The process successfully produced a design within bounds, with parameters pushing the physical limits:
* **Blade Width:** 150 mm (Upper Bound)
* **Blade Depth:** 50 mm (Upper Bound)
* **Loft:** 5$^{\circ}$ (Lower Bound)
* **Toe Height:** $\approx$ 51 mm

The final optimized club yielded a maximum carry of 275 meters, proving the utility of simulation-driven design.
