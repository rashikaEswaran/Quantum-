# Quantum Methodology & Simulation Integrity

## 1. Simulation Philosophy
QuantumTrace AI maintains strict scientific honesty:
- **Ideal Statevector Evolution**: Represents coherent unitary evolution $U|\psi_0\rangle$ without unphysical assumptions.
- **Physical Noise Channels**:
  - Two-qubit depolarizing channel: $\mathcal{E}(\rho) = (1-p)\rho + \frac{p}{4} I$
  - Asymmetric measurement readout bit-flip error: stochastic transition matrix $[[1-p, p], [p, 1-p]]$
  - Thermal relaxation: Lindblad decay based on physical $T_1$ and $T_2$ coherence timescales ($T_2 \le 2T_1$).
- **Scientific Checkpoint Execution (Prefix Simulation)**:
  - An isolated quantum sub-circuit cannot simply be executed independently, because earlier gates establish quantum entanglement and superposition.
  - Phase 2 executes prefixes from instruction 0 through cut $k$, accurately preserving intermediate quantum states.

## 2. Statistical Metrics
For empirical distributions $P$ and $Q$ over computational basis $\{|x\rangle\}$:
- **Total Variation Distance**: $TV(P, Q) = \frac{1}{2} \sum_x |P(x) - Q(x)|$
- **Hellinger Distance**: $H(P, Q) = \frac{1}{\sqrt{2}} \sqrt{\sum_x (\sqrt{P(x)} - \sqrt{Q(x)})^2}$
- **Jensen-Shannon Divergence**: $JSD(P, Q) = \frac{1}{2} D_{KL}(P \parallel M) + \frac{1}{2} D_{KL}(Q \parallel M)$ where $M = \frac{P+Q}{2}$.

