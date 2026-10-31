# Quantum Fingerprint Schema (Version 1.0.0)

A Quantum Fingerprint in QuantumTrace AI is an immutable, cryptographic record of an executed circuit run:

```json
{
  "fingerprint_hash": "sha256_hex_digest_over_canonical_payload",
  "circuit_hash": "sha256_hex_digest_of_instruction_sequence",
  "execution_mode": "ideal | noisy | counterfactual | hardware",
  "schema_version": "1.0.0",
  "summary_metrics": {
    "entropy_bits": 1.0,
    "purity_estimate": 0.5,
    "dominant_states": [
      {"state": "00", "prob": 0.50},
      {"state": "11", "prob": 0.50}
    ],
    "distinct_outcomes_observed": 2,
    "qubit_count": 2,
    "circuit_depth": 2,
    "shot_count": 2048
  },
  "distribution": {
    "00": 0.501,
    "11": 0.499
  },
  "uncertainty_bounds": {
    "00": {
      "p": 0.501,
      "ci_95_lower": 0.479,
      "ci_95_upper": 0.523,
      "uncertainty_half_width": 0.022
    }
  }
}
```

Fingerprint hashes separate the static circuit definition from dynamic execution parameters, allowing reproducible tracking and cross-run variance auditing.

