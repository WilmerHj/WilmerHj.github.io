**Overview.** A two-part simulation-driven design project covering automated structural optimization and surrogate modeling for computationally expensive functions. The first task coupled MATLAB, Python, and Abaqus to minimize the mass of a cantilever I-beam. The second investigated Latin Hypercube Sampling and cubic metamodeling for a black-box optimization problem. Performed together with Florent Congost.

## Task 1 - Automated optimization of an I-beam

The objective was to minimize the mass of a $1.2\ \mathrm{m}$ cantilever I-beam subjected to a $75\ \mathrm{kN}$ end load acting at $45^{\circ}$.

Because the beam length and material density remained constant, minimizing mass was equivalent to minimizing the cross-sectional area:

$$
A =
2t_f w
+
\left(h-2t_f\right)t_w,
$$

where:

* $w$ is the flange width,
* $h$ is the section height,
* $t_f$ is the flange thickness,
* $t_w$ is the web thickness.

The design was required to satisfy:

$$
\sigma_{VM,max}\leq190\ \mathrm{MPa},
$$

$$
\delta_{max}\leq15\ \mathrm{mm},
$$

together with geometric bounds on the section dimensions.

## Finite element model

The beam was represented in Abaqus using quadratic Timoshenko beam elements. The model contained approximately 100 nodes and used:

| Parameter | Value |
| :--- | :--- |
| Length | $1.2\ \mathrm{m}$ |
| End load | $75\ \mathrm{kN}$ |
| Load direction | $-45^{\circ}$ |
| Young's modulus | $210\ \mathrm{GPa}$ |
| Shear modulus | $70\ \mathrm{GPa}$ |
| Stress limit | $190\ \mathrm{MPa}$ |
| Deflection limit | $15\ \mathrm{mm}$ |

The load was resolved into two components:

$$
F_x=F_y=
-\frac{75\,000}{\sqrt{2}}
\approx-53.0\ \mathrm{kN}.
$$

Maximum von Mises stress and resultant tip displacement were extracted from every Abaqus analysis.

## MATLAB-Python-Abaqus automation

A fully automated optimization loop was developed:

1. MATLAB supplied a new design vector containing $w$, $h$, $t_f$, and $t_w$.
2. The dimensions were written to an Abaqus parameter file.
3. Abaqus regenerated and solved the FE model.
4. Python scripts opened the Abaqus ODB file.
5. Maximum stress and tip-displacement components were written to result files.
6. MATLAB evaluated the normalized constraints and cross-sectional area.
7. The gradient-based fmincon algorithm generated the next design.

The nonlinear constraints were formulated as

$$
g_1=
\frac{\delta_{max}-\delta_{limit}}
{\delta_{limit}}
\leq0,
$$

$$
g_2=
\frac{\sigma_{VM,max}-\sigma_{limit}}
{\sigma_{limit}}
\leq0.
$$

Invalid Abaqus models or missing result files were penalized so the optimizer could recover and continue searching.

The same optimization architecture was also recreated in Isight using connected Abaqus, Calculator, and Optimization components. This provided an alternative graphical implementation of the automated workflow.

## Optimized design

The reported MATLAB-Abaqus solution was:

| Design variable | Optimized value |
| :--- | :--- |
| Flange width $w$ | $119.2\ \mathrm{mm}$ |
| Section height $h$ | $175.0\ \mathrm{mm}$ |
| Flange thickness $t_f$ | $21.8\ \mathrm{mm}$ |
| Web thickness $t_w$ | $1.0\ \mathrm{mm}$ |
| Cross-sectional area | $5.33\times10^{-3}\ \mathrm{m^2}$ |
| Maximum von Mises stress | $190\ \mathrm{MPa}$ |
| Maximum displacement | $5.8\ \mathrm{mm}$ |

The stress constraint became active while the displacement remained below its limit. The section height reached its upper bound and the web thickness reached its lower bound.

This result also exposes an important distinction between mathematical and engineering optimization: without buckling, fabrication, or minimum-gauge constraints, the optimizer drives the web toward an impractically small thickness. A production-oriented study would therefore require additional constraints for manufacturability, local buckling, and section slenderness.

## Task 2 - Metamodeling of an expensive black-box function

The second task considered a function requiring approximately three hours for each evaluation. Direct gradient-based optimization would therefore be prohibitively expensive.

Ten design points were generated using Latin Hypercube Sampling:

$$
\mathbf{x}^{(i)}
=
\mathbf{x}_{min}
+
\mathbf{u}^{(i)}
\odot
\left(
\mathbf{x}_{max}-\mathbf{x}_{min}
\right),
$$

where $\mathbf{u}^{(i)}$ contains the normalized Latin Hypercube coordinates.

MATLAB controlled an Excel-based black-box model through COM automation. The sampled input-output pairs were then used to construct a cubic response surface:

$$
\hat f(x_1,x_2)
=
\operatorname{CubicInterp}
\left(
x_1,x_2,f
\right).
$$

## Surrogate-model verification

The exercise demonstrated why a metamodel optimum must always be evaluated with the original high-fidelity function. Validation showed that the cubic surface did not reliably predict the true response near its proposed minimum.

The implementation also contained incorrectly scaled design bounds. Consequently, the numerical black-box optimum is not presented as a valid result. The useful outcome is instead methodological: space-filling sampling, input-domain verification, sufficient sample density, cross-validation, and confirmation using the original model are all essential before a surrogate is trusted for design decisions.

## Conclusion

The project demonstrates an end-to-end simulation-driven design workflow spanning parameterized FE modeling, automated solver execution, ODB post-processing, nonlinear constrained optimization, and graphical process automation in Isight.

It also highlights two practical lessons:

* Optimization results are only meaningful when all relevant physical and manufacturing constraints are included.
* A surrogate model must be validated against the original function before its predicted optimum is accepted.

The strongest result is the reusable MATLAB-Python-Abaqus framework, which separates optimization logic, FE evaluation, and result extraction into a modular automated process.
