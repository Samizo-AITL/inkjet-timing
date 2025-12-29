import { DT, N, gains } from "./params.js";

export function simulate() {
  const t=[], V=[], I=[], x=[], P=[], Q=[];

  for (let i=0;i<N;i++) {
    const ti=i*DT;
    t.push(ti);

    const v = (ti>5e-6 && ti<15e-6)?1:0;
    const ii = (ti>6e-6 && ti<16e-6)?0.8:0;
    const xx = (ti>8e-6)?(1-Math.exp(-(ti-8e-6)/5e-6)):0;
    const pp = (ti>12e-6)?Math.sin((ti-12e-6)*2e5):0;
    const qq = (ti>18e-6)?Math.max(0,pp):0;

    V.push(v*gains.V);
    I.push(ii*gains.I);
    x.push(xx*gains.x);
    P.push(pp*gains.P);
    Q.push(qq*gains.Q);
  }
  return {t,V,I,x,P,Q};
}
