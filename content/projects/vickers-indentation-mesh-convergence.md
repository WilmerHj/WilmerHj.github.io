**Overview.** A Vickers indentation model was used as the test case for a fully scripted mesh-refinement study. One Abaqus Python script copies a base model, halves the biased seed sizes for each refinement level, meshes, submits the job, opens the resulting ODB and writes a force-displacement CSV in which the mesh metadata is carried in dedicated columns. A MATLAB script then discovers every CSV automatically, isolates the loading branch and compares the indentation force at one common penetration depth. The subject of the project is the automation and the comparison methodology; the indentation model itself is deliberately small.
 
## Finite element model
 
The Vickers pyramid is represented by the axisymmetric cone of equal apex angle. The 136$^{\circ}$ face angle gives a cone semi-angle of
 
$$
\psi=\frac{136^{\circ}}{2}=68^{\circ},
$$
 
which reduces the indentation to a two-dimensional axisymmetric contact problem while preserving the area-to-depth relation of the real indenter.
 
| Parameter | Value |
| :--- | :--- |
| Specimen element type | CAX8R (quadratic, reduced integration) |
| Indenter element type | CAX4R / CAX3 |
| Specimen domain | $30\ \mathrm{\mu m}$ radius $\times\ 6\ \mathrm{\mu m}$ depth |
| Specimen material | $E=210\ \mathrm{GPa}$, $\nu=0.33$, isotropic hardening $250\rightarrow400\ \mathrm{MPa}$ |
| Indenter material | $E=900\ \mathrm{GPa}$, $\nu=0.021$ |
| Contact | Surface-to-surface, hard normal behaviour, frictionless |
| Load introduction | Kinematic coupling of the indenter to a reference point |
| Prescribed depth | $0.9\ \mathrm{\mu m}$, applied and fully removed through an amplitude |
| Step | Static, `nlgeom=YES`, automatic stabilisation $2\times10^{-4}$ |
 
The symmetry axis and the outer radius are constrained radially and the bottom face vertically. Reaction force and displacement are requested as history output at the reference point, so one loading curve is produced per job without any field-output post-processing.
 
## Refinement series in Python
 
Both the minimum and the maximum biased seed size are halved together at every level, so the meshes form a clean sequence
 
$$
h_{k}=\frac{h_{0}}{2^{k}},\qquad k=0,1,2,\dots
$$
 
rather than an arbitrary set of unrelated meshes. Halving both ends of the bias keeps the grading ratio constant, which means the meshes differ in resolution but not in character.
 
For each level the script:
 
1. deletes any previous model and job with the same name and copies the base model,
2. rebuilds the reference-point set and the U2/RF2 history request,
3. applies the new bias with `seedEdgeByBias` on the named edge set and regenerates the mesh,
4. submits the job and waits for completion,
5. opens the ODB and writes the force-displacement history to CSV.
 
The ODB reader does not hard-code a history region name. It scans the available regions and selects the first one containing both `U2` and `RF2`, and prints the full list of regions and outputs if no match is found. The time points of the two histories are also compared before every row is written, so a mismatched output request fails immediately instead of silently producing a shifted curve.
 
The mesh metadata is written into the CSV as repeated columns:
 
`CASE, MIN_SEED, MAX_SEED, STEP_TIME, ABS_U2, ABS_RF2`
 
Repeating the case name and the two seed sizes on every row is redundant, but it means MATLAB can read the file with a plain `readtable` call. A separate header block would have required a custom parser, and metadata encoded in the file name would have to be parsed with string operations that break as soon as the naming convention changes.
 
## Post-processing in MATLAB
 
Two decisions determine whether the comparison is meaningful.
 
**Only the loading branch is used.** The analysis loads and then fully unloads the indenter. Plotting $|U_{2}|$ against $|RF_{2}|$ for the complete cycle folds the unloading curve back onto the loading curve and produces a near-vertical return segment that has no physical meaning in a convergence plot. Each history is therefore truncated at the first displacement maximum.
 
**Force is compared at the same depth, not at the peak.** Abaqus does not write history output at identical increments in different jobs, so $\max(F)$ is sampled at slightly different penetrations in each mesh and part of the apparent mesh sensitivity would simply be sampling scatter. The script instead interpolates the force linearly at one common depth,
 
$$
U_{c}=0.88\ \mathrm{\mu m},
$$
 
taken as the smallest peak depth of the series rounded down. Two deviations are then reported,
 
$$
\varepsilon_{\text{finest}}
=
\frac{\left|F_{k}-F_{N}\right|}{\left|F_{N}\right|}\times100\%,
\qquad
\varepsilon_{\text{prev}}
=
\frac{\left|F_{k}-F_{k-1}\right|}{\left|F_{k}\right|}\times100\%,
$$
 
and the cases are sorted from coarse to fine using the seed size read from the CSV, so no ordering is assumed from the file names.
 
## Results
 
| Case | Specimen nodes | Min seed [$\mathrm{\mu m}$] | Max seed [$\mathrm{\mu m}$] | $F$ at $0.88\ \mathrm{\mu m}$ [N] | $\varepsilon_{\text{prev}}$ [%] |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Mesh_01 | 77 | 1.050 | 7.00 | 0.01542 | - |
| Mesh_02 | 216 | 0.525 | 3.50 | 0.01865 | 17.3 |
| Mesh_03 | 889 | 0.2625 | 1.75 | 0.01843 | 1.19 |
| Mesh_04 | 889 | 0.2625 | 1.75 | 0.01843 | 0.00 |
 
The coarse mesh underestimates the indentation force by about 16%, which is expected: with a maximum seed of $7\ \mathrm{\mu m}$ the contact zone is resolved by a handful of elements and neither the contact pressure distribution nor the plastic zone under the tip is captured. The change collapses to roughly 1% at the next refinement.
 
## Limitations
 
**The series is truncated by a node limit.** The model was built in Abaqus Learning Edition, which allows at most 1000 nodes. Mesh_03 uses 889 nodes in the specimen and 90 in the indenter, so the fourth refinement level could not be created: the seeding request could not produce a finer mesh and Mesh_04 reproduced the Mesh_03 mesh exactly. The finest case is therefore not an independent reference, and the $0.000\%$ deviation reported for Mesh_03 is the result of comparing a mesh with itself. It is a property of the table, not evidence of convergence.
 
Several further caveats follow from the same constraint:
 
* The sequence is not monotonic. The force rises from Mesh_01 to Mesh_02 and then falls slightly at Mesh_03, so the solution is not in the asymptotic range where an observed order of accuracy or a Richardson extrapolation would be defensible.
* Only the specimen was refined. The indenter mesh is unchanged in every case, so contact resolution improves on one side of the interface only.
* The specimen depth is about $6\ \mathrm{\mu m}$ against a contact radius of roughly $a=h\tan\psi\approx2.2\ \mathrm{\mu m}$ at maximum load. The constrained bottom face is close enough to stiffen the response, and a converged study would need a deeper domain.
* Automatic stabilisation is active, so the ratio of stabilisation energy to internal energy should be checked before the force is treated as a purely physical quantity.
 
The honest summary is that this study demonstrates a refinement workflow and shows the expected trend, but does not establish a mesh-converged indentation force.
