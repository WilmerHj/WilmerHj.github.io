# More AI-automated meshing of a phone arm

The product is a part from an articulating arm to connect a phone like a desk lamp and it is getting topology optimized.

![CAD rendering of the redesigned phone-support arm with its mounting bracket and pentagonal connections.](images/PhoneArm/01_assembly_render.png)
*The arm in its assembly context: desk clamp, joint, and the optimized 300 mm link with pentagon holes at each end.*

## Summary
In the first post I topology-optimized one link of an articulating phone arm in Ansys Mechanical, redesigned it in Inventor, and checked the new design with FE analysis. I also asked ChatGPT-6 Codex Astra and Claude Opus 5.5 to build independent meshing workflows for the redesigned part. Both delivered a working all-hex mesh that imported into Ansys. The two meshes differ, but the results from them agree within 0.2 % in deflection and stiffness.

## Design brief
The arm supports a phone in a similar way to an articulated desk lamp. My requirements were to limit deflection to 1 mm under a 3 N load, reduce material use and develop a geometry suitable for 3D printing. The load represents a phone weighing approximately 270 g, rounded up for the design case. Pentagon-shaped pins lock the rotation at each end. The link is the part that gets topology optimized.

## How can this be extended?

In the first part I only asked AI to mesh one part. But some what about assemblies? Turns out that this works as well. This time I used PrePoMax instead of Ansys or Abaqus that I generally use. PrePoMax is basically a graphical interface for Calculix, which is an open-source FEA solver. I used the code-bases that was generated in the first part, and asked a new instance of codex to Codex to build use them as inspiration to build a meshing-tool for the new geometry.

The new tool identifies parts from a step-file containing the assembly and meshes each. In PrePoMax I was able to set nonlinear contacts to perform a nonlinear static analysis of the complete assembly. Since the beam/ link was already designed to have a deflection of 1 mm from 3N perpendicular, I already knew the order of magnitude of the deflection. I still used the 3N force, but also a 71g magsafe holder was added to the loaded hole and the supporting pin was no longer idealized, the surface of the deskholder that touches the desk as well as the top of the bolt was set as fixed. So I expected a deflection of more than 1 mm but not much more.

## The result of the full assembly

As expected, the larges magnitude of deflection was 1.45mm in negative Y-direction.

![CAD rendering of the redesigned phone-support arm with its mounting bracket and pentagonal connections.](images/PhoneArm/01_assembly_render.png)
*The arm in its assembly context: desk clamp, joint, and the optimized 300 mm link with pentagon holes at each end.*

## Two Ansys models: nonlinear reference and linear surrogate
Topology optimization in Ansys needs a linear model, which is why I made the surrogate.

1. **A nonlinear model** with rigid pins to fit the pentagon holes.
    - A remote point connecting the ends of the supporting pin gets a remote displacement of 0 in all six directions.
    - A remote point connecting the ends of the pin that is loaded gets a remote force of 3N i negativ Y-direction.
    - The pins have frictionless contact against the beam.
    - After the solve, an APDL script exports the contact pressure in the loaded pentagon hole together with the x, y and z coordinates of each node. This gives a more realistic pressure distribution at the load than a plain surface force.
2. **A linear surrogate model** with identlical mesh but no modeled pins.
    - In the supporting hole I used the contact status from the nonlinear model to see where the pin actually touches. Those faces get a frictionless support directly.
    - In the loading hole, the exported pressure field from the nonlinear model is imported and applied.

The surrogate retained the distributed load introduction, but it fixed the pressure field and supported surfaces. It could no longer update the contact conditions as the arm deformed. I compared the two models before using it for optimization:

## Comparing metrics between the nonlinear and the surrogate

Since the topology optimization is run with the linear surrogate model, the error needs to be known. In some contexts these errors would be too large. Here I accepted them, since the final design is checked afterwards.


|  | Nonlinear | Surrogate | Difference | Unit | Percentage Difference |
| --- | --- | --- | --- | --- | --- |
| Deformation mid hole Y | -0.40 | -0.32 | 0.09 | mm | -21% |
| Strain Energy U | 0.27 | 0.25 | -0.02 | mJ | -9% |
| Max VM Stress | 2.49 | 1.71 | -0.78 | Mpa | -31% |
| Effective stiffness | 3.71 | 4.72 | 1.01 | N/mm | 27% |

