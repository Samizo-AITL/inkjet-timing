const M = { left: 80, right: 10, top: 10, bottom: 10 };

const plotW = W - M.left - M.right;
const rowH  = plotH / channels.length;

channels.forEach((ch, i) => {
  const y0 = M.top + i * rowH;
  const yMid = y0 + rowH / 2;

  // label
  ctx.fillStyle = "#9aa3ad";
  ctx.textAlign = "right";
  ctx.fillText(ch.label, M.left - 8, yMid);

  // waveform
  ctx.beginPath();
  data[ch.key].forEach((v, k) => {
    const x = M.left + (k / (N - 1)) * plotW;
    const y = yMid - v * ch.scale;
    k === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();
});
