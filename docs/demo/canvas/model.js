// model.js
import { params } from "./params.js";

export function computeStack(p = params) {
  const { T_us, N } = p;
  const dt = T_us / (N - 1);

  const t = new Float64Array(N);
  const V = new Float64Array(N);
  const I = new Float64Array(N);
  const x = new Float64Array(N);
  const P = new Float64Array(N);
  const Q = new Float64Array(N);

  for (let i = 0; i < N; i++) t[i] = i * dt;

  // Drive voltage
  for (let i = 0; i < N; i++) V[i] = driveVoltage(t[i], p);

  // Current ~ dV/dt
  for (let i = 1; i < N - 1; i++) {
    I[i] = p.C_eff * (V[i + 1] - V[i - 1]) / (2 * dt);
  }
  I[0] = I[1]; I[N - 1] = I[N - 2];

  // Mechanical first-order lag
  x[0] = p.mech_gain * V[0];
  for (let i = 1; i < N; i++) {
    x[i] = x[i - 1] + (p.mech_gain * V[i] - x[i - 1]) * (dt / p.mech_tau);
  }

  // Acoustic pressure (simple underdamped + reflection)
  const w0 = 2 * Math.PI * p.f0;
  let y = 0, ydot = 0;
  const dIdx = p.refl_delay / dt;

  for (let i = 0; i < N; i++) {
    const u = x[i] - (p.damper_enabled ? p.damper_strength : 0) * sample(x, i - dIdx);
    const ydd = w0 * w0 * (u - y) - 2 * p.zeta * w0 * ydot;
    ydot += ydd * dt;
    y += ydot * dt;
    P[i] = p.p_gain * y;
  }

  for (let i = 0; i < N; i++) Q[i] = P[i];

  return {
    t,
    V: norm(V),
    I: norm(I),
    x: norm(x),
    P: norm(P),
    Q: norm(Q),
  };
}

function driveVoltage(t, p) {
  const { t0, tr, th, tf, V_amp } = p;
  if (t < t0) return 0;
  if (t < t0 + tr) return V_amp * (t - t0) / tr;
  if (t < t0 + tr + th) return V_amp;
  if (t < t0 + tr + th + tf) return V_amp * (1 - (t - t0 - tr - th) / tf);
  return 0;
}

function sample(arr, i) {
  if (i < 0) return 0;
  if (i >= arr.length) return arr[arr.length - 1];
  const i0 = Math.floor(i);
  const f = i - i0;
  return arr[i0] * (1 - f) + arr[i0 + 1] * f;
}

function norm(arr) {
  let m = 0;
  for (const v of arr) m = Math.max(m, Math.abs(v));
  return arr.map(v => (m ? v / m : 0));
}
