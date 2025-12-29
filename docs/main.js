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

const cursor = document.getElementById("cursor");

// 初期カーソル位置：駆動立ち上がり付近
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
console.log("DRAW STACK READY");
