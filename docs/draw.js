export function draw(ctx, data, cursorT) {
  const {t,V,I,x,P,Q}=data;
  const W=ctx.canvas.width;
  const H=ctx.canvas.height;

  ctx.clearRect(0,0,W,H);

  const rows=[V,I,x,P,Q];
  const labels=["V(t)","I(t)","Δx(t)","P(t)","Q(t)"];
  const rowH=H/rows.length;

  rows.forEach((row,r)=>{
    const y0=r*rowH+rowH/2;

    ctx.strokeStyle="#222";
    ctx.beginPath();
    ctx.moveTo(0,y0);
    ctx.lineTo(W,y0);
    ctx.stroke();

    ctx.strokeStyle="#0af";
    ctx.beginPath();
    row.forEach((v,i)=>{
      const xp=i/row.length*W;
      const yp=y0-v*rowH*0.4;
      i?ctx.lineTo(xp,yp):ctx.moveTo(xp,yp);
    });
    ctx.stroke();

    ctx.fillStyle="#888";
    ctx.fillText(labels[r],8,y0-6);
  });

  const cx=cursorT/t[t.length-1]*W;
  ctx.strokeStyle="#fff";
  ctx.beginPath();
  ctx.moveTo(cx,0);
  ctx.lineTo(cx,H);
  ctx.stroke();
}
