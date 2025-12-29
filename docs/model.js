import { DT, N, gains } from "./params.js";

export function simulate() {
  const t = [], V = [], I = [], x = [], P = [], Q = [];

  /* =========================
     State variables
     ========================= */
  let x_prev = 0;
  let p_prev = 0;
  let v_prev = 0;

  /* =========================
     Electrical parameters
     ========================= */
  const Cpiezo = 2e-9;   // [F] 圧電等価容量
  const Rloss  = 5e5;    // [Ohm] 誘電損失
  const tr     = 0.5e-6; // [s] 立上り・立下り時間

  for (let i = 0; i < N; i++) {
    const ti = i * DT;
    t.push(ti);

    /* =========================
       1. Drive Voltage (finite slope)
       ========================= */
    let v_drive = 0;

    if (ti > 5e-6 && ti < 15e-6) {
      if (ti < 5e-6 + tr) {
        v_drive = (ti - 5e-6) / tr;          // rise
      } else if (ti > 15e-6 - tr) {
        v_drive = (15e-6 - ti) / tr;         // fall
      } else {
        v_drive = 1;                         // hold
      }
    }

    const v = v_drive * gains.V;
    V.push(v);

    /* =========================
       2. Current (capacitive + loss)
       ========================= */
    const dv = (v - v_prev) / DT;
    const ii = gains.I * (Cpiezo * dv + v / Rloss);
    I.push(ii);
    v_prev = v;

    /* =========================
       3. Piezo Displacement
          Δx ← V
       ========================= */
    const tau_x = 5e-6; // 機械応答
    const x_target = gains.x * v;
    const xx = x_prev + (DT / tau_x) * (x_target - x_prev);
    x.push(xx);
    x_prev = xx;

    /* =========================
       4. Cavity Pressure
          P ← Δx
       ========================= */
    const tau_p = 8e-6; // 音響応答
    const p_target = gains.P * xx;
    const pp = p_prev + (DT / tau_p) * (p_target - p_prev);
    P.push(pp);
    p_prev = pp;

    /* =========================
       5. Flow Rate
          Q ← P
       ========================= */
    const qq = Math.max(0, gains.Q * pp);
    Q.push(qq);
  }

  return { t, V, I, x, P, Q };
}
