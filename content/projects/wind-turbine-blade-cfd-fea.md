**Overview.** In this project, I followed the load on a 44.2 m wind-turbine blade from the airflow all the way into the structure. I first solved the aerodynamics in ANSYS Fluent and then transferred the pressure field to a composite-shell model in ANSYS Mechanical.

Getting a result was only part of the goal. I also wanted to find out which results could actually be trusted. The thrust agreed very well with an independent momentum calculation. The torque was much more sensitive to the mesh, and a free-body check showed that about one quarter of the aerodynamic load was lost during the transfer to Mechanical.

**The model**
| Item             | Model                                                    |
| :--------------- | :------------------------------------------------------- |
| Rotor            | Three blades, radius 44.2 m                              |
| Operating point  | 12 m/s, 2.22 rad/s, 21.2 rpm, TSR 8.18                   |
| CFD              | Steady RANS, SST k-omega, rotating reference frame       |
| Fluid domain     | One 120-degree periodic sector with one blade            |
| Fluid mesh       | 367,691 tetrahedra, 73,331 nodes, 5,108 blade-wall faces |
| Structural model | 15,881 SHELL181 and 13,508 SURF154 elements              |
| Material         | Simplified orthotropic UD composite                      |
| Coupling         | Pressure transferred from Fluent to Mechanical           |

Only one blade and one third of the fluid domain were solved. The other two blades were represented through rotational periodicity. This reduced the model size without changing the physics for a rotor in uniform wind.

A multiple reference frame, or MRF, model was used to describe the rotation as a steady problem. This works for the current model because it does not include a tower, wind shear or yawed flow.

**Rotational kinematics**

The rotor turns at a constant speed, and the blade does not move relative to the rotating frame. Therefore,

$$
\dot\omega_z=0,
\qquad
\vec v_{rel}=0,
\qquad
\vec a_{rel}=0.
$$

The blade velocity and acceleration can then be written as

$$
\vec v
=
\vec\omega\times\vec r,
\qquad
\vec a
=
\vec\omega
\times
\left(
\vec\omega\times\vec r
\right).
$$

In cylindrical coordinates,

$$
\vec\omega
=
\omega_z\hat z,
\qquad
\vec r
=
R\hat r.
$$

The blade velocity follows from the cross product

$$
\vec\omega\times\vec r
=
\begin{vmatrix}
\hat r & \hat\theta & \hat z\\
0 & 0 & \omega_z\\
R & 0 & 0
\end{vmatrix}
=
\omega_zR\hat\theta.
$$

At the blade tip, the velocity is

$$
\left|\vec v_{tip}\right|
=
\left|\omega_z\right|R
=
2.22\times44.2
=
98.1\ \text{m/s}.
$$

The centripetal acceleration is found by taking a second cross product:

$$
\vec\omega
\times
\left(
\vec\omega\times\vec r
\right)
=
\begin{vmatrix}
\hat r & \hat\theta & \hat z\\
0 & 0 & \omega_z\\
0 & \omega_zR & 0
\end{vmatrix}
=
-\omega_z^2R\hat r.
$$

The minus sign means that the acceleration points inward, toward the hub. At the blade tip,

$$
\left|\vec a_{tip}\right|
=
\omega_z^2R
=
2.22^2\times44.2
=
217.8\ \text{m/s}^2
=
22.2g.
$$

The shell model has its center of gravity at

$$
R_{CG}=14.087\ \text{m}.
$$

The acceleration at the center of gravity is therefore

$$
\left|\vec a_{CG}\right|
=
2.22^2\times14.087
=
69.43\ \text{m/s}^2.
$$

With a blade mass of 22,147.7 kg, the expected radial root force becomes

$$
\begin{aligned}
F_{root}
&=
m\omega_z^2R_{CG}\\
&=
22\,147.7\times69.43\\
&=
1.538\times10^6\ \text{N}
=
1.538\ \text{MN}.
\end{aligned}
$$

Mechanical reported 1.5388 MN. That is only 0.07% above the hand calculation. When the small radial aerodynamic force of 1.6 kN is included, the difference falls to **0.03%**.

**Checking the CFD result**

I used four checks to judge whether the CFD solution had converged:

* The momentum residuals reached roughly $10^{-6}$, while continuity reached $3.0	imes10^{-5}$.
* The integrated pressure force changed by only **0.025%** during the final 50 iterations.
* The mass-flow imbalance was $1.09	imes10^{-6}$ kg/s on a total flow of about 886,000 kg/s.
* The thrust from the blade surface was compared with a separate momentum balance over the outer boundaries of the fluid domain.

The momentum balance was the most useful check. Integrating the pressure and shear directly over the blade gave **82.09 kN per blade**. The independent control-volume calculation gave **82.52 kN**. The difference was only **0.52%**.

| Rotor result       |    Value | Assessment                                  |
| :----------------- | -------: | :------------------------------------------ |
| Thrust             |   246 kN | Verified independently to 0.52%             |
| Thrust coefficient |    0.455 | Reasonable at this operating point          |
| Torque             | 364 kNm  | Not mesh-converged                          |
| Shaft power        |   807 kW | Based on the uncertain torque               |
| Power coefficient  |    0.124 | Should not be treated as a validated result |

The pressure field had the expected pattern: high pressure near the leading-edge stagnation point, low pressure on the suction side and a gradual recovery toward the trailing edge.

The outer part of the blade carried most of the structural load. The **outer 30% of the span produced 53% of the thrust**, which is especially important because this load also acts with the longest lever arm.

