// params.js
export const params = {
  // Time window
  T_us: 30.0,
  N: 900,

  // Drive voltage
  V_amp: 35.0,
  t0: 2.0,
  tr: 1.5,
  th: 2.0,
  tf: 2.5,

  // Electrical
  C_eff: 1.0,

  // Mechanical
  mech_gain: 1.0,
  mech_tau: 0.6,

  // Acoustic
  p_gain: 1.0,
  f0: 0.22,
  zeta: 0.18,
  refl_delay: 6.0,
  refl_gain: 0.65,

  // Damper
  damper_enabled: true,
  damper_strength: 0.7,
};
