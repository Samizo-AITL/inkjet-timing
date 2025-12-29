// draw.js — Oscilloscope-style renderer (FULL)

export function drawStack(ctx, stack, ui){
  const { canvas } = ctx;
  const W = canvas.width;
  const H = canvas.height;

  /* ===== Layout ===== */
  const padL = 70, padR = 20, padT = 20, padB = 20;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const rows = [
    { key:"V", label:"V(t)  [drive]",      color:"#00ff88" },
    { key:"I", label:"I(t)  [current]",    color:"#ffd400" },
    { key:"x", label:"Δx(t) [mechanical]", color:"#ff8800" },
    { key:"P", label:"P(t)  [pressure]",   color:"#ff4d4d" },
    { key:"Q", label:"Q(t)  [ink flow]",   color:"#4da6ff" },
  ];
  const nRow = rows.length;
  const rowH = plotH / nRow;

  /* ===== Persistence background ===== */
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.fillRect(0, 0, W, H);

  /* ===== Grid ===== */
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#111";
  for(let x = padL; x <= padL + plotW; x += plotW / 10){
    ctx.beginPath();
    ctx.moveTo(x, padT);
    ctx.lineTo(x, padT + plotH);
    ctx.stroke();
  }
  for(let y = padT; y <= padT + plotH; y += plotH / 10){
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(padL + plotW, y);
    ctx.stroke();
  }

  ctx.font = "12px ui-monospace";
  ctx.fillStyle = "#aaa";

  /* ===== Time window (scrolling) ===== */
  const t = stack.t;
  const T = t[t.length - 1];
  const win_us = T * 0.25;              // visible window (25%)
  const t0 = Math.max(0, ui.cursor_us - win_us);
  const t1 = ui.cursor_us;

  const i0 = indexAtTime(t, t0);
  const i1 = indexAtTime(t, t1);

  /* ===== Draw each row ===== */
  for(let r = 0; r < nRow; r++){
    const row = rows[r];
    const yBase = padT + r * rowH;
    const yMid  = yBase + rowH / 2;

    // zero line
    ctx.strokeStyle = "#222";
    ctx.beginPath();
    ctx.moveTo(padL, yMid);
    ctx.lineTo(padL + plotW, yMid);
    ctx.stroke();

    // label
    ctx.fillStyle = "#aaa";
    ctx.fillText(row.label, 10, yBase + 14);

    // waveform
    ctx.strokeStyle = row.color;
    ctx.lineWidth = 2.0;
    ctx.beginPath();

    for(let i = i0; i <= i1; i++){
      const tx = (t[i] - t0) / (t1 - t0);
      const x  = padL + tx * plotW;
      const y  = yMid - stack[row.key][i] * rowH * 0.42;
      if(i === i0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  /* ===== Time cursor (right edge) ===== */
  ctx.strokeStyle = "#00ffff";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(padL + plotW, padT);
  ctx.lineTo(padL + plotW, padT + plotH);
  ctx.stroke();
}

/* ===== Helper ===== */
function indexAtTime(tArr, t){
  let lo = 0, hi = tArr.length - 1;
  while(lo < hi){
    const m = (lo + hi) >> 1;
    if(tArr[m] < t) lo = m + 1;
    else hi = m;
  }
  return lo;
}
