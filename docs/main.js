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

  // 初期位置：駆動パルス中
  slider.value = Math.floor(data.t.length * 0.35);

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
     Gain sliders
     ========================= */

  /*
    data-gain 属性の意味づけ：
    - V : Primary control (Drive voltage)
    - x,P,Q : Advanced (Device parameters)
    - I : Display only
  */

  document.querySelectorAll("input[data-gain]").forEach(el => {
    el.addEventListener("input", e => {
      const key = e.target.dataset.gain;
      const value = +e.target.value;

      // Gain更新
      setGain(key, value);

      // 物理モデルは常に再計算
      data = simulate();

      update();
    });
  });

});
