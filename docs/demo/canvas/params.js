// docs/demo/canvas/params.js
export const params = {
  // ===== Time axis (qualitative) =====
  T_us: 30.0,     // [µs] visible time window
  N: 900,         // samples across the window

  // ===== Electrical drive (cause) =====
  V_amp: 35.0,    // [V]
  t0: 2.0,        // [µs] start
  tr: 1.5,        // [µs] rise time
  th: 2.0,        // [µs] hold
  tf: 2.5,        // [µs] fall time
  V_bias: 0.0,    // [V] (optional)

  // ===== Electrical response (capacitive-ish) =====
  C_eff: 1.0,     // normalized (I ≈ C_eff * dV/dt)

  // ===== Mechanical response (piezo + structure) =====
  mech_gain: 1.0,   // x ∝ mech_gain * V (normalized)
  mech_tau: 0.6,    // [µs] first-order lag (structure)

  // ===== Fluid / acoustic =====
  p_gain: 1.0,      // pressure gain
  f0: 0.22,         // [1/µs] resonance-ish (qualitative)
  zeta: 0.18,       // damping ratio-ish (base)
  refl_delay: 6.0,  // [µs] reflection delay (channel flight time)
  refl_gain: 0.65,  // reflection strength (when no damper)

  // ===== Acoustic damper =====
  damper_enabled: true,
  damper_strength: 0.70, // 0..1 (higher => stronger absorption)
};
