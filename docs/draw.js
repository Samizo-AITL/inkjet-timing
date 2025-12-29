export function draw(ctx, data, idx) {
  const { V,I,x,P,Q } = data;
  const W=ctx.canvas.width, H=ctx.canvas.height;

  ctx.clearRect(0,0,W,H);

  const rows=[V,I,x,P,Q];
  const colors=["#3fa9f5","#3fa9f5","#f5a623","#f5a623","#7ed321"];
  const labels=["V(t)","I(t)","Δx(t)","P(t)","Q(t)"];
  const rowH=H/rows.length;
  const cx=(idx/(V.length-1))*W;

  rows.forEach((row,r)=>{
    const y0=r*rowH+rowH/2;
    ctx.strokeStyle="#222";
    ctx.beginPath(); ctx.moveTo(0,y0); ctx.lineTo(W,y0); ctx.stroke();

    ctx.strokeStyle=colors[r];
    ctx.beginPath();
    row.forEach((v,i)=>{
      const x=i/(row.length-1)*W;
      const y=y0-v*rowH*0.4;
      i?ctx.lineTo(x,y):ctx.moveTo(x,y);
    });
    ctx.stroke();

    ctx.fillStyle="#888";
    ctx.fillText(labels[r],8,y0-8);

    ctx.fillStyle=colors[r];
    ctx.beginPath();
    ctx.arc(cx,y0-row[idx]*rowH*0.4,4,0,Math.PI*2);
    ctx.fill();
  });

  ctx.strokeStyle="#fff";
  ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(cx,0); ctx.lineTo(cx,H); ctx.stroke();
}
