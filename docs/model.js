import { DT, N, gains } from "./params.js";

export function simulate() {
  const t = [], V = [], I = [], x = [], P = [], Q = [];

  // 状態変数（連続系）
  let x_prev = 0;
  let p_prev = 0;
  let q_prev = 0;

  for (let i = 0; i < N; i++) {
    const ti = i * DT;
    t.push(ti);

    /* =========================
       1. Drive Voltage (Primary)
       ========================= */
    const v_drive = (ti > 5e-6 && ti < 15e-6) ? 1 : 0;
    const v = v_drive * gains.V;
    V.push(v);

    /* =========================
       2. Piezo Displacement
          Δx ← V
       ========================= */
    // 一次遅れ（材料・機械応答）
    const tau_x = 5e-6; // 応答時間定数（仮）
    const x_target = gains.x * v;
    const xx = x_prev + (DT / tau_x) * (x_target - x_prev);
    x.push(xx);
    x_prev = xx;

    /* =========================
       3. Cavity Pressure
          P ← Δx
       ========================= */
    // 簡易音響応答（一次）
    const tau_p = 8e-6;
    const p_target = gains.P * xx;
    const pp = p_prev + (DT / tau_p) * (p_target - p_prev);
    P.push(pp);
    p_prev = pp;

    /* =========================
       4. Flow Rate
          Q ← P
       ========================= */
    // ノズル抵抗モデル（非負制約付き）
    const qq = Math.max(0, pp * gains.Q);
    Q.push(qq);
    q_prev = qq;

    /* =========================
       5. Current (Result)
       ========================= */
    // 圧電を容量性負荷として近似
    const Cpiezo = 1e-9; // 仮の容量
    const ii = Cpiezo * (v - (V[i - 1] || 0)) / DT;
    I.push(ii);
  }

  return { t, V, I, x, P, Q };
}
