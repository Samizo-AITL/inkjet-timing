// docs/demo/canvas/model.js
import { params } from "./params.js";

export function computeWaveforms(t) {
  const V = driveVoltage(t);
  const I = dVdt(V);
  const x = params.mech_gain * I;
  const P = channelPressure(x, t);
  const Q = inkFlow(P);
  return { V, I, x, P, Q };
}

function driveVoltage(t) {
  if (t < params.rise_time) {
    return params.V_amp * t / params.rise_time;
  }
  if (t < params.rise_time + params.fall_time) {
    return params.V_amp * (1 - (t - params.rise_time) / params.fall_time);
  }
  return 0;
}

function dVdt(V) {
  return V; // 簡易（容量性応答の代理）
}

function channelPressure(x, t) {
  const delay = params.channel_length / params.sound_speed;
  let p = x;

  const reflected = x * Math.exp(-params.wall_damping * delay);

  if (params.damper_enabled) {
    p += reflected * Math.exp(-params.damper_strength * delay);
  } else {
    p += reflected;
  }
  return p;
}

function inkFlow(P) {
  return Math.max(P, 0);
}

