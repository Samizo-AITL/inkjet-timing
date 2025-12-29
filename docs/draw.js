export function draw(ctx, data, idx) {
  const { V, I, x, P, Q } = data;
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;

  ctx.clearRect(0, 0, W, H);

  const COLORS = {
    V: "#3fa9f5",
    I: "#3fa9f5",
    x: "#f5a623",
    P: "#f5a623",
    Q: "#7ed321",
    grid: "#222",
    label: "#888",
    cursor: "#ffffff"
  };

  const rows = [
    { key: "V", data: V, label: "V(t)" },
    { key: "I", data: I, label: "I(t)" },
    { key: "x", data: x, label: "Δx(t)" },
    { key: "P", data: P, label: "P(t)" },
    { key: "Q", data: Q, label: "Q(t)" }
  ];

  const rowH = H / rows.length;
  const cx = (idx / (V.length - 1)) * W;

  rows.forEach((row, r) => {
    const y0 = r * rowH + rowH / 2;

    // baseline
    ctx.strokeStyle = COLORS.grid;
    ctx.beginPath();
    ctx.moveTo(0, y0);
    ctx.lineTo(W, y0);
    ctx.stroke();

    // waveform
    ctx.strokeStyle = COLORS[row.key];
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    row.data.forEach((v, i) => {
      const xp = (i / (row.data.length - 1)) * W;
      const yp = y0 - v * rowH * 0.4;
      i === 0 ? ctx.moveTo(xp, yp) : ctx.lineTo(xp, yp);
    });
    ctx.stroke();

    // label
    ctx.fillStyle = COLORS.label;
    ctx.fillText(row.label, 8, y0 - rowH * 0.35);

    // ★ index マーカー
    const vNow = row.data[idx];
    const yNow = y0 - vNow * rowH * 0.4;
    ctx.fillStyle = COLORS[row.key];
    ctx.beginPath();
    ctx.arc(cx, yNow, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // ★ 白線 = index カーソル
  ctx.strokeStyle = COLORS.cursor;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, H);
  ctx.stroke();
}
