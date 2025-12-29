// docs/demo/canvas/draw.js
export function draw(ctx, data) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const keys = ["V", "I", "x", "P", "Q"];
  keys.forEach((k, i) => {
    ctx.fillText(`${k}: ${data[k].toFixed(2)}`, 20, 30 + i * 20);
  });
}