The surrogate is too stiff because a frictionless support on the contact faces holds the hole more rigidly than a pin that can separate and slide. So the optimizer sees a somewhat stiffer structure than the real one. That makes the final verification step important.

Effective stiffness is calculated as applied half-model force divided by the magnitude of the load-point displacement.

## The Topology Optimization (Structural Optimization)
Since I wanted to minimize mass but keep the maximum deflection < 1 mm, without necessarily maximizing stiffness beyond that, I used the "Level Set Based" optimization type in Ansys, which allows mass as the objective with a displacement constraint.

The saved optimization history shows the mass objective falling to 25.8% of its initial value, a reduction of approximately 74%, with a final constrained displacement of 0.9987 mm. Those figures describe the optimizer's result before smoothing and CAD reconstruction; they are not the mass saving or displacement of the final CAD design.

![Level-set optimization history](images/PhoneArm/ConstrainedDisplacement.png)
![Optimization history showing the normalized mass objective decreasing to 25.8 percent and the constrained Y displacement approaching 1 mm.](images/PhoneArm/PercentageMass.png)

*Level-set history: mass in the half model drops from 108 g to 28 g while the deflection converges on the 1 mm limit. The saved design history shows the trade-off between the mass objective and the displacement constraint.*


I then imported the smoothed STL into Inventor and redesigned the part based of the output. An interesting observation is that the result is not an I-beam, that I expected and that also was the result when I used the "Mixable density" type optimization.

The reconstructed CAD geometry follows the main layout of the optimization output while replacing its irregular boundaries with defined features.

![From topology result to redesign](images/PhoneArm/03_topology_to_redesign.png)
*Top: mixable density. Middle: level set. Bottom: my redesign in Inventor, based on the level-set shape.*

![Orthographic comparison of the smoothed topology optimization output and the reconstructed CAD geometry at the same scale.](images/PhoneArm/02-topology-to-cad.png)

*The reconstructed CAD geometry follows the main layout of the optimization output while replacing its irregular boundaries with defined features.*s


## Verification of the new design using AI
The new design had a complex topology that needed some work to build a decent mesh. I asked ChatGPT Codex and Claude Opus 5.5 to automate that process.

I gave Codex and Claude the model as STL and Parasolid (.x_t) and the same prompt with meshing brief, asking each to build a parameterized Python + Gmsh workflow that could export a mesh for Ansys. The full prompt can be found in the bottom of this page.

The brief specified 10 elements along each complete pentagon side, two radial elements across the surrounding washer region, controlled thickness layers and named regions for applying loads and supports. It also required checks on element quality, connectivity and the exported file.

It worked way better than expected. Both followed the instructions and returned a complete Python + Gmsh project that creates an all-HEX8 mesh and exports it as an Abaqus INP file. I imported both files into Ansys as External Models.

![The Codex and Claude meshes shown in matching views, with enlarged details around a pentagonal hole and the rounded slot.](images/PhoneArm/03-mesh-comparison.png)

*The two scripts satisfy the same local mesh-count requirements through different block layouts and element distributions.*

Both AI solutions read the geometry directly from the CAD and don't use hardcoded entity IDs, check their own element counts, write quality reports, and export named selections (holes, washers, faces, support and load regions) so loads and supports can be applied in Mechanical.

Both also ran parameter studies. Changing n_thickness or n_washer_radial in the config file regenerates the whole mesh in seconds, which makes a mesh convergence study almost free.

![Codex mesh in Ansys](images/PhoneArm/07_ansys_codex_mesh.png)
*The Codex mesh imported into Ansys Mechanical.*

![Claude mesh in Ansys](images/PhoneArm/08_ansys_claude_mesh.png)
*The Claude mesh imported into Ansys Mechanical.*

Ansys did not allow for further meshing when importing an external model, so I could not use nonlinear contacts between the AI-generated mesh and the pins, so I performed the "surrogate" analysis for this new mesh instead, but compared with my own mesh in the nonlinear model with the following results:

**My Nonlinear reference vs ChatGPT Astra**:

|  | Nonlinear | Surrogate ChatGPT Codex Astra | Difference | Unit | Percentage Difference |
| --- | --- | --- | --- | --- | --- |
| Deformation mid hole Y | -0.5876 | -0.4938 | 0.094 | mm | -16% |
| Strain Energy U | 0.4073 | 0.3703 | -0.037 | mJ | -9% |
| Max VM Stress | 1.9796 | 0.6690 | -1.311 | MPa | -66% |
| Stiffness | 2.5528 | 3.0377 | 0.485 | N/mm | 19% |

