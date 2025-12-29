// draw.js
// Oscilloscope-style stacked waveform renderer
// Designed for Inkjet Full-stack Timing visualization

export function drawStack(ctx, stack, opts = {}) {
  const {
    cursor_us = null
  } = opts;

  const W = ctx.canvas.width;
  const H = ctx.canvas.height;

  // ---- layout ----
  const M = {
    left: 90,     // label area
    right: 20,
    top: 20,
    bottom: 20
  };

  const channels = [
    { key: "V", label: "V(t) [drive]",      color: "#00ff9c", scale: 1.0 },
    { key: "I", label: "I(t) [current]",    color: "#ffd400", scale: 1.0 },
    { key: "X", label: "Δx(t) [mechanical]",color: "#ff9f0a", scale: 1.0 },
    { key: "P", label: "P(t) [pressure]",   color: "#ff4d4d", scale: 1.0 },
    { key: "Q", label: "Q(t) [flow]",       color: "#4dd2ff", scale: 1.0 }
  ];

  const plotW = W - M.left - M.right;
  const plotH = H - M.top - M.bottom;
  const rowH  = plotH / channels.length;

  // ---- clear ----
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);

  // ---- grid ----
  ctx.strokeStyle = "#1f1f1f";
  ctx.lineWidth = 1;

  // vertical grid (time)
  for (let i = 0; i <= 10; i++) {
    const x = M.left + (i / 10) * plotW;
    ctx.beginPath();
    ctx.moveTo(x, M.top);
    ctx.lineTo(x, H - M.bottom);
    ctx.stroke();
  }

  // horizontal grid (per channel)
  channels.forEach((_, i) => {
    const y = M.top + i * rowH;
    ctx.beginPath();
    ctx.moveTo(M.left, y);
    ctx.lineTo(W - M.right, y);
    ctx.stroke();
  });

  // ---- waveforms ----
  const N = stack.t.length;

  ctx.font = "12px system-ui";
  ctx.textBaseline = "middle";

  channels.forEach((ch, i) => {
    const data = stack[ch.key];
    if (!data) return;

    const y0 = M.top + i * rowH;
    const yMid = y0 + rowH / 2;

    // label
    ctx.fillStyle = "#9aa3ad";
    ctx.textAlign = "right";
    ctx.fillText(ch.label, M.left - 10, yMid);

    // waveform
    ctx.strokeStyle = ch.color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let k = 0; k < N; k++) {
      const x = M.left + (k / (N - 1)) * plotW;
      const y = yMid - data[k] * (rowH * 0.35) * ch.scale;
      if (k === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  });

  // ---- time cursor ----
  if (cursor_us !== null) {
    const tMax = stack.t[stack.t.length - 1];
    const tx = M.left + (cursor_us / tMax) * plotW;

    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(tx, M.top);
    ctx.lineTo(tx, H - M.bottom);
    ctx.stroke();
  }
}
