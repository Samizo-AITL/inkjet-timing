export function computeStack(p) {
  const { dt, N } = p;

  const V = Array(N).fill(0);
  const I = Array(N).fill(0);
  const x = Array(N).fill(0);
  const P = Array(N).fill(0);
  const Q = Array(N).fill(0);

  // V(t)
  for (let i = p.drive.tOn; i < p.drive.tOff; i++) {
    V[i] = p.drive.amp;
  }

  // I(t) = dV/dt
  for (let i = 1; i < N; i++) {
    I[i] = (V[i] - V[i - 1]) / dt;
  }

  // x(t) : 2nd order
  let xd = 0;
  for (let i = 1; i < N; i++) {
    const a =
      -2 * p.mech.zeta * p.mech.wn * xd -
      p.mech.wn * p.mech.wn * x[i - 1] +
      V[i];
    xd += a * dt;
    x[i] = x[i - 1] + xd * dt;
  }

  // scale for visualization
  for (let i = 0; i < N; i++) x[i] *= 200;

  // P(t) delayed response
  for (let i = p.fluid.delay; i < N; i++) {
    P[i] = 0.95 * P[i - 1] + 0.05 * x[i - p.fluid.delay];
  }

  // Q(t) = dP/dt
  for (let i = 1; i < N; i++) {
    Q[i] = (P[i] - P[i - 1]) / dt;
  }

  return { V, I, x, P, Q };
}
