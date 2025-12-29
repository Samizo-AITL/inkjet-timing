export function draw(ctx, data, cursorT) {
  const { t, V, I, x, P, Q } = data;
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;

  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;

  const rows = [V, I, x, P, Q];
  const labels = ["V(t)", "I(t)", "Δx(t)", "P(t)", "Q(t)"];
  const rowH = H / rows.length;

  rows.forEach((row, r) => {
    const y0 = r * rowH + rowH / 2;

    // baseline
    ctx.strokeStyle = "#444";
    ctx.beginPath();
    ctx.moveTo(0, y0);
    ctx.lineTo(W, y0);
    ctx.stroke();

    // waveform
    ctx.strokeStyle = "#6cf";
    ctx.beginPath();
    row.forEach((v, i) => {
      const xPos = (i / row.length) * W;
      const yPos = y0 - v * rowH * 0.4;
      if (i === 0) ctx.moveTo(xPos, yPos);
      else ctx.lineTo(xPos, yPos);
    });
    ctx.stroke();

    // label
    ctx.fillStyle = "#aaa";
    ctx.fillText(labels[r], 10, y0 - rowH * 0.35);
  });

  // --- Time cursor ---
  const cx = (cursorT / t[t.length - 1]) * W;
  ctx.strokeStyle = "#fff";
  ctx.beginPath();
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, H);
  ctx.stroke();
}
