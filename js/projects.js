// Joins a tagged template. NOTE: this is a COOKED template literal - JS escape
// processing applies before the text ever reaches the markdown renderer. So a
// LaTeX command is written \\cmd (JS turns it into \cmd) and a matrix/align row
// break is written \\\\ (JS turns it into \\, which is what TeX wants).
// (The previous String.raw({raw: strings}) form did NOT return the raw string:
//  it fed String.raw the cooked array, so it was a no-op with a misleading name.)
const md = (strings, ...values) =>
  strings.reduce((out, s, i) => out + s + (i < values.length ? values[i] : ''), '');

function getYoutubeId(url) {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  return match ? match[1] : null;
}



const projects = [
  {
  slug: 'topology-optimization-ai-meshing-phone-arm',
  title: 'Topology Optimization & AI-Automated Hex Meshing',
  subtitle: 'From nonlinear contact FEA to topology optimization, CAD reconstruction and automated Gmsh meshing',
  stack: [
    'ANSYS Mechanical',
    'Topology Optimization',
    'Nonlinear FEA',
    'Contact Mechanics',
    'Inventor',
    'Python',
    'Gmsh',
    'Hex Meshing',
    'FEA Automation',
    'AI-Assisted Engineering'
  ],
  images: [
    'images/PhoneArm/01_assembly_render.png',
    'images/PhoneArm/03_topology_to_redesign.png',
    'images/PhoneArm/02-topology-to-cad.png',
    'images/PhoneArm/03-mesh-comparison.png',
    'images/PhoneArm/07_ansys_codex_mesh.png',
    'images/PhoneArm/08_ansys_claude_mesh.png',
    'images/PhoneArm/ConstrainedDisplacement.png',
    'images/PhoneArm/PercentageMass.png'
  ],
  content: md`
# Topology optimization and AI-automated meshing of a phone arm

The product is a part from an articulating arm to connect a phone like a desk lamp and it is getting topology optimized.

![CAD rendering of the redesigned phone-support arm with its mounting bracket and pentagonal connections.](images/PhoneArm/01_assembly_render.png)
*The arm in its assembly context: desk clamp, joint, and the optimized 300 mm link with pentagon holes at each end.*

## Summary
I topology-optimized one link of an articulating phone arm in Ansys Mechanical, redesigned
it in Inventor, and checked the new design with FE analysis. I also asked ChatGPT-6 Codex Astra and Claude Opus 5.5 to build independent meshing workflows for the redesigned part. Both delivered a working all-hex mesh that imported into Ansys. The two meshes differ, but the results from them agree within 0.2 % in deflection and stiffness.

## Design brief
The arm supports a phone in a similar way to an articulated desk lamp. My requirements were to limit deflection to 1 mm under a 3 N load, reduce material use and develop a geometry suitable for 3D printing. The load represents a phone weighing approximately 270 g, rounded up for the design case. Pentagon-shaped pins lock the rotation at each end. The link is the part that gets topology optimized.

## Requirements

- Maximum deflection of 1 mm under 3 N (Mass of phone ~270g) cantilever load. (Constraint)
- As little material possible (Goal).
- 3D printable in PLA (Design).

## The design space

- I modeled a block of 15 x 20 x 300 mm. It is half of the full 30 x 20 x 300 mm arm. Both the geometry and the load are symmetric through the depth, so a half model with a symmetry condition is enough. It carries half the load, 1.5 N.
- I cut two pentagon holes in the block: one to mount the arm to the desk bracket and one to mount the phone.

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

\`\`\`md
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
\`\`\`
`

},
  {
  slug: 'wind-turbine-blade-cfd-fea',
  title: 'Wind-Turbine Blade: CFD to Shell FEA',
  subtitle: 'Rotating-frame aerodynamics, FSI and independent load verification in ANSYS',
  stack: [
    'ANSYS Fluent',
    'ANSYS Mechanical',
    'CFD',
    'FSI',
    'SST k-omega',
    'MRF (Multiple Reference Frame)',
    'Composite Shell FEA (ish)',
    'Python Post-Processing'
    ],
  images: [
    'images/WindTurbineFSI/render4_pressure_suction_side.png',
    'images/WindTurbineFSI/render10_total_deformation.png',
    'images/WindTurbineFSI/fig2_spanwise_loads.png',
    'images/WindTurbineFSI/render6_section_forces.png',
    'images/WindTurbineFSI/fig5_yplus.png',
    'images/WindTurbineFSI/fig8_kinetics.png',
    'images/WindTurbineFSI/render9_shell_mesh.png',
    'images/WindTurbineFSI/fig6_section_cp.png',
    'images/WindTurbineFSI/fig7_fea.png',
    'images/WindTurbineFSI/render1_domain.png',
    'images/WindTurbineFSI/render8_section_pressure_field.png',
    'images/WindTurbineFSI/render7_section_vectors.png',
    'images/WindTurbineFSI/render2_blade_velocity.png',
  ],
  content: md`
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
\\dot\\omega_z=0,
\\qquad
\\vec v_{rel}=0,
\\qquad
\\vec a_{rel}=0.
$$

The blade velocity and acceleration can then be written as

$$
\\vec v
=
\\vec\\omega\\times\\vec r,
\\qquad
\\vec a
=
\\vec\\omega
\\times
\\left(
\\vec\\omega\\times\\vec r
\\right).
$$

In cylindrical coordinates,

$$
\\vec\\omega
=
\\omega_z\\hat z,
\\qquad
\\vec r
=
R\\hat r.
$$

The blade velocity follows from the cross product

$$
\\vec\\omega\\times\\vec r
=
\\begin{vmatrix}
\\hat r & \\hat\\theta & \\hat z\\\\
0 & 0 & \\omega_z\\\\
R & 0 & 0
\\end{vmatrix}
=
\\omega_zR\\hat\\theta.
$$

At the blade tip, the velocity is

$$
\\left|\\vec v_{tip}\\right|
=
\\left|\\omega_z\\right|R
=
2.22\\times44.2
=
98.1\\ \\text{m/s}.
$$

The centripetal acceleration is found by taking a second cross product:

$$
\\vec\\omega
\\times
\\left(
\\vec\\omega\\times\\vec r
\\right)
=
\\begin{vmatrix}
\\hat r & \\hat\\theta & \\hat z\\\\
0 & 0 & \\omega_z\\\\
0 & \\omega_zR & 0
\\end{vmatrix}
=
-\\omega_z^2R\\hat r.
$$

The minus sign means that the acceleration points inward, toward the hub. At the blade tip,

$$
\\left|\\vec a_{tip}\\right|
=
\\omega_z^2R
=
2.22^2\\times44.2
=
217.8\\ \\text{m/s}^2
=
22.2g.
$$

The shell model has its center of gravity at

$$
R_{CG}=14.087\\ \\text{m}.
$$

The acceleration at the center of gravity is therefore

$$
\\left|\\vec a_{CG}\\right|
=
2.22^2\\times14.087
=
69.43\\ \\text{m/s}^2.
$$

With a blade mass of 22,147.7 kg, the expected radial root force becomes

$$
\\begin{aligned}
F_{root}
&=
m\\omega_z^2R_{CG}\\\\
&=
22\\,147.7\\times69.43\\\\
&=
1.538\\times10^6\\ \\text{N}
=
1.538\\ \\text{MN}.
\\end{aligned}
$$

Mechanical reported 1.5388 MN. That is only 0.07% above the hand calculation. When the small radial aerodynamic force of 1.6 kN is included, the difference falls to **0.03%**.

**Checking the CFD result**

I used four checks to judge whether the CFD solution had converged:

* The momentum residuals reached roughly $10^{-6}$, while continuity reached $3.0\times10^{-5}$.
* The integrated pressure force changed by only **0.025%** during the final 50 iterations.
* The mass-flow imbalance was $1.09\times10^{-6}$ kg/s on a total flow of about 886,000 kg/s.
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
An Euler-Bernoulli beam model predicted 0.211 m under full CFD load. The shell is ~1.7$\times$ more flexible, which is expected because the thin-walled composite can distort while the beam assumes rigid cross-sections.

Two loads act on the blade: the aerodynamics and the centrifugal force from the Rotational Velocity. Centrifugal load is purely radial (z-component = 0):

$$ F_{cent} = (-1 537 672, -238 540) N $$

Therefore, the z-reaction is purely aerodynamic. Mechanical reports 62.67 kN, while the CFD states 82.09 kN:

$$\\frac{62.67}{82.09} = 76.3\\%$$

The same applies to the bending moment, although there the centrifugal part must be subtracted first (the mass has a slight z-offset, which generates a y-moment):

$$\\frac{2 202.2 - 402.1}{2 535.2} = \\frac{1 800.1}{2 535.2} = 71.0\\%$$

That leaves two components that do not match, axial force and flapwise moment, and they are missing by roughly the same proportion, 24% and 25% respectively. This is the signature of a load lost in the transfer, not a redistribution or a calculation error.

The shell deformed 0.259 m under approximately three-quarters of the load it should have received. That is why the post states that 0.34 m is a more reasonable figure under full load, and that 0.259 m should be read as an underloaded result, not a structural conclusion.

 It should therefore be treated as an under-loaded result. If the pressure is transferred conservatively and the model is solved again, the displacement would probably be closer to **0.34 m**.

As a separate check, an Euler-Bernoulli beam model predicted a tip displacement of 0.211 m under the full CFD load. At the same load, the shell model is roughly 1.7 times more flexible. That is reasonable because the beam model assumes that the cross-section keeps its shape, while the thin-walled composite shell can distort.

The beam result is therefore useful as an order-of-magnitude check, but not as an exact validation result.
The middle graph shows how much the blade is pulled outward as it spins. At the base (the root), this pull is massive: 1.54 million Newtons, which is almost 19 times stronger than the wind pushing against the blade. Because of this, the blade acts more like a stretched rope than a bending stick. The connection at the base is designed mostly to handle this huge spinning force, rather than the wind. However, because the base is so thick, this force is spread out, keeping the actual stress on the material quite low.

The pulling force drops very quickly as you move outward toward the tip. You might expect the opposite, since the tip is moving much faster than the base. But while speed increases toward the tip, the weight of the blade drops drastically.

**Reproducible post-processing**

Python scripts read the Fluent HDF5 files directly and computed forces, momentum balance, spanwise loading, $y^+$, sectional $C_p$, convergence and the structural free-body check. All reported values therefore come from the solver files, not manual extractions from screenshots.
  `
},
      {
        slug: 'experimental-modal-analysis',
        title: 'Experimental Modal Analysis & FE Model Updating',
        subtitle: 'Shaker testing vs. simulation - from a free-free beam to a welded T-structure',
        stack: ['Abaqus', 'MATLAB', 'CALFEM', 'EMA', 'FRF & Coherence', 'Shaker Testing', 'Model Updating'],
        images: [
          'images/ModalLab/lab2_test_setup.png',
          'images/ModalLab/lab2_geometry.png',
          'images/ModalLab/lab2_frf.png',
          'images/ModalLab/lab2_stab.png',
          'images/ModalLab/lab2_exp_mode1.png',
          'images/ModalLab/lab2_fea_updated_mode1.png',
          'images/ModalLab/lab1_freefree_modes.png',
          'images/ModalLab/lab1_frfs.png',
          'images/ModalLab/lab1_clamping.png'
        ],
        content: md`
**Overview.** A two-part structural dynamics lab project comparing Finite Element predictions against Experimental Modal Analysis (EMA), then updating the FE models until simulation and measurement agree. Performed together with Tobias Johansson.

**Part 1 - Steel beam (free-free & cantilever).**
The first three bending modes of a 400 mm steel beam were predicted with two FE formulations: Euler-Bernoulli beam elements in MATLAB/CALFEM and Timoshenko (B31) elements in Abaqus. The mode shape plots identified the node lines - locations where a mode is always zero - to avoid placing accelerometers there.

| Mode | Abaqus [Hz] | MATLAB [Hz] | Experimental [Hz] |
| :--- | :--- | :--- | :--- |
| 1 | 323.44 | 324.77 | 326.17 |
| 2 | 886.87 | 895.25 | 891.11 |
| 3 | 1726.40 | 1755.06 | 1736.82 |

With the highest frequency of interest ≈ 1755 Hz, the sampling frequency was set to $f_s = 4000$ Hz. FRFs (accelerance) and coherence were measured with roving accelerometers; the best point kept coherence above 80% for 98.7% of all data points.

**Model updating (Part 1).** Since $K\\psi = \\omega^2 M \\psi$, the Young's modulus can be scaled directly from the frequency ratio:

$$
E_{new} = \\left( \\frac{f_{exp}}{f_{sim}} \\right)^2 E_0 = 67.78 \\ \\mathrm{GPa} \\quad (E_0 = 69 \\ \\mathrm{GPa})
$$

This normalized the errors but could not remove them all, as the deviations had mixed signs. For the cantilever case, replacing the ideal clamp with a rotational spring $k_\\theta = 50 \\ \\mathrm{kNm/rad}$ matched the experiment better than scaling the stiffness - the real fixture is not ideally rigid.

**Part 2 - Welded T-structure.**
A T-shaped structure of two welded 35$\times$35$\times$2 mm hollow steel sections (327 mm horizontal, 500 mm vertical) was modeled in Abaqus. The predicted mode shapes guided the pretest planning: the shaker was placed at the end of the vertical beam where both modes are most visible, and 13 response points were distributed over the structure.

**Measurement.** Excitation by shaker, response by 3 accelerometers (QuickDAQ): 0-150 Hz range, 4000 Hz sample rate, FFT size 8192, Hanning window, 20 averages. Modal parameters were extracted from the stabilization diagram:

| Mode | First FE-model | Updated FE-model | EMA | Damping $\\zeta$ |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 121.55 Hz | 100.61 Hz | 100.61 Hz | 0.429% |
| 2 | 136.18 Hz | 126.59 Hz | 126.63 Hz | 0.495% |

**Model updating (Part 2).** The ideally fixed support overestimated the stiffness by ~20%. Replacing it with boundary springs (rotation about x: $1.25 \\cdot 10^5$ N/rad, about y: $1.9 \\cdot 10^4$ N/rad, about z: $10^6$ N/rad, translation in z: $10^{15}$ N/m) reproduced the measured frequencies almost exactly.

**Conclusion.** Idealized clamped boundary conditions consistently overpredict resonance frequencies. Calibrating boundary stiffness against EMA data - rather than scaling material parameters - reconciles the FE model with reality, since real fixtures are never ideally rigid.
        `
      },
{
  slug: 'automated-fea-design-optimization',
  title: 'Automated FEA Design Optimization',
  subtitle: 'MATLAB-Python-Abaqus coupling, Isight automation and surrogate modeling',
  stack: [
    'Abaqus',
    'MATLAB',
    'Python',
    'Isight',
    'FEA Automation',
    'fmincon',
    'Latin Hypercube Sampling',
    'Metamodeling'
  ],
  images: [],
  content: md`
**Overview.** A two-part simulation-driven design project covering automated structural optimization and surrogate modeling for computationally expensive functions. The first task coupled MATLAB, Python, and Abaqus to minimize the mass of a cantilever I-beam. The second investigated Latin Hypercube Sampling and cubic metamodeling for a black-box optimization problem. Performed together with Florent Congost.

## Task 1 - Automated optimization of an I-beam

The objective was to minimize the mass of a $1.2\\ \\mathrm{m}$ cantilever I-beam subjected to a $75\\ \\mathrm{kN}$ end load acting at $45^{\\circ}$.

Because the beam length and material density remained constant, minimizing mass was equivalent to minimizing the cross-sectional area:

$$
A =
2t_f w
+
\\left(h-2t_f\\right)t_w,
$$

where:

* $w$ is the flange width,
* $h$ is the section height,
* $t_f$ is the flange thickness,
* $t_w$ is the web thickness.

The design was required to satisfy:

$$
\\sigma_{VM,max}\\leq190\\ \\mathrm{MPa},
$$

$$
\\delta_{max}\\leq15\\ \\mathrm{mm},
$$

together with geometric bounds on the section dimensions.

## Finite element model

The beam was represented in Abaqus using quadratic Timoshenko beam elements. The model contained approximately 100 nodes and used:

| Parameter | Value |
| :--- | :--- |
| Length | $1.2\\ \\mathrm{m}$ |
| End load | $75\\ \\mathrm{kN}$ |
| Load direction | $-45^{\\circ}$ |
| Young's modulus | $210\\ \\mathrm{GPa}$ |
| Shear modulus | $70\\ \\mathrm{GPa}$ |
| Stress limit | $190\\ \\mathrm{MPa}$ |
| Deflection limit | $15\\ \\mathrm{mm}$ |

The load was resolved into two components:

$$
F_x=F_y=
-\\frac{75\\,000}{\\sqrt{2}}
\\approx-53.0\\ \\mathrm{kN}.
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
\\frac{\\delta_{max}-\\delta_{limit}}
{\\delta_{limit}}
\\leq0,
$$

$$
g_2=
\\frac{\\sigma_{VM,max}-\\sigma_{limit}}
{\\sigma_{limit}}
\\leq0.
$$

Invalid Abaqus models or missing result files were penalized so the optimizer could recover and continue searching.

The same optimization architecture was also recreated in Isight using connected Abaqus, Calculator, and Optimization components. This provided an alternative graphical implementation of the automated workflow.

## Optimized design

The reported MATLAB-Abaqus solution was:

| Design variable | Optimized value |
| :--- | :--- |
| Flange width $w$ | $119.2\\ \\mathrm{mm}$ |
| Section height $h$ | $175.0\\ \\mathrm{mm}$ |
| Flange thickness $t_f$ | $21.8\\ \\mathrm{mm}$ |
| Web thickness $t_w$ | $1.0\\ \\mathrm{mm}$ |
| Cross-sectional area | $5.33\\times10^{-3}\\ \\mathrm{m^2}$ |
| Maximum von Mises stress | $190\\ \\mathrm{MPa}$ |
| Maximum displacement | $5.8\\ \\mathrm{mm}$ |

The stress constraint became active while the displacement remained below its limit. The section height reached its upper bound and the web thickness reached its lower bound.

This result also exposes an important distinction between mathematical and engineering optimization: without buckling, fabrication, or minimum-gauge constraints, the optimizer drives the web toward an impractically small thickness. A production-oriented study would therefore require additional constraints for manufacturability, local buckling, and section slenderness.

## Task 2 - Metamodeling of an expensive black-box function

The second task considered a function requiring approximately three hours for each evaluation. Direct gradient-based optimization would therefore be prohibitively expensive.

Ten design points were generated using Latin Hypercube Sampling:

$$
\\mathbf{x}^{(i)}
=
\\mathbf{x}_{min}
+
\\mathbf{u}^{(i)}
\\odot
\\left(
\\mathbf{x}_{max}-\\mathbf{x}_{min}
\\right),
$$

where $\\mathbf{u}^{(i)}$ contains the normalized Latin Hypercube coordinates.

MATLAB controlled an Excel-based black-box model through COM automation. The sampled input-output pairs were then used to construct a cubic response surface:

$$
\\hat f(x_1,x_2)
=
\\operatorname{CubicInterp}
\\left(
x_1,x_2,f
\\right).
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
  `
},
      {
  slug: 'vickers-indentation-mesh-convergence',
  title: 'Automated Mesh Convergence Study',
  subtitle: 'Scripted Abaqus refinement and MATLAB post-processing of a Vickers indentation model',
  stack: [
    'Abaqus',
    'Python (Abaqus scripting)',
    'MATLAB',
    'Axisymmetric FEM',
    'Contact Mechanics',
    'Elastoplasticity',
    'Mesh Convergence',
    'Automation'
  ],
  images: ['images/Vickers/VickersConvergence.svg'],
  content: md`
**Overview.** A Vickers indentation model was used as the test case for a fully scripted mesh-refinement study. One Abaqus Python script copies a base model, halves the biased seed sizes for each refinement level, meshes, submits the job, opens the resulting ODB and writes a force-displacement CSV in which the mesh metadata is carried in dedicated columns. A MATLAB script then discovers every CSV automatically, isolates the loading branch and compares the indentation force at one common penetration depth. The subject of the project is the automation and the comparison methodology; the indentation model itself is deliberately small.
 
## Finite element model
 
The Vickers pyramid is represented by the axisymmetric cone of equal apex angle. The 136$^{\\circ}$ face angle gives a cone semi-angle of
 
$$
\\psi=\\frac{136^{\\circ}}{2}=68^{\\circ},
$$
 
which reduces the indentation to a two-dimensional axisymmetric contact problem while preserving the area-to-depth relation of the real indenter.
 
| Parameter | Value |
| :--- | :--- |
| Specimen element type | CAX8R (quadratic, reduced integration) |
| Indenter element type | CAX4R / CAX3 |
| Specimen domain | $30\\ \\mathrm{\\mu m}$ radius $\\times\\ 6\\ \\mathrm{\\mu m}$ depth |
| Specimen material | $E=210\\ \\mathrm{GPa}$, $\\nu=0.33$, isotropic hardening $250\\rightarrow400\\ \\mathrm{MPa}$ |
| Indenter material | $E=900\\ \\mathrm{GPa}$, $\\nu=0.021$ |
| Contact | Surface-to-surface, hard normal behaviour, frictionless |
| Load introduction | Kinematic coupling of the indenter to a reference point |
| Prescribed depth | $0.9\\ \\mathrm{\\mu m}$, applied and fully removed through an amplitude |
| Step | Static, \`nlgeom=YES\`, automatic stabilisation $2\\times10^{-4}$ |
 
The symmetry axis and the outer radius are constrained radially and the bottom face vertically. Reaction force and displacement are requested as history output at the reference point, so one loading curve is produced per job without any field-output post-processing.
 
## Refinement series in Python
 
Both the minimum and the maximum biased seed size are halved together at every level, so the meshes form a clean sequence
 
$$
h_{k}=\\frac{h_{0}}{2^{k}},\\qquad k=0,1,2,\\dots
$$
 
rather than an arbitrary set of unrelated meshes. Halving both ends of the bias keeps the grading ratio constant, which means the meshes differ in resolution but not in character.
 
For each level the script:
 
1. deletes any previous model and job with the same name and copies the base model,
2. rebuilds the reference-point set and the U2/RF2 history request,
3. applies the new bias with \`seedEdgeByBias\` on the named edge set and regenerates the mesh,
4. submits the job and waits for completion,
5. opens the ODB and writes the force-displacement history to CSV.
 
The ODB reader does not hard-code a history region name. It scans the available regions and selects the first one containing both \`U2\` and \`RF2\`, and prints the full list of regions and outputs if no match is found. The time points of the two histories are also compared before every row is written, so a mismatched output request fails immediately instead of silently producing a shifted curve.
 
The mesh metadata is written into the CSV as repeated columns:
 
\`CASE, MIN_SEED, MAX_SEED, STEP_TIME, ABS_U2, ABS_RF2\`
 
Repeating the case name and the two seed sizes on every row is redundant, but it means MATLAB can read the file with a plain \`readtable\` call. A separate header block would have required a custom parser, and metadata encoded in the file name would have to be parsed with string operations that break as soon as the naming convention changes.
 
## Post-processing in MATLAB
 
Two decisions determine whether the comparison is meaningful.
 
**Only the loading branch is used.** The analysis loads and then fully unloads the indenter. Plotting $|U_{2}|$ against $|RF_{2}|$ for the complete cycle folds the unloading curve back onto the loading curve and produces a near-vertical return segment that has no physical meaning in a convergence plot. Each history is therefore truncated at the first displacement maximum.
 
**Force is compared at the same depth, not at the peak.** Abaqus does not write history output at identical increments in different jobs, so $\\max(F)$ is sampled at slightly different penetrations in each mesh and part of the apparent mesh sensitivity would simply be sampling scatter. The script instead interpolates the force linearly at one common depth,
 
$$
U_{c}=0.88\\ \\mathrm{\\mu m},
$$
 
taken as the smallest peak depth of the series rounded down. Two deviations are then reported,
 
$$
\\varepsilon_{\\text{finest}}
=
\\frac{\\left|F_{k}-F_{N}\\right|}{\\left|F_{N}\\right|}\\times100\\%,
\\qquad
\\varepsilon_{\\text{prev}}
=
\\frac{\\left|F_{k}-F_{k-1}\\right|}{\\left|F_{k}\\right|}\\times100\\%,
$$
 
and the cases are sorted from coarse to fine using the seed size read from the CSV, so no ordering is assumed from the file names.
 
## Results
 
| Case | Specimen nodes | Min seed [$\\mathrm{\\mu m}$] | Max seed [$\\mathrm{\\mu m}$] | $F$ at $0.88\\ \\mathrm{\\mu m}$ [N] | $\\varepsilon_{\\text{prev}}$ [%] |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Mesh_01 | 77 | 1.050 | 7.00 | 0.01542 | - |
| Mesh_02 | 216 | 0.525 | 3.50 | 0.01865 | 17.3 |
| Mesh_03 | 889 | 0.2625 | 1.75 | 0.01843 | 1.19 |
| Mesh_04 | 889 | 0.2625 | 1.75 | 0.01843 | 0.00 |
 
The coarse mesh underestimates the indentation force by about 16%, which is expected: with a maximum seed of $7\\ \\mathrm{\\mu m}$ the contact zone is resolved by a handful of elements and neither the contact pressure distribution nor the plastic zone under the tip is captured. The change collapses to roughly 1% at the next refinement.
 
## Limitations
 
**The series is truncated by a node limit.** The model was built in Abaqus Learning Edition, which allows at most 1000 nodes. Mesh_03 uses 889 nodes in the specimen and 90 in the indenter, so the fourth refinement level could not be created: the seeding request could not produce a finer mesh and Mesh_04 reproduced the Mesh_03 mesh exactly. The finest case is therefore not an independent reference, and the $0.000\\%$ deviation reported for Mesh_03 is the result of comparing a mesh with itself. It is a property of the table, not evidence of convergence.
 
Several further caveats follow from the same constraint:
 
* The sequence is not monotonic. The force rises from Mesh_01 to Mesh_02 and then falls slightly at Mesh_03, so the solution is not in the asymptotic range where an observed order of accuracy or a Richardson extrapolation would be defensible.
* Only the specimen was refined. The indenter mesh is unchanged in every case, so contact resolution improves on one side of the interface only.
* The specimen depth is about $6\\ \\mathrm{\\mu m}$ against a contact radius of roughly $a=h\\tan\\psi\\approx2.2\\ \\mathrm{\\mu m}$ at maximum load. The constrained bottom face is close enough to stiffen the response, and a converged study would need a deeper domain.
* Automatic stabilisation is active, so the ratio of stabilisation energy to internal energy should be checked before the force is treated as a purely physical quantity.
 
The honest summary is that this study demonstrates a refinement workflow and shows the expected trend, but does not establish a mesh-converged indentation force.`
},
      {
        slug: 'topology-optimization-lifting',
        title: 'Topology Optimization for Lifting Solutions',
        subtitle: 'Generalized attachment design using Ansys Mechanical',
        stack: ['Ansys Mechanical', 'Topology Optimization', 'FEM', 'CAD', 'Product Development'],
        images: ['images/Hook/1500N/1500N_optimized_stress.png', 'images/Hook/Paretofront.png', 'images/Hook/400N/400N_optimized.png', 'images/Hook/Analyze lifting loops on cargo.png'],
        content: md`
**Overview.** The transportation of a diverse product range-specifically pumps of different sizes and weights-creates logistical bottlenecks due to frequent tool changes. This project investigates the design of a generalized conveyor attachment system capable of handling diverse loads without operational stoppages.

**Methodology.** The study utilizes topology optimization to analyze the structural balance between stress and material consumption. By applying Finite Element Method (FEM) stress analysis in Ansys Mechanical, the design process iteratively removes material from determining where structural support is essential vs. where it is negligible.

**Mathematical Validation.** To validate the FEA results, a simplification of the attachment solution was performed using hand calculations based on the Winkler-Bach formula for bending of curved beams. The hook is affected by both direct tensile stress and bending stress:

$$
\\sigma = \\frac{F}{A} + M \\cdot \\frac{r_n - r_i}{A \\cdot e \\cdot r_i}
$$

Where $r_n$ is the neutral axis radius ($r_n = \\frac{h}{\\ln(r_o/r_i)}$) and $e$ is the eccentricity. The theoretical deflection was calculated as:

$$
\\delta = \\frac{\\pi \\cdot F \\cdot R^2}{2 \\cdot E \\cdot A \\cdot e}
$$

**Optimization Results.** Three distinct models were generated based on different load cases (400 N and 1500 N) and contact surfaces. The results demonstrated a non-linear trade-off between volume and stress, visualized as a Pareto front.

| Model | Load Case | Volume [L] | Max Stress [MPa] | Characteristics |
| :--- | :--- | :--- | :--- | :--- |
| **Model 1** | 400 N | 1.35 | 10.89 | **Balanced:** Good trade-off between weight and strength. |
| **Model 2** | 1500 N | 1.48 | 10.46 | **Lowest Stress:** Most durable, but highest volume. |
| **Model 3** | 1500 N (Small Area) | 1.19 | 13.29 | **Lowest Volume:** Lightest design (48% reduction), higher stress. |

**Conclusion.** The final optimized solution achieved a weight reduction of up to 48% compared to the original design while maintaining structural integrity under a reference load of 3000 N. The study confirmed that while critical stress areas require consistent material distribution across load cases, the magnitude of material volume can be optimized significantly.
        `
      },
      {
  slug: 'thermal-fem-slider-bearing',
  title: 'Thermal FEM',
  subtitle: 'Transient heat transfer in MATLAB and Abaqus',
  stack: [
    'MATLAB',
    'Finite Element Method',
    'Finite Difference Method',
    'Crank-Nicolson',
    'Reynolds Equation',
    'Coupled Physics'
  ],
  images: ['images/Comp2A2/A2_Ball.png', 'images/Comp2A2/MatlabR.svg', 'images/Comp2A2/MatlabTemp.svg', 'images/Comp2A2/AbaqusTemp.svg'],
  content: md`
**Overview.** The transient thermal model was reproduced in Abaqus and Matlab to verify the implementation and compare the two finite element solutions.

The first problem investigated how long a heated martensitic-steel component could remain in ambient air before its surface temperature fell below a manufacturing limit of $950\\,^{\\circ}\\mathrm{C}$.

The component's elliptic cross-section was approximated by a sphere with radius

$$
R=\\sqrt{a^2+b^2}\\approx0.029\\ \\mathrm{m}.
$$

The component was initially at

$$
T_0=1030\\,^{\\circ}\\mathrm{C},
$$

with an ambient-air temperature of

$$
T_{\\mathrm{air}}=25\\,^{\\circ}\\mathrm{C}.
$$

Radial heat conduction was described by the transient heat equation in spherical coordinates:

$$
\\rho c_p\\frac{\\partial T}{\\partial t}
=
\\frac{1}{r^2}
\\frac{\\partial}{\\partial r}
\\left(
k r^2\\frac{\\partial T}{\\partial r} \\right).
$$

Heat loss from the outer surface included convection and nonlinear thermal radiation:

$$
q_s= h(T_s-T_{\\mathrm{air}})
+
\\varepsilon\\sigma
\\left(
T_s^4-T_{\\mathrm{air}}^4
\\right),
$$

where $h=15\\ \\mathrm{W/(m^2K)}$. An emissivity of $\\varepsilon=1$ was used in the comparison model.

### MATLAB finite element model

The radial domain was discretized using linear finite elements. Element capacity and conductivity matrices were assembled into the global system

$$
\\mathbf C\\dot{\\mathbf T}
+
\\mathbf K\\mathbf T
=
\\mathbf f(\\mathbf T).
$$

Time integration was performed using the Crank-Nicolson method,

$$
\\left(
\\frac{\\mathbf C}{\\Delta t}
+
\\frac{\\mathbf K}{2}
\\right)
\\mathbf T_{n+1}
=
\\left(
\\frac{\\mathbf C}{\\Delta t}
-
\\frac{\\mathbf K}{2}
\\right)
\\mathbf T_n
+
\\frac{\\mathbf f_n+\\mathbf f_{n+1}}{2}.
$$

Because the radiation heat flux varies with $T_s^4$, the surface-load vector is nonlinear. A nonlinear iteration was therefore performed within each time increment to update $\\mathbf f_{n+1}$ until the temperature solution converged.

The MATLAB model used 20 radial nodes and a time increment of

$$
\\Delta t=0.01\\ \\mathrm{s}.
$$

### Independent verification in Abaqus

The same cooling problem was recreated independently in Abaqus/Standard using a three-dimensional heat-transfer model of the sphere.

The Abaqus model used:

* the same geometry and thermal properties as the MATLAB model;
* an initial temperature of $1030\\,^{\\circ}\\mathrm{C}$;
* convection to air at $25\\,^{\\circ}\\mathrm{C}$;
* nonlinear surface radiation;
* a transient heat-transfer step; and
* linear tetrahedral heat-transfer elements.

This provided an independent implementation of the same physical problem and allowed the MATLAB solver to be checked against a commercial finite element code.

The comparison also proved useful for debugging the numerical implementation. An earlier MATLAB formulation weighted the surface-load vector only as $\\theta\\mathbf f$. For the general $\\theta$-method, the correct contribution is

$$
(1-\\theta)\\mathbf f_n+\\theta\\mathbf f_{n+1}.
$$

For Crank-Nicolson, where $\\theta=0.5$, this becomes

$$
\\frac{\\mathbf f_n+\\mathbf f_{n+1}}{2}.
$$

Correcting the load treatment and iterating the nonlinear radiation term produced close agreement with Abaqus.

### Results

Both models predicted essentially the same time for the surface to cool from $1030\\,^{\\circ}\\mathrm{C}$ to $950\\,^{\\circ}\\mathrm{C}$:

| Model           | Time to $950\\,^{\\circ}\\mathrm{C}$ |
| --------------- | -------------------------------: |
| MATLAB FEM      |     $\\approx 14.300\\ \\mathrm{s}$ |
| Abaqus/Standard |     $\\approx 14.294\\ \\mathrm{s}$ |

The difference between the reported threshold times was approximately

$$
0.006\\ \\mathrm{s},
$$

or about $0.04\\%$.

The close agreement between two independently constructed finite element models provides strong verification of the numerical implementation within the assumptions of the model.

It also demonstrates the value of independent solver comparison: Abaqus was not simply used to reproduce the result, but as a verification tool that helped identify and correct an error in the original time-integration implementation.

### Analytical verification
To check the numerical results, an analytical estimate was obtained from the one-term approximation for transient conduction in a sphere.
The nonlinear radiation flux was linearized over the cooling interval (1030 °C &rarr; 950 °C) by introducing an equivalent radiation coefficient evaluated at the mean surface temperature. The effective heat-transfer coefficient then became
$$h_{\\mathrm{eff}}=h+h_{\\mathrm{rad}},$$
yielding the Biot number
$$Bi_R=\\frac{h_{\\mathrm{eff}}R}{k}\\approx0.1045.$$
Using tabulated coefficients for $  Bi=0.1  $ ($  \\zeta_1\\approx0.5423  $, $  C_1\\approx1.0298  $), the surface temperature was evaluated from
$$\\theta_s^*=C_1\\frac{\\sin(\\zeta_1)}{\\zeta_1}\\exp(-\\zeta_1^2Fo).$$
Solving for the Fourier number and converting to time gave
$$ Fo = \\frac{1}{-\\zeta_1^2} \\ln\\left(\\frac{C_1 \\sin(\\zeta_1)}{\\theta_s^*}\\right) $$
$$ t = \\frac{Fo R^2}{\\alpha} $$
$$t_{\\mathrm{analytic}}\\approx14.55\\,\\mathrm{s}.$$

This lies within 2 % of the numerical predictions (14.3 s). The small difference is expected: the analytical model holds $h_{\\mathrm{rad}}$ constant, whereas the MATLAB and Abaqus solutions retain the full nonlinear $T^4$ dependence. The close agreement nevertheless confirms the physical consistency of the numerical results.

## Key takeaways

The project combined equation-based modelling with numerical implementation and independent FE verification. Rather than treating the numerical solver as a black box, the governing equations were derived, discretized and implemented directly before the thermal model was cross-checked in Abaqus.

**Methods and tools:** MATLAB, Abaqus/Standard, finite element method, Crank-Nicolson time integration, nonlinear thermal boundary conditions, solver-to-solver verification.
`
},
{
  slug: 'sector-thrust-bearing-analysis',
  title: 'Sector Thrust Bearing Analysis',
  subtitle: 'Comparing finite difference and finite element solutions of the Reynolds equation',
  stack: [
    'MATLAB',
    'Tribology',
    'Lubrication Theory',
    'Finite Difference Method',
    'Finite Element Method',
    'Gaussian Quadrature Integration',
  ],
  images: [
  'images/Comp2A1/xy_pressure.png',
  'images/Comp2A1/rt_pressure.png',
  'images/Comp2A1/mesh.png',
  'images/Comp2A1/mesh_highlight.png',
  'images/Comp2A1/xy-height.png',
  'images/Comp2A1/rt-height.png',
  'images/Comp2A1/1D_pressure_Ravg.png',
  'images/Comp2A1/1D_pressure_Rmax.png'
],
  content: md`
**Overview.** A computational analysis of the pressure distribution, load capacity, and frictional power loss in a six-pad sector thrust bearing. The Reynolds equation was solved independently using the Finite Difference Method (FDM) and the Finite Element Method (FEM), allowing the two numerical formulations to be compared.

## Bearing model

Each pad covers an angular sector of $\\phi=0.8\\ \\mathrm{rad}$ and contains a stepped lubricant-film geometry. The bearing dimensions and operating conditions were:

| Parameter | Value |
| :--- | :--- |
| Inner radius | $R_{in}=0.045\\ \\mathrm{m}$ |
| Outer radius | $R_{out}=0.120\\ \\mathrm{m}$ |
| Minimum film thickness | $h_{min}=40\\ \\mu\\mathrm{m}$ |
| Film-height ratio | $k_0=2$ |
| Step position | $\\beta=0.6\\ \\mathrm{rad}$ |
| Lubricant viscosity | $\\eta=0.015\\ \\mathrm{Pa\\,s}$ |
| Angular velocity | $\\omega=29\\ \\mathrm{rad/s}$ |

The lubricant-film pressure is governed by the two-dimensional Reynolds equation in polar coordinates:

$$
\\frac{1}{r}
\\frac{\\partial}{\\partial r}
\\left(
r h^3 \\frac{\\partial p}{\\partial r}
\\right)
+
\\frac{1}{r^2}
\\frac{\\partial}{\\partial \\theta}
\\left(
h^3 \\frac{\\partial p}{\\partial \\theta}
\\right)
=
6\\eta\\omega\\frac{\\partial h}{\\partial \\theta}.
$$

Ambient-pressure boundary conditions, $p=0$, were applied along every edge of the pad.

## Finite Difference Method

The bearing domain was discretized using a structured mesh with 35 radial and 50 circumferential nodes. Central finite-difference approximations connected each interior node to its east, west, north, and south neighbours.

Because the stepped film thickness gives an undefined derivative at $\\theta=\\beta$, the transition was regularized using a hyperbolic tangent:

$$
h(\\theta)
=
h_{min}
\\left[
1+
\\frac{k_0}{2}
\\left(
1+\\tanh\\left(\\frac{\\beta-\\theta}{\\delta}\\right)
\\right)
\\right].
$$

This produced a finite and analytically defined value of $\\partial h/\\partial\\theta$ for the Reynolds-equation load vector.

## Finite Element Method

For the FEM solution, the Reynolds equation was transformed into its weak form and discretized using four-node bilinear quadrilateral elements.

The element matrix was evaluated with two-point Gaussian quadrature:

$$
\\mathbf{K}_e
=
\\int_{r_1}^{r_2}
\\int_{\\theta_1}^{\\theta_2}
\\left[
r h^3
\\frac{\\partial \\mathbf{N}^{T}}{\\partial r}
\\frac{\\partial \\mathbf{N}}{\\partial r}
+
\\frac{h^3}{r}
\\frac{\\partial \\mathbf{N}^{T}}{\\partial \\theta}
\\frac{\\partial \\mathbf{N}}{\\partial \\theta}
\\right]
d\\theta\\,dr.
$$

The mesh was refined around the radial and circumferential film-height discontinuities. Unlike the FDM formulation, the FEM load vector treated the film-height step analytically rather than smoothing it.

## Results

Both methods produced similar pressure fields, with the maximum located near the end of the raised film region.

| Method | Maximum pressure | Load per pad |
| :--- | :--- | :--- |
| FDM | $445.2\\ \\mathrm{kPa}$ | $770\\ \\mathrm{N}$ |
| FEM | $434.9\\ \\mathrm{kPa}$ | $738.17\\ \\mathrm{N}$ |

The maximum-pressure predictions differ by approximately 2.3%, while the calculated load capacities differ by approximately 4.1%. For all six pads, the FDM model predicts a total bearing load capacity of approximately $4.6\\ \\mathrm{kN}$.

The supporting load was obtained by integrating pressure over the sector:

$$
F
=
\\int_{0}^{\\phi}
\\int_{R_{in}}^{R_{out}}
p(\\theta,r)\\,r\\,dr\\,d\\theta.
$$

The lubricant shear stress was calculated from the combined Couette and pressure-driven flow:

$$
\\tau_{\\theta}
=
\\eta\\frac{\\omega r}{h}
-
\\frac{h}{2r}\\frac{\\partial p}{\\partial\\theta}.
$$

For the FDM solution, the resulting frictional power loss was approximately $10.98\\ \\mathrm{W}$ per pad, with a dimensionless relative power loss of approximately $0.00425$.

## Verification

A simplified one-dimensional analytical solution was derived for fixed radii. It predicted higher peak pressures than the two-dimensional numerical models because it does not capture radial pressure redistribution:

* $555\\ \\mathrm{kPa}$ at the mean radius.
* $823.8\\ \\mathrm{kPa}$ at the radius of the FEM pressure maximum.

**Conclusion.** The project demonstrates how the same lubrication problem can be formulated using both FDM and FEM. Despite different treatments of the discontinuous film geometry, the methods agreed closely on maximum pressure and load capacity. The comparison also shows why a two-dimensional model is important when radial pressure variation materially affects bearing performance.
  `
},
{
        slug: 'Drone1',
        title: 'Flying & Balancing robot drone',
        subtitle: 'Two wheeled, two propellered drone car',
        stack: ['MATLAB','Simulink','Kinematics', 'Control Theory'],
        images: ['images/Drone1/Turn.png', 'images/Drone1/Equation.png','images/Drone1/RobotBild.jpeg', 'images/Drone1/Balancing Kinematics.png', 'images/Drone1/Assembly1.png', 'images/Drone1/PXL_20250327_161507964.jpg','images/Drone1/Video (1).mp4','images/Drone1/Video (2).mp4'],
        content: md`
**Overview.** An accurate controlled robot that can move on ground and in air.

**Odometry.** Designed & built a balancing drone robot including both mechanical parts and control algorithms for automated navigation system using MATLAB and Simulink.
For wheel i, the velocity is calculated as
$$
V_i = \\bar{V} + \\overline{r_{i/C}} \\times \\bar{\\omega}
= V\\hat{y} + \\det\\left| \\begin{bmatrix}
    \\hat{x} & \\hat{y} & \\hat{z} \\newline
    r_x & r_y & r_z \\newline
    0 & 0 & \\omega_z
\\end{bmatrix} \\right|
= (V - r_x \\omega_z) \\hat{y}
$$

The left wheel has a directed distance of $+\\frac{L}{2}$
and the right wheel a directed distance of $-\\frac{L}{2}$ in the x-direction relative to C.
We obtain the equations:

$$
\\begin{cases}
V_l = V - \\frac{L}{2}\\,\\omega_z
  = \\begin{bmatrix} 1 & -\\frac{L}{2} \\end{bmatrix}\\begin{bmatrix} V \\newline \\omega_z \\end{bmatrix} \\newline
V_r = V + \\frac{L}{2}\\,\\omega_z
  = \\begin{bmatrix} 1 & +\\frac{L}{2} \\end{bmatrix}\\begin{bmatrix} V \\newline \\omega_z \\end{bmatrix}
\\end{cases}
$$

            `
      },
      {
        slug: 'arrow-flight-simulation',
        title: 'Compound Bow Arrow Flight Simulation',
        subtitle: 'Trajectory and Archer\'s Paradox Modeling',
        stack: ['MATLAB', 'FEM', 'Runge-Kutta 4', 'Newmark-Beta', 'Physics Simulation'],
        images: ['images/arrow/DrawCurve2.png', 'images/arrow/StaticDef.png', 'images/arrow/DynamicDef.png', 'images/arrow/FlightHorizontal.png', 'images/arrow/DrawAndVertDiff.png'],
        content: md`
**Overview.** The problem consists of building up a simulation model for an arrow launched from a compound bow. The objective was to hit a target 20 meters away and estimate how the release affects the accuracy, considering different shooting styles with the Mediterranean draw. The simulation includes surrounding factors such as gravitation, quadratic air resistance, shooting angle, and the archer's paradox.

**Methodology.**
The project combined empirical measurements with advanced numerical methods to simulate the entire launch and flight sequence.

**Experimental Data Collection.** An experiment was conducted using an actual compound bow and a dynamometer. By measuring the force applied to the string for different draw lengths, a nonlinear relationship was interpolated to compute the initial velocity.

**Modeling the Archer's Paradox.** The arrow was simplified into an Euler-Bernoulli beam. The dynamic movement was calculated using the Finite Element Method (FEM) and integrated over time using the Newmark-Beta method. The beam equation used in the model was $EI\\,w''''(x,t) + \\rho A\\,\\ddot{w}(x,t) = 0$.

**Flight Trajectory.** The flight path was modeled as an ordinary differential equation (ODE) initial value problem and solved using the fourth-order Runge-Kutta (RK4) method. The model combined initial velocity, gravity, quadratic air resistance, and the tip vibrations derived from the FEM calculations.

**Results.** The simulation produced a periodic oscillating motion reflecting the archer's paradox over a 20-meter trajectory. The impact of different initial conditions on accuracy was evaluated:
* The order and timing of which finger leaves the string first, introducing horizontal and vertical offsets, has the largest impact on hit location.
* An uneven release excites a stronger tip vibration and gives the arrow a persistent initial angular deviation.
* Differences in draw length resulted in considerably lower spread, giving it the least impact on overall precision.

**Conclusion.** To minimize potential error and maximize accuracy, it is highly recommended to release all fingers as simultaneously as possible without pulling the string sideways.
        `
      },
      {
        slug: 'Railroad-vehicle-suspension',
        title: 'Suspension Optimization for railroad vehicles',
        subtitle: 'Solving for feasibility',
        stack: ['MATLAB','Mathematical Modeling', 'Runge-Kutta 4'],
        images: ['images/Suspension/Mathematical Model.png', 'images/Suspension/Task5_Impulse_10mm.png', 'images/Suspension/StepResponse.png'],
        content: md`
**Problem statement.** The vehicle is running at constant velocity $v = 68\\ \\mathrm{km/h}$. The measured vertical height position $z_s$ of the track along the route $s$ is given by data.

**Mathematical model.** We consider a two-degree-of-freedom train model with masses $m_1$, $m_2$, contact and suspension springs $k_1$, $k_2$, and dampers $C_1$, $C_2$, traveling over a track profile $z_s(s)$ at constant speed v.

The parameters are:
$$
\\begin{aligned}
m_1 &= 6\\,000 \\ \\mathrm{kg}, & m_2 &= 38\\,200 \\ \\mathrm{kg},\\newline
k_1 &= 1.12 \\times 10^7 \\ \\mathrm{N/m}, & k_2 &= 2.16 \\times 10^6 \\ \\mathrm{N/m},\\newline
C_1 &= 4.10 \\times 10^5 \\ \\mathrm{Ns/m}, & C_2 &= 1.60 \\times 10^5 \\ \\mathrm{Ns/m}.
\\end{aligned}
$$

The track elevation is given as a dataset with corresponding heights $z_s$ and distances $s$.
Since the vehicle moves at constant speed $v_s = 68\\ \\mathrm{km/h}$, we can also obtain the time signal from the data:
$$
t = \\frac{s}{v}, \\quad \\text{where $s$ is the track distance vector}.
$$

We denote:
$$
z_s(t) = z_s(s = v t),
$$
and approximate its time derivative by:
$$
v_s(t_i) = \\dot z_s(t_i) \\approx \\frac{z_s(t_{i+1}) - z_s(t_i)}{\\Delta t},  
\\quad \\Delta t = \\frac{T}{N}.
$$
The system can be modeled as a coupled spring-mass-damper system with the given parameters.
From the free body diagram, the forces are:
$$
\\begin{aligned}
F_{S1} &= k_1(z_s - z_1), & F_{C1} &= C_1(\\dot z_s - \\dot z_1),\\newline
F_{S2} &= k_2(z_1 - z_2), & F_{C2} &= C_2(\\dot z_1 - \\dot z_2).
\\end{aligned}
$$

The equilibrium equations are:
$$
\\begin{aligned}
\\uparrow^+ \\sum F_{z1} = m_1 \\ddot z_1 &= +F_{S1} - F_{S2} + F_{C1} - F_{C2} + F_1,\\newline
&= k_1(z_s - z_1) - k_2(z_1 - z_2) + C_1(\\dot z_s - \\dot z_1) - C_2(\\dot z_1 - \\dot z_2) + F_1,\\newline
\\uparrow^+ \\sum F_{z2} = m_2 \\ddot z_2 &= +F_{S2} + F_{C2} + F_2,\\newline
&= -k_2(z_2 - z_1) - C_2(\\dot z_2 - \\dot z_1) + F_2.
\\end{aligned}
$$

Since there are no other external forces ($F_1 = F_2 = 0$), the accelerations can be expressed as:
$$
\\ddot{z}_1 = -\\frac{1}{m_1} \\left[ (C_1 + C_2)\\dot z_1 + (k_1 + k_2) z_1 - C_2 \\dot z_2 - k_2 z_2 - C_1 \\dot z_s - k_1 z_s \\right], \\tag{1}
$$
$$
\\ddot{z}_2 = -\\frac{1}{m_2} \\left[ C_2 \\dot z_2 + k_2 z_2 - C_2 \\dot z_1 - k_2 z_1 \\right]. \\tag{2}
$$

**Solving the coupled system.** The system of equations is defined as
$$
\\begin{aligned}
f_1(z_1, \\dot{z}_1, z_2, \\dot{z}_2, i) &=
\\frac{-C_1\\left(\\dot{z}_1 - \\dot{z}_s(i)\\right)
      - k_1\\left(z_1 - z_s(i)\\right)
      - C_2\\left(\\dot{z}_1 - \\dot{z}_2\\right)
      - k_2\\left(z_1 - z_2\\right)}{m_1}, \\newline
f_2(z_1, \\dot{z}_1, z_2, \\dot{z}_2) &=
\\frac{-C_2\\left(\\dot{z}_2 - \\dot{z}_1\\right)
      - k_2\\left(z_2 - z_1\\right)}{m_2}.
\\end{aligned}
$$

The fourth-order Runge-Kutta method (RK4) is applied as follows.
For $k = 1, \\dots, N-1$, let

$$
\\begin{aligned}
k_{1v_1} &= f_1(z_1^k, \\dot z_1^k, z_2^k, \\dot z_2^k, k), &\\quad
k_{1z_1} &= \\dot z_1^k, \\newline
k_{2v_1} &= f_1\\left(z_1^k + \\tfrac{\\Delta t}{2}k_{1z_1},\\, \\dot z_1^k + \\tfrac{\\Delta t}{2}k_{1v_1},\\, z_2^k,\\, \\dot z_2^k,\\, k\\right), &\\quad
k_{2z_1} &= \\dot z_1^k + \\tfrac{\\Delta t}{2}k_{1v_1}, \\newline
k_{3v_1} &= f_1\\left(z_1^k + \\tfrac{\\Delta t}{2}k_{2z_1},\\, \\dot z_1^k + \\tfrac{\\Delta t}{2}k_{2v_1},\\, z_2^k,\\, \\dot z_2^k,\\, k\\right), &\\quad
k_{3z_1} &= \\dot z_1^k + \\tfrac{\\Delta t}{2}k_{2v_1}, \\newline
k_{4v_1} &= f_1\\left(z_1^k + \\Delta t\\,k_{3z_1},\\, \\dot z_1^k + \\Delta t\\,k_{3v_1},\\, z_2^k,\\, \\dot z_2^k,\\, k\\right), &\\quad
k_{4z_1} &= \\dot z_1^k + \\Delta t\\,k_{3v_1}, \\newline
\\dot z_1^{k+1} &= \\dot z_1^k + \\frac{\\Delta t}{6}\\left(k_{1v_1} + 2k_{2v_1} + 2k_{3v_1} + k_{4v_1}\\right), &\\quad
z_1^{k+1} &= z_1^k + \\frac{\\Delta t}{6}\\left(k_{1z_1} + 2k_{2z_1} + 2k_{3z_1} + k_{4z_1}\\right).
\\end{aligned}
$$

Similarly, for $z_2$:

$$
\\begin{aligned}
k_{1v_2} &= f_2(z_1^k, \\dot z_1^k, z_2^k, \\dot z_2^k), &\\quad
k_{1z_2} &= \\dot z_2^k, \\newline
k_{2v_2} &= f_2\\left(z_1^k,\\, \\dot z_1^k,\\, z_2^k + \\tfrac{\\Delta t}{2}k_{1z_2},\\, \\dot z_2^k + \\tfrac{\\Delta t}{2}k_{1v_2}\\right), &\\quad
k_{2z_2} &= \\dot z_2^k + \\tfrac{\\Delta t}{2}k_{1v_2}, \\newline
k_{3v_2} &= f_2\\left(z_1^k,\\, \\dot z_1^k,\\, z_2^k + \\tfrac{\\Delta t}{2}k_{2z_2},\\, \\dot z_2^k + \\tfrac{\\Delta t}{2}k_{2v_2}\\right), &\\quad
k_{3z_2} &= \\dot z_2^k + \\tfrac{\\Delta t}{2}k_{2v_2}, \\newline
k_{4v_2} &= f_2\\left(z_1^k,\\, \\dot z_1^k,\\, z_2^k + \\Delta t\\,k_{3z_2},\\, \\dot z_2^k + \\Delta t\\,k_{3v_2}\\right), &\\quad
k_{4z_2} &= \\dot z_2^k + \\Delta t\\,k_{3v_2}, \\newline
\\dot z_2^{k+1} &= \\dot z_2^k + \\frac{\\Delta t}{6}\\left(k_{1v_2} + 2k_{2v_2} + 2k_{3v_2} + k_{4v_2}\\right), &\\quad
z_2^{k+1} &= z_2^k + \\frac{\\Delta t}{6}\\left(k_{1z_2} + 2k_{2z_2} + 2k_{3z_2} + k_{4z_2}\\right).
\\end{aligned}
$$


The Runge-Kutta 4 method is implemented by iteratively computing the four RK coefficients and performing a weighted average.
For any function $\\dot{y} = F(t, y)$:
$$
\\begin{aligned}
k_1 &= F(t_n, y_n), \\newline
k_2 &= F\\left(t_n + \\frac{\\Delta t}{2},\\ y_n + \\frac{\\Delta t}{2} k_1\\right), \\newline
k_3 &= F\\left(t_n + \\frac{\\Delta t}{2},\\ y_n + \\frac{\\Delta t}{2} k_2\\right), \\newline
k_4 &= F\\left(t_n + \\Delta t,\\ y_n + \\Delta t\\, k_3\\right), \\newline
y_{n+1} &= y_n + \\frac{\\Delta t}{6} \\left(k_1 + 2k_2 + 2k_3 + k_4\\right).
\\end{aligned}
$$

Here, $f_1$ and $f_2$ are the accelerations of masses 1 and 2, respectively, as in Eqs. (1) - (2).
Defining
$$
\\begin{aligned}
v_1 &= \\dot{z}_1, \\quad \\dot{v}_1 = \\ddot{z}_1 = f_1(z_1^n, v_1^n, z_2^n, v_2^n, z_s^n, v_s^n), \\newline
v_2 &= \\dot{z}_2, \\quad \\dot{v}_2 = \\ddot{z}_2 = f_2(z_1^n, v_1^n, z_2^n, v_2^n),
\\end{aligned}
$$
we have four first-order ODEs of the form $\\dot{y} = F(t, y)$.



**Optimization.** For obvious reasons, the suspension of the car body is something that is added after the wheels and tracks and thus is subject to more changes, therefore the parameters that are to be optimized are the car body's stiffness and damping ($k_2$ and $C_2$). The optimization involves a multidimensional problem, where the displacement is dependent on both stiffness and damping in addition to the wheels reaction to the movement of the car body.

Implementation of optimization in MATLAB resulted in the lowest rms acceleration occurred at the lowest possible stiffness and damping in the user defined range. Interpretation of this is that the theoretical maximum deflection is not what is limiting the system but the limit lies in the feasibility and real world application of the stiffness and damping. To test the feasibility of the solution was modified with a fake impulse (simulated gravel on the track) in addition to the solution beginning and end of the data was zero padded to be able to inspect longer oscillatory behaviours. With the introduced "gravel" (impulse in data) the optimization was run again with more feasible results this time, not the lowest possible of the input range of solutions. This result that includes a faked impulse in the track seems more trustworthy and robust since it can handle not perfectly smooth (and clean) track without losing comfort for potential passengers.
        `
      },
      {
        slug: 'comsol-heat',
        title: '1D Heat Conduction (COMSOL)',
        subtitle: 'Verification vs. model',
        stack: ['MATLAB','COMSOL','FEM'],
        images: ['images/Heatsink/Comsol.png', 'images/Heatsink/FEM.png'],
        content: md`
**PDE.** $\\nabla \\cdot(-c\\nabla u - \\alpha u + \\gamma) + \\beta \\nabla u + au = f$. In 1D: $$\\frac{d}{dx}\\left(k \\frac{dT}{dx}\\right) - 25T + 25T_{air} = 0.$$

**Mapping.** $c=-K,\ u=T,\ a=-25,\ f=-25T_{air}$. Dirichlet + zero-flux on boundaries.
$$
\\begin{align}
N_i &= \\frac{x - x_j}{x_i-x_j} \\quad N_j = \\frac{x_i-x}{x_i-x_j} \\newline
F_r &= \\int_{x_1}^{x_2} 25 T_{air} N_r \\, dx \\newline
K_{rc} &= \\int_{x_1}^{x_2} -\\frac{d}{dx}\\left(K \\frac{d N_c}{dx}\\right) N_r + 25 N_r N_c \\, dx\\newline
&= \\int_{x_1}^{x_2} K \\frac{d N_r}{dx} \\frac{d N_c}{dx} + 25 N_r N_c \\, dx\\newline
\\mathbf{T} &= K^{-1} \\mathbf{F}
\\end{align}
$$

**Result.** Temperature decays along the fin; MATLAB computations correspond to Comsol.
        `
      },
      {
        slug: 'robot-challenge',
        title: 'Autonomous Ball-Sorting Robots',
        subtitle: 'Two collaborative mechatronic systems - LEGO Mindstorms EV3',
        stack: ['LEGO Mindstorms EV3', 'Mechatronics', 'CAD (Inventor)', '3D Printing', 'CNC', 'Design-Build-Test'],
        images: ['images/CollabRobots/2The_One_assembly_New.png', 'images/CollabRobots/2The_One_assembly_New2.png'],
        content: md`
**Overview.** Designed, built, and programmed two autonomous robots - *Baggern* (the digger) and *Dumpern* (the transporter) - that collaborate to collect unsorted balls from a loading zone, navigate an obstacle course, and sort them by size into three colour-coded unloading zones, all within 10 minutes.

**Challenge.** The course featured three elevated platforms (P1-P3), a tipping bridge (P2), and variable-width paths (300-1300 mm), requiring an adaptable open-loop/sensor-fusion solution. Balls came in three sizes - white (Ø 20 mm, 3 g), yellow (Ø 25 mm, 1.4 g), blue (Ø 30 mm, 4.3 g) - plus red balls to be excluded.

**Robot Roles.**
* **Baggern** - stationed beside the ball box; scoops balls and delivers them to the top platform.
* **Dumpern** - pre-positioned on the platform nearest the pickup zone; transports and sorts balls across the obstacle course and deposits them in the correct boxes.

**User Interface.** A two-button colour-coded remote control lets an uninitiated user configure the sorting mapping before start. The software then infers the third destination automatically.

**Methodology.**
* Group contract, shared vision, and sub-team structure (10 members, communication leads per sub-team).
* Concept generation via brainstorming + ranked comparison in Excel &rarr; two finalist concepts selected by elimination.
* LEGO prototyping &rarr; physical iteration &rarr; CAD in Autodesk Inventor &rarr; CNC milling, metal lathe, and 3D printing (Cura + FDM).
* Design-Build-Test robustness loop: each sub-solution reviewed for feasibility before manufacture.
* User-guide validation: external test users performed the full startup sequence; manual refined after each session.

**Sustainability.** No component used two different materials, enabling correct source-separation and recycling at end of life.

**Outcome.** The final system successfully sorted and transported balls autonomously. The team demonstrated that well-thought-out concept selection minimises unnecessary prototypes, and that rigorous user testing produces genuinely user-friendly solutions.
        `
      },
      {
        slug: 'ocean-sensor',
        title: 'Ocean Sensor',
        subtitle: 'Modular waterproof sensing unit for ocean pollution & climate data',
        stack: ['Embedded Systems', 'Sensors', 'Electronics', 'Radio/WiFi', 'Web Visualization'],
        images: ['images/OceanSensor/slide-2.png', 'images/OceanSensor/slide-3.png', 'images/OceanSensor/slide-4.png', 'images/OceanSensor/slide-5.png', 'images/OceanSensor/Film1.mp4'],
        content: md`
**Overview.** A modular, waterproof sensor unit for monitoring ocean pollution, collecting climate data for research, and tracking algae growth.

**Hardware.**
* **Enclosure:** Waterproof case with modular design, built for quick customer assembly.
* **Electronics & sensors:** turbidity (*grumlighet*) and temperature.
* **Future extensions:** pH and oil detection via capacitance.
* **Comms:** radio transmitter (sender).

**Software & data flow.**
* Web-based data visualization dashboard.
* Multi-unit support.
* Receiver: **radio + WiFi** gateway; sender: **radio**.

**Testing.**
* Temperature validation and calibration (bench testing).

**Learnings.**
* Waterproofing (connectors, sealing surfaces, tolerances).
* Radio link robustness as a key design constraint.
* Design-for-manufacturing and practical measurement electronics.
        `
      },
      {
        slug: 'golf-design-exploration',
        title: 'Golf Trajectory & Club Optimization',
        subtitle: 'Simulation Driven Design & Parameter Estimation',
        stack: ['MATLAB', 'Optimization', 'Latin Hypercube', 'Physics Modeling'],
        images: ['images/Golf/Golf2024.png', 'images/Golf/traject3.png', 'images/Golf/kline3.png', 'images/Golf/Trajectory Best Club.png'],
        content: md`
**Overview.** The project consists of two parts: constructing a prediction model for a golf ball's trajectory and optimizing the geometry of a parametric golf club head to maximize carry distance.

**Part 1: Trajectory Prediction.**
The goal was to build a model to predict the carry and apex of a golf ball using simulator data. The ball is subject to drag and lift forces, modeled as proportional to the square of the velocity:
$$
F_D = k_{Drag} \\cdot v^2, \\quad F_L = k_{Lift} \\cdot v^2
$$

The system is modeled in 2D, where the acceleration components are derived from Newton's second law:
$$
\\begin{align}
a_x &= -\\frac{1}{m} \\left[ k_{Lift}\\sin(\\alpha) + k_{Drag}\\cos(\\alpha) \\right] \\cdot \\|v\\|^2 \\newline
a_y &= +\\frac{1}{m} \\left[ k_{Lift}\\cos(\\alpha) - k_{Drag}\\sin(\\alpha) \\right] \\cdot \\|v\\|^2 - g
\\end{align}
$$

**Parameter Estimation.**
Using the \`fminsearch\` function in MATLAB, a non-linear least square error optimization was performed to estimate $k_{Drag}$ and $k_{Lift}$ by minimizing the difference between predicted and actual carry.

* **Results:** The calculated coefficients were $C_D \\approx 0.34$ and $C_L \\approx 0.32$, which aligns with standard literature.
* **Accuracy:** 8 out of 11 hits had an error below 2%, though apex error reached up to 16.8% for inexperienced shots.

**Part 2: Geometry Optimization.**
The second objective was to optimize a fully parametric golf club head to maximize carry distance for a beginner level player.

**Method.**
To solve the unknown relationships between design variables and club velocity, a **Latin Hypercube Sampling (LHS)** was used to generate initial points, followed by a gradient-based optimization (\`fmincon\`) to minimize the negative carry.

**Optimal Design.**
The process successfully produced a design within bounds, with parameters pushing the physical limits:
* **Blade Width:** 150 mm (Upper Bound)
* **Blade Depth:** 50 mm (Upper Bound)
* **Loft:** 5$^{\\circ}$ (Lower Bound)
* **Toe Height:** $\\approx$ 51 mm

The final optimized club yielded a maximum carry of 275 meters, proving the utility of simulation-driven design.
        `
      },
      {
        slug: 'Robotic_Cat_Companion',
        title: 'Robotic Cat Companion',
        subtitle: 'A paintable, personality-swappable wooden robot cat for children',
        stack: ['CAD (Inventor)', 'Arduino Uno', 'Raspberry Pi Zero WH', 'ATMEGA328P', 'ESP8266 Wi-Fi', 'Ultrasonic Sensing', 'Laser-Cut Masonite', '3D Printing', 'Web App', 'DBT / Gate Process'],
        images: ['images/Cat/Picture2.jpg','images/Cat/Picture1.jpg', 'images/Cat/webGif.mp4', 'images/Cat/PXL_20231208_102716055.jpg', 'images/Cat/PXL_20231208_102719947.jpg'],
        content: md`
**Overview.** *The Robotic Cat Companion* is a Standalone Consumer Robot (SCR) developed for children aged 3-8.

The cat is intentionally **not** a low-care pet substitute - it is a creative toy. Children **paint the wooden shell themselves**, swap **ears and hats**, and choose **personalities** through a companion website, so the same hardware can become endlessly different cats over time.

**Product goals (from the PRD).**
* **Innovative user experience** - a curious, story-enabled, ever-changeable robot friend that addresses unmet desires children haven't yet articulated.
* **Technology leadership** - modern consumer-robotics components and early prototype testing.
* **Competitive positioning** - feature/price parity with or above existing offerings (benchmarked against ImagiCharm and Pokémon-style toys).

**Target user.**
* **Buyer:** parents, grandparents, relatives or friends of children.
* **User:** children aged 3-8 with an interest in robotics or cats.
* **Scenario:** *"Elliot, an 8-year-old, is bored and uses ShellCat to stay satisfied with endless play and unlimited personalities. He paints and plays with the ShellCat and sees it as a real pet/friend."*

**Mechanical design.**
* **Outer shell:** **Masonite, laser-cut** - a wooden surface that takes paint well, fitting the brand's *Blanchedalmond* wooden look.
* **3D-printed plastic** parts for gears, the MCU case, the computer case, and battery holders.
* **Swappable accessories:** ears and hats designed to be made by the user from a manual included in the box.
* CAD modelled in **Inventor** to allow rapid iteration and a **modular design** for a future "world of characters."

**Electronics.**
The PRD splits the bill of materials between an early *prototype* and a cost-reduced *product* version:

| Subsystem | Prototype | Product |
| :--- | :--- | :--- |
| MCU | Arduino Uno | ATMEGA328P-PU |
| Computer | Raspberry Pi Zero WH | - (replaced by Wi-Fi + MCU) |
| Connectivity | (via Pi) | ESP8266 Wi-Fi module |
| Motion | 2$\times$ DC motors + 1$\times$ stepper (28BYJ-48 + ULN2003) | same |
| Sensing | Ultrasonic ranger | Ultrasonic ranger |
| Power | 3$\times$ AA + 1$\times$ 6LR holders | 3$\times$ AA + 1$\times$ 6LR holders |
| PCB | breadboard / wiring | Custom PCB |

**Functional requirements.**
* Natural, intuitive interaction with children.
* **Selectable personalities** - currently five, exposed via the companion website with regular updates planned.
* **Autonomous navigation** in a home environment with obstacle avoidance and the ability to approach objects within a defined area.
* **Safe interaction** with household objects, children, and pets.
* **Battery life** sufficient for at least one full day of typical use, with easy-to-change batteries.

**Non-functional requirements.**
* User-friendly setup with no maintenance.
* High durability and a low failure rate to support endless play.
* **Modular design** to allow future upgrades and new characters.

**Companion website.** A web app (a visual copy hosted at *here* and is also shown in one of the videos) lets the user pick the cat's personality and will host a community forum where suggestions can be voted on and rolled into future updates - closing a loop directly back into the product.

**Brand & story.** ShellCats are described in the PRD as having come from a worn-out world to Earth via a "magical spell," carrying protective shells that children can decorate to express each cat's personality.

**Process.** The development followed a **Design-Build-Test (DBT) and gate** workflow with early user-testing prototypes feeding back into the design before each gate.
        `
      },
    ];

    const aboutPage = {
      title: 'About me',
      subtitle: 'Engineering, control, simulation, and prototyping',
      stack: ['MATLAB','Mathematical Modeling', 'Runge-Kutta 4'],
      images: ['images/Wilmer/LinkedInProfile2.jpg'],
      content: md`
**Hi, I'm an engineer focused on building and understanding real systems.** My work sits at the intersection of mechanical design, modeling, control, and experimentation.

I enjoy taking ideas from first-principles physics and turning them into working prototypes, simulations, and optimized designs. Across the projects on this site, that includes:

* control systems and robotics in **MATLAB** and **Simulink**
* simulation-driven product development using **FEM** and **scripting**, in **Abaqus**, **Hypermesh**, **Ansys** and **Autodesk Inventor**.
* numerical methods, optimization, and parameter estimation
* embedded sensing, measurement systems, and hardware prototyping

I'm especially interested in projects where theory meets implementation: deriving the model, validating it with data, and then using it to improve performance, robustness, or design decisions.

This portfolio highlights that workflow through projects in balancing robots, golf trajectory modeling, arrow flight simulation, lifting design optimization, ocean sensing, thermal modeling, and railroad suspension analysis.

---

## Curriculum Vitae

**Contact.** [LinkedIn](https://www.linkedin.com/in/wilmer-hjulstr%C3%B6m/?locale=en-US) · wilmer.hjulstrom@outlook.com

## Education

**M.Sc. in Mechanical Engineering, Applied Mechanics** - Blekinge Institute of Technology | 2021 - 2026

* Focus on experimental & computational engineering, signal processing, product development, and mechatronics.
* Strong foundation in analytical, numerical, and experimental methods and technologies.

**Key competencies:** CAE, FEM, Abaqus, Ansys, COMSOL, analytical/numerical/experimental modelling, MATLAB & Simulink, Python, Inventor, Nastran, Signal Processing, Mechatronics, Analogue Electronics.

## Work Experience

**Technical Documentation Specialist** - Shape Process Automation | March 2022 - June 2026

* Compile and create manuals, drawings, CE documents, and installation guides for laser- and waterjet cutting machines, ensuring compliance with industry standards for technical documentation.

**Machine Operator** - NKT HV Cables | Summers 2024 - 2026

* Operated heavy industrial machinery in high-voltage cable manufacturing at the world's largest site for high-voltage offshore cables. Acquired knowledge of risk assessment and safety measures in manufacturing.

**Production Planning Specialist** - Tarkett | May 2023 - August 2023

* Managed production scheduling for two production lines; gained insight into supply chain and customer interactions in large-scale production.

**Machine Operator** - Shape Process Automation | June 2022 - August 2022

* Coil manufacturing with hand bending deformations to drawing; hands-on experience in maintenance, troubleshooting, and machine repair.

## Entrepreneurship

**Founder & Consultant** - HWK AB | September 2023 - Present

* Founded a consulting firm specializing in mechanical engineering and technical documentation. Developed business management skills, including bookkeeping and legal compliance.

## Research & Projects

* **Master's thesis at Combitech** - numerical analysis comparing FE models of bolted joints to produce validity boundaries supporting engineers' modelling choices. [Read more](#thesis)
* **Balancing drone robot** - mechanics and control algorithms for automated navigation in MATLAB/Simulink. [Read more](#/project/Drone1)
* **Cooperating sorting robots** - autonomous robots navigating, balancing, and climbing in an obstacle course. [Read more](#/project/robot-challenge)
* **Ocean sensor buoy** - water measurements transmitted via radio to a land-based hub, for emission detection and climate research. [Read more](#/project/ocean-sensor)

## Skills

| Skills |
| :--- |
| Computational, numerical & experimental methods | 
| Structural dynamics | 
| Programming (Python, MATLAB, C++) | 
| Mechatronics, signal processing, analogue & digital electronics | 
| Electronics with applications in measurement systems | 
| Feedback and control systems | 
| Project management, product development, cooperation | 
| Thermal dynamics | 
| Solid mechanics | 
| Simulation-driven design | 
| CAE - CAD, CAM & simulations | 
| Documentation - CE, ISO, standards | 

## Voluntary Work

**MakerNinja** - Blekinge Institute of Technology | 2022 - Present

* Conduct training sessions on 3D printing, laser cutting, and product development prototyping for university and high school students.

**Languages:** Swedish (native), English (fluent, professional).

References available upon request.
      `
    };

    const thesisPage = {
      title: 'Guidelines for Resource Efficient Finite Element Analysis of Bolted Joints under Random Vibration Fatigue',
      subtitle: 'Master of Science Thesis in Mechanical Engineering - Blekinge Institute of Technology (BTH), 2026',
      stack: ['FEM', 'Bolted Joints', 'Random Vibration Fatigue', 'Dirlik Method', 'PSD Analysis', 'Modal Analysis', 'Modeling Guidelines'],
      images: [
        'images/Thesis/geometryWNut.png',
        'images/Thesis/decisionTree2.png',
        'images/Thesis/researchMethod.png',
        'images/Thesis/StressTensorToDamage.png',
        'images/Thesis/excitationDrawing.png',
        'images/Thesis/PSDs5.png',
        'images/Thesis/MODAL27.png',
        'images/Thesis/modal_frequency_convergence.png',
        'images/Thesis/ranking_heatmap_transverse_nasa.png',
        'images/Thesis/efficiency_ratio.png',
        'https://youtu.be/rPNvHnWSXBc',
      ],
      content: md`
*Link to thesis PDF:* [Guidelines for Resource Efficient Finite Element Analysis of Bolted Joints under Random Vibration Fatigue](http://www.diva-portal.org/smash/record.jsf?pid=diva2:2067092)
> *A practical engineering model is not the most detailed model available, but the simplest model that still answers the right question with sufficient confidence.*

**Background.** Predicting random-vibration fatigue in bolted joints is challenging. While industry standards provide analytical frameworks, they lack systematic guidance on selecting a Finite Element bolt representation. Fully threaded 3D models become prohibitive at large assembly scale, requiring engineers to simplify - yet it remains unclear *when* specific simplifications are acceptable.

**Objective.** Develop practical guidelines for selecting bolt modeling strategies in random vibration fatigue analysis, balancing accuracy against computational cost. The work tests the hypothesis that model selection can be systematized based on the mechanical phenomena of interest and the requirements on accuracy and cost.

**Method.** The study combines a qualitative literature review with a comparative computational experiment. Four FE representations of a single-bolt joint were analyzed:

* **Bonded surface** contact
* **1D beam** element
* **CBUSH spring** connector
* **Threadless 3D solid** (reference)

Each model was subjected to pre-stressed linear perturbation (modal + random response) with two excitation profiles - **NASA-STD-7001B** and **MIL-STD-810G T43A** - in both transverse and axial directions. The stress tensor PSDs were reduced to an equivalent von Mises PSD using the **Segalman method**, mean stress from bolt preload was handled with a **Goodman correction**, and fatigue life was computed in the frequency domain with the **Dirlik method** (cross-checked against Steinberg's three-band approach):

$$
E[D] = \\frac{T \\, \\nu_p}{C} \\int_0^{\\infty} S^m \\, p_{Dirlik}(S) \\, dS
$$

Model accuracy was scored against the solid reference using a combined ranking of fatigue life and RMS stress, evaluated per region (clamped members, under bolt head, at the nut) - weighed against solver cost.

**Results.**

* For **clamped members**, the 1D beam model gave the closest agreement with the solid reference across all load cases - at a fraction of the computational cost.
* **Bonded and CBUSH** models generally overpredicted stress and underpredicted fatigue life, in some cases by up to two orders of magnitude.
* In **local bolt regions**, simplified models were unreliable: the beam captured the correct stress magnitude for transverse loading but was non-conservative under axial loads. Bonded and CBUSH models cannot produce meaningful local bolt stresses at all.
* Dirlik and Steinberg life estimates agreed closely, confirming the model ranking was not an artifact of the fatigue method.

**Conclusions.** No single bolt model is universally best - the optimal choice depends on the desired response and dominant loading:

| Question to answer | Cheapest adequate model |
| :--- | :--- |
| Global response, load path, modal behaviour | Beam or bonded contact |
| Clamped member stress / fatigue life | Beam (or threadless solid) |
| Local bolt stress & fatigue (head fillet, nut) | 3D solid without threads |
| Thread-root stress from pretension | 3D solid with threads |
| Thread-related nonlinearities (e.g. self-loosening) | Threaded solid + nonlinear transient |

Phenomena that are too expensive to resolve in FE - sliding/self-loosening, bolt bending, hole elongation, embedding preload loss - can still be incorporated into design decisions through analytical governing conditions (e.g. $F_{Shear} < F_{friction}$, $\\sigma_{bend} = M/W$). The resulting **decision flowchart**, **phenomenon-method matrix**, and benchmark results provide scoped engineering guidance for FE model selection under random-vibration fatigue.

**Keywords:** Bolted joints, Dirlik method, Finite element modeling, Modeling guidelines, Random vibration fatigue.
      `
    };

    // ---------- Helpers ----------
    const grid = document.getElementById('grid');
    const list = document.getElementById('list');
    const detail = document.getElementById('detail');
    const detailTitle = document.getElementById('detailTitle');
    const detailSubtitle = document.getElementById('detailSubtitle');
    const detailMD = document.getElementById('detailMD');
    const tabs = document.querySelectorAll('nav .tab[data-tab]');

    function slugify(s){return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');}

    function setActiveTab(activeTab){
      tabs.forEach(tab => {
        const isActive = tab.dataset.tab === activeTab;
        tab.classList.toggle('active', isActive);
        if (isActive) {
          tab.setAttribute('aria-current', 'page');
        } else {
          tab.removeAttribute('aria-current');
        }
      });
    }

    let lightbox;
    let lightboxContent;
    let lightboxItems = [];
    let lightboxIndex = 0;
    let lightboxTitle = '';

    function ensureLightbox(){
      if (lightbox) return;

      lightbox = document.createElement('div');
      lightbox.className = 'project-lightbox';
      lightbox.setAttribute('role', 'dialog');
      lightbox.setAttribute('aria-modal', 'true');
      lightbox.setAttribute('aria-label', 'Project media preview');
      lightbox.hidden = true;
      lightbox.innerHTML = `
        <button class="project-lightbox-close" type="button" aria-label="Close preview">$\times$</button>
        <div class="project-lightbox-content"></div>
      `;

      lightboxContent = lightbox.querySelector('.project-lightbox-content');
      lightbox.querySelector('.project-lightbox-close').addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', event => {
        if (event.target === lightbox) closeLightbox();
      });
      document.addEventListener('keydown', event => {
        if (lightbox.hidden) return;
        if (event.key === 'Escape') { closeLightbox(); return; }
        // Don't hijack arrow keys while a video has focus (they seek/adjust volume)
        if (event.target && event.target.tagName === 'VIDEO') return;
        if (event.key === 'ArrowRight') { event.preventDefault(); stepLightbox(1); }
        if (event.key === 'ArrowLeft')  { event.preventDefault(); stepLightbox(-1); }
      });

      // Swipe navigation (mobile)
      let touchStartX = 0, touchStartY = 0;
      lightbox.addEventListener('touchstart', event => {
        const t = event.changedTouches[0];
        touchStartX = t.clientX;
        touchStartY = t.clientY;
      }, { passive: true });
      lightbox.addEventListener('touchend', event => {
        if (event.target && event.target.tagName === 'VIDEO') return;
        const t = event.changedTouches[0];
        const dx = t.clientX - touchStartX;
        const dy = t.clientY - touchStartY;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
          stepLightbox(dx < 0 ? 1 : -1);
        }
      }, { passive: true });

      document.body.appendChild(lightbox);
    }

    function showLightboxItem(){
      const src = lightboxItems[lightboxIndex];
      const ytId = getYoutubeId(src); // Check if it's a YouTube URL
      const isVideo = /\.(mp4|webm|ogg)$/i.test(src);
      lightboxContent.innerHTML = '';

      let preview;
      if (ytId) {
        preview = document.createElement('iframe');
        // Adding ?autoplay=1 so it starts immediately when the lightbox opens
        preview.src = `https://www.youtube.com/embed/${ytId}?autoplay=1`; 
        preview.setAttribute('frameborder', '0');
        preview.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        preview.setAttribute('allowfullscreen', 'true');
        preview.style.width = '100%';
        preview.style.height = '100%'; // Ensure it fills the lightbox container
      } else if (isVideo) {
        preview = document.createElement('video');
        preview.src = src;
        preview.controls = true;
        preview.autoplay = true;
        preview.setAttribute('aria-label', `${lightboxTitle || 'Project'} video preview`);
      } else {
        preview = document.createElement('img');
        preview.src = src;
        preview.alt = lightboxTitle || '';
      }
      lightboxContent.appendChild(preview);

      if (lightboxItems.length > 1) {
        const counter = document.createElement('div');
        counter.className = 'project-lightbox-counter';
        counter.textContent = `${lightboxIndex + 1} / ${lightboxItems.length}`;
        lightboxContent.appendChild(counter);
      }
    }

    function stepLightbox(dir){
      if (lightboxItems.length < 2) return;
      lightboxIndex = (lightboxIndex + dir + lightboxItems.length) % lightboxItems.length;
      showLightboxItem();
    }

    function openLightbox(items, index, title){
      ensureLightbox();
      lightboxItems = Array.isArray(items) ? items : [items];
      lightboxIndex = Math.min(Math.max(index || 0, 0), lightboxItems.length - 1);
      lightboxTitle = title || '';
      showLightboxItem();
      lightbox.hidden = false;
      document.body.classList.add('lightbox-open');
      lightbox.querySelector('.project-lightbox-close').focus();
    }

    function closeLightbox(){
      if (!lightbox) return;
      lightbox.hidden = true;
      document.body.classList.remove('lightbox-open');
      lightboxContent.innerHTML = '';
    }

    function renderMedia(container, sources, title){
      container.innerHTML = '';
      sources.forEach((src, idx) => {
        let el;
        const ytId = getYoutubeId(src);
        const isVideo = /\.(mp4|webm|ogg)$/i.test(src);
        
        if (ytId) {
          el = document.createElement('iframe');
          el.src = `https://www.youtube.com/embed/${ytId}`;
          el.setAttribute('frameborder', '0');
          el.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
          el.setAttribute('allowfullscreen', 'true');
          el.setAttribute('aria-label', `${title || 'Project'} YouTube video`);
        } else if (isVideo) {
          el = document.createElement('video');
          el.src = src;
          el.controls = true;
          el.preload = 'metadata';
          el.setAttribute('aria-label', `${title || 'Project'} video`);
        } else {
          el = document.createElement('img');
          el.src = src;
          el.alt = title || '';
          el.loading = 'lazy';
          el.decoding = 'async';
        }
        
        el.classList.add('project-media');
        
        // Only add lightbox click events for local images and videos, 
        // since clicking an iframe should just interact with the YouTube player.
        if (!ytId) {
          el.tabIndex = 0;
          el.addEventListener('click', () => openLightbox(sources, idx, title));
          el.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              openLightbox(sources, idx, title);
            }
          });
        }
        container.appendChild(el);
      });
    }

    function renderList(){
        grid.innerHTML = '';

        const items = [
          {
            slug: 'about',
            title: aboutPage.title,
            subtitle: aboutPage.subtitle,
            stack: ['About', 'Background', 'Skills'],
            images: aboutPage.images,
            href: '#about'
          },
          {
            slug: 'thesis',
            title: 'Master\'s Thesis - FE Analysis of Bolted Joints',
            subtitle: thesisPage.subtitle,
            stack: thesisPage.stack,
            images: thesisPage.images,
            href: '#thesis'
          },
          ...projects.map(p => ({
            ...p,
            href: `#/project/${p.slug || slugify(p.title)}`
          }))
        ];

        items.forEach(p => {
            const cover = (p.images && p.images.length) ? p.images[0] : p.shot;
            const media = cover
              ? `<div class="shot"><img src="${cover}" alt="${p.title}" loading="lazy" decoding="async"/></div>`
              : `<div class="shot" aria-hidden="true"></div>`;

            const card = document.createElement('article');
            card.className = 'card';
            card.innerHTML = `
            <div>
                <div class="title">${p.title}</div>
                <div class="subtitle">- ${p.subtitle || ''}</div>
                <div class="stack">${(p.stack||[]).map(s=>`<div>${s}</div>`).join('')}</div>
            </div>
            ${media}
            <a class="linkcover" href="${p.href}" aria-label="Open ${p.title}"></a>
            `;
            if (cover) {
              const shot = card.querySelector('.shot');
              shot.classList.add('project-media');
              shot.tabIndex = 0;
              shot.setAttribute('role', 'button');
              shot.setAttribute('aria-label', `Preview ${p.title}`);
              const gallery = (p.images && p.images.length) ? p.images : [cover];
              shot.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                openLightbox(gallery, 0, p.title);
              });
              shot.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  openLightbox(gallery, 0, p.title);
                }
              });
            }
            grid.appendChild(card);
        });
    }

    const detailImages = document.getElementById('detailImages');
    const BASE_TITLE = 'Wilmer Hjulström';

