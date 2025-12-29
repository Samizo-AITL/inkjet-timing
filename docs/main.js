import { params } from "./params.js";
import { computeStack } from "./model.js";
import { drawStack } from "./draw.js";

const canvas = document.getElementById("scope");
const ctx = canvas.getContext("2d");

// DPI対応
const dpr = window.devicePixelRatio || 1;
canvas.width  = 1200 * dpr;
canvas.height = 600 * dpr;
canvas.style.width = "1200px";
canvas.style.height = "600px";
ctx.scale(dpr, dpr);

const stack = computeStack(params);

const gains = { V:1, I:1, x:1, P:1, Q:1 };

const cursor = document.getElementById("cursor");
cursor.max = stack.V.length - 1;
cursor.value = params.drive.tOn + 20;

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
console.log("Inkjet Timing Demo READY");
