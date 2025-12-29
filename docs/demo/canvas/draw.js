// draw.js
// Oscilloscope-style stacked waveform renderer
// Channels: V, I, X, P, Q  (single time axis)

export function drawStack(ctx, stack, opts = {}) {
  const {
    cursor_us = null,
    grid = true
  } = opts;

  const W = ctx.canvas.width / (window.devicePixelRatio || 1);
  const H = ctx.canvas.height / (window.devicePixelRatio || 1);

  ctx.clearRect(0, 0, W, H);

  // ----- layout -----
  const channels = [
    { key: "V", label: "V(t) [drive]",       color: "#00ff9c" },
    { key: "I", label: "I(t) [current]",     color: "#ffd400" },
    { key: "X", label: "Δx(t) [mechanical]", color: "#ff9f0a" },
    { key: "P", label: "P(t) [pressure]",    color: "#ff453a" },
    { key: "Q", label: "Q(t) [flow]",        color: "#64d2ff" } // ★これが欠けていた
  ];

  const PAD_L = 52;
  const PAD_R = 10;
  const PAD_T = 10;
  const PAD_B = 10;

  const plotH = H - PAD_T - PAD_B;
  const rowH  = plotH / channels.length;

  const T = stack.t; // time array [µs]

  // ----- helpers -----
  function drawGrid(y0) {
    ctx.strokeStyle = "#1f2329";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = y0 + (i / 4) * rowH;
      ctx.beginPath();
      ctx.moveTo(PAD_L, y);
      ctx.lineTo(W - PAD_R, y);
      ctx.stroke();
    }
  }

  function drawWave(y0, data, color) {
    let max = 0;
    for (let v of data) max = Math.max(max, Math.abs(v));
    if (max === 0) max = 1;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i < data.length; i++) {
      const x =
        PAD_L +
        (i / (data.length - 1)) * (W - PAD_L - PAD_R);
      const y =
        y0 + rowH / 2 -
        (data[i] / max) * (rowH * 0.35);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // ----- draw channels -----
  ctx.font = "12px system-ui";
  ctx.textBaseline = "middle";

  channels.forEach((ch, idx) => {
    const y0 = PAD_T + idx * rowH;

    if (grid) drawGrid(y0);

    // label
    ctx.fillStyle = "#9aa3ad";
    ctx.fillText(ch.label, 6, y0 + rowH / 2);

    // waveform
    drawWave(y0, stack[ch.key], ch.color);
  });

  // ----- time cursor -----
  if (cursor_us !== null) {
    const i =
      Math.floor((cursor_us / T[T.length - 1]) * (T.length - 1));
    const x =
      PAD_L +
      (i / (T.length - 1)) * (W - PAD_L - PAD_R);

    ctx.strokeStyle = "#00e5ff";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, PAD_T);
    ctx.lineTo(x, H - PAD_B);
    ctx.stroke();
  }
}
