import { setGain } from "./params.js";
import { simulate } from "./model.js";
import { draw } from "./draw.js";

window.addEventListener("DOMContentLoaded",()=>{
  const canvas=document.getElementById("canvas");
  const ctx=canvas.getContext("2d");

  function resize(){
    canvas.width=window.innerWidth-300;
    canvas.height=window.innerHeight;
  }
  resize(); window.addEventListener("resize",resize);

  let data=simulate();
  const slider=document.getElementById("time");
  slider.min=0;
  slider.max=data.t.length-1;
  slider.step=1;

  // ★ 初期位置をイベント中に
  slider.value=Math.floor(data.t.length*0.35);

  function update(){
    const idx=+slider.value;
    draw(ctx,data,idx);

    document.getElementById("tv").textContent=(data.t[idx]*1e6).toFixed(1);
    document.getElementById("vV").textContent=data.V[idx].toFixed(2);
    document.getElementById("vI").textContent=data.I[idx].toFixed(2);
    document.getElementById("vx").textContent=data.x[idx].toFixed(2);
    document.getElementById("vP").textContent=data.P[idx].toFixed(2);
    document.getElementById("vQ").textContent=data.Q[idx].toFixed(2);
  }

  update();
  slider.addEventListener("input",update);

  document.querySelectorAll("input[data-gain]").forEach(el=>{
    el.addEventListener("input",e=>{
      setGain(e.target.dataset.gain,+e.target.value);
      data=simulate();
      update();
    });
  });
});
