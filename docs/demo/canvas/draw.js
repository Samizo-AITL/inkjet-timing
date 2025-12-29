// draw.js — Fixed waveform + time cursor
// FINAL: Per-channel auto vertical scaling (true oscilloscope behavior)

export function drawStack(ctx, stack, ui){
  const { canvas } = ctx;
  const W = canvas.width;
  const H = canvas.height;

  /* ===== layout ===== */
  const padL = 70;
  const padR = 20;
  const padT = 10;
  const padB = 10;

  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  /* ===== channels ===== */
  const rows = [
    { key:"V", label:"V(t)  [drive]",      color:"#00ff88", weight:1.0 },
    { key:"I", label:"I(t)  [current]",    color:"#ffd400", weight:1.0 },
    { key:"x", label:"Δx(t) [mechanical]", color:"#ff8800", weight:1.0 },
    { key:"P", label:"P(t)  [pressure]",   color:"#ff4d4d", weight:1.4 },
    { key:"Q", label:"Q(t)  [ink flow]",   color:"#4da6ff", weight:1.4 },
  ];

  const sumW = rows.reduce((s,r)=>s+r.weight,0);

  const t = stack.t;
  const tEnd = t[t.length - 1];

  /* ===== clear ===== */
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);

  /* ===== vertical grid ===== */
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#111";
  for(let i=0;i<=10;i++){
    const x = padL + plotW * i / 10;
    ctx.beginPath();
    ctx.moveTo(x, padT);
    ctx.lineTo(x, padT + plotH);
    ctx.stroke();
  }

  ctx.font = "12px ui-monospace";
  let yCursor = padT;

  /* ===== draw each channel ===== */
  for(const row of rows){
    const rowH = plotH * row.weight / sumW;
    const yMid = yCursor + rowH / 2;

    // separator
    ctx.strokeStyle = "#111";
    ctx.beginPath();
    ctx.moveTo(padL, yCursor);
    ctx.lineTo(padL + plotW, yCursor);
    ctx.stroke();

    // zero line
    ctx.strokeStyle = "#222";
    ctx.beginPath();
    ctx.moveTo(padL, yMid);
    ctx.lineTo(padL + plotW, yMid);
    ctx.stroke();

    // label
    ctx.fillStyle = "#aaa";
    ctx.fillText(row.label, 10, yCursor + 14);

    // ---- AUTO SCALE (core fix) ----
    let maxAbs = 1e-9;
    const data = stack[row.key];
    for(let i=0;i<data.length;i++){
      const a = Math.abs(data[i]);
      if(a > maxAbs) maxAbs = a;
    }
    const scale = (rowH * 0.45) / maxAbs; // always fit

    // waveform
    ctx.strokeStyle = row.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for(let i=0;i<t.length;i++){
      const x = padL + plotW * (t[i] / tEnd);
      const y = yMid - data[i] * scale;
      if(i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    yCursor += rowH;
  }

  // bottom border
  ctx.strokeStyle = "#111";
  ctx.beginPath();
  ctx.moveTo(padL, padT + plotH);
  ctx.lineTo(padL + plotW, padT + plotH);
  ctx.stroke();

  /* ===== time cursor ===== */
  const xc = padL + plotW * (ui.cursor_us / tEnd);
  ctx.strokeStyle = "#00ffff";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(xc, padT);
  ctx.lineTo(xc, padT + plotH);
  ctx.stroke();
}
