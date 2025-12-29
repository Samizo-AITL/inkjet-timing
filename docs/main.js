import { params } from "./params.js";
import { computeStack } from "./model.js";
import { drawStack } from "./draw.js";

const canvas = document.getElementById("scope");
const ctx = canvas.getContext("2d");

const stack = computeStack(params);

const gains = {
  V: 1,
  I: 0.3,
  x: 2,
  P: 3,
  Q: 0.5
};

const cursor = document.getElementById("cursor");

["V","I","x","P","Q"].forEach(k => {
  document.getElementById("g"+k).oninput = e => {
    gains[k] = +e.target.value;
    redraw();
  };
});

cursor.oninput = redraw;

function redraw() {
  drawStack(ctx, stack, gains, +cursor.value);
}

redraw();
console.log("TIMING OBSERVER READY");
