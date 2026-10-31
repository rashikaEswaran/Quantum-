# IBM Quantum Integration Guide

## 1. Credentials Configuration
To connect live IBM Quantum QPUs, set your API token in `.env`:

```env
IBM_QUANTUM_TOKEN=your_token_here
IBM_QUANTUM_INSTANCE=ibm-q/open/main
```

## 2. Safety Safeguards
- **Explicit Confirmation Required**: Quantum jobs will **NEVER** automatically submit to physical QPU resources. The API rejects any request where `confirmed=False`.
- **Honest Offline Mode**: When running without credentials, QuantumTrace AI provides authentic architecture topology maps (e.g. 127-qubit Eagle r3 heavy-hex layout) and calibrated simulations clearly tagged with provenance `Cached Architecture Reference`.
- **Zero Fabrication**: Live QPU results are only displayed if returned by the verified `qiskit-ibm-runtime` API.

