**Overview.** A computational analysis of the pressure distribution, load capacity, and frictional power loss in a six-pad sector thrust bearing. The Reynolds equation was solved independently using the Finite Difference Method (FDM) and the Finite Element Method (FEM), allowing the two numerical formulations to be compared.

## Bearing model

Each pad covers an angular sector of $\phi=0.8\ \mathrm{rad}$ and contains a stepped lubricant-film geometry. The bearing dimensions and operating conditions were:

| Parameter | Value |
| :--- | :--- |
| Inner radius | $R_{in}=0.045\ \mathrm{m}$ |
| Outer radius | $R_{out}=0.120\ \mathrm{m}$ |
| Minimum film thickness | $h_{min}=40\ \mu\mathrm{m}$ |
| Film-height ratio | $k_0=2$ |
| Step position | $\beta=0.6\ \mathrm{rad}$ |
| Lubricant viscosity | $\eta=0.015\ \mathrm{Pa\,s}$ |
| Angular velocity | $\omega=29\ \mathrm{rad/s}$ |

The lubricant-film pressure is governed by the two-dimensional Reynolds equation in polar coordinates:

$$
\frac{1}{r}
\frac{\partial}{\partial r}
\left(
r h^3 \frac{\partial p}{\partial r}
\right)
+
\frac{1}{r^2}
\frac{\partial}{\partial \theta}
\left(
h^3 \frac{\partial p}{\partial \theta}
\right)
=
6\eta\omega\frac{\partial h}{\partial \theta}.
$$

Ambient-pressure boundary conditions, $p=0$, were applied along every edge of the pad.

## Finite Difference Method

The bearing domain was discretized using a structured mesh with 35 radial and 50 circumferential nodes. Central finite-difference approximations connected each interior node to its east, west, north, and south neighbours.

Because the stepped film thickness gives an undefined derivative at $\theta=\beta$, the transition was regularized using a hyperbolic tangent:

$$
h(\theta)
=
h_{min}
\left[
1+
\frac{k_0}{2}
\left(
1+\tanh\left(\frac{\beta-\theta}{\delta}\right)
\right)
\right].
$$

This produced a finite and analytically defined value of $\partial h/\partial\theta$ for the Reynolds-equation load vector.

## Finite Element Method

For the FEM solution, the Reynolds equation was transformed into its weak form and discretized using four-node bilinear quadrilateral elements.

The element matrix was evaluated with two-point Gaussian quadrature:

$$
\mathbf{K}_e
=
\int_{r_1}^{r_2}
\int_{\theta_1}^{\theta_2}
\left[
r h^3
\frac{\partial \mathbf{N}^{T}}{\partial r}
\frac{\partial \mathbf{N}}{\partial r}
+
\frac{h^3}{r}
\frac{\partial \mathbf{N}^{T}}{\partial \theta}
\frac{\partial \mathbf{N}}{\partial \theta}
\right]
d\theta\,dr.
$$

The mesh was refined around the radial and circumferential film-height discontinuities. Unlike the FDM formulation, the FEM load vector treated the film-height step analytically rather than smoothing it.

## Results

Both methods produced similar pressure fields, with the maximum located near the end of the raised film region.

| Method | Maximum pressure | Load per pad |
| :--- | :--- | :--- |
| FDM | $445.2\ \mathrm{kPa}$ | $770\ \mathrm{N}$ |
| FEM | $434.9\ \mathrm{kPa}$ | $738.17\ \mathrm{N}$ |

The maximum-pressure predictions differ by approximately 2.3%, while the calculated load capacities differ by approximately 4.1%. For all six pads, the FDM model predicts a total bearing load capacity of approximately $4.6\ \mathrm{kN}$.

The supporting load was obtained by integrating pressure over the sector:

$$
F
=
\int_{0}^{\phi}
\int_{R_{in}}^{R_{out}}
p(\theta,r)\,r\,dr\,d\theta.
$$

The lubricant shear stress was calculated from the combined Couette and pressure-driven flow:

$$
\tau_{\theta}
=
\eta\frac{\omega r}{h}
-
\frac{h}{2r}\frac{\partial p}{\partial\theta}.
$$

For the FDM solution, the resulting frictional power loss was approximately $10.98\ \mathrm{W}$ per pad, with a dimensionless relative power loss of approximately $0.00425$.

## Verification

A simplified one-dimensional analytical solution was derived for fixed radii. It predicted higher peak pressures than the two-dimensional numerical models because it does not capture radial pressure redistribution:

* $555\ \mathrm{kPa}$ at the mean radius.
* $823.8\ \mathrm{kPa}$ at the radius of the FEM pressure maximum.

**Conclusion.** The project demonstrates how the same lubrication problem can be formulated using both FDM and FEM. Despite different treatments of the discontinuous film geometry, the methods agreed closely on maximum pressure and load capacity. The comparison also shows why a two-dimensional model is important when radial pressure variation materially affects bearing performance.
