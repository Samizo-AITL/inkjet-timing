# inkjet-timing

Time-domain causality visualization of a piezoelectric inkjet system.

This repository provides a **stacked, time-aligned visualization**
showing how electrical, mechanical, and fluidic domains are causally
connected during inkjet droplet ejection.

---

## What this shows

A single time axis is shared across the following signals:

- Drive voltage $V(t)$  
- Current response $I(t)$  
- Mechanical displacement $\Delta x(t)$  
- Channel pressure $P(t)$  
- Ink flow response ($Q_{out}$ / $Q_{in}$)

Each waveform belongs to a different physical domain, but all are
**causally linked in time**.

---

## Why this is not PID control

Inkjet actuation is fundamentally:

- open-loop
- feedforward-driven
- completed within microseconds

There is no opportunity for closed-loop feedback during droplet
formation.  
Stability is achieved through **waveform design, mechanical damping,
and fluidic architecture**, not gain tuning.

---

## Design intent

- Qualitative, not CFD-based
- Causality-focused, not parameter-accurate
- Represents a well-damped, properly designed operating condition

This visualization is intended for **architectural understanding and
physical intuition**, not numerical prediction.

---

## Live demo (GitHub Pages)

👉 Open the interactive timing chart:

https://<your-github-id>.github.io/inkjet-timing/

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

## 🔗 Live Demo (GitHub Pages)

👉 **Interactive animation (browser-based):**  
https://samizo-aitl.github.io/inkjet-timing/index.html

- No installation required
- Runs entirely in the browser
- Parameters (e.g. acoustic damper ON/OFF) can be adjusted interactively

---

## License

### Code
All source code (HTML, JavaScript, CSS) is released under the MIT License.

### Conceptual Model & Documentation
The physical interpretations, causal structure, and architectural explanations
presented in this repository are provided for educational and research purposes.

Reuse or derivative work based on the **conceptual model or design methodology**
should include proper attribution and is not intended for direct commercial reuse
without independent validation.

