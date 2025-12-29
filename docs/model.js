import { gains } from "./params.js";

/*
  Simple causal inkjet model:
    V(t) -> Δx(t) -> P(t) -> Q(t)
*/

export function simulate() {
  const N = 600;
  const tEnd = 30e-6; // 30 µs
  const dt = tEnd / (N - 1);

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
     Drive voltage waveform
     （※ ここは一切変更していない）
     ========================= */
  const Vamp = 1.0; // ← 波形形状用（固定）

  for (let i = 0; i < N; i++) {
    const ti = t[i] * 1e6; // µs

    if (ti < 5) {
      V[i] = 0;
    } else if (ti < 10) {
      V[i] = Vamp;
    } else if (ti < 12) {
      V[i] = -0.4 * Vamp;
    } else {
      V[i] = 0;
    }
  }

  /* =========================
     Current (display only)
     ========================= */
  for (let i = 1; i < N; i++) {
    I[i] = gains.I * (V[i] - V[i - 1]) / dt * 1e-6;
  }
  I[0] = 0;

  /* =========================
     Piezo displacement Δx(t)
     ========================= */
  const kx = gains.x; // [nm/V]
  let xState = 0;

  for (let i = 0; i < N; i++) {
    // ★ Voltage Amplitude を「駆動強度」としてここで掛ける
    xState += (kx * gains.V * V[i] - xState) * 0.05;
    x[i] = xState;
  }

  /* =========================
     Cavity pressure P(t)
     ========================= */
  const kp = gains.P; // [kPa/nm]
  let pState = 0;

  for (let i = 0; i < N; i++) {
    pState += (kp * x[i] - pState) * 0.05;
    P[i] = pState;
  }

  /* =========================
     Flow rate Q(t)
     ========================= */
  const kq = gains.Q; // [nL/µs/kPa]
  let qState = 0;

  for (let i = 0; i < N; i++) {
    qState += (kq * P[i] - qState) * 0.05;
    Q[i] = qState;
  }

  return { t, V, I, x, P, Q };
}
