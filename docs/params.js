// ===== Time control =====
export const TIME_VIEW = 40e-6;   // ★ 40 µs：1因果だけ
export const DT = 0.1e-6;         // 0.1 µs resolution
export const N = Math.floor(TIME_VIEW / DT);

// ===== Gains =====
export let gains = {
  V: 1.0,
  I: 1.0,
  x: 1.0,
  P: 1.0,
  Q: 1.0
};

export function setGain(key, value) {
  gains[key] = value;
}
