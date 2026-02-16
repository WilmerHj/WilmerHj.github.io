// Project renderer with external .tex content support

const grid = document.getElementById("grid");
const list = document.getElementById("list");
const detail = document.getElementById("detail");
const detailTitle = document.getElementById("detailTitle");
const detailSubtitle = document.getElementById("detailSubtitle");
const detailMD = document.getElementById("detailMD");
const detailImages = document.getElementById("detailImages");

let projects = [];

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function loadText(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Failed to load ${path}: ${res.status}`);
  }
  return res.text();
}

async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Failed to load ${path}: ${res.status}`);
  }
  return res.json();
}

async function loadProjects() {
  try {
    const raw = await loadJson("projects/projects.json");

    const resolved = await Promise.all(
      raw.map(async (project) => {
        if (project.content_tex) {
          const texContent = await loadText(project.content_tex);
          return { ...project, content: texContent };
        }
        return project;
      })
    );

    return resolved;
  } catch (err) {
    console.warn("Could not load projects/projects.json, using fallback list.", err);
    // Fallback keeps page usable even if external files are missing.
    return [
      {
        slug: "fallback-project",
        title: "Project data unavailable",
        subtitle: "Could not load external .tex project files",
        stack: ["Fallback"],
        images: [],
        content:
          "Could not load `projects/projects.json` or one of the referenced `.tex` files. Please verify paths and hosting.",
      },
    ];
  }
}

function renderList() {
  grid.innerHTML = "";

  projects.forEach((p) => {
    const cover = p.images && p.images.length ? p.images[0] : p.shot;
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <div>
        <div class="title">${p.title}</div>
        <div class="subtitle">– ${p.subtitle || ""}</div>
        <div class="stack">${(p.stack || []).map((s) => `<div>${s}</div>`).join("")}</div>
      </div>
      <div class="shot"><img src="${cover || ""}" alt="${p.title}"/></div>
      <a class="linkcover" href="#/project/${p.slug || slugify(p.title)}" aria-label="Open ${p.title}"></a>
    `;

    grid.appendChild(card);
  });
}

function renderDetail(slug) {
  const p = projects.find((x) => (x.slug || slugify(x.title)) === slug);
  if (!p) {
    location.hash = "#projects";
    return;
  }

  detailTitle.textContent = p.title;
  detailSubtitle.textContent = p.subtitle || "";
  detailMD.innerHTML = marked.parse(p.content || "");
  if (window.MathJax) MathJax.typesetPromise([detailMD]);

  const imgs = p.images && p.images.length ? p.images : p.shot ? [p.shot] : [];
  detailImages.innerHTML = "";

  imgs.forEach((src) => {
    let el;
    if (/\.(mp4|webm|ogg)$/i.test(src)) {
      el = document.createElement("video");
      el.src = src;
      el.controls = true;
    } else {
      el = document.createElement("img");
      el.src = src;
    }
    el.alt = p.title;
    detailImages.appendChild(el);
  });
}

function route() {
  const hash = location.hash || "#projects";
  const m = hash.match(/^#\/project\/([A-Za-z0-9\-_%]+)/);
  if (m) {
    list.style.display = "none";
    detail.style.display = "block";
    renderDetail(decodeURIComponent(m[1]));
  } else {
    detail.style.display = "none";
    list.style.display = "block";
    renderList();
  }
}

(async () => {
  projects = await loadProjects();
  window.addEventListener("hashchange", route);
  route();
})();
