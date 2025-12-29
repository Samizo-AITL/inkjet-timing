// docs/demo/canvas/draw.js
// Draw stacked waveforms on a single time axis + causality cursor.

export function drawStack(ctx, stack, ui) {
  const { canvas } = ctx;
  const W = canvas.width;
  const H = canvas.height;

  // layout
  const padL = 80;
  const padR = 22;
  const padT = 18;
  const padB = 18;

  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const rows = [
    { key: "V", label: "V(t)  [drive]" },
    { key: "I", label: "I(t)  [response]" },
    { key: "x", label: "Δx(t) [mech]" },
    { key: "P", label: "P(t)  [pressure]" },
    { key: "Q", label: "Q(t)  [+out / -in]" },
  ];

  const rowH = plotH / rows.length;

  // clear
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, W, H);

  // frame
  ctx.strokeStyle = "#d0d7de";
  ctx.lineWidth = 1;
  roundRect(ctx, 6, 6, W - 12, H - 12, 10);
  ctx.stroke();

  // axis + plots
  ctx.font = "12px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
  ctx.fillStyle = "#111";
  ctx.strokeStyle = "#d0d7de";
  ctx.lineWidth = 1;

  // time labels
  ctx.fillStyle = "#666";
  ctx.fillText("time [µs]", padL + plotW / 2 - 22, H - 6);

  // draw each row
  for (let r = 0; r < rows.length; r++) {
    const y0 = padT + r * rowH;
    const yMid = y0 + rowH / 2;

    // separator
    if (r > 0) {
      ctx.beginPath();
      ctx.moveTo(padL, y0);
      ctx.lineTo(padL + plotW, y0);
      ctx.stroke();
    }

    // label
    ctx.fillStyle = "#111";
    ctx.fillText(rows[r].label, 14, y0 + 14);

    // zero line
    ctx.strokeStyle = "#e6ebf1";
    ctx.beginPath();
    ctx.moveTo(padL, yMid);
    ctx.lineTo(padL + plotW, yMid);
    ctx.stroke();

    // waveform
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 1.2;
    plotWave(ctx, stack.t, stack[rows[r].key], padL, y0 + 6, plotW, rowH - 12);
  }

  // causality arrows at left (V→I→x→P→Q)
  const xArrow = padL - 28;
  ctx.strokeStyle = "#111";
  ctx.fillStyle = "#111";
  for (let r = 0; r < rows.length - 1; r++) {
    const yA = padT + r * rowH + rowH / 2;
    const yB = padT + (r + 1) * rowH + rowH / 2;
    arrow(ctx, xArrow, yA, xArrow, yB);
  }
  ctx.fillStyle = "#666";
  ctx.fillText("causal", xArrow - 14, padT + 10);

  // cursor (shared time)
  const t = stack.t;
  const tMin = t[0];
  const tMax = t[t.length - 1];
  const tc = ui.cursor_us;

  const xc = padL + (plotW * (tc - tMin)) / (tMax - tMin);
  ctx.strokeStyle = "#0969da";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(xc, padT);
  ctx.lineTo(xc, padT + plotH);
  ctx.stroke();

  // show reflection delay marker if enabled
  if (ui.showDelay) {
    const xd = padL + (plotW * (tc - ui.refl_delay_us - tMin)) / (tMax - tMin);
    ctx.strokeStyle = "#ff7b72";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(xd, padT);
    ctx.lineTo(xd, padT + plotH);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#666";
    ctx.fillText("delay", xd + 4, padT + 12);
  }

  // HUD
  ctx.fillStyle = "#111";
  ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";
  ctx.fillText(`t = ${tc.toFixed(2)} µs`, padL + 6, padT + 14);
}

// ---- drawing helpers ----
function plotWave(ctx, t, y, x, yTop, w, h) {
  const n = t.length;
  const yMid = yTop + h / 2;

  // map y in [-1,1] -> pixels
  const amp = (h / 2) * 0.90;

  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const px = x + (w * i) / (n - 1);
    const py = yMid - y[i] * amp;
    if (i === 0) ctx.move
