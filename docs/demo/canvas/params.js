// params.js — Scope-tuned default parameters (FULL)
//
// Units are qualitative / normalized for visualization.
// Time unit: microsecond [µs]
//
// Design intent:
// - One-shot inkjet actuation (open-loop, feedforward)
// - Clear separation of V / I / Δx / P / Q in time
// - Visible current spikes, mechanical lag, acoustic ringing
// - Damper reduces reflection AND increases damping (absorption)

export const params = {
  /* =========================
   * Time / sampling
   * ========================= */
  T_us: 30.0,     // total time window [µs]
  N: 900,         // samples (≈33 ns resolution)

  /* =========================
   * Drive voltage V(t)
   * ========================= */
  V_amp: 35.0,    // drive amplitude [V]

  t0: 2.0,        // pulse start time [µs]
  tr: 1.6,        // rise time [µs]
  th: 2.2,        // hold time [µs]
  tf: 2.8,        // fall time [µs]

  /* =========================
   * Electrical (current)
   * ========================= */
  C_eff: 1.0,     // effective capacitance (normalized)

  /* =========================
   * Mechanical (piezo + structure)
   * ========================= */
  mech_gain: 1.0, // displacement gain (normalized)
  mech_tau: 0.7,  // structural time constant [µs]
                  // -> makes Δx(t) lag V(t) visibly

  /* =========================
   * Acoustic / fluid domain
   * ========================= */
  p_gain: 1.0,    // pressure gain (normalized)

  f0: 0.22,       // acoustic ring frequency [1/µs]
                  // -> period ≈ 4.5 µs (easy to read on scope)

  zeta: 0.18,     // base damping ratio (underdamped)

  refl_delay: 6.0,// reflection delay [µs]
                  // -> nozzle ↔ reservoir round-trip (conceptual)

  refl_gain: 0.65,// reflection gain (before damper)

  /* =========================
   * Acoustic damper
   * ========================= */
  damper_enabled: true,

  damper_strength: 0.70,
  // 0.0 : no absorption
  // 1.0 : strong absorption
};
