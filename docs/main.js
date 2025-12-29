import { setGain } from "./params.js";
import { simulate } from "./model.js";
import { draw } from "./draw.js";

window.addEventListener("DOMContentLoaded", () => {
  /* =========================
     Canvas setup
     ========================= */
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth - 300;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  /* =========================
     Simulation data
     ========================= */
  let data = simulate();

  /* =========================
     Time cursor
     ========================= */
  const slider = document.getElementById("time");
  slider.min = 0;
  slider.max = data.t.length - 1;
  slider.step = 1;
  slider.value = Math.floor(data.t.length * 0.35);

  /* =========================
     RUN control（安全対応）
     ========================= */
  const runBtn = document.getElementById("run"); // ← HTML側に追加
  let isRunning = false;
  let playSpeed = 1;

  if (runBtn) {
    runBtn.addEventListener("click", () => {
      isRunning = !isRunning;
      runBtn.textContent = isRunning ? "STOP" : "RUN";
    });
  }

  /* =========================
     Update display
     ========================= */
  function update() {
    const idx = +slider.value;
    draw(ctx, data, idx);

    document.getElementById("tv").textContent =
      (data.t[idx] * 1e6).toFixed(1);

    document.getElementById("vV").textContent =
      data.V[idx].toFixed(2);

    document.getElementById("vI").textContent =
      data.I[idx].toFixed(2);

    document.getElementById("vx").textContent =
      data.x[idx].toFixed(2);

    document.getElementById("vP").textContent =
      data.P[idx].toFixed(2);

    document.getElementById("vQ").textContent =
      data.Q[idx].toFixed(2);
  }

  update();
  slider.addEventListener("input", update);

  /* =========================
     Animation loop
     ========================= */
  function animate() {
    if (isRunning) {
      let idx = +slider.value + playSpeed;
      if (idx >= data.t.length) idx = 0;
      slider.value = idx;
      update();
    }
    requestAnimationFrame(animate);
  }
  animate();

  /* =========================
     Gain sliders
     ========================= */
  document.querySelectorAll("input[data-gain]").forEach(el => {
    el.addEventListener("input", e => {
      const key = e.target.dataset.gain;
      const value = +e.target.value;

      setGain(key, value);
      data = simulate();

      slider.max = data.t.length - 1;
      update();
    });
  });
});
