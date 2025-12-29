import { DT, N, gains } from "./params.js";

export function simulate() {
  const t = [];
  const V = [], I = [], x = [], P = [], Q = [];

  for (let i = 0; i < N; i++) {
    const ti = i * DT;
    t.push(ti);

    // --- Drive voltage (rect pulse) ---
    const v = (ti > 5e-6 && ti < 15e-6) ? 1.0 : 0.0;
    V.push(v * gains.V);

    // --- Current (derivative-like delay) ---
    const i_t = (ti > 6e-6 && ti < 16e-6) ? 0.8 : 0.0;
    I.push(i_t * gains.I);

    // --- Piezo displacement ---
    const x_t = (ti > 8e-6) ? (1 - Math.exp(-(ti - 8e-6) / 5e-6)) : 0.0;
    x.push(x_t * gains.x);

    // --- Pressure ---
    const p_t = (ti > 12e-6) ? Math.sin((ti - 12e-6) * 2e5) : 0.0;
    P.push(p_t * gains.P);

    // --- Flow rate ---
    const q_t = (ti > 18e-6) ? Math.max(0, p_t) : 0.0;
    Q.push(q_t * gains.Q);
  }

  return { t, V, I, x, P, Q };
}
