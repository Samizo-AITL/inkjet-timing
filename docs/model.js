// model.js
// Full-stack causal model:
// V(t) -> I(t) -> x(t) -> P(t) -> Q(t)
//
// Units:
// time: microseconds [us]
// V: volt, I: arbitrary, x: arbitrary displacement
// P: pressure (normalized), Q: flow (normalized)

export function computeStack(params) {
  const {
    T_us = 30,        // total time window [us]
    dt_us = 0.02,     // time step [us]
    V_amp,
    zeta,
    f0,
    refl_delay,
    refl_gain,
    damper_enabled,
    damper_strength
  } = params;

  const N = Math.floor(T_us / dt_us);
  const t = new Array(N);
  for (let i = 0; i < N; i++) t[i] = i * dt_us;

  /* =========================================================
   * 1) Drive waveform V(t)  (simple trapezoid)
   * =======================================================*/
  const V = new Array(N).fill(0);
  const t_rise = 2.0;
  const t_hold = 6.0;
  const t_fall = 2.0;

  for (let i = 0; i < N; i++) {
    const ti = t[i];
    if (ti < t_rise) {
      V[i] = V_amp * (ti / t_rise);
    } else if (ti < t_rise + t_hold) {
      V[i] = V_amp;
    } else if (ti < t_rise + t_hold + t_fall) {
      V[i] = V_amp * (1 - (ti - t_rise - t_hold) / t_fall);
    } else {
      V[i] = 0;
    }
  }

  /* =========================================================
   * 2) Current I(t) ~ dV/dt (edge response)
   * =======================================================*/
  const I = new Array(N).fill(0);
  for (let i = 1; i < N; i++) {
    I[i] = (V[i] - V[i - 1]) / dt_us;
  }

  /* =========================================================
   * 3) Mechanical displacement x(t)
   *    2nd-order damped oscillator driven by I(t)
   * =======================================================*/
  const X = new Array(N).fill(0);
  let x = 0;
  let v = 0;

  const w0 = 2 * Math.PI * f0; // rad/us

  for (let i = 0; i < N; i++) {
    const a =
      I[i] -
      2 * zeta * w0 * v -
      w0 * w0 * x;

    v += a * dt_us;
    x += v * dt_us;

    X[i] = x;
  }

  /* =========================================================
   * 4) Pressure P(t)
   *    = x(t) + delayed reflection
   * =======================================================*/
  const P = new Array(N).fill(0);
  const delayN = Math.floor(refl_delay / dt_us);

  for (let i = 0; i < N; i++) {
    let p = X[i];

    if (i - delayN >= 0) {
      let refl = P[i - delayN] * refl_gain;
      if (damper_enabled) {
        refl *= (1 - damper_strength);
      }
      p += refl;
    }

    P[i] = p;
  }

  /* =========================================================
   * 5) Flow Q(t) ~ dP/dt
   * =======================================================*/
  const Q = new Array(N).fill(0);
  for (let i = 1; i < N; i++) {
    Q[i] = (P[i] - P[i - 1]) / dt_us;
  }

  return {
    t,
    V,
    I,
    X,
    P,
    Q
  };
}
