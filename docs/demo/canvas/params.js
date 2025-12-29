// docs/demo/canvas/params.js
export const params = {
  // Electrical (cause)
  V_amp: 30,          // [V]
  rise_time: 2.0,     // [µs]
  fall_time: 3.0,     // [µs]

  // Mechanical
  mech_gain: 1.0,

  // Fluid / Acoustic
  channel_length: 30, // normalized
  sound_speed: 1.0,
  wall_damping: 0.05,

  // Acoustic damper
  damper_enabled: true,
  damper_strength: 0.3
};

