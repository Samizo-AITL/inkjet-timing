/* =========================
   Time Settings
   ========================= */
export const DT = 0.1e-6;
export const T_END = 40e-6;
export const N = Math.floor(T_END / DT);

/* =========================
   Gain / Parameter Sets
   ========================= */

/*
  設計方針：
  - V : 基本操作量（駆動電圧）
  - x : 圧電感度（材料・形状）
  - P : キャビティ圧変換係数
  - Q : ノズル流量係数
  - I : 表示スケール用（結果量）
*/

export let gains = {
  /* ---- Primary (Drive) ---- */
  V: 1.0,   // Drive Voltage (Primary control)

  /* ---- Device Parameters (Advanced) ---- */
  x: 1.0,   // Piezo coupling (d31_eff)
  P: 1.0,   // Cavity pressure gain / compliance inverse
  Q: 1.0,   // Flow coefficient / nozzle conductance

  /* ---- Display Only ---- */
  I: 1.0    // Current display scale
};

/* =========================
   Gain Setter
   ========================= */

/*
  k : string ("V","x","P","Q","I")
  v : number
*/
export function setGain(k, v) {
  if (!(k in gains)) {
    console.warn(`Unknown gain key: ${k}`);
    return;
  }
  gains[k] = v;
}
