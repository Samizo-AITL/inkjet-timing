import { setGain } from "./params.js";
import { simulate } from "./model.js";
import { draw } from "./draw.js";

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width  = window.innerWidth - 260;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  let data = simulate();
  const N = data.t.length;

  // ★ スライダーは index
  const slider = document.getElementById("time");
  slider.min = 0;
  slider.max = N - 1;
  slider.step = 1;
  slider.value = 0;

  function update() {
    const idx = parseInt(slider.value, 10);
    draw(ctx, data, idx);
  }

  update();
  slider.addEventListener("input", update);

  document.querySelectorAll("input[data-gain]").forEach(el => {
    el.addEventListener("input", e => {
      setGain(e.target.dataset.gain, parseFloat(e.target.value));
      data = simulate();
      update();
    });
  });
});
