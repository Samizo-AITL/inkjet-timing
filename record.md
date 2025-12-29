---
title: Inkjet Full-stack Timing – Status Log & Next Actions
date: 2025-12-29
status: suspended
scope: architectural / visualization
---

# Inkjet Full-stack Timing  
## Status Log & Next Actions

This document records the **current state**, **root causes identified**, and **recommended next steps** for the Inkjet Full-stack Timing visualization project.

---

## 1. Project Intent (Recap)

**Objective**

Visualize the *time-domain causal chain* of a piezoelectric inkjet system on a **single aligned time axis**:

```
V(t) → I(t) → Δx(t) → P(t) → Q(t)
```

Key design principles:

- Open-loop / feedforward driven actuation
- Microsecond-scale causality (no feedback control)
- Cross-domain alignment (electrical → mechanical → fluid)
- Oscilloscope-style visualization for physical intuition
- Qualitative / architectural (not CFD-accurate)

---

## 2. What Was Successfully Achieved ✅

### 2.1 Conceptual Model

- Clear separation of **cause vs result**
  - Adjustable: V(t), structural parameters
  - Computed: Δx(t), P(t), Q(t)
- Physical interpretation aligned with inkjet practice:
  - Pressure ringing = underdamped acoustic system
  - Reflection delay = channel length / wave travel time
  - Damper = acoustic absorption

### 2.2 Model Implementation (model.js)

- Fully functional signal generation:
  - V(t): drive waveform
  - I(t): capacitive / derivative-like response
  - Δx(t): damped second-order mechanical response
  - P(t): pressure with reflection + damping
  - Q(t): flow derived from pressure dynamics
- Damper ON/OFF behavior clearly observable
- All five waveforms **numerically valid and non-zero**

### 2.3 Renderer (draw.js)

- Canvas-based stacked waveform renderer
- Oscilloscope-style:
  - Black background
  - Color-coded traces
  - Horizontal grid
  - Vertical time cursor
- Left margin reserved for labels
- All 5 channels rendered when data is present

---

## 3. Where Things Broke ❌

### 3.1 Symptom Timeline

- Initial issues: missing lower waveforms (Δx, P, Q)
  - Root cause: model not yet completed → fixed
- Later issues: labels overlapping with waveforms
  - Root cause: canvas left-margin not reserved → fixed
- Final blocking issue: **black / empty canvas on GitHub Pages**

### 3.2 Root Cause (Confirmed)

**JavaScript execution never starts on GitHub Pages**

This is **not** a physics, rendering, or layout problem.

#### Actual cause:
- ES Modules (`type="module"`) fail to load due to:
  - Incorrect relative paths
  - Directory depth mismatch
  - GitHub Pages base URL (`/inkjet-timing/`) not accounted for

When *any* `import` fails:
- No JS executes
- No errors visible unless DevTools console is checked
- Canvas remains blank (black)

---

## 4. What This Is NOT ❌

- Not a `_layout/default.html` issue
- Not a CSS layout issue
- Not a canvas sizing issue
- Not a draw.js logic issue
- Not a model.js issue

**HTML / Jekyll layout is innocent.**

---

## 5. Why This Was Hard to Notice

- Works locally (Live Server / file://)
- Fails silently on GitHub Pages
- Visual symptoms look like rendering bugs
- ES Modules + GitHub Pages is a known trap

This is a **deployment-layer failure**, not a design failure.

---

## 6. Recommended Next Actions (When Resuming)

### Option A — Minimal, Robust Fix (Recommended)

Flatten the structure under `docs/`:

```
docs/
 ├ index.html
 ├ draw.js
 ├ model.js
 └ params.js
```

Then use **only relative imports**:

```js
import { params } from "./params.js";
import { computeStack } from "./model.js";
import { drawStack } from "./draw.js";
```

No subdirectories. No ambiguity.

---

### Option B — Explicit Base Path (Advanced)

Keep directories but hardcode base path:

```js
const BASE = "/inkjet-timing/docs/demo/canvas/";
import { params } from `${BASE}params.js`;
```

More fragile, not recommended unless structure is fixed long-term.

---

### Option C — Ditch ES Modules (Fallback)

- Bundle JS into a single file
- Or use classic `<script>` without `type="module"`

Technically works, but conceptually ugly.

---

## 7. Architectural Position (Important)

This project is **architectural visualization**, not UI polish.

It sits at the intersection of:

- Control theory (feedforward vs feedback)
- Electromechanics
- Acoustic wave propagation
- Fluid dynamics intuition

It is **not** a failure-case exaggeration tool,
but a *baseline causal reference*.

---

## 8. Decision Status

**Current state:** paused / suspended  
**Reason:** deployment friction exceeded value for now  
**Technical viability:** confirmed (model + renderer are sound)

No work is lost.

---

## 9. When/If Restarting

Resume in this order:

1. Fix module loading on GitHub Pages
2. Confirm console has zero errors
3. Verify `drawStack()` is called
4. Only then adjust visuals / UI

---

## 10. Final Note

This was not a misunderstanding of inkjet physics.

This was a **Web tooling impedance mismatch** encountered *after* the hard part was already solved.

Stopping here is a rational engineering decision.

---

*End of log.*
