// model.js — Qualitative causal model for oscilloscope-style display (FULL)
//
// Causality (single-shot):
//   V(t)  ->  I(t)  ->  Δx(t)  ->  P(t)  ->  Q(t)
// where
//   I(t)  is mainly capacitive (C_eff * dV/dt) + small leakage term,
//   Δx(t) follows V(t) with a first-order structural lag,
//   P(t) is an underdamped acoustic response driven by d(Δx)/dt plus delayed reflection,
//   Damper reduces reflection and increases effective damping (absorption).
//
// Output waveforms are normalized per-channel to [-1, +1] for clear visibility.

import { params } from "./params.js";

export function computeStack(p = params) {
  const N = Math.max(200, Math.floor(p.N));
  const T = Number(p.T_us);
  const dt = T / (N - 1);

  const t = new Float64Array(N);
  const V = new Float64Array(N);
  const I = new Float64Array(N);
  const x = new Float64Array(N);
  const P = new Float64Array(N);
  const Q = new Float64Array(N);

  for (let i = 0; i < N; i++) t[i] = i * dt;

  // 1) Drive voltage V(t)
  for (let i = 0; i < N; i++) V[i] = driveVoltage(t[i], p);

  // 2) Current I(t): capacitive + small leakage
  //    I ≈ C_eff * dV/dt + G_leak * V
  const G_leak = 0.02; // small (normalized), for "scope-like" baseline
  for (let i = 1; i < N - 1; i++) {
    const dVdt = (V[i + 1] - V[i - 1]) / (2 * dt);
    I[i] = p.C_eff * dVdt + G_leak * V[i];
  }
  I[0] = I[1];
  I[N - 1] = I[N - 2];

  // 3) Mechanical displacement Δx(t): first-order lag to V(t)
  //    x' = (k*V - x)/tau
  const tau = Math.max(1e-6, Number(p.mech_tau));
  x[0] = p.mech_gain * V[0];
  for (let i = 1; i < N; i++) {
    const target = p.mech_gain * V[i];
    x[i] = x[i - 1] + (target - x[i - 1]) * (dt / tau);
  }

  // 4) Pressure P(t): underdamped resonator driven by xdot + delayed reflection
  const xdot = new Float64Array(N);
  for (let i = 1; i < N - 1; i++) xdot[i] = (x[i + 1] - x[i - 1]) / (2 * dt);
  xdot[0] = xdot[1];
  xdot[N - 1] = xdot[N - 2];

  // Resonator: y'' + 2ζω0 y' + ω0^2 y = ω0^2 u
  // u = +xdot + reflection(xdot delayed)
  const w0 = 2 * Math.PI * Number(p.f0); // [rad/µs] qualitative
  const baseZeta = Math.max(0, Number(p.zeta));

  const delay_us = Math.max(0, Number(p.refl_delay));
  const delaySamp = delay_us / dt;

  const damperOn = !!p.damper_enabled;
  const damperStrength = clamp01(p.damper_strength);

  // Reflection gain reduction by damper
  const reflGain0 = clamp01(p.refl_gain);
  const reflGain = reflGain0 * (damperOn ? (1 - 0.85 * damperStrength) : 1);

  // Effective damping increased by damper (absorption)
  const zetaEff = baseZeta + (damperOn ? 0.40 * damperStrength : 0);

  let y = 0;     // pressure state
  let ydot = 0;  // pressure derivative

  for (let i = 0; i < N; i++) {
    const uDirect = xdot[i];

    // Delayed reflected component (simple)
    const uRefl = reflGain * sampleDelayed(xdot, i - delaySamp);

    // A small polarity tweak makes "pressure ring" read naturally for inkjet intuition.
    // You can flip sign here if you prefer.
    const u = (uDirect + uRefl);

    const yddot = (w0 * w0) * (u - y) - 2 * zetaEff * w0 * ydot;

    ydot += yddot * dt;
    y += ydot * dt;

    P[i] = Number(p.p_gain) * y;
  }

  // 5) Flow Q(t): signed ( +out / -in ) from pressure sign (qualitative)
  // Small nonlinear saturation gives a more "scope-like" waveform shape.
  for (let i = 0; i < N; i++) {
    const q = Math.tanh(1.6 * P[i]); // soft saturation
    Q[i] = q;
  }

  // Normalize each channel independently to [-1, +1] for display
  return {
    t,
    V: normalizeSigned(V),
    I: normalizeSigned(I),
    x: normalizeSigned(x),
    P: normalizeSigned(P),
    Q: normalizeSigned(Q),
  };
}

/* ---------------- helpers ---------------- */

function driveVoltage(t, p) {
  const V0 = 0.0; // baseline
  const Vamp = Number(p.V_amp);

  const t0 = Number(p.t0);
  const tr = Math.max(1e-9, Number(p.tr));
  const th = Math.max(0, Number(p.th));
  const tf = Math.max(1e-9, Number(p.tf));

  const t1 = t0;
  const t2 = t1 + tr;
  const t3 = t2 + th;
  const t4 = t3 + tf;

  if (t < t1) return V0;

  // Smooth edges (scope-friendly)
  if (t < t2) {
    const a = (t - t1) / tr;
    return V0 + Vamp * smoothstep(a);
  }
  if (t < t3) return V0 + Vamp;
  if (t < t4) {
    const a = (t - t3) / tf;
    return V0 + Vamp * (1 - smoothstep(a));
  }
  return V0;
}

function smoothstep(x) {
  const u = clamp01(x);
  return u * u * (3 - 2 * u);
}

function clamp01(x) {
  const v = Number(x);
  if (!Number.isFinite(v)) return 0;
  return Math.min(1, Math.max(0, v));
}

function sampleDelayed(arr, idxFloat) {
  // linear interpolation
  const n = arr.length;
  if (idxFloat <= 0) return arr[0];
  if (idxFloat >= n - 1) return arr[n - 1];
  const i0 = Math.floor(idxFloat);
  const frac = idxFloat - i0;
  return arr[i0] * (1 - frac) + arr[i0 + 1] * frac;
}

function normalizeSigned(arr) {
  let m = 0;
  for (let i = 0; i < arr.length; i++) m = Math.max(m, Math.abs(arr[i]));
  const s = (m > 1e-12) ? (1 / m) : 1;
  const out = new Float64Array(arr.length);
  for (let i = 0; i < arr.length; i++) out[i] = arr[i] * s;
  return out;
}
