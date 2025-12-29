import { params } from "./params.js";
import { computeStack } from "./model.js";
import { drawStack } from "./draw.js";

console.log("MAIN BOOT OK");

const canvas = document.getElementById("scope");
const ctx = canvas.getContext("2d");

// 仮テスト（まず塗る）
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = "lime";
ctx.beginPath();
ctx.moveTo(0, canvas.height / 2);
ctx.lineTo(canvas.width, canvas.height / 2);
ctx.stroke();

// 本来の処理
const data = computeStack(params);
drawStack(ctx, data);
