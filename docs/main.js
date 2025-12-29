import { TIME_VIEW, DT, setGain } from "./params.js";
import { simulate } from "./model.js";
import { draw } from "./draw.js";

window.addEventListener("DOMContentLoaded",()=>{
  const canvas=document.getElementById("canvas");
  const ctx=canvas.getContext("2d");

  function resize(){
    canvas.width=window.innerWidth-260;
    canvas.height=window.innerHeight;
  }
  resize();
  window.addEventListener("resize",resize);

  const slider=document.getElementById("time");
  slider.min=0;
  slider.max=TIME_VIEW;
  slider.step=DT;
  slider.value=0;

  let data=simulate();

  function update(){
    draw(ctx,data,parseFloat(slider.value));
  }
  update();

  slider.addEventListener("input",update);

  document.querySelectorAll("input[data-gain]").forEach(el=>{
    el.addEventListener("input",e=>{
      setGain(e.target.dataset.gain,parseFloat(e.target.value));
      data=simulate();
      update();
    });
  });
});
