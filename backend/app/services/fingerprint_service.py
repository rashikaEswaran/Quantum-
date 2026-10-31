import hashlib
import json
import math
from typing import Dict, Any, Tuple

class QuantumFingerprintService:
    @staticmethod
    def generate_fingerprint(
        circuit_hash: str,
        simulation_mode: str,
        shot_count: int,
        probabilities: Dict[str, float],
        observables: Dict[str, float],
        entropy: float,
        qubit_count: int,
        circuit_depth: int
    ) -> Tuple[str, Dict[str, Any], Dict[str, Any]]:
        """
        Creates a structured, reproducible quantum fingerprint from actual simulation outputs.
        Returns:
            (fingerprint_hash, summary_metrics, uncertainty_bounds)
        """
        # 1. Sort distribution by bitstring keys for canonical representation
        sorted_probs = {k: round(v, 6) for k, v in sorted(probabilities.items())}

        # 2. Extract top dominant basis states (probability >= 0.05)
        dominant_states = [
            {"state": k, "prob": round(v, 4)}
            for k, v in sorted(sorted_probs.items(), key=lambda item: item[1], reverse=True)
            if v >= 0.05
        ]

        # 3. Approximate state purity from measurement distribution: \gamma = \sum p_i^2
        purity_estimate = sum(p**2 for p in sorted_probs.values())

        summary_metrics = {
            "entropy_bits": round(entropy, 4),
            "purity_estimate": round(purity_estimate, 4),
            "dominant_states": dominant_states,
            "distinct_outcomes_observed": len(sorted_probs),
            "qubit_count": qubit_count,
            "circuit_depth": circuit_depth,
            "shot_count": shot_count
        }

        # 4. Compute finite-sampling uncertainty bounds using Wilson Score Interval (95% CI)
        # z = 1.96 for 95% confidence
        z = 1.96
        uncertainty_bounds = {}
        n = max(shot_count, 1)

        for bitstr, p in sorted_probs.items():
            denominator = 1.0 + (z**2) / n
            center = (p + (z**2) / (2 * n)) / denominator
            margin = (z * math.sqrt((p * (1.0 - p) / n) + (z**2) / (4 * (n**2)))) / denominator
            lower = max(0.0, center - margin)
            upper = min(1.0, center + margin)
            uncertainty_bounds[bitstr] = {
                "p": round(p, 4),
                "ci_95_lower": round(lower, 4),
                "ci_95_upper": round(upper, 4),
                "uncertainty_half_width": round(margin, 4)
            }

        # 5. Canonical cryptographic SHA-256 fingerprint hash
        canonical_payload = {
            "circuit_hash": circuit_hash,
            "mode": simulation_mode,
            "probs": sorted_probs,
            "observables": {k: round(v, 4) for k, v in sorted(observables.items())},
            "purity": round(purity_estimate, 4)
        }
        
        payload_bytes = json.dumps(canonical_payload, sort_keys=True).encode("utf-8")
        fingerprint_hash = hashlib.sha256(payload_bytes).hexdigest()

        return fingerprint_hash, summary_metrics, uncertainty_bounds

