// draw.js — Fixed waveform + time cursor (FULL)

export function drawStack(ctx, stack, ui){
  const { canvas } = ctx;
  const W = canvas.width;
  const H = canvas.height;

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
  const t = stack.t;
  const tEnd = t[t.length - 1];

  /* ===== clear (solid black) ===== */
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);

  /* ===== grid ===== */
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#111";
  for(let i=0;i<=10;i++){
    const x = padL + plotW * i / 10;
    ctx.beginPath();
    ctx.moveTo(x, padT);
    ctx.lineTo(x, padT + plotH);
    ctx.stroke();
  }
  for(let i=0;i<=nRow;i++){
    const y = padT + rowH * i;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(padL + plotW, y);
    ctx.stroke();
  }

  ctx.font = "12px ui-monospace";
  ctx.fillStyle = "#aaa";

  /* ===== waveforms ===== */
  for(let r=0;r<nRow;r++){
    const row = rows[r];
    const y0 = padT + r * rowH;
    const yMid = y0 + rowH/2;

    // zero line
    ctx.strokeStyle = "#222";
    ctx.beginPath();
    ctx.moveTo(padL, yMid);
    ctx.lineTo(padL + plotW, yMid);
    ctx.stroke();

    // label
    ctx.fillStyle = "#aaa";
    ctx.fillText(row.label, 10, y0 + 14);

    // waveform
    ctx.strokeStyle = row.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for(let i=0;i<t.length;i++){
      const x = padL + plotW * (t[i]/tEnd);
      const y = yMid - stack[row.key][i] * rowH * 0.42;
      if(i===0) ctx.moveTo(x,y);
      else ctx.lineTo(x,y);
    }
    ctx.stroke();
  }

  /* ===== time cursor ===== */
  const xc = padL + plotW * (ui.cursor_us / tEnd);
  ctx.strokeStyle = "#00ffff";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(xc, padT);
  ctx.lineTo(xc, padT + plotH);
  ctx.stroke();
}
