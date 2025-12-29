export function computeStack(p) {
  const { dt, N } = p;

  const V = Array(N).fill(0);
  const I = Array(N).fill(0);
  const x = Array(N).fill(0);
  const P = Array(N).fill(0);
  const Q = Array(N).fill(0);

  // ---- Drive V(t)
  for (let i = p.drive.tOn; i < p.drive.tOff; i++) {
    V[i] = p.drive.amp;
  }

  // ---- I(t) = dV/dt (scaled)
  for (let i = 1; i < N; i++) {
    I[i] = (V[i] - V[i - 1]) / dt * 1e-6;
  }

  // ---- Mechanical x(t) (scaled)
  let xd = 0;
  for (let i = 1; i < N; i++) {
    const a =
      -2 * p.mech.zeta * p.mech.wn * xd -
      p.mech.wn * p.mech.wn * x[i - 1] +
      0.5 * V[i];
    xd += a * dt;
    x[i] = x[i - 1] + xd * dt;
  }

  // ★ 観測用スケール
  for (let i = 0; i < N; i++) {
    x[i] *= 5e3;
  }

  // ---- Pressure P(t)
  for (let i = p.fluid.delay; i < N; i++) {
    P[i] =
      0.9 * P[i - 1] +
      0.1 * x[i - p.fluid.delay];
  }

  // ★ 観測用スケール
  for (let i = 0; i < N; i++) {
    P[i] *= 2;
  }

  // ---- Flow Q(t)
  for (let i = 1; i < N; i++) {
    Q[i] = (P[i] - P[i - 1]) / dt * 1e-6;
  }

  return { V, I, x, P, Q };
}
