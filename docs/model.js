import { DT, N, gains } from "./params.js";

export function simulate() {
  const t=[], V=[], I=[], x=[], P=[], Q=[];

  for (let i=0;i<N;i++) {
    const ti=i*DT;
    t.push(ti);

    const v = (ti>5e-6 && ti<15e-6)?1:0;
    V.push(v*gains.V);

    const ii = (ti>6e-6 && ti<16e-6)?0.8:0;
    I.push(ii*gains.I);

    const xx = (ti>8e-6)?(1-Math.exp(-(ti-8e-6)/5e-6)):0;
    x.push(xx*gains.x);

    const pp = (ti>12e-6)?Math.sin((ti-12e-6)*2e5):0;
    P.push(pp*gains.P);

    const qq = (ti>18e-6)?Math.max(0,pp):0;
    Q.push(qq*gains.Q);
  }
  return {t,V,I,x,P,Q};
}
