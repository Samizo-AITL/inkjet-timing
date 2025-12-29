import { gains } from "./params.js";

export function simulate() {
  const N = 600;
  const tEnd = 30e-6;
  const dt = tEnd / (N - 1);

  const t = new Array(N);
  const V = new Array(N);
  const I = new Array(N);
  const x = new Array(N);
  const P = new Array(N);
  const Q = new Array(N);

  for (let i = 0; i < N; i++) t[i] = i * dt;

  /* ---- Drive voltage ---- */
  const Vamp = gains.V;
  for (let i = 0; i < N; i++) {
    const ti = t[i] * 1e6;
    if (ti < 5) V[i] = 0;
    else if (ti < 10) V[i] = Vamp;
    else if (ti < 12) V[i] = -0.4 * Vamp;
    else V[i] = 0;
  }

  /* ---- Current (display only) ---- */
  for (let i = 1; i < N; i++) {
    I[i] = gains.I * (V[i] - V[i - 1]) / dt * 1e-6;
  }
  I[0] = 0;

  /* ---- Δx(t) ---- */
  let xState = 0;
  for (let i = 0; i < N; i++) {
    xState += (gains.x * V[i] - xState) * dt * 1e6;
    x[i] = xState;
  }

  /* ---- P(t) ---- */
  let pState = 0;
  for (let i = 0; i < N; i++) {
    pState += (gains.P * x[i] - pState) * dt * 1e6;
    P[i] = pState;
  }

  /* ---- Q(t) ---- */
  let qState = 0;
  for (let i = 0; i < N; i++) {
    qState += (gains.Q * P[i] - qState) * dt * 1e6;
    Q[i] = qState;
  }

  return { t, V, I, x, P, Q };
}
