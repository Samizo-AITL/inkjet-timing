export function draw(ctx, data, idx) {
  const { V, I, x, P, Q } = data;
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;

  ctx.clearRect(0, 0, W, H);

  const rows   = [V, I, x, P, Q];
  const colors = ["#3fa9f5", "#3fa9f5", "#f5a623", "#f5a623", "#7ed321"];
  const labels = ["V(t)", "I(t)", "Δx(t)", "P(t)", "Q(t)"];

  const rowH = H / rows.length;
  const cx   = (idx / (V.length - 1)) * W;

  ctx.font = "bold 13px system-ui, sans-serif";
  ctx.textBaseline = "middle";

  const Y_MARGIN = 0.15;   // ← 15% マージン
  const AMP_RATIO = 0.5;  // 行高さに対する最大振幅

  /* ===== 各波形 ===== */
  rows.forEach((row, r) => {
    const y0 = r * rowH + rowH / 2;

    /* --- min / max 計算 --- */
    const vMinRaw = Math.min(...row);
    const vMaxRaw = Math.max(...row);
    const vSpan   = vMaxRaw - vMinRaw || 1;

    const vMin = vMinRaw - vSpan * Y_MARGIN;
    const vMax = vMaxRaw + vSpan * Y_MARGIN;

    const scale = (rowH * AMP_RATIO) / (vMax - vMin);

    /* --- 基準線 --- */
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y0);
    ctx.lineTo(W, y0);
    ctx.stroke();

    /* --- 波形 --- */
    ctx.strokeStyle = colors[r];
    ctx.lineWidth = 2;
    ctx.beginPath();

    row.forEach((v, i) => {
      const xPos = (i / (row.length - 1)) * W;
      const yPos = y0 - (v - (vMin + vMax) / 2) * scale;
      i === 0 ? ctx.moveTo(xPos, yPos) : ctx.lineTo(xPos, yPos);
    });

    ctx.stroke();

    /* --- ラベル --- */
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000";
    ctx.strokeText(labels[r], 10, y0 - rowH * 0.35);

    ctx.fillStyle = colors[r];
    ctx.fillText(labels[r], 10, y0 - rowH * 0.35);

    /* --- カーソル交点 --- */
    const v = row[idx];
    const cy = y0 - (v - (vMin + vMax) / 2) * scale;

    ctx.fillStyle = colors[r];
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  /* ===== 時間カーソル ===== */
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, H);
  ctx.stroke();
}
