import { params } from "./params.js";
import { computeStack } from "./model.js";
import { drawStack } from "./draw.js";

const canvas = document.getElementById("scope");
const ctx = canvas.getContext("2d");

const stack = computeStack(params);

const gains = {
  V: 1,
  I: 1,
  x: 1,
  P: 1,
  Q: 1,
};

function bind(id, key) {
  const el = document.getElementById(id);
  el.oninput = () => {
    gains[key] = parseFloat(el.value);
    redraw();
  };
}

bind("gain-v", "V");
bind("gain-i", "I");
bind("gain-x", "x");
bind("gain-p", "P");
bind("gain-q", "Q");

function redraw() {
  drawStack(ctx, stack, gains);
}

redraw();
console.log("FULL STACK BOOT OK");
