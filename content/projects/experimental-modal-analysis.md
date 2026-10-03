**Overview.** A two-part structural dynamics lab project comparing Finite Element predictions against Experimental Modal Analysis (EMA), then updating the FE models until simulation and measurement agree. Performed together with Tobias Johansson.

**Part 1 - Steel beam (free-free & cantilever).**
The first three bending modes of a 400 mm steel beam were predicted with two FE formulations: Euler-Bernoulli beam elements in MATLAB/CALFEM and Timoshenko (B31) elements in Abaqus. The mode shape plots identified the node lines - locations where a mode is always zero - to avoid placing accelerometers there.

| Mode | Abaqus [Hz] | MATLAB [Hz] | Experimental [Hz] |
| :--- | :--- | :--- | :--- |
| 1 | 323.44 | 324.77 | 326.17 |
| 2 | 886.87 | 895.25 | 891.11 |
| 3 | 1726.40 | 1755.06 | 1736.82 |

With the highest frequency of interest ≈ 1755 Hz, the sampling frequency was set to $f_s = 4000$ Hz. FRFs (accelerance) and coherence were measured with roving accelerometers; the best point kept coherence above 80% for 98.7% of all data points.

**Model updating (Part 1).** Since $K\psi = \omega^2 M \psi$, the Young's modulus can be scaled directly from the frequency ratio:

$$
E_{new} = \left( \frac{f_{exp}}{f_{sim}} \right)^2 E_0 = 67.78 \ \mathrm{GPa} \quad (E_0 = 69 \ \mathrm{GPa})
$$

This normalized the errors but could not remove them all, as the deviations had mixed signs. For the cantilever case, replacing the ideal clamp with a rotational spring $k_\theta = 50 \ \mathrm{kNm/rad}$ matched the experiment better than scaling the stiffness - the real fixture is not ideally rigid.

**Part 2 - Welded T-structure.**
A T-shaped structure of two welded 35$	imes$35$	imes$2 mm hollow steel sections (327 mm horizontal, 500 mm vertical) was modeled in Abaqus. The predicted mode shapes guided the pretest planning: the shaker was placed at the end of the vertical beam where both modes are most visible, and 13 response points were distributed over the structure.

**Measurement.** Excitation by shaker, response by 3 accelerometers (QuickDAQ): 0-150 Hz range, 4000 Hz sample rate, FFT size 8192, Hanning window, 20 averages. Modal parameters were extracted from the stabilization diagram:

| Mode | First FE-model | Updated FE-model | EMA | Damping $\zeta$ |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 121.55 Hz | 100.61 Hz | 100.61 Hz | 0.429% |
| 2 | 136.18 Hz | 126.59 Hz | 126.63 Hz | 0.495% |

**Model updating (Part 2).** The ideally fixed support overestimated the stiffness by ~20%. Replacing it with boundary springs (rotation about x: $1.25 \cdot 10^5$ N/rad, about y: $1.9 \cdot 10^4$ N/rad, about z: $10^6$ N/rad, translation in z: $10^{15}$ N/m) reproduced the measured frequencies almost exactly.

**Conclusion.** Idealized clamped boundary conditions consistently overpredict resonance frequencies. Calibrating boundary stiffness against EMA data - rather than scaling material parameters - reconciles the FE model with reality, since real fixtures are never ideally rigid.
