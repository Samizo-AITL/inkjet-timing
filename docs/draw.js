export function drawStack(ctx, stack, gains) {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, W, H);

  const channels = [
    { key: "V", color: "yellow", label: "V(t)", y: 80 },
    { key: "I", color: "cyan",   label: "I(t)", y: 180 },
    { key: "x", color: "orange", label: "x(t)", y: 280 },
    { key: "P", color: "red",    label: "P(t)", y: 380 },
    { key: "Q", color: "lime",   label: "Q(t)", y: 480 },
  ];

  channels.forEach((ch) => {
    const data = stack[ch.key];
    const gain = gains[ch.key];

    ctx.strokeStyle = ch.color;
    ctx.beginPath();

    for (let i = 0; i < data.length; i++) {
      const x = (i / data.length) * W;
      const y = ch.y - data[i] * gain;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.fillStyle = "#888";
    ctx.fillText(ch.label, 10, ch.y - 10);
  });
}
