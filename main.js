import init, { solve_constant_coeffs } from "./pkg/fem1d_wasm.js";

let chart;

function setupChart(ctx) {
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "u(x)",
        data: [],
        borderWidth: 2,
        pointRadius: 5,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { title: { display: true, text: "x" } },
        y: { title: { display: true, text: "u(x)" } },
      },
    },
  });
}

function updateChart(xs, ys) {
  chart.data.labels = xs.map((v) => +v.toFixed(6));
  chart.data.datasets[0].data = ys;
  chart.update();
}

function showSample(xs, ys) {
  const lines = ["x, u(x)"];
  for (let i = 0; i < xs.length; i += 1) {
    lines.push(`${xs[i].toFixed(6)},  ${ys[i].toFixed(6)}`);
  }
  document.getElementById("data").textContent = lines.join("\n");
}

async function main() {
  await init();
  chart = setupChart(document.getElementById("chart").getContext("2d"));

  const form = document.getElementById("params");
  const run = (ev) => {
    ev?.preventDefault();

    const nel = parseInt(document.getElementById("nel").value, 10);
    if (isNaN(nel) || nel < 1) {
      alert("nel must be >= 1");
      return;
    }

    const L = parseFloat(document.getElementById("L").value);
    const c = parseFloat(document.getElementById("c").value);
    const alpha = parseFloat(document.getElementById("alpha").value);
    const beta = parseFloat(document.getElementById("beta").value);
    const a = parseFloat(document.getElementById("a").value);
    const gamma = parseFloat(document.getElementById("gamma").value);
    const f = parseFloat(document.getElementById("f").value);

    const lk = document.getElementById("left_kind").value;
    const lv = parseFloat(document.getElementById("left_val").value);
    const rk = document.getElementById("right_kind").value;
    const rv = parseFloat(document.getElementById("right_val").value);

    try {
      const { x, u } = solve_constant_coeffs(
        0.0,
        L,
        nel,
        c,
        alpha,
        beta,
        a,
        gamma,
        f,
        lk,
        lv,
        rk,
        rv
      );
      updateChart(x, u);
      showSample(x, u);
    } catch (err) {
      alert("Solve error: " + err);
      console.error(err);
    }
  };

  form.addEventListener("submit", run);
  run();
}

main();