**My Nonlinear reference vs Claude Opus 5.5**:

|  | Nonlinear | Surrogate Claude Opus 5.5 | Difference | Unit | Percentage Difference |
| --- | --- | --- | --- | --- | --- |
| Deformation mid hole Y | -0.5876 | -0.4948 | 0.093 | mm | -16% |
| Strain Energy U | 0.4073 | 0.3711 | -0.036 | mJ | -9% |
| Max VM Stress | 1.9796 | 0.6929 | -1.287 | MPa | -65% |
| Stiffness | 2.5528 | 3.0318 | 0.479 | N/mm | 19% |

**Chat GPT Astra vs ChatGPT Astra**:

|  | Surrogate Ch | Surrogate Claude Opus 5.5 | Difference | Unit | Percentage Difference |
| --- | --- | --- | --- | --- | --- |
| Deformation mid hole Y | -0.4938 | -0.4948 | -0.00096 | mm | 0.194% |
| Strain Energy U | 0.3703 | 0.3711 | 0.00072 | mJ | 0.194% |
| Max VM Stress | 0.6690 | 0.6929 | 0.02397 | MPa | 3.583% |
| Stiffness | 3.0377 | 3.0318 | -0.00589 | N/mm | -0.194% |


The meshes made by ChatGPT and Claude are not identical, yet they provide almost identical results. The rest of the analysis is completely identical and made by hand by me so there is no "hard coded" results from the AIs.

The difference between my solution and the AI solutions is the nonlinear contacts at support and load, and the mesh.

### The Prompt

The prompt itself is also designed by ChatGPT. I only asked for "a prompt for Codex or Claude to do this.".

They did not only give a complete mesh each, they also included functionality to perform mesh convergence. The part is ready to automatically be meshed at any instance in seconds.

