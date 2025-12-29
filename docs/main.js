function resize() {
  canvas.width  = window.innerWidth - 260; // 右余白
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);
