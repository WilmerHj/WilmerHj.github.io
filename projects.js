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
      }
    ];

    // ---------- Helpers ----------
    const grid = document.getElementById('grid');
    const list = document.getElementById('list');
    const detail = document.getElementById('detail');
    const detailShot = document.getElementById('detailShot');
    const detailTitle = document.getElementById('detailTitle');
    const detailSubtitle = document.getElementById('detailSubtitle');
    const detailMD = document.getElementById('detailMD');

    function slugify(s){return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');}

    function renderList(){
        grid.innerHTML = '';
        projects.forEach(p => {
            const cover = (p.images && p.images.length) ? p.images[0] : p.shot;
            const card = document.createElement('article');
            card.className = 'card';
            card.innerHTML = `
            <div>
                <div class="title">${p.title}</div>
                <div class="subtitle">– ${p.subtitle || ''}</div>
                <div class="stack">${(p.stack||[]).map(s=>`<div>${s}</div>`).join('')}</div>
            </div>
            <div class="shot"><img src="${cover || ''}" alt="${p.title}"/></div>
            <a class="linkcover" href="#/project/${p.slug || slugify(p.title)}" aria-label="Open ${p.title}"></a>
            `;
            grid.appendChild(card);
        });
    }

    const detailImages = document.getElementById('detailImages');

function renderDetail(slug){
  const p = projects.find(x => (x.slug || slugify(x.title)) === slug);
  if(!p){ location.hash = '#projects'; return; }

  detailTitle.textContent = p.title;
  detailSubtitle.textContent = p.subtitle || '';
  detailMD.innerHTML = marked.parse(p.content || '');
  if(window.MathJax) MathJax.typesetPromise([detailMD]);

  // Render stacked images (or fall back to shot)
  const imgs = (p.images && p.images.length) ? p.images : (p.shot ? [p.shot] : []);
  detailImages.innerHTML = '';
imgs.forEach(src => {
  let el;
  if (/\.(mp4|webm|ogg)$/i.test(src)) {
    // video
    el = document.createElement('video');
    el.src = src;
    el.controls = true;
  } else {
    // image
    el = document.createElement('img');
    el.src = src;
  }
  el.alt = p.title;
  detailImages.appendChild(el);
});
}

    function route(){
      const hash = location.hash || '#projects';
      const m = hash.match(/^#\/project\/([A-Za-z0-9\-_%]+)/);
      if(m){
        list.style.display = 'none';
        detail.style.display = 'block';
        renderDetail(decodeURIComponent(m[1]));
      } else {
        detail.style.display = 'none';
        list.style.display = 'block';
        renderList();
      }
    }

    window.addEventListener('hashchange', route);
    route();