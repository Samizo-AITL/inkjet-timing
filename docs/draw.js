export function drawStack(ctx, stack, gains, cursor) {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  ctx.clearRect(0, 0, W, H);

  const channels = [
    { k: "V", y: 80,  c: "yellow", l: "V(t)" },
    { k: "I", y: 180, c: "cyan",   l: "I(t)" },
    { k: "x", y: 280, c: "orange", l: "Δx(t)" },
    { k: "P", y: 380, c: "red",    l: "P(t)" },
    { k: "Q", y: 480, c: "lime",   l: "Q(t)" },
  ];

  channels.forEach(ch => {
    const d = stack[ch.k];
    ctx.strokeStyle = ch.c;
    ctx.beginPath();
    for (let i = 0; i < d.length; i++) {
      const x = (i / d.length) * W;
      const y = ch.y - d[i] * gains[ch.k];
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = "#888";
    ctx.fillText(ch.l, 10, ch.y - 8);
  });

  // 時間カーソル
  const cx = (cursor / stack.V.length) * W;
  ctx.strokeStyle = "#0f0";
  ctx.beginPath();
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, H);
  ctx.stroke();
}
