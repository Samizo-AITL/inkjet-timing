import { setGain } from "./params.js";
import { simulate } from "./model.js";
import { draw } from "./draw.js";

window.addEventListener("DOMContentLoaded", () => {
  /* =========================
     Canvas
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
     Data
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
     RUN control（←これが欠けていた）
     ========================= */
  const runBtn = document.getElementById("run");
  let isRunning = false;

  runBtn.addEventListener("click", () => {
    isRunning = !isRunning;
    runBtn.textContent = isRunning ? "STOP" : "RUN";
  });

  /* =========================
     Update
     ========================= */
  function update() {
    const idx = +slider.value;
    draw(ctx, data, idx);

    tv.textContent = (data.t[idx] * 1e6).toFixed(1);
    vV.textContent = data.V[idx].toFixed(2);
    vI.textContent = data.I[idx].toFixed(2);
    vx.textContent = data.x[idx].toFixed(2);
    vP.textContent = data.P[idx].toFixed(2);
    vQ.textContent = data.Q[idx].toFixed(2);
  }

  update();
  slider.addEventListener("input", update);

  /* =========================
     Animation loop（←RUN の正体）
     ========================= */
  function animate() {
    if (isRunning) {
      let idx = +slider.value + 1;
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
      setGain(e.target.dataset.gain, +e.target.value);
      data = simulate();
      slider.max = data.t.length - 1;
      update();
    });
  });
});
