// docs/demo/canvas/model.js
// Qualitative causal model:
// V(t) -> I(t) -> x(t) -> P(t) -> Q_out/Q_in (sign-based)
//
// Notes:
// - I(t): mostly capacitive (dV/dt), plus a tiny dynamic term (optional).
// - x(t): first-order lag of V(t).
// - P(t): underdamped response driven by dx/dt with delayed reflection.
// - Damper: reduces reflection and increases effective damping (absorption).

import { params } from "./params.js";

export function computeStack(paramsLocal = params) {
  const { T_us, N } = paramsLocal;
  const dt = T_us / (N - 1);

  const t = new Float64Array(N);
  const V = new Float64Array(N);
  const I = new Float64Array(N);
  const x = new Float64Array(N);
  const P = new Float64Array(N);
  const Qout = new Float64Array(N);
  const Qin = new Float64Array(N);

  // --- time vector ---
  for (let i = 0; i < N; i++) t[i] = i * dt;

  // --- drive voltage ---
  for (let i = 0; i < N; i++) V[i] = driveVoltage(t[i], paramsLocal);

  // --- current: I ≈ C*dV/dt (finite difference) ---
  for (let i = 1; i < N - 1; i++) {
    const dVdt = (V[i + 1] - V[i - 1]) / (2 * dt);
    I[i] = paramsLocal.C_eff * dVdt;
  }
  I[0] = I[1];
  I[N - 1] = I[N - 2];

  // --- mechanical displacement: first-order lag x' = (k*V - x)/tau ---
  const tau = Math.max(1e-6, paramsLocal.mech_tau);
  x[0] = paramsLocal.mech_gain * V[0];
  for (let i = 1; i < N; i++) {
    const target = paramsLocal.mech_gain * V[i];
    const dx = (target - x[i - 1]) * (dt / tau);
    x[i] = x[i - 1] + dx;
  }

  // --- compute dx/dt as drive for acoustic ---
  const xdot = new Float64Array(N);
  for (let i = 1; i < N - 1; i++) xdot[i] = (x[i + 1] - x[i - 1]) / (2 * dt);
  xdot[0] = xdot[1];
  xdot[N - 1] = xdot[N - 2];

  // --- acoustic pressure: underdamped 2nd-order driven by xdot + reflection ---
  // Discrete-time resonator:
  // y'' + 2*zeta*w0*y' + w0^2*y = w0^2 * u
  // Implemented by semi-implicit integration.
  const w0 = 2 * Math.PI * paramsLocal.f0; // [rad/µs] qualitative
  let y = 0.0;      // pressure state
  let ydot = 0.0;

  // reflection lookup by delay
  const delay = Math.max(0.0, paramsLocal.refl_delay);
  const dSamp = delay / dt;

  const damperOn = !!paramsLocal.damper_enabled;
  const damperStrength = clamp01(paramsLocal.damper_strength);

  // Reflection reduction by damper: gain_eff = refl_gain * (1 - strength)
  const reflGainEff = paramsLocal.refl_gain * (damperOn ? (1.0 - damperStrength) : 1.0);

  // Effective damping: zeta_eff = zeta + strength*0.35 (qualitative absorption)
  const zetaEff = Math.max(0.0, paramsLocal.zeta + (damperOn ? damperStrength * 0.35 : 0.0));

  for (let i = 0; i < N; i++) {
    const u_direct = xdot[i];

    // delayed reflection of xdot (simple)
    const u_refl = reflGainEff * sampleDelayed(xdot, i - dSamp);

    const u = u_direct + u_refl;

    // yddot = w0^2*(u - y) - 2*zeta*w0*ydot
    const yddot = (w0 * w0) * (u - y) - 2.0 * zetaEff * w0 * ydot;

    // integrate
    ydot += yddot * dt;
    y += ydot * dt;

    P[i] = paramsLocal.p_gain * y;
  }

  // --- flow response: sign-based (qualitative) ---
  // Q_out: positive pressure contributes to ejection
  // Q_in : negative pressure contributes to refill
  for (let i = 0; i < N; i++) {
    const p = P[i];
    Qout[i] = Math.max(0, p);
    Qin[i] = Math.max(0, -p);
  }

  // Normalize each channel for display (keep sign where needed)
  const Vn = normalizeSigned(V);
  const In = normalizeSigned(I);
  const xn = normalizeSigned(x);
  const Pn = normalizeSigned(P);
  const Qn = normalizeFlow(Qout, Qin); // returns signed flow: +out / -in

  return {
    t, dt,
    V: Vn,
    I: In,
    x: xn,
    P: Pn,
    Q: Qn,
  };
}

// ---- helpers ----
function driveVoltage(t, p) {
  const { V_amp, V_bias, t0, tr, th, tf } = p;
  const t1 = t0;
  const t2 = t1 + tr;
  const t3 = t2 + th;
  const t4 = t3 + tf;

  if (t < t1) return V_bias;
  if (t < t2) {
    const a = (t - t1) / Math.max(1e-9, tr);
    return V_bias + V_amp * smoothstep(a);
  }
  if (t < t3) return V_bias + V_amp;
  if (t < t4) {
    const a = (t - t3) / Math.max(1e-9, tf);
    return V_bias + V_amp * (1 - smoothstep(a));
  }
  return V_bias;
}

function smoothstep(x) {
  const u = clamp01(x);
  return u * u * (3 - 2 * u);
}

function clamp01(x) {
  return Math.min(1, Math.max(0, Number(x)));
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
  // normalize by max abs
  let m = 0;
  for (let i = 0; i < arr.length; i++) m = Math.max(m, Math.abs(arr[i]));
  const out = new Float64Array(arr.length);
  const s = m > 1e-12 ? 1 / m : 1;
  for (let i = 0; i < arr.length; i++) out[i] = arr[i] * s;
  return out;
}

function normalizeFlow(Qout, Qin) {
  // signed flow: +Qout, -Qin
  const n = Qout.length;
  const out = new Float64Array(n);
  let m = 0;
  for (let i = 0; i < n; i++) {
    out[i] = Qout[i] - Qin[i];
    m = Math.max(m, Math.abs(out[i]));
  }
  const s = m > 1e-12 ? 1 / m : 1;
  for (let i = 0; i < n; i++) out[i] *= s;
  return out;
}