The torque result was less convincing. Near the tip, the calculated torque became negative and the cumulative torque briefly exceeded 100% before falling back. Two mesh problems explain this:

* **93% of the blade-wall faces had $y^+>300$**, with a median value of 943. The near-wall mesh was therefore too coarse for reliable skin-friction forces.
* The wall-face size remained close to 0.29 m even though the blade chord decreased from about 3.0 m to 0.90 m. Near the tip, only around twelve faces described each airfoil section.

Thrust is dominated by a large pressure force, so it remained stable despite these limitations. Torque is a much smaller difference between pressure and viscous contributions, making it far more sensitive to the mesh. For that reason, I consider the thrust trustworthy but not the torque or power coefficient.

**Transferring the load to Mechanical**

The Fluent pressure field was transferred to a shell model in Mechanical. The simplified composite material had a spanwise Youngs modulus of 175 GPa and transverse moduli of 7.58 GPa. The shell thickness decreased linearly from 100 mm at the root to 5 mm at the tip.

The root was fully fixed with a remote displacement. The same rotational speed was used as in Fluent, and large deflection was enabled to include geometric stiffening from the centrifugal load.

The idealized shell weighed 22.1 tonnes and produced a radial root force of about **1.54 MN**. This is roughly nineteen times larger than the aerodynamic thrust on one blade. The close agreement with the hand calculation showed that the rotational load and mass distribution were being handled correctly.

**Checking the transferred load**

I compared expected forces/moments with Mechanicals root reactions:

| Reaction component | Difference from free-body prediction |
| :----------------- | -----------------------------------: |
| Radial force       |                               -0.03% |
| Tangential force   |                               -1.91% |
| Rotor-axis torque  |                               -3.26% |
| Axial thrust       |                          **-23.66%** |
| Flapwise moment    |                          **-25.03%** |

Radial force, tangential force and torque agreed well. Axial thrust and flapwise moment did not, roughly one quarter of the aerodynamic load was missing after pressure transfer.

This was not due to missing surface coverage (211.9 m$^2$ vs 214.5 m$^2$, only 1.2% difference). The most likely cause is that standard pressure interpolation smoothed the leading-edge suction peak. Inconsistent shell normals should also be checked.

The most likely explanation is that the standard pressure interpolation smoothed out part of the leading-edge suction peak. Inconsistent shell normals are another possibility that should be checked in Mechanicals imported-load mapping summary.

**Structural result**
Mechanical reported a maximum tip displacement of 0.259 m (0.59% of rotor radius).

CFD gives 82.09 kN thrust per blade (verified to within 0.52%). After mapping, Mechanical reports only 62.67 kN axial reaction (76.3% of the load). The flapwise moment shows a similar shortfall (~71% after subtracting the small centrifugal contribution). This means that ~24-25% of the load was lost in transfer. The 0.259 m displacement is therefore an under-loaded result; under full load it would likely be closer to 0.34 m.
An Euler-Bernoulli beam model predicted 0.211 m under full CFD load. The shell is ~1.7$	imes$ more flexible, which is expected because the thin-walled composite can distort while the beam assumes rigid cross-sections.

Two loads act on the blade: the aerodynamics and the centrifugal force from the Rotational Velocity. Centrifugal load is purely radial (z-component = 0):

$$ F_{cent} = (-1 537 672, -238 540) N $$

Therefore, the z-reaction is purely aerodynamic. Mechanical reports 62.67 kN, while the CFD states 82.09 kN:

$$\frac{62.67}{82.09} = 76.3\%$$

The same applies to the bending moment, although there the centrifugal part must be subtracted first (the mass has a slight z-offset, which generates a y-moment):

$$\frac{2 202.2 - 402.1}{2 535.2} = \frac{1 800.1}{2 535.2} = 71.0\%$$

That leaves two components that do not match, axial force and flapwise moment, and they are missing by roughly the same proportion, 24% and 25% respectively. This is the signature of a load lost in the transfer, not a redistribution or a calculation error.

The shell deformed 0.259 m under approximately three-quarters of the load it should have received. That is why the post states that 0.34 m is a more reasonable figure under full load, and that 0.259 m should be read as an underloaded result, not a structural conclusion.

 It should therefore be treated as an under-loaded result. If the pressure is transferred conservatively and the model is solved again, the displacement would probably be closer to **0.34 m**.

As a separate check, an Euler-Bernoulli beam model predicted a tip displacement of 0.211 m under the full CFD load. At the same load, the shell model is roughly 1.7 times more flexible. That is reasonable because the beam model assumes that the cross-section keeps its shape, while the thin-walled composite shell can distort.

The beam result is therefore useful as an order-of-magnitude check, but not as an exact validation result.
The middle graph shows how much the blade is pulled outward as it spins. At the base (the root), this pull is massive: 1.54 million Newtons, which is almost 19 times stronger than the wind pushing against the blade. Because of this, the blade acts more like a stretched rope than a bending stick. The connection at the base is designed mostly to handle this huge spinning force, rather than the wind. However, because the base is so thick, this force is spread out, keeping the actual stress on the material quite low.

The pulling force drops very quickly as you move outward toward the tip. You might expect the opposite, since the tip is moving much faster than the base. But while speed increases toward the tip, the weight of the blade drops drastically.

**Reproducible post-processing**

Python scripts read the Fluent HDF5 files directly and computed forces, momentum balance, spanwise loading, $y^+$, sectional $C_p$, convergence and the structural free-body check. All reported values therefore come from the solver files, not manual extractions from screenshots.
