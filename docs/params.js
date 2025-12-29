export const params = {
  dt: 1e-6,
  N: 2000,

  drive: {
    tOn: 200,
    tOff: 600,
    amp: 1.0,
  },

  mech: {
    wn: 2 * Math.PI * 20e3,
    zeta: 0.15,
  },

  fluid: {
    delay: 120,
    damp: 0.85,
  },
};
