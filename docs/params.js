export const DT = 0.1e-6;
export const T_END = 40e-6;
export const N = Math.floor(T_END / DT);

export let gains = { V:1, I:1, x:1, P:1, Q:1 };

export function setGain(k, v) {
  gains[k] = v;
}