```md
You are working as a senior CAE / finite-element preprocessing engineer.

Your task is to build a robust Python + Gmsh meshing workflow for a mechanical structural part that will ultimately be solved in ANSYS Mechanical.

The goal is NOT simply to produce “a mesh that runs”.
The goal is to create a controlled, parameterized, predominantly/all-hexahedral mesh with predictable element counts around important features.

============================================================
1. BACKGROUND
============================================================

The part is a relatively thin 3D structural component whose geometry is largely an extrusion through its thickness.

Important geometric features include:

- Pentagonal through-holes.
- Pentagonal washer-like regions around those holes.
- A central elongated/slot-like through-hole.
- Several larger surrounding structural regions.
- The part has previously been partitioned into approximately three major regions in ANSYS.
- The thickness direction is approximately the global X direction.
- Front and back geometry are largely corresponding planar faces.

The current ANSYS Mechanical mesh uses combinations of:

- MultiZone
- Face Meshing
- Edge Sizing
- Hard sizing constraints

but ANSYS is modifying the expected blocking topology and sometimes does not respect the mesh pattern in the intuitive way.

Example desired local mesh controls:

- 10 elements along each side of a pentagonal hole.
- 10 elements along the corresponding outer pentagonal washer boundary.
- 2 elements radially between hole and washer boundary.
- Configurable number of elements through thickness, initially around 4–6.
- Prefer structured quadrilateral surface meshes.
- Extrude quadrilateral meshes through thickness to create HEX8 elements.

The exact CAD dimensions must be read from the supplied geometry. Do not infer dimensions from screenshots.

============================================================
2. AVAILABLE INPUT
============================================================

The project folder may contain:

1. A STEP file containing the CAD geometry.
2. Optionally an exported ANSYS baseline mesh.
3. Optionally screenshots/reference files.

Search the project directory and identify the available inputs before implementing the solution.

The ANSYS mesh, if present, is ONLY a reference.

DO NOT use its element connectivity as the basis for the final mesh.

It may be used to:

- estimate useful element sizes,
- identify difficult regions,
- compare element counts,
- compare mesh density,
- benchmark the final mesh.

The final Gmsh mesh should be regenerated from the CAD geometry / mathematical blocking.

============================================================
3. PRIMARY TECHNICAL APPROACH
============================================================

Use:

- Python 3
- Gmsh Python API
- Gmsh OpenCASCADE kernel

Additional libraries such as:

- numpy
- scipy
- meshio

may be used when helpful.

The preferred workflow is:

STEP geometry
    ↓
OpenCASCADE import
    ↓
geometric feature identification
    ↓
2D blocking / transfinite surface construction
    ↓
structured quadrilateral mesh
    ↓
extrusion through thickness
    ↓
HEX8 solid mesh
    ↓
quality verification
    ↓
Abaqus .inp export
    ↓
ANSYS External Model

============================================================
4. VERY IMPORTANT DESIGN REQUIREMENT
============================================================

Do NOT hard-code Gmsh entity tags such as:

surface 14
curve 57
volume 3

unless they are generated internally and tracked robustly.

STEP entity IDs are not guaranteed to stay stable.

Instead identify geometry using geometric properties, for example:

- center of mass,
- bounding boxes,
- orientation,
- normal direction,
- location,
- curve length,
- adjacency,
- topology,
- distance to known geometric features.

Create helper functions for robust entity detection.

Examples:

find_planar_faces_normal_to_x(...)
find_pentagonal_loops(...)
find_through_holes(...)
find_outer_washer_loop(...)
find_slot_boundary(...)
find_thickness_edges(...)

The script should fail with a useful diagnostic message if expected geometry cannot be identified.

============================================================
5. HEX MESH STRATEGY
============================================================

Because the part is approximately an extrusion, first investigate whether the problem can be reduced to:

2D quad mesh
+
through-thickness extrusion

This is strongly preferred over general automatic 3D meshing.

For suitable surfaces use Gmsh transfinite meshing:

setTransfiniteCurve(...)
setTransfiniteSurface(...)
setRecombine(...)

and where applicable:

setTransfiniteVolume(...)

or structured extrusion using:

gmsh.model.occ.extrude(...)

with Layers / recombination such that quadrilateral elements become hexahedral elements.

The preferred final solid element type is:

8-node first-order hexahedron
ANSYS equivalent: SOLID185-style topology
Abaqus export equivalent: C3D8

Do NOT create tetrahedral elements merely because they are easier.

If a region genuinely cannot be meshed as structured hex without modifying the block decomposition:

1. diagnose why,
2. report the topology causing the issue,
3. modify/decompose the blocking,
4. retry.

Only use non-hex elements as an explicitly documented fallback.

============================================================
6. PENTAGON WASHER BLOCKING
============================================================

The pentagonal hole regions are especially important.

The intended 2D topology around one pentagonal hole is conceptually:

inner pentagon
    ↓
structured radial sectors
    ↓
outer pentagonal washer boundary

Each side should ideally form a mapped quadrilateral region.

For each of the five sectors use approximately:

circumferential:
    10 elements

radial:
    2 elements

These numbers must be configurable.

Conceptually:

inner side
o-o-o-o-o-o-o-o-o-o-o
| | | | | | | | | | |
o-o-o-o-o-o-o-o-o-o-o
| | | | | | | | | | |
o-o-o-o-o-o-o-o-o-o-o
outer side

= 10 x 2 quads for each side sector.

Do not allow an automatic mesher to silently change 2 radial elements into 4.

The topology must explicitly contain the requested number.

Create a check that counts the actual number of elements in these directions after meshing.

============================================================
7. TRANSITIONS TO THE REST OF THE PART
============================================================

The structured washer mesh must transition into the larger surrounding part.

Use explicit blocking where practical.

The mesh should aim for:

- good alignment with load paths,
- gradual size transitions,
- minimal skewness,
- minimal warpage,
- reasonable aspect ratios,
- no unnecessarily tiny elements.

Do not simply propagate the fine washer size through the entire part.

Allow a coarser mesh away from:

- holes,
- washers,
- the slot,
- load introduction regions,
- supports.

============================================================
8. CENTRAL SLOT
============================================================

Treat the elongated central hole separately.

Create a structured quad topology around it.

Prefer an O-grid-like or mapped blocking arrangement rather than allowing arbitrary triangular surface meshing.

The final topology should be suitable for extrusion to HEX8 elements.

The exact blocking should be derived from the actual CAD geometry.

============================================================
9. THROUGH-THICKNESS MESH
============================================================

Create a configurable parameter:

n_thickness

Default:

n_thickness = 5

The code should allow easy comparison of, for example:

3
4
5
6
8
10

elements through thickness.

If the geometry thickness changes locally, detect this and report whether a simple extrusion remains valid.

============================================================
10. CONFIGURATION
============================================================

Do not scatter mesh parameters throughout the code.

Create a clear configuration mechanism, for example:

config.py

or

config.yaml

with parameters such as:

n_pentagon_side = 10
n_washer_radial = 2
n_thickness = 5
n_slot_arc = ...
n_slot_straight = ...
target_size_farfield = ...
growth_ratio = ...

Also include:

CAD input filename
output directory
mesh order
debug options
visualization options

============================================================
11. NAMED REGIONS FOR ANSYS
============================================================

This is critical.

The imported mesh in ANSYS Mechanical must still allow convenient application of loads and boundary conditions.

Create meaningful physical groups / sets.

At minimum identify, where applicable:

SOLID_ALL

PENTAGON_HOLE_1
PENTAGON_HOLE_2
...

WASHER_1
WASHER_2
...

SLOT_SURFACE

FRONT_FACE
BACK_FACE

SUPPORT_REGION

LOAD_REGION

LEFT_END
RIGHT_END

If the STEP geometry contains multiple relevant areas, give them meaningful names.

The Abaqus .inp should contain useful:

*NSET
*ELSET

and, if feasible/appropriate, surface definitions.

Do not rely solely on anonymous element numbers.

============================================================
12. EXPORT
============================================================

Produce at least:

mesh.msh
mesh.inp

The .inp file must be suitable for import through:

ANSYS Workbench
&rarr; External Model
&rarr; Static Structural

Verify the element type in the generated .inp.

The intended solid topology is C3D8 / HEX8.

If native Gmsh Abaqus export does not preserve the sets exactly as required, use Python or meshio to postprocess the file.

Do not assume export is correct without checking it.

============================================================
13. MESH QUALITY
============================================================

Implement automated quality reporting.

Calculate/report useful quantities such as:

- total node count
- total element count
- number of HEX8 elements
- number of non-HEX elements
- minimum Jacobian / scaled Jacobian if available
- aspect ratio statistics
- edge-length statistics
- volume checks
- inverted elements
- zero/negative volume elements

Generate a concise terminal report.

Example:

-------------------------------------
MESH QUALITY REPORT
-------------------------------------
Nodes:             82,421
HEX8:              71,560
Other elements:         0

Min scaled Jacobian: 0.61
Mean aspect ratio:   1.84
Max aspect ratio:    5.21

Negative volumes:       0
-------------------------------------

Use Gmsh quality metrics where appropriate, or calculate additional metrics in Python.

============================================================
14. GEOMETRY / MESH VALIDATION
============================================================

Add validation checks before exporting:

- all expected through-holes are present,
- no holes have accidentally been filled,
- all volumes are meshed,
- no duplicate nodes where continuity is expected,
- neighboring blocks share nodes,
- washer sector element counts match configuration,
- through-thickness element count matches configuration,
- no disconnected solid regions unless intentionally present.

============================================================
15. OPTIONAL ANSYS BASELINE COMPARISON
============================================================

If an ANSYS baseline mesh is present and readable:

create a separate analysis script that compares:

- node count
- element count
- element size distribution
- local washer mesh density
- through-thickness density

Do NOT modify the Gmsh connectivity to mimic bad ANSYS topology.

The baseline is for comparison only.

Generate something like:

reports/baseline_comparison.md

============================================================
16. PROJECT STRUCTURE
============================================================

Create a clean project such as:

project/
│
├── README.md
├── requirements.txt
├── config.yaml
│
├── geometry/
│   └── input.step
│
├── src/
│   ├── main.py
│   ├── geometry.py
│   ├── blocking.py
│   ├── meshing.py
│   ├── quality.py
│   ├── export.py
│   └── utilities.py
│
├── scripts/
│   ├── inspect_geometry.py
│   ├── generate_mesh.py
│   └── compare_baseline.py
│
├── output/
│   ├── mesh.msh
│   └── mesh.inp
│
└── reports/
    ├── geometry_report.md
    ├── mesh_quality.md
    └── baseline_comparison.md

You may modify this structure if a better architecture is justified.

============================================================
17. GEOMETRY INSPECTION FIRST
============================================================

Do not begin by guessing the CAD topology.

First write and run a geometry inspection script.

It should report:

- number of volumes
- number of surfaces
- number of curves
- bounding box
- principal dimensions
- candidate front/back faces
- through-thickness direction
- closed loops
- possible pentagonal holes
- possible slot
- adjacency information

Generate a geometry report.

Only after understanding the actual STEP model should you implement the final blocking.

============================================================
18. VISUAL DEBUG OUTPUT
============================================================

Provide useful debug visualization.

For example:

- save an intermediate .msh after geometry classification,
- assign physical groups to detected geometry,
- optionally create screenshots if the environment supports it,
- print entity IDs together with geometric descriptions.

I should be able to open the model in the Gmsh GUI and visually inspect:

- detected hole loops
- washer regions
- slot
- source plane
- extrusion direction
- block boundaries

============================================================
19. ITERATIVE IMPLEMENTATION
============================================================

Work iteratively.

Phase 1:
Inspect CAD.

Phase 2:
Identify geometry robustly.

Phase 3:
Create structured 2D mesh for one pentagonal washer.

Phase 4:
Verify exactly 10 x 2 topology.

Phase 5:
Extend blocking to surrounding geometry.

Phase 6:
Handle central slot.

Phase 7:
Generate complete 2D quad mesh.

Phase 8:
Extrude through thickness.

Phase 9:
Run quality checks.

Phase 10:
Export to ANSYS-compatible .inp.

Do not move on from a phase if the previous one is clearly broken.

============================================================
20. IMPORTANT: DO NOT FAKE SUCCESS
============================================================

If the complete part cannot be converted to a conforming all-hex mesh with the present CAD topology:

do not silently fall back to tetrahedra.

Instead:

- identify the exact geometric/topological obstruction,
- explain it,
- show which surfaces/curves cause it,
- suggest the minimum CAD or blocking modification required,
- implement that modification programmatically where practical.

A partial but technically correct diagnosis is preferable to an apparently complete but poor-quality mesh.

============================================================
21. USER EXPERIENCE
============================================================

The final workflow should ideally require only:

python scripts/generate_mesh.py

or similar.

The script should then:

1. load the STEP file,
2. classify geometry,
3. generate blocks,
4. apply mesh divisions,
5. generate 2D quads,
6. extrude to HEX8,
7. validate,
8. calculate mesh quality,
9. export .msh,
10. export .inp,
11. generate reports.

Mesh parameters should be changed only in the configuration file.

============================================================
22. DOCUMENTATION
============================================================

Write a practical README explaining:

- required Python version,
- how to install Gmsh Python API,
- installation commands,
- how to run geometry inspection,
- how to generate the mesh,
- how to modify mesh density,
- how to open the result in Gmsh,
- how to import mesh.inp into ANSYS Workbench External Model,
- how physical groups map to ANSYS selections,
- known limitations.

Also explain the blocking strategy using simple diagrams where useful.

============================================================
23. CODE QUALITY
============================================================

Use:

- clear functions,
- docstrings,
- type hints where useful,
- logging instead of excessive print statements,
- useful exceptions,
- deterministic behavior.

Avoid:

- giant single-file scripts,
- unexplained magic numbers,
- hard-coded STEP entity IDs,
- unnecessary dependencies.

============================================================
24. SUCCESS CRITERIA
============================================================

The project is successful when:

1. The supplied STEP geometry can be loaded automatically.
2. Important geometric features are identified programmatically.
3. Pentagonal washer regions have exactly the requested structured topology.
4. The primary surface mesh consists of quads.
5. The solid mesh is predominantly, preferably entirely, HEX8.
6. Through-thickness element count is explicitly controlled.
7. Important regions are exported as named sets.
8. No inverted/negative-volume elements exist.
9. Mesh-quality statistics are generated automatically.
10. mesh.inp imports into ANSYS Mechanical through External Model.
11. Changing a value such as:

   n_washer_radial: 2 &rarr; 3

   actually regenerates the topology with 3 radial elements rather than allowing an automatic mesher to override it.

============================================================
25. FIRST ACTION
============================================================

Start by inspecting the project directory and the supplied STEP geometry.

Do not immediately write the entire final mesher.

Create the geometry inspection utility first, run it, inspect the actual topology, and then base the blocking strategy on the real CAD model.

Continue autonomously through implementation, testing, debugging, and documentation.

When finished, summarize:

- the blocking strategy used,
- mesh element counts,
- quality metrics,
- any compromises,
- how to import the result into ANSYS,
- which configuration parameters I should change for a convergence study.
```
