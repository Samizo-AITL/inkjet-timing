# inkjet-timing

Time-domain causality visualization of a piezoelectric inkjet system.

This repository provides a **stacked, time-aligned visualization**
showing how electrical, mechanical, and fluidic domains are causally
connected during inkjet droplet ejection.

---

## What this shows

A single time axis is shared across the following signals:

- Drive voltage **V(t)**
- Current response **I(t)**
- Mechanical displacement **Δx(t)**
- Channel pressure **P(t)**
- Ink flow response **Q(t)** (outflow / inflow)

Each waveform belongs to a different physical domain, but all are
**causally linked in time**.
The visualization emphasizes **temporal ordering, delay, and phase
relationships** rather than numerical accuracy.

---

## Why this is not PID control

Inkjet actuation is fundamentally:

- open-loop
- feedforward-driven
- completed within microseconds

There is no opportunity for closed-loop feedback during droplet
formation.

System stability is achieved through:

- waveform design
- mechanical damping
- acoustic and fluidic architecture

—not through gain tuning or feedback control.

This makes inkjet actuation categorically different from
PID-controlled systems.

---

## Design intent

- Qualitative, not CFD-based
- Causality-focused, not parameter-accurate
- Represents a well-damped, properly designed operating condition

This visualization is intended for **architectural understanding and
physical intuition**, not numerical prediction.

---

## How to read the visualization

- The vertical axis is stacked by physical domain:
  - Electrical → Mechanical → Fluidic (top to bottom)
- The horizontal axis represents time (microsecond scale)
- A single time cursor highlights the instantaneous state across all domains
- Dots indicate the value of each signal at the cursor time

The display is designed to be read similarly to an oscilloscope or
logic analyzer, but across multiple physical domains.

---

## Live demo (GitHub Pages)

👉 **Interactive browser-based visualization:**

https://samizo-aitl.github.io/inkjet-timing/index.html

- No installation required
- Runs entirely in the browser
- Gain parameters can be adjusted interactively
- Intended for exploration, explanation, and review

---

## Position within AITL

This project complements PID-based control examples by addressing
systems where:

- behavior is determined by architecture and timing
- stability is embedded in physical design
- cross-domain causality must be understood at a glance

Inkjet waveform engineering can be viewed as a
**physics-constrained feedforward control problem**.

---

## License

### Code

All source code in this repository (HTML, JavaScript, CSS) is released
under the **MIT License**.

### Conceptual model and documentation

The physical interpretations, causal structure, and architectural
explanations presented here are provided for **educational and research
purposes**.

Reuse or derivative work based on the **conceptual model, causal
representation, or design methodology** should include proper
attribution and is not intended for direct commercial reuse without
independent validation.

---

## Notes

This project is intentionally simplified to support clear reasoning
about timing and causality.
It is not a substitute for detailed multiphysics simulation or
hardware-specific waveform optimization.
