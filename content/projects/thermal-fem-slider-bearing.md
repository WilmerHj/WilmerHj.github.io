**Overview.** The transient thermal model was reproduced in Abaqus and Matlab to verify the implementation and compare the two finite element solutions.

The first problem investigated how long a heated martensitic-steel component could remain in ambient air before its surface temperature fell below a manufacturing limit of $950\,^{\circ}\mathrm{C}$.

The component's elliptic cross-section was approximated by a sphere with radius

$$
R=\sqrt{a^2+b^2}\approx0.029\ \mathrm{m}.
$$

The component was initially at

$$
T_0=1030\,^{\circ}\mathrm{C},
$$

with an ambient-air temperature of

$$
T_{\mathrm{air}}=25\,^{\circ}\mathrm{C}.
$$

Radial heat conduction was described by the transient heat equation in spherical coordinates:

$$
\rho c_p\frac{\partial T}{\partial t}
=
\frac{1}{r^2}
\frac{\partial}{\partial r}
\left(
k r^2\frac{\partial T}{\partial r} \right).
$$

Heat loss from the outer surface included convection and nonlinear thermal radiation:

$$
q_s= h(T_s-T_{\mathrm{air}})
+
\varepsilon\sigma
\left(
T_s^4-T_{\mathrm{air}}^4
\right),
$$

where $h=15\ \mathrm{W/(m^2K)}$. An emissivity of $\varepsilon=1$ was used in the comparison model.

### MATLAB finite element model

The radial domain was discretized using linear finite elements. Element capacity and conductivity matrices were assembled into the global system

$$
\mathbf C\dot{\mathbf T}
+
\mathbf K\mathbf T
=
\mathbf f(\mathbf T).
$$

Time integration was performed using the Crank-Nicolson method,

$$
\left(
\frac{\mathbf C}{\Delta t}
+
\frac{\mathbf K}{2}
\right)
\mathbf T_{n+1}
=
\left(
\frac{\mathbf C}{\Delta t}
-
\frac{\mathbf K}{2}
\right)
\mathbf T_n
+
\frac{\mathbf f_n+\mathbf f_{n+1}}{2}.
$$

Because the radiation heat flux varies with $T_s^4$, the surface-load vector is nonlinear. A nonlinear iteration was therefore performed within each time increment to update $\mathbf f_{n+1}$ until the temperature solution converged.

The MATLAB model used 20 radial nodes and a time increment of

$$
\Delta t=0.01\ \mathrm{s}.
$$

### Independent verification in Abaqus

The same cooling problem was recreated independently in Abaqus/Standard using a three-dimensional heat-transfer model of the sphere.

The Abaqus model used:

* the same geometry and thermal properties as the MATLAB model;
* an initial temperature of $1030\,^{\circ}\mathrm{C}$;
* convection to air at $25\,^{\circ}\mathrm{C}$;
* nonlinear surface radiation;
* a transient heat-transfer step; and
* linear tetrahedral heat-transfer elements.

This provided an independent implementation of the same physical problem and allowed the MATLAB solver to be checked against a commercial finite element code.

The comparison also proved useful for debugging the numerical implementation. An earlier MATLAB formulation weighted the surface-load vector only as $\theta\mathbf f$. For the general $\theta$-method, the correct contribution is

$$
(1-\theta)\mathbf f_n+\theta\mathbf f_{n+1}.
$$

For Crank-Nicolson, where $\theta=0.5$, this becomes

$$
\frac{\mathbf f_n+\mathbf f_{n+1}}{2}.
$$

Correcting the load treatment and iterating the nonlinear radiation term produced close agreement with Abaqus.

### Results

Both models predicted essentially the same time for the surface to cool from $1030\,^{\circ}\mathrm{C}$ to $950\,^{\circ}\mathrm{C}$:

| Model           | Time to $950\,^{\circ}\mathrm{C}$ |
| --------------- | -------------------------------: |
| MATLAB FEM      |     $\approx 14.300\ \mathrm{s}$ |
| Abaqus/Standard |     $\approx 14.294\ \mathrm{s}$ |

The difference between the reported threshold times was approximately

$$
0.006\ \mathrm{s},
$$

or about $0.04\%$.

The close agreement between two independently constructed finite element models provides strong verification of the numerical implementation within the assumptions of the model.

It also demonstrates the value of independent solver comparison: Abaqus was not simply used to reproduce the result, but as a verification tool that helped identify and correct an error in the original time-integration implementation.

### Analytical verification
To check the numerical results, an analytical estimate was obtained from the one-term approximation for transient conduction in a sphere.
The nonlinear radiation flux was linearized over the cooling interval (1030 °C &rarr; 950 °C) by introducing an equivalent radiation coefficient evaluated at the mean surface temperature. The effective heat-transfer coefficient then became
$$h_{\mathrm{eff}}=h+h_{\mathrm{rad}},$$
yielding the Biot number
$$Bi_R=\frac{h_{\mathrm{eff}}R}{k}\approx0.1045.$$
Using tabulated coefficients for $  Bi=0.1  $ ($  \zeta_1\approx0.5423  $, $  C_1\approx1.0298  $), the surface temperature was evaluated from
$$\theta_s^*=C_1\frac{\sin(\zeta_1)}{\zeta_1}\exp(-\zeta_1^2Fo).$$
Solving for the Fourier number and converting to time gave
$$ Fo = \frac{1}{-\zeta_1^2} \ln\left(\frac{C_1 \sin(\zeta_1)}{\theta_s^*}\right) $$
$$ t = \frac{Fo R^2}{\alpha} $$
$$t_{\mathrm{analytic}}\approx14.55\,\mathrm{s}.$$

This lies within 2 % of the numerical predictions (14.3 s). The small difference is expected: the analytical model holds $h_{\mathrm{rad}}$ constant, whereas the MATLAB and Abaqus solutions retain the full nonlinear $T^4$ dependence. The close agreement nevertheless confirms the physical consistency of the numerical results.

## Key takeaways

The project combined equation-based modelling with numerical implementation and independent FE verification. Rather than treating the numerical solver as a black box, the governing equations were derived, discretized and implemented directly before the thermal model was cross-checked in Abaqus.

**Methods and tools:** MATLAB, Abaqus/Standard, finite element method, Crank-Nicolson time integration, nonlinear thermal boundary conditions, solver-to-solver verification.
