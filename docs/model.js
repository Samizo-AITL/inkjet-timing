export function computeStack(p) {
  const { dt, N } = p;

  const V = new Array(N).fill(0);
  const I = new Array(N).fill(0);
  const x = new Array(N).fill(0);
  const P = new Array(N).fill(0);
  const Q = new Array(N).fill(0);

  // V(t)
  for (let i = p.drive.tOn; i < p.drive.tOff; i++) {
    V[i] = p.drive.amp;
  }

  // I(t) ~ dV/dt
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

  // P(t) : delayed + damped
  for (let i = p.fluid.delay; i < N; i++) {
    P[i] =
      p.fluid.damp * P[i - 1] +
      (1 - p.fluid.damp) * x[i - p.fluid.delay];
  }

  // Q(t) : dP/dt
  for (let i = 1; i < N; i++) {
    Q[i] = (P[i] - P[i - 1]) / dt;
  }

  return { V, I, x, P, Q };
}
