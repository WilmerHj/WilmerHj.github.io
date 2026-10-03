// Project text lives in Markdown files under content/ (one file per project).
// Each entry below only holds metadata plus `contentFile`, the path to its .md.
// The files are plain Markdown + TeX: write \cmd and \\ exactly as TeX wants
// them - there is no JS string escaping involved any more.

function getYoutubeId(url) {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  return match ? match[1] : null;
}



const projects = [
  {
  slug: 'topology-optimization-ai-meshing-phone-arm-continuation',
  title: 'Continuation of Topology Optimization & AI-Automated Hex Meshing',
  subtitle: 'Further AI-assisted meshing and Topology Optimization with Calculix (Open Source FEA)',
  stack: [
    'PrePoMax',
    'Calculix',
    'Beso'
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
    'images/'
  ],
  contentFile: 'content/projects/topology-optimization-ai-meshing-phone-arm-continuation.md'

},
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
  contentFile: 'content/projects/topology-optimization-ai-meshing-phone-arm.md'

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
  contentFile: 'content/projects/wind-turbine-blade-cfd-fea.md'
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
        contentFile: 'content/projects/experimental-modal-analysis.md'
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
  contentFile: 'content/projects/automated-fea-design-optimization.md'
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
  contentFile: 'content/projects/vickers-indentation-mesh-convergence.md'
},
      {
        slug: 'topology-optimization-lifting',
        title: 'Topology Optimization for Lifting Solutions',
        subtitle: 'Generalized attachment design using Ansys Mechanical',
        stack: ['Ansys Mechanical', 'Topology Optimization', 'FEM', 'CAD', 'Product Development'],
        images: ['images/Hook/1500N/1500N_optimized_stress.png', 'images/Hook/Paretofront.png', 'images/Hook/400N/400N_optimized.png', 'images/Hook/Analyze lifting loops on cargo.png'],
        contentFile: 'content/projects/topology-optimization-lifting.md'
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
  contentFile: 'content/projects/thermal-fem-slider-bearing.md'
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
  contentFile: 'content/projects/sector-thrust-bearing-analysis.md'
},
{
        slug: 'Drone1',
        title: 'Flying & Balancing robot drone',
        subtitle: 'Two wheeled, two propellered drone car',
        stack: ['MATLAB','Simulink','Kinematics', 'Control Theory'],
        images: ['images/Drone1/Turn.png', 'images/Drone1/Equation.png','images/Drone1/RobotBild.jpeg', 'images/Drone1/Balancing Kinematics.png', 'images/Drone1/Assembly1.png', 'images/Drone1/PXL_20250327_161507964.jpg','images/Drone1/Video (1).mp4','images/Drone1/Video (2).mp4'],
        contentFile: 'content/projects/Drone1.md'
      },
      {
        slug: 'arrow-flight-simulation',
        title: 'Compound Bow Arrow Flight Simulation',
        subtitle: 'Trajectory and Archer\'s Paradox Modeling',
        stack: ['MATLAB', 'FEM', 'Runge-Kutta 4', 'Newmark-Beta', 'Physics Simulation'],
        images: ['images/arrow/DrawCurve2.png', 'images/arrow/StaticDef.png', 'images/arrow/DynamicDef.png', 'images/arrow/FlightHorizontal.png', 'images/arrow/DrawAndVertDiff.png', 'images/arrow/Testing.jpg'],
        contentFile: 'content/projects/arrow-flight-simulation.md'
      },
      {
        slug: 'Railroad-vehicle-suspension',
        title: 'Suspension Optimization for railroad vehicles',
        subtitle: 'Solving for feasibility',
        stack: ['MATLAB','Mathematical Modeling', 'Runge-Kutta 4'],
        images: ['images/Suspension/Mathematical Model.png', 'images/Suspension/Task5_Impulse_10mm.png', 'images/Suspension/StepResponse.png'],
        contentFile: 'content/projects/Railroad-vehicle-suspension.md'
      },
      {
        slug: 'comsol-heat',
        title: '1D Heat Conduction (COMSOL)',
        subtitle: 'Verification vs. model',
        stack: ['MATLAB','COMSOL','FEM'],
        images: ['images/Heatsink/Comsol.png', 'images/Heatsink/FEM.png'],
        contentFile: 'content/projects/comsol-heat.md'
      },
      {
        slug: 'robot-challenge',
        title: 'Autonomous Ball-Sorting Robots',
        subtitle: 'Two collaborative mechatronic systems - LEGO Mindstorms EV3',
        stack: ['LEGO Mindstorms EV3', 'Mechatronics', 'CAD (Inventor)', '3D Printing', 'CNC', 'Design-Build-Test'],
        images: ['images/CollabRobots/2The_One_assembly_New.png', 'images/CollabRobots/2The_One_assembly_New2.png'],
        contentFile: 'content/projects/robot-challenge.md'
      },
      {
        slug: 'ocean-sensor',
        title: 'Ocean Sensor',
        subtitle: 'Modular waterproof sensing unit for ocean pollution & climate data',
        stack: ['Embedded Systems', 'Sensors', 'Electronics', 'Radio/WiFi', 'Web Visualization'],
        images: ['images/OceanSensor/slide-2.png', 'images/OceanSensor/slide-3.png', 'images/OceanSensor/slide-4.png', 'images/OceanSensor/slide-5.png', 'images/OceanSensor/Film1.mp4'],
        contentFile: 'content/projects/ocean-sensor.md'
      },
      {
        slug: 'golf-design-exploration',
        title: 'Golf Trajectory & Club Optimization',
        subtitle: 'Simulation Driven Design & Parameter Estimation',
        stack: ['MATLAB', 'Optimization', 'Latin Hypercube', 'Physics Modeling'],
        images: ['images/Golf/Golf2024.png', 'images/Golf/traject3.png', 'images/Golf/kline3.png', 'images/Golf/Trajectory Best Club.png'],
        contentFile: 'content/projects/golf-design-exploration.md'
      },
      {
        slug: 'Robotic_Cat_Companion',
        title: 'Robotic Cat Companion',
        subtitle: 'A paintable, personality-swappable wooden robot cat for children',
        stack: ['CAD (Inventor)', 'Arduino Uno', 'Raspberry Pi Zero WH', 'ATMEGA328P', 'ESP8266 Wi-Fi', 'Ultrasonic Sensing', 'Laser-Cut Masonite', '3D Printing', 'Web App', 'DBT / Gate Process'],
        images: ['images/Cat/Picture2.jpg','images/Cat/Picture1.jpg', 'images/Cat/webGif.mp4', 'images/Cat/PXL_20231208_102716055.jpg', 'images/Cat/PXL_20231208_102719947.jpg'],
        contentFile: 'content/projects/Robotic_Cat_Companion.md'
      },
    ];

    const aboutPage = {
      title: 'About me',
      subtitle: 'Engineering, control, simulation, and prototyping',
      stack: ['MATLAB','Mathematical Modeling', 'Runge-Kutta 4'],
      images: ['images/Wilmer/LinkedInProfile2.jpg'],
      contentFile: 'content/about.md'
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
      contentFile: 'content/thesis.md'
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
// Do NOT collapse \\ -> \ here: the .md files hold TeX verbatim, and \\ is the
// row separator matrix/aligned blocks need.
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

// Fetch a page's Markdown file once and cache it (works on GitHub Pages or any
// static server; opening index.html via file:// blocks fetch in most browsers).
const contentCache = new Map();
function loadContent(page){
  if(!page.contentFile) return Promise.resolve(page.content || '');
  if(!contentCache.has(page.contentFile)){
    contentCache.set(page.contentFile,
      fetch(page.contentFile).then(r => {
        if(!r.ok) throw new Error(`${r.status} ${r.statusText}`);
        return r.text();
      }).catch(err => {
        contentCache.delete(page.contentFile);   // allow a retry next time
        throw err;
      }));
  }
  return contentCache.get(page.contentFile);
}

// Each render bumps this, so a slow fetch can't overwrite a newer page.
let renderToken = 0;
function renderBody(page){
  const token = ++renderToken;
  detailMD.innerHTML = '<p class="loading" style="color:#6b7280">Loading…</p>';
  loadContent(page).then(text => {
    if(token !== renderToken) return;
    detailMD.innerHTML = renderMarkdown(text);
    typesetMath(detailMD);
  }).catch(err => {
    if(token !== renderToken) return;
    console.error('Could not load', page.contentFile, err);
    detailMD.innerHTML = `<p>Could not load this page's content (${page.contentFile}).</p>`;
  });
}

function renderContentPage(page){
  detailTitle.textContent = page.title || '';
  detailSubtitle.textContent = page.subtitle || '';
  renderBody(page);

  const imgs = (page.images && page.images.length) ? page.images : (page.shot ? [page.shot] : []);
  renderMedia(detailImages, imgs, page.title);
}


function renderDetail(slug){
  const p = projects.find(x => (x.slug || slugify(x.title)) === slug);
  if(!p){ location.hash = '#projects'; return; }

  document.title = `${BASE_TITLE} - ${p.title}`;
  detailTitle.textContent = p.title;
  detailSubtitle.textContent = p.subtitle || '';
  renderBody(p);

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
