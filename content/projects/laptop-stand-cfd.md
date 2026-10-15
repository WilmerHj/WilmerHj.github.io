Four placements of the same laptop were compared using steady buoyant CFD. The commercial Dacota stand produced by far the coolest intake air ($\Delta T \approx 0.14$ K), while the two AI-designed stands imposed the smallest external intake-pressure penalty. However, both AI designs also allowed substantially more of the hot exhaust plume to return toward the laptop intakes.

The comparison is useful for identifying flow mechanisms and design trade-offs, but it is not a final thermal ranking. The dominant uncertainty is the assumed fraction of the laptop heat rejected through the bottom exhaust.

![The Claude-designed stand under the laptop, with the bottom intakes (blue) and the exhausts (red) marked.](images/LaptopStandCFD/01_pods_vents.png)  
*The Claude-designed “linked pods” stand under an approximate model of the Lenovo LOQ 15IRX10. Blue: fan intakes in the bottom panel. Red: exhausts.*

## Summary

I gave two AI coding agents the same brief: design a passive stand for my Lenovo LOQ 15IRX10. They produced two quite different concepts: a linked-pod design and an aluminium side-plate frame.

I then used a generic Gmsh-based meshing toolkit I am developing to build external-air CFD models for four configurations:

- laptop directly on the desk,
- Claude linked pods,
- Codex Airframe,
- a commercial Dacota stand.

The meshes were imported into Ansys Fluent and solved under identical imposed airflow and thermal conditions.

The most interesting result was not that one stand was universally better. Instead, the simulations revealed a trade-off between **intake restriction** and **exhaust recirculation**.

The Dacota geometry kept the intake air almost at room temperature while requiring only a moderate intake suction pressure. The AI-designed stands gave the least restricted intake paths, but their intermediate clearance allowed the downward exhaust jet to interact with the desk and return toward the laptop.

Because the actual distribution of exhaust flow between the bottom and rear vents is unknown, the result should be interpreted as a CFD-supported design hypothesis rather than a definitive ranking.

## The thermal question

Laptop stands are usually marketed mainly for ergonomics. For a gaming or simulation laptop with bottom-mounted cooling intakes, two additional questions matter:

- **How warm is the air reaching the fans?**  
  Exhaust that returns toward the intakes pre-heats the cooling air.

- **How restrictive is the path into the fans?**  
  A very small gap beneath the laptop can require a larger pressure difference to maintain the same airflow.

These questions can be investigated with an external-flow CFD model without resolving the internal heat sink, fan blades or electronics.

The goal of the model is therefore not to predict CPU or GPU temperature directly. It is to compare how the different stand geometries affect the **air presented to the laptop cooling system**.

## The four cases

| Case | Placement | Tilt / front clearance | Geometry source |
| :--- | :--- | :--- | :--- |
| **BL1 Desk** | Directly on the desk, on its rubber feet | 0.65° / 2.3 mm | Laptop model only |
| **B Claude pods** | Four linked pods with tubes | 10° / 25 mm | Parametric CadQuery model |
| **C Codex Airframe** | Aluminium side-plate frame | 10° / 32 mm | STEP assembly, bolts removed |
| **D Dacota** | Commercial stand with a large plate opening | ~15° / ~80 mm | Parametric approximation from product photos |

![Desk](images/LaptopStandCFD/02_geom_BL1_desk.png)
![Claude pods](images/LaptopStandCFD/02_geom_B_claude_pods.png)
![Codex Airframe](images/LaptopStandCFD/02_geom_C_codex_airframe.png)
![Dacota](images/LaptopStandCFD/02_geom_D_dacota_approx.png)

*The four configurations. The same simplified laptop and external air-domain concept were used in every case; the stand geometry and laptop pose were changed.*

The laptop itself is intentionally simplified. It consists of a wedge-shaped base, a lid opened approximately 110°, rubber feet and simplified vent surfaces. Each vent was represented as a shallow 1 mm pocket so that it could be identified reliably as a separate boundary during automated meshing.

The positions of the vents were measured from the physical laptop.

## Automated meshing workflow

Stand geometry, laptop position and mesh controls are defined parametrically, with named regions generated automatically from geometry rather than selected manually inside the solver.

The final Fluent meshes contained:

| Case | Cells |
| :--- | ---: |
| Claude pods | 462,819 |
| Codex Airframe | 578,678 |
| Dacota | 669,009 |
| Desk | 885,275 |

No formal mesh-independence study was performed because the cases were constrained by the Ansys Student cell limit. The results should therefore be treated primarily as a comparative study at a common practical resolution.

## CFD setup

| Item | Setting |
| :--- | :--- |
| Solver | Pressure-based, steady, coupled with pseudo-time stepping |
| Turbulence | $k$-$\omega$ SST |
| Buoyancy | Boussinesq, $\rho = 1.204$ kg/$m^3$, $\beta = 0.00343$ $K^{-1}$, $T_{op}=293.15$ K |
| Fan intakes | Two pressure-outlet boundaries with target flow of 0.0047 kg/s each |
| Exhausts | Bottom: 0.0052 kg/s; rear: $2\times0.0021$ kg/s |
| Exhaust temperature | 306 K |
| Surroundings | Pressure outlets at 0 Pa with 293.15 K backflow temperature |
| Solid surfaces | Desk, laptop and stand treated as adiabatic walls |

The total imposed exhaust flow was

$$
\dot m = 0.0094\ \text{kg/s}.
$$

