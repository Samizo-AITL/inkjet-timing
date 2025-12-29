import { TIME_VIEW, DT, setGain } from "./params.js";
import { simulate } from "./model.js";
import { draw } from "./draw.js";

window.addEventListener("DOMContentLoaded", () => {

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // ★ 保険：明示的にサイズ指定（重要）
  canvas.width  = 1000;
  canvas.height = 500;

  const slider = document.getElementById("time");

  // ★ 初期値を必ず入れる（最重要）
  slider.min = 0;
  slider.max = TIME_VIEW;
  slider.step = DT;
  slider.value = 0;

  let data = simulate();

  function update() {
    const t = parseFloat(slider.value);
    draw(ctx, data, t);
  }

  // ★ 最初に必ず1回描く（これが無いと真っ黒）
  update();

  slider.addEventListener("input", update);

  document.querySelectorAll("input[data-gain]").forEach(sl => {
    sl.addEventListener("input", e => {
      setGain(e.target.dataset.gain, parseFloat(e.target.value));
      data = simulate();
      update();
    });
  });

});
