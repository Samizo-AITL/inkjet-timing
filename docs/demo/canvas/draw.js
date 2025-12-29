// draw.js
export function drawStack(ctx, stack, ui) {
  const { canvas } = ctx;
  const W = canvas.width;
  const H = canvas.height;

  const padL = 70, padR = 20, padT = 20, padB = 20;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const rows = [
    { key: "V", label: "V(t)  [drive]",      color: "#00ff88" },
    { key: "I", label: "I(t)  [current]",    color: "#ffd400" },
    { key: "x", label: "Δx(t) [mechanical]", color: "#ff8800" },
    { key: "P", label: "P(t)  [pressure]",   color: "#ff4d4d" },
    { key: "Q", label: "Q(t)  [ink flow]",   color: "#4da6ff" },
  ];

  const rowH = plotH / rows.length;

  // Background
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, W, H);

  ctx.font = "12px ui-monospace";
  ctx.lineWidth = 1;

  for (let r = 0; r < rows.length; r++) {
    const y0 = padT + r * rowH;
    const mid = y0 + rowH / 2;

    // Zero line
    ctx.strokeStyle = "#202020";
    ctx.beginPath();
    ctx.moveTo(padL, mid);
    ctx.lineTo(padL + plotW, mid);
    ctx.stroke();

    // Label
    ctx.fillStyle = "#aaaaaa";
    ctx.fillText(rows[r].label, 10, y0 + 14);

    // Waveform
    ctx.strokeStyle = rows[r].color;
    ctx.beginPath();
    for (let i = 0; i < stack.t.length; i++) {
      const x = padL + plotW * i / (stack.t.length - 1);
      const y = mid - stack[rows[r].key][i] * (rowH * 0.4);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Time cursor
  const t = stack.t;
  const xc = padL + plotW * ui.cursor_us / t[t.length - 1];
  ctx.strokeStyle = "#00ffff";
  ctx.beginPath();
  ctx.moveTo(xc, padT);
  ctx.lineTo(xc, padT + plotH);
  ctx.stroke();
}