At an exhaust temperature approximately 12.7 K above ambient, this corresponds to roughly 120 W carried by the airflow:

$$
\Delta T_{ex}
=
\frac{P}{\dot m c_p}
=
\frac{120}
{0.0094\cdot1006}
\approx
12.7\ \text{K}.
$$

The same airflow and heat rejection were prescribed in each case. Within the assumptions of the model, the resulting differences therefore come from the stand geometry and laptop placement.

## Figures of merit

Two primary quantities were compared.

### Intake temperature rise

The first is the increase in intake-air temperature relative to ambient:

$$
\Delta T_{in}=T_{in}-T_{amb}.
$$

A smaller value means that less hot exhaust has returned to the intake region.

### External intake-pressure penalty

The second is the mean static gauge pressure at the laptop intakes.

With the same airflow imposed in every case, a more negative pressure means that the external geometry is more restrictive and a larger suction pressure is required to maintain the prescribed flow.

This should not be interpreted as the complete pressure drop of the laptop cooling system, since the internal fans, heat sinks and ducting are not modelled.

### Thermal recirculation index

To normalize the temperature result I defined

$$
R_T
=
\frac{\Delta T_{in}}
{\Delta T_{ex}}.
$$

With uniform exhaust temperature, common ambient conditions and adiabatic external walls, this provides a convenient indication of the degree of thermal contamination at the intakes.

It should be interpreted as a **thermal recirculation index**, not as a directly calculated exhaust mass fraction. A true exhaust recirculation fraction would require, for example, a passive scalar or species tracer released at the exhaust boundaries.

## Results

| Case | Intake $\Delta T$ | Thermal recirculation index $R_T$ | Intake gauge pressure | Space beneath laptop |
| :--- | ---: | ---: | ---: | :--- |
| **D Dacota** | **0.14 K** | **~1 %** | −3.2 Pa | ~80 mm, plate with large opening |
| BL1 Desk | 1.93 K | ~15 % | −19.5 Pa | 2.3 mm |
| C Codex Airframe | 2.74 K | ~22 % | **−0.8 Pa** | ~32 mm, closed at sides |
| B Claude pods | 3.28 K | ~26 % | −0.9 Pa | ~25 mm, open |

The results show two different design effects.

The Dacota geometry gives the lowest intake temperature by a large margin. The AI-designed stands, however, give the smallest intake-pressure penalty.

The bare-desk configuration performs poorly from a flow-resistance perspective, requiring approximately −19.5 Pa at the intake surfaces to maintain the same prescribed flow.

![Dacota](images/LaptopStandCFD/04_T_dacota.png)

*Dacota: the downward exhaust is directed through the large plate opening and away from the intake region. The intakes therefore remain close to room temperature.*

![Desk](images/LaptopStandCFD/04_T_desk.png)

*Desk: the 2.3 mm gap strongly restricts the intake path and redirects the lower exhaust through the narrow space beneath the laptop.*

![Codex Airframe](images/LaptopStandCFD/04_T_airframe.png)

*Codex Airframe: the side plates restrict lateral escape and a region of warm air develops beneath the laptop before spilling toward the intake region.*

![Claude pods](images/LaptopStandCFD/04_T_pods.png)

*Claude pods: the downward exhaust jet reaches the desk below the laptop and spreads outward, including toward the intake region.*

## Interpretation

The simulations suggest three distinct behaviors.

**Dacota minimizes thermal recirculation.**  
Its large clearance and central opening provide a path for the downward exhaust to move away from the laptop before interacting strongly with the intake region.

**The AI stands minimize external intake restriction.**  
Their intake pressures of approximately −0.8 to −0.9 Pa indicate that the imposed airflow can enter the laptop with very little external pressure penalty.

However, both designs leave the laptop close enough to the desk for the downward exhaust jet to interact with the surrounding surfaces and return toward the intakes.

**The desk configuration is strongly restricted.**  
At the prescribed airflow, approximately −19.5 Pa is required at the intake boundaries.

A real laptop fan would not necessarily maintain the same flow rate under this condition. It would instead move to a different operating point determined by the intersection between the fan curve and the total system-resistance curve.

Without the fan curve, the actual airflow reduction cannot be quantified from this model.

## Other limitations

Several additional limitations should be kept in mind:

- The fan flow rate is prescribed rather than determined from an actual fan curve.
- The laptop internals are not modelled.
- The solid surfaces are adiabatic, so conduction and radiation are excluded.
- The stand geometry for Dacota was reconstructed approximately from product photographs.
- The simulations use steady RANS even though separated jets and recirculation can contain inherently unsteady structures.
- The meshes are constrained by the Ansys Student cell limit.
- No formal mesh-independence study has yet been completed.
- No experimental temperature or velocity measurements have been used for validation.

The simulations do, however, reveal clearly different **qualitative flow mechanisms** between the four geometries.

Those mechanisms are useful for design decisions, but the detailed flow structures and absolute numerical differences should not be considered experimentally validated or mesh-independent.


## Conclusion

The main result is not that one laptop stand is universally superior.

Under the current assumptions, the Dacota geometry minimizes exhaust recirculation, while the two AI-designed stands provide the least restrictive intake paths. The bare desk produces by far the largest external intake-pressure penalty.

More importantly, the project demonstrates a reusable simulation workflow that turns parametric geometry into solver-ready CFD meshes and makes design variants inexpensive to evaluate.

It also exposed a more general lesson from AI-assisted engineering:

**Automation can make modelling much faster, but it does not remove the need for independent verification, sensitivity analysis and engineering judgment.**