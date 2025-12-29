import { TIME_VIEW, DT, setGain } from "./params.js";
import { simulate } from "./model.js";
import { draw } from "./draw.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const slider = document.getElementById("time");
slider.max = TIME_VIEW;
slider.step = DT;

let data = simulate();

function update() {
  const t = parseFloat(slider.value);
  draw(ctx, data, t);
}

slider.addEventListener("input", update);

document.querySelectorAll("input[data-gain]").forEach(sl => {
  sl.addEventListener("input", e => {
    setGain(e.target.dataset.gain, parseFloat(e.target.value));
    data = simulate();
    update();
  });
});

update();
