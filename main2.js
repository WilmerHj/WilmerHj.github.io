import init, { compute_pressure } from "./pkg2/FDM_2D_Reynolds.js";

// UI refs
const q = (s) => document.querySelector(s);
const nxEl = q("#nx"), nyEl = q("#ny"), kEl = q("#k"), bLEl = q("#bL");
const omegaEl = q("#omega"), tolEl = q("#tol"), itEl = q("#max_iter");
const nxv = q("#nxv"), nyv = q("#nyv");
const runBtn = q("#run");
const heat = q("#heat"), wire = q("#wire");
const hctx = heat.getContext("2d");
const wctx = wire.getContext("2d");

// simple color ramp (blue → white → red)
function colorRamp(t) {
  // clamp
  t = Math.max(0, Math.min(1, t));
  // piecewise: 0..0.5 blue→white, 0.5..1 white→red
  if (t < 0.5) {
    const u = t / 0.5;
    return [Math.round(255 * u), Math.round(255 * u), 255, 255];
  } else {
    const u = (t - 0.5) / 0.5;
    return [255, Math.round(255 * (1 - u)), Math.round(255 * (1 - u)), 255];
  }
}

function drawHeatmap(P, nx, ny) {
  const w = heat.width, h = heat.height;
  const img = hctx.createImageData(w, h);
  let pmin = Infinity, pmax = -Infinity;
  for (let v of P) { if (v < pmin) pmin = v; if (v > pmax) pmax = v; }
  const scale = (v) => (pmax === pmin) ? 0.5 : (v - pmin) / (pmax - pmin);

  for (let y = 0; y < h; y++) {
    const jy_real = y / (h - 1) * (ny - 1);
    const jy0 = Math.floor(jy_real), jy1 = Math.min(ny - 1, jy0 + 1);
    const ty = jy_real - jy0;

    for (let x = 0; x < w; x++) {
      const ix_real = x / (w - 1) * (nx - 1);
      const ix0 = Math.floor(ix_real), ix1 = Math.min(nx - 1, ix0 + 1);
      const tx = ix_real - ix0;

      const p00 = P[jy0 * nx + ix0];
      const p10 = P[jy0 * nx + ix1];
      const p01 = P[jy1 * nx + ix0];
      const p11 = P[jy1 * nx + ix1];
      const p0 = p00 * (1 - tx) + p10 * tx;
      const p1 = p01 * (1 - tx) + p11 * tx;
      const p = p0 * (1 - ty) + p1 * ty;

      const t = scale(p);
      const [r, g, b, a] = colorRamp(t);
      const off = (y * w + x) * 4;
      img.data[off] = r; img.data[off + 1] = g; img.data[off + 2] = b; img.data[off + 3] = a;
    }
  }
  hctx.putImageData(img, 0, 0);
}

// Simple isometric wireframe
function drawWireframe(P, nx, ny) {
  const w = wire.width, h = wire.height;
  wctx.clearRect(0, 0, w, h);
  wctx.lineWidth = 1;

  // normalize P for z scaling
  let pmin = Infinity, pmax = -Infinity;
  for (let v of P) { if (v < pmin) pmin = v; if (v > pmax) pmax = v; }
  const z = (v) => (pmax === pmin) ? 0 : (v - pmin) / (pmax - pmin);

  const margin = 30;
  const sx = (w - 2 * margin) / (nx - 1);
  const sy = (h - 2 * margin) / (ny - 1);
  const zscale = Math.min(sx, sy) * 0.6;

  // iso projection
  const iso = (i, j, v) => {
    const x = margin + i * sx;
    const y = margin + j * sy;
    const zz = z(v) * zscale;
    // simple "iso": shift x by -0.5*z, y by -z
    return [x - 0.5 * zz, y - zz];
  };

  wctx.strokeStyle = "#999";
  // horizontal lines
  const stepY = Math.max(1, Math.floor(ny / 30));
  for (let j = 0; j < ny; j += stepY) {
    wctx.beginPath();
    for (let i = 0; i < nx; i++) {
      const [x, y] = iso(i, j, P[j * nx + i]);
      if (i === 0) wctx.moveTo(x, y); else wctx.lineTo(x, y);
    }
    wctx.stroke();
  }
  // vertical lines
  const stepX = Math.max(1, Math.floor(nx / 30));
  for (let i = 0; i < nx; i += stepX) {
    wctx.beginPath();
    for (let j = 0; j < ny; j++) {
      const [x, y] = iso(i, j, P[j * nx + i]);
      if (j === 0) wctx.moveTo(x, y); else wctx.lineTo(x, y);
    }
    wctx.stroke();
  }
}

function updateLabels() { nxv.textContent = nxEl.value; nyv.textContent = nyEl.value; }
nxEl.addEventListener("input", updateLabels);
nyEl.addEventListener("input", updateLabels);

async function runOnce() {
  const nx = parseInt(nxEl.value, 10);
  const ny = parseInt(nyEl.value, 10);
  const k = parseFloat(kEl.value);
  const bL = parseFloat(bLEl.value);
  const omega = parseFloat(omegaEl.value);
  const tol = parseFloat(tolEl.value);
  const max_iter = parseInt(itEl.value, 10);

  const res = compute_pressure(nx, ny, k, bL, omega, tol, max_iter);
  const P = Array.from(res.p());
  drawHeatmap(P, res.nx, res.ny);
  drawWireframe(P, res.nx, res.ny);
}

runBtn.addEventListener("click", runOnce);

(async () => {
  await init(); // load wasm
  updateLabels();
  runOnce();
})();