// Render markdown to HTML while protecting TeX math from the markdown parser.
// Without this, markdown eats backslashes before punctuation (e.g. \, -> ,)
// and may mangle _ or * inside math. Math spans are swapped for placeholders,
// markdown runs on the rest, then the TeX is reinserted (HTML-escaped).
//
// Do NOT collapse \\ -> \ here. The template literal has already done exactly
// that when the content was parsed, so a second pass eats the \\ that TeX needs
// as a row separator and every matrix/aligned block collapses onto one line.
function renderMarkdown(src){
  const math = [];
  const protectedSrc = (src || '').replace(/\$\$[\s\S]+?\$\$|\$[^$\n]+?\$/g, m => {
    const tex = m
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    math.push(tex);
    return `@@MATH${math.length - 1}@@`;
  });
  return marked.parse(protectedSrc).replace(/@@MATH(\d+)@@/g, (_, i) => math[i]);
}

// MathJax loads async. On a direct page load window.MathJax already exists
// (it is the config object set before the library) while typesetPromise does
// not, so `if(window.MathJax) MathJax.typesetPromise(...)` throws and silently
// aborts the rest of the render. Wait for startup instead.
function typesetMath(el){
  if(!window.MathJax) return Promise.resolve();
  if(MathJax.typesetPromise) return MathJax.typesetPromise([el]);
  if(MathJax.startup && MathJax.startup.promise)
    return MathJax.startup.promise.then(() => MathJax.typesetPromise([el]));
  if(MathJax.Hub && MathJax.Hub.Queue){            // MathJax 2 fallback
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, el]);
    return Promise.resolve();
  }
  return new Promise(resolve => {                  // library still downloading
    const started = Date.now();
    const poll = setInterval(() => {
      if(window.MathJax && MathJax.typesetPromise){
        clearInterval(poll); resolve(MathJax.typesetPromise([el]));
      } else if(Date.now() - started > 10000){
        clearInterval(poll); resolve();
      }
    }, 100);
  });
}

