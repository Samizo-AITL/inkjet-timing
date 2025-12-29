export const TIME_VIEW = 40e-6;   // 40 µs
export const DT = 0.1e-6;
export const N = Math.floor(TIME_VIEW / DT);

export let gains = { V:1, I:1, x:1, P:1, Q:1 };

export function setGain(k, v) {
  gains[k] = v;
}
