# QuantumTrace AI: Architecture Specification

## 1. System Overview

QuantumTrace AI is an evidence-driven quantum software debugging, digital twin, quantum fingerprinting, and counterfactual investigation platform. It operates under the core principle:

> **"The debugging engine identifies and validates evidence. The AI explains that evidence. The developer remains in control of the proposed correction."**

```
+-----------------------------------------------------------------------------------+
|                              REACT FRONTEND (Vite + TS)                          |
|  - 3D Digital Twin (Three.js / R3F)      - Monaco/Syntax Quantum Editor           |
|  - Phase 1 Noise Studio                 - Phase 2 Checkpoint Timeline            |
|  - What-If Counterfactual Console       - Unified Diagnosis Panel                |
|  - IBM Hardware Discovery & Topology    - Audit & Printable Reports              |
+-----------------------------------------------------------------------------------+
                                          |
                                     (HTTP / JSON)
                                          v
+-----------------------------------------------------------------------------------+
|                               FASTAPI BACKEND CORE                                |
|  +--------------------+  +----------------------+  +---------------------------+  |
|  | Quantum Parser     |  | Static Code Analyzer |  | Simulation Engine         |  |
|  | AST validation,    |  | Structural linting,  |  | Exact Statevector, Aer,   |  |
|  | Canonical SHA-256  |  | Inverted CNOT checks |  | Pauli/Thermal decoherence |  |
|  +--------------------+  +----------------------+  +---------------------------+  |
|  +--------------------+  +----------------------+  +---------------------------+  |
|  | Fingerprint Engine |  | Statistics Service   |  | Checkpoint Service        |  |
|  | Canonical hashing, |  | TVD, Hellinger, JSD, |  | Prefix simulation,        |  |
|  | Wilson CI bounds   |  | Chi2 significance    |  | earliest divergence track |  |
|  +--------------------+  +----------------------+  +---------------------------+  |
|  +--------------------+  +----------------------+  +---------------------------+  |
|  | BDH-CQ Reasoning   |  | LLM Explanation      |  | IBM Runtime Service       |  |
|  | Directed hypothesis|  | Grounded structured  |  | Heavy-hex topology,       |  |
|  | information gain   |  | diagnostics & repair |  | Safe QPU job confirmation |  |
|  +--------------------+  +----------------------+  +---------------------------+  |
+-----------------------------------------------------------------------------------+
                                          |
                                    (SQLAlchemy)
                                          v
+-----------------------------------------------------------------------------------+
|                        PERSISTENT STORAGE (PostgreSQL / SQLite)                   |
|  Circuits, Versions, Runs, Fingerprints, Comparisons, Checkpoints, Diagnoses, Jobs |
+-----------------------------------------------------------------------------------+
```