function renderContentPage(page){
  detailTitle.textContent = page.title || '';
  detailSubtitle.textContent = page.subtitle || '';
  detailMD.innerHTML = renderMarkdown(page.content);
  typesetMath(detailMD);

  const imgs = (page.images && page.images.length) ? page.images : (page.shot ? [page.shot] : []);
  renderMedia(detailImages, imgs, page.title);
}


function renderDetail(slug){
  const p = projects.find(x => (x.slug || slugify(x.title)) === slug);
  if(!p){ location.hash = '#projects'; return; }

  document.title = `${BASE_TITLE} - ${p.title}`;
  detailTitle.textContent = p.title;
  detailSubtitle.textContent = p.subtitle || '';
  detailMD.innerHTML = renderMarkdown(p.content);
  typesetMath(detailMD);

  // Render stacked images (or fall back to shot)
  const imgs = (p.images && p.images.length) ? p.images : (p.shot ? [p.shot] : []);
  renderMedia(detailImages, imgs, p.title);
}

    function route(){
      const hash = location.hash || '#projects';
      const m = hash.match(/^#\/project\/([A-Za-z0-9\-_%]+)/);
      if(hash === '#about' || hash === '#/about'){
        list.style.display = 'none';
        detail.style.display = 'block';
        setActiveTab('about');
        document.title = `${BASE_TITLE} - About Me`;
        renderContentPage(aboutPage);
        return;
      }
      if(hash === '#thesis' || hash === '#/thesis'){
        list.style.display = 'none';
        detail.style.display = 'block';
        setActiveTab('thesis');
        document.title = `${BASE_TITLE} - Thesis`;
        renderContentPage(thesisPage);
        return;
      }
      if(m){
        list.style.display = 'none';
        detail.style.display = 'block';
        setActiveTab('projects');
        renderDetail(decodeURIComponent(m[1]));
      } else {
        detail.style.display = 'none';
        list.style.display = 'block';
        setActiveTab('projects');
        document.title = `${BASE_TITLE} - Projects`;
        renderList();
      }
    }

    window.addEventListener('hashchange', route);
    route();
