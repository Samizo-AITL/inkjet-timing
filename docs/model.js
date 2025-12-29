import { gains } from "./params.js";

/*
  FINAL simple inkjet model (educational, deterministic)
  V(t) -> Δx(t) -> P(t) -> Q(t)
*/

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

  /* ---- time axis ---- */
  for (let i = 0; i < N; i++) {
    t[i] = i * dt;
  }

  /* ---- drive voltage (UNCHANGED MEANING) ---- */
  const Vamp = gains.V;

  for (let i = 0; i < N; i++) {
    const ti = t[i] * 1e6; // µs
    if (ti < 5) V[i] = 0;
    else if (ti < 10) V[i] = Vamp;
    else if (ti < 12) V[i] = -0.4 * Vamp;
    else V[i] = 0;
  }

  /* ---- current (display only) ---- */
  for (let i = 1; i < N; i++) {
    I[i] = gains.I * (V[i] - V[i - 1]) / dt * 1e-6;
  }
  I[0] = 0;

  /* ---- Δx(t): DIRECT coupling ---- */
  for (let i = 0; i < N; i++) {
    x[i] = gains.x * V[i];
  }

  /* ---- P(t): DIRECT coupling ---- */
  for (let i = 0; i < N; i++) {
    P[i] = gains.P * x[i];
  }

  /* ---- Q(t): DIRECT coupling ---- */
  for (let i = 0; i < N; i++) {
    Q[i] = gains.Q * P[i];
  }

  return { t, V, I, x, P, Q };
}
