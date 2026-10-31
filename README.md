# QuantumTrace AI

## Complete Quantum Program Debugging, Digital Twin, Quantum Fingerprinting, Counterfactual Investigation, IBM Quantum Integration, and Explainable AI Platform

QuantumTrace AI is a production-grade, evidence-driven quantum software debugging and investigation platform built under the guiding principle:

> **"The debugging engine identifies and validates evidence. The AI explains that evidence. The developer remains in control of the proposed correction."**

---

## 🌟 Key Capabilities

1. **Dual Quantum Simulation Engine**:
   - Ideal coherent statevector evolution using Qiskit 2.x and exact quantum state calculations.
   - Noise-aware simulation modeling Lindblad thermal relaxation ($T_1, T_2$), two-qubit depolarizing error channels, and asymmetric projective measurement readout errors.
2. **Deterministic Quantum Fingerprinting**:
   - SHA-256 canonical hashing derived from empirical measurement counts, distribution purity, and finite-sample Wilson score 95% confidence intervals.
   - Separation of circuit identity hashes from execution run fingerprints.
3. **Interactive 3D Digital Twin**:
   - Cryostat-inspired dilution refrigeration model (300K outer vacuum vessel, 50K radiation shield, 4K stage, still stage, and 15 mK mixing chamber).
   - QPU resonator coupling lattice animated dynamically in response to simulation events, noise decoherence, and divergence detection.
4. **Phase 1: Global Noise Studio**:
   - Rigorous statistical comparison metrics: Total Variation Distance (TV), Hellinger Distance, and Jensen-Shannon Divergence (JSD).
   - Two-sample chi-square significance testing with $p < 0.01$ divergence rejection.
5. **Phase 2: Checkpoint Segmentation**:
   - Scientifically valid prefix simulation preserving intermediate quantum states up to each boundary cut.
   - Detection of earliest statistically supported divergence frontiers.
6. **Interactive What-If Counterfactual Experiments**:
   - Natural language causal question parsing with prioritized proposals and explicit confirmation before execution.
   - Quantification of fidelity recovery percentage.
7. **IBM Quantum Hardware Integration**:
   - Discovery of backends (`ibm_brisbane`, `ibm_kyoto`, `ibm_sherbrooke`, etc.) and heavy-hex coupling maps.
   - Calibration telemetry ($T_1, T_2$, gate errors, readout errors).
   - Mandatory developer confirmation safeguards before physical QPU dispatch.
   - Honest offline demonstration mode with zero fabricated telemetry.
8. **Automated Code Repair & Diff**:
   - Pre-repair and post-repair validation, syntax checking, regression testing, and unified side-by-side diff.
9. **Exportable Audit Reports**:
   - Server-rendered printable executive HTML reports and structured JSON exports.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Three.js, Lucide Icons.
- **Backend**: Python 3.10+, FastAPI, Uvicorn, Pydantic v2, SQLAlchemy 2.0.
- **Quantum Core**: Qiskit 2.6+, Qiskit Aer, `qiskit-ibm-runtime`.
- **Database**: PostgreSQL (with automated SQLite fallback for immediate local execution).
- **Reasoning**: BDH-CQ directed hypothesis prioritization adapter & provider-independent Transformer LLM explanation engine.

---

## 🚀 Quick Start & Installation

### 1. Start the Backend
```powershell
cd backend
$env:PYTHONPATH="backend"
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- Interactive Swagger docs: `http://127.0.0.1:8000/docs`
- Health check endpoint: `http://127.0.0.1:8000/api/v1/health`

### 2. Start the Frontend
```powershell
cd frontend
npm run dev
```
- Open `http://localhost:5173` in your browser.

### 3. Run Backend Test Suite
```powershell
$env:PYTHONPATH="backend"; python -m pytest -v backend/app/tests
```

---

## 🔒 Security & Physical Safeguards
- Circuit code submitted via the editor is validated via strict AST parsing prohibiting system calls, subprocesses, sockets, and unauthorized file imports.
- Physical IBM hardware dispatch requires explicit user confirmation.
- API tokens are never exposed in client logs or telemetry payloads.

