//(TODO) Tagged template to preserve backslashes in LaTeX (no JS escaping)
const md = (strings, ...values) => String.raw({raw: strings}, ...values);

const projects = [
      {
        slug: 'Drone1',
        title: 'Flying & Balanicng robot drone',
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
V_l = V - \\frac{L}{2},\\omega_l
  = \\begin{bmatrix} 1 & -\\frac{L}{2} \\end{bmatrix}\\begin{bmatrix} V \\newline \\omega_z \\end{bmatrix} \\newline
V_r = V + \\frac{L}{2},\\omega_r
  = \\begin{bmatrix} 1 & +\\frac{L}{2} \\end{bmatrix}\\begin{bmatrix} V \\newline \\omega_z \\end{bmatrix}
\\end{cases}
$$

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
a_x &= -\\frac{1}{m} \\left[ k_{Lift}\\sin(\\alpha) + k_{Drag}\\cos(\\alpha) \\right] \\cdot \|v\|^2 \\newline
a_y &= +\\frac{1}{m} \\left[ k_{Lift}\\cos(\\alpha) - k_{Drag}\\sin(\\alpha) \\right] \\cdot \|v\|^2 - g
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

**Modeling the Archer's Paradox.** The arrow was simplified into an Euler-Bernoulli beam. The dynamic movement was calculated using the Finite Element Method (FEM) and integrated over time using the Newmark-Beta method. The beam equation used in the model was $EI\,w''''(x,t) + \rho A\,\ddot{w}(x,t) = 0$.

**Flight Trajectory.** The flight path was modeled as an ordinary differential equation (ODE) initial value problem and solved using the fourth-order Runge-Kutta (RK4) method. The model combined initial velocity, gravity, quadratic air resistance, and the tip vibrations derived from the FEM calculations.

**Results.** The simulation produced a periodic oscillating motion reflecting the archer's paradox over a 20-meter trajectory. The impact of different initial conditions on accuracy was evaluated:
* The order and timing of which finger leaves the string first, introducing horizontal and vertical offsets, has the largest impact on hit location.
* An uneven release excites a stronger tip vibration and gives the arrow a persistent initial angular deviation.
* Differences in draw length resulted in considerably lower spread, giving it the least impact on overall precision.

**Conclusion.** To minimize potential error and maximize accuracy, it is highly recommended to release all fingers as simultaneously as possible without pulling the string sideways.
        `
      },
      {
        slug: 'topology-optimization-lifting',
        title: 'Topology Optimization for Lifting Solutions',
        subtitle: 'Generalized attachment design using Ansys Mechanical',
        stack: ['Ansys Mechanical', 'Topology Optimization', 'FEM', 'CAD', 'Product Development'],
        images: ['images/Hook//1500N/1500N_optimized_stress.png', 'images/Hook/Paretofront.png', 'images/Hook//400N/400N_optimized.png', 'images/Hook//Analyze lifting loops on cargo.png'],
        content: md`
**Overview.** The transportation of a diverse product range—specifically pumps of different sizes and weights—creates logistical bottlenecks due to frequent tool changes. This project investigates the design of a generalized conveyor attachment system capable of handling diverse loads without operational stoppages.

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
        slug: 'robot-challenge',
        title: 'Autonomous Ball-Sorting Robots',
        subtitle: 'Two collaborative mechatronic systems — LEGO Mindstorms EV3',
        stack: ['LEGO Mindstorms EV3', 'Mechatronics', 'CAD (Inventor)', '3D Printing', 'CNC', 'Design-Build-Test'],
        images: ['images/CollabRobots/2The_One_assembly_New.png', 'images/CollabRobots/2The_One_assembly_New2.png'],
        content: md`
**Overview.** Designed, built, and programmed two autonomous robots — *Baggern* (the digger) and *Dumpern* (the transporter) — that collaborate to collect unsorted balls from a loading zone, navigate an obstacle course, and sort them by size into three colour-coded unloading zones, all within 10 minutes.

**Challenge.** The course featured three elevated platforms (P1–P3), a tipping bridge (P2), and variable-width paths (300–1300 mm), requiring an adaptable open-loop/sensor-fusion solution. Balls came in three sizes — white (Ø 20 mm, 3 g), yellow (Ø 25 mm, 1.4 g), blue (Ø 30 mm, 4.3 g) — plus red balls to be excluded.

**Robot Roles.**
* **Baggern** — stationed beside the ball box; scoops balls and delivers them to the top platform.
* **Dumpern** — pre-positioned on the platform nearest the pickup zone; transports and sorts balls across the obstacle course and deposits them in the correct boxes.

**User Interface.** A two-button colour-coded remote control lets an uninitiated user configure the sorting mapping before start. The software then infers the third destination automatically.

**Methodology.**
* Group contract, shared vision, and sub-team structure (10 members, communication leads per sub-team).
* Concept generation via brainstorming + ranked comparison in Excel → two finalist concepts selected by elimination.
* LEGO prototyping → physical iteration → CAD in Autodesk Inventor → CNC milling, metal lathe, and 3D printing (Cura + FDM).
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
        slug: 'comsol-heat',
        title: '1D Heat Conduction (COMSOL)',
        subtitle: 'Verification vs. model',
        stack: ['MATLAB','COMSOL','FEM'],
        images: ['images/Heatsink/Comsol.png', 'images/Heatsink/FEM.png'],
        content: `
**PDE.** $\\nabla \\cdot(-c\\nabla u - \\alpha u + \\gamma) + \\beta \\nabla u + au = f$. In 1D: $$\\frac{d}{dx}\\left(k \\frac{dT}{dx}\\right) - 25T + 25T_{air} = 0.$$

**Mapping.** $c=-K,\ u=T,\ a=-25,\ f=-25T_{air}$. Dirichlet + zero-flux on boundaries.
$$
\\begin{align}
N_i &= \\frac{x - x_j}{x_i-x_j} \\quad N_j = \\frac{x_i-x}{x_i-x_j} \\newline
F_r &= \\int_{x_1}^{x_2} 25 T_{air} N_r \\, dx \\newline
K_{rc} &= \\int_{x_1}^{x_2} \\frac{d^2}{dx^2} K N_r N_c + 25 N_r N_c \\, dx\\newline
&= \\int_{x_1}^{x_2} K \\frac{d N_r}{dx} \\frac{d N_c}{dx} + 25 N_r N_c \\, dx\\newline
\\mathbf{T} &= K^{-1} \\mathbf{F}
\\end{align}
$$

**Result.** Temperature decays along the fin; MATLAB computations correspond to Comsol.
        `
      },
      {
        slug: 'Railroad-vehicle-suspension',
        title: 'Suspension Optimization for railroad vehicles',
        subtitle: 'Solving for feasibility',
        stack: ['MATLAB','Mathematical Modeling', 'Runge-Kutta 4'],
        images: ['images/Suspension/Mathematical Model.png', 'images/Suspension/Task5_Impulse_10mm.png', 'images/Suspension/StepResponse.png'],
        content: md`
**Problem statement.** The vehicle is running at constant velocity $v = 68 km/h$. The measured vertical height position $z_s$ of the track along the route $s$ is given by data.

**Mathematical model.** We consider a two-degree-of-freedom train model with masses $m_1$, $m_2$, contact and suspension springs $k_1$, $k_2$, and dampers $C_1$, $C_2$, traveling over a track profile $z_s(s)$ at constant speed v.

The parameters are:
$$
\\begin{aligned}
m_1 &= 6\\,000 \\ \\mathrm{kg}, & m_2 &= 38\\,200 \\ \\mathrm{kg},\\newline
k_1 &= 1.12 \\times 10^7 \\ \\mathrm{N/m}, & k_2 &= 2.16 \\times 10^6 \\ \\mathrm{N/m},\\newline
C_1 &= 4.10 \\times 10^5 \\ \\mathrm{Ns/m}, & C_2 &= 1.60 \\times 10^5 \\ \\mathrm{Ns/m}.
\\end{aligned}
$$

The track elevation is given as a dataset with corresponding heights z_s and distances s.
Since the vehicle moves at constant speed v_s = 68 \\ \\mathrm{km/h}, we can also obtain the time signal from the data:
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
\\uparrow^+ \\sum F_{z1} = m_1 \\ddot z_1 &= -F_{S1} - F_{S2} - F_{C1} - F_{C2} + F_1,\\newline
&= -k_1(z_s - z_1) - k_2(z_1 - z_2) - C_1(\\dot z_s - \\dot z_1) - C_2(\\dot z_1 - \\dot z_2) + F_1,\\newline
\\uparrow^+ \\sum F_{z2} = m_2 \\ddot z_2 &= +F_{S2} + F_{C2} + F_2,\\newline
&= -k_2(z_2 - z_1) - C_2(\\dot z_2 - \\dot z_1) + F_2.
\\end{aligned}
$$

Since there are no other external forces (F_1 = F_2 = 0), the accelerations can be expressed as:
$$
\\ddot{z}_1 = -\\frac{1}{m_1} \\left[ (C_2 - C_1)\\dot z_1 + (k_2 - k_1) z_1 - C_2 \\dot z_2 - k_2 z_2 + C_1 \\dot z_s + k_1 z_s \\right], \\tag{1}
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

The fourth-order Runge–Kutta method (RK4) is applied as follows.
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

Implementation of optimization in MATLAB resulted in the lowest rms acceleration occurred at the lowest possible stiffness and damping in the user defined range. Interpretation of this is that the theoretical maximum deflection is not what is limiting the system but the limit lies in the feasibility and real world application of the stiffness and damping. To test the feasibility of the solution was modified with a fake impulse (simulated gravel on the track) in addition to the solution beginning and end of the data was zero padded to be able to inspect longer oscillatory behaviours. With the introduced "gravel" (impulse in data) the optimization was run again with more feasible results this time, not the lowest possible of the input range of solutions. This result that includes a faked impulse in the track seems more trustworthy and robust since it can handle not perfectly smooth (and clean) track without loosing comfort for potential passengers.
        `
      },
      {
        slug: 'Robotic_Cat_Companion',
        title: 'Robotic Cat Companion',
        subtitle: 'A paintable, personality-swappable wooden robot cat for children',
        stack: ['CAD (Inventor)', 'Arduino Uno', 'Raspberry Pi Zero WH', 'ATMEGA328P', 'ESP8266 Wi-Fi', 'Ultrasonic Sensing', 'Laser-Cut Masonite', '3D Printing', 'Web App', 'DBT / Gate Process'],
        images: ['images/Cat/Picture2.jpg','images/Cat/Picture1.jpg', 'images/Cat/webGif.mp4', 'images/Cat/PXL_20231208_102716055.jpg', 'images/Cat/PXL_20231208_102719947.jpg'],
        content: md`
**Overview.** *The Robotic Cat Companion* is a Standalone Consumer Robot (SCR) developed for children aged 3–8.

The cat is intentionally **not** a low-care pet substitute — it is a creative toy. Children **paint the wooden shell themselves**, swap **ears and hats**, and choose **personalities** through a companion website, so the same hardware can become endlessly different cats over time.

**Product goals (from the PRD).**
* **Innovative user experience** — a curious, story-enabled, ever-changeable robot friend that addresses unmet desires children haven't yet articulated.
* **Technology leadership** — modern consumer-robotics components and early prototype testing.
* **Competitive positioning** — feature/price parity with or above existing offerings (benchmarked against ImagiCharm and Pokémon-style toys).

**Target user.**
* **Buyer:** parents, grandparents, relatives or friends of children.
* **User:** children aged 3–8 with an interest in robotics or cats.
* **Scenario:** *"Elliot, an 8-year-old, is bored and uses ShellCat to stay satisfied with endless play and unlimited personalities. He paints and plays with the ShellCat and sees it as a real pet/friend."*

**Mechanical design.**
* **Outer shell:** **Masonite, laser-cut** — a wooden surface that takes paint well, fitting the brand's *Blanchedalmond* wooden look.
* **3D-printed plastic** parts for gears, the MCU case, the computer case, and battery holders.
* **Swappable accessories:** ears and hats designed to be made by the user from a manual included in the box.
* CAD modelled in **Inventor** to allow rapid iteration and a **modular design** for a future "world of characters."

**Electronics.**
The PRD splits the bill of materials between an early *prototype* and a cost-reduced *product* version:

| Subsystem | Prototype | Product |
| :--- | :--- | :--- |
| MCU | Arduino Uno | ATMEGA328P-PU |
| Computer | Raspberry Pi Zero WH | — (replaced by Wi-Fi + MCU) |
| Connectivity | (via Pi) | ESP8266 Wi-Fi module |
| Motion | 2× DC motors + 1× stepper (28BYJ-48 + ULN2003) | same |
| Sensing | Ultrasonic ranger | Ultrasonic ranger |
| Power | 3× AA + 1× 6LR holders | 3× AA + 1× 6LR holders |
| PCB | breadboard / wiring | Custom PCB |

**Functional requirements.**
* Natural, intuitive interaction with children.
* **Selectable personalities** — currently five, exposed via the companion website with regular updates planned.
* **Autonomous navigation** in a home environment with obstacle avoidance and the ability to approach objects within a defined area.
* **Safe interaction** with household objects, children, and pets.
* **Battery life** sufficient for at least one full day of typical use, with easy-to-change batteries.

**Non-functional requirements.**
* User-friendly setup with no maintenance.
* High durability and a low failure rate to support endless play.
* **Modular design** to allow future upgrades and new characters.

**Companion website.** A web app (a visual copy hosted at *here* and is also shown in one of the videos) lets the user pick the cat's personality and will host a community forum where suggestions can be voted on and rolled into future updates — closing a loop directly back into the product.

**Brand & story.** ShellCats are described in the PRD as having come from a worn-out world to Earth via a "magical spell," carrying protective shells that children can decorate to express each cat's personality.

**Process.** The development followed a **Design-Build-Test (DBT) and gate** workflow with early user-testing prototypes feeding back into the design before each gate.
        `
      }
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
* simulation-driven product development using **FEM** and **scripting**, in **Abaqus**, **Hypermesh**, and **Ansys**
* numerical methods, optimization, and parameter estimation
* embedded sensing, measurement systems, and hardware prototyping

I'm especially interested in projects where theory meets implementation: deriving the model, validating it with data, and then using it to improve performance, robustness, or design decisions.

This portfolio highlights that workflow through projects in balancing robots, golf trajectory modeling, arrow flight simulation, lifting design optimization, ocean sensing, thermal modeling, and railroad suspension analysis.
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

    function renderMedia(container, sources, title){
      container.innerHTML = '';
      sources.forEach(src => {
        let el;
        if (/\.(mp4|webm|ogg)$/i.test(src)) {
          el = document.createElement('video');
          el.src = src;
          el.controls = true;
          el.setAttribute('aria-label', `${title || 'Project'} video`);
        } else {
          el = document.createElement('img');
          el.src = src;
          el.alt = title || '';
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
          ...projects.map(p => ({
            ...p,
            href: `#/project/${p.slug || slugify(p.title)}`
          }))
        ];

        items.forEach(p => {
            const cover = (p.images && p.images.length) ? p.images[0] : p.shot;
            const media = cover
              ? `<div class="shot"><img src="${cover}" alt="${p.title}"/></div>`
              : `<div class="shot" aria-hidden="true"></div>`;

            const card = document.createElement('article');
            card.className = 'card';
            card.innerHTML = `
            <div>
                <div class="title">${p.title}</div>
                <div class="subtitle">– ${p.subtitle || ''}</div>
                <div class="stack">${(p.stack||[]).map(s=>`<div>${s}</div>`).join('')}</div>
            </div>
            ${media}
            <a class="linkcover" href="${p.href}" aria-label="Open ${p.title}"></a>
            `;
            grid.appendChild(card);
        });
    }

    const detailImages = document.getElementById('detailImages');

function renderContentPage(page){
  detailTitle.textContent = page.title || '';
  detailSubtitle.textContent = page.subtitle || '';
  detailMD.innerHTML = marked.parse(page.content || '');
  if(window.MathJax) MathJax.typesetPromise([detailMD]);

  const imgs = (page.images && page.images.length) ? page.images : (page.shot ? [page.shot] : []);
  renderMedia(detailImages, imgs, page.title);
}


function renderDetail(slug){
  const p = projects.find(x => (x.slug || slugify(x.title)) === slug);
  if(!p){ location.hash = '#projects'; return; }

  detailTitle.textContent = p.title;
  detailSubtitle.textContent = p.subtitle || '';
  detailMD.innerHTML = marked.parse(p.content || '');
  if(window.MathJax) MathJax.typesetPromise([detailMD]);

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
        renderContentPage(aboutPage);
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
        renderList();
      }
    }

    window.addEventListener('hashchange', route);
    route();
