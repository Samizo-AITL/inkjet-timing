import { gains } from "./params.js";

/*
  FINAL causal inkjet model (minimal, correct)
  V(t) -> Δx(t) -> P(t) -> Q(t)
*/

export function simulate() {
  const N = 600;
  const tEnd = 30e-6;              // 30 µs
  const dt = tEnd / (N - 1);       // [s]

  const t = new Array(N);
  const V = new Array(N);
  const I = new Array(N);
  const x = new Array(N);
  const P = new Array(N);
  const Q = new Array(N);

  /* =========================
     Time axis
     ========================= */
  for (let i = 0; i < N; i++) {
    t[i] = i * dt;
  }

  /* =========================
     Drive voltage (UNCHANGED)
     ========================= */
  const Vamp = gains.V;

  for (let i = 0; i < N; i++) {
    const ti = t[i] * 1e6; // µs
    if (ti < 5) V[i] = 0;
    else if (ti < 10) V[i] = Vamp;
    else if (ti < 12) V[i] = -0.4 * Vamp;
    else V[i] = 0;
  }

  /* =========================
     Current (display only)
     ========================= */
  for (let i = 1; i < N; i++) {
    I[i] = 0.5 * gains.I * (V[i] - V[i - 1]) / dt * 1e-6;
  }
  I[0] = 0;

  /* =========================
     Δx(t): piezo mechanical response
     ========================= */
  const tauX = 2e-6; // 2 µs
  let xState = 0;

  for (let i = 0; i < N; i++) {
    const dx = (gains.x * V[i] - xState) * (dt / tauX);
    xState += dx;
    x[i] = xState;
  }

  /* =========================
     P(t): cavity pressure
     ========================= */
  const tauP = 3e-6; // 3 µs
  let pState = 0;

  for (let i = 0; i < N; i++) {
    const dp = (gains.P * x[i] - pState) * (dt / tauP);
    pState += dp;
    P[i] = pState;
  }

  /* =========================
     Q(t): flow response
     ========================= */
  const tauQ = 5e-6; // 5 µs
  let qState = 0;

  for (let i = 0; i < N; i++) {
    const dq = (gains.Q * P[i] - qState) * (dt / tauQ);
    qState += dq;
    Q[i] = qState;
  }

  return { t, V, I, x, P, Q };
}
