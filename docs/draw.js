export function drawStack(ctx, stack, gains, cursor) {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, W, H);

  const channels = [
    { k: "V", y: 80,  c: "yellow", l: "V(t)", s: 1 },
    { k: "I", y: 180, c: "cyan",   l: "I(t)", s: 1 },
    { k: "x", y: 280, c: "orange", l: "Δx(t)", s: 1 },
    { k: "P", y: 380, c: "red",    l: "P(t)", s: 1 },
    { k: "Q", y: 480, c: "lime",   l: "Q(t)", s: 1 },
  ];

  // grid
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  for (let i = 0; i <= 10; i++) {
    const x = (i / 10) * W;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }

  channels.forEach(ch => {
    const d = stack[ch.k];
    const g = gains[ch.k] * ch.s;

    // zero line
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.beginPath();
    ctx.moveTo(0, ch.y);
    ctx.lineTo(W, ch.y);
    ctx.stroke();

    // waveform
    ctx.strokeStyle = ch.c;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < d.length; i++) {
      const x = (i / (d.length - 1)) * W;
      const y = ch.y - d[i] * g;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.fillStyle = "#aaa";
    ctx.fillText(ch.l, 10, ch.y - 8);
  });

  // time cursor
  const cx = (cursor / (stack.V.length - 1)) * W;
  ctx.strokeStyle = "rgba(0,255,0,0.7)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, H);
  ctx.stroke();
}
