export function draw(ctx, data, idx) {
  const { V, I, x, P, Q } = data;
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;

  ctx.clearRect(0, 0, W, H);

  const rows   = [V, I, x, P, Q];
  const colors = ["#3fa9f5", "#3fa9f5", "#f5a623", "#f5a623", "#7ed321"];
  const labels = ["V(t)", "I(t)", "Δx(t)", "P(t)", "Q(t)"];

  // ===== 固定スケール（ここが決着点）=====
  const scales = [
    2.0,   // Vmax [V]
    2.0,   // Imax [mA]（表示用）
    2.0,   // Xmax [nm]
    2.0,   // Pmax [kPa]
    2.0    // Qmax [nL/µs]
  ];

  const rowH = H / rows.length;
  const cx   = (idx / (V.length - 1)) * W;

  ctx.font = "bold 13px system-ui, sans-serif";
  ctx.textBaseline = "middle";

  rows.forEach((row, r) => {
    const y0 = r * rowH + rowH / 2;

    // baseline
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y0);
    ctx.lineTo(W, y0);
    ctx.stroke();

    // ===== 固定スケール描画 =====
    const scale = (rowH * 0.4) / scales[r];

    ctx.strokeStyle = colors[r];
    ctx.lineWidth = 2;
    ctx.beginPath();
    row.forEach((v, i) => {
      const xPos = (i / (row.length - 1)) * W;
      const yPos = y0 - v * scale;
      i === 0 ? ctx.moveTo(xPos, yPos) : ctx.lineTo(xPos, yPos);
    });
    ctx.stroke();

    // label
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000";
    ctx.strokeText(labels[r], 10, y0 - rowH * 0.35);
    ctx.fillStyle = colors[r];
    ctx.fillText(labels[r], 10, y0 - rowH * 0.35);

    // cursor point
    const cy = y0 - row[idx] * scale;
    ctx.fillStyle = colors[r];
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // time cursor
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, H);
  ctx.stroke();
}
