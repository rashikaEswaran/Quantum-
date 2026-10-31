import re
from typing import Dict, Any, Tuple, Optional
from qiskit import QuantumCircuit
from app.services.simulator import QuantumSimulatorService
from app.services.statistics_service import StatisticsService
from app.services.fingerprint_service import QuantumFingerprintService
from app.services.quantum_parser import compute_canonical_circuit_hash

class CounterfactualService:
    @staticmethod
    def parse_query_to_proposal(user_query: str) -> Dict[str, Any]:
        """
        Translates a natural language 'What if?' question into a validated counterfactual intervention proposal.
        """
        q_lower = user_query.lower()

        if "readout" in q_lower or "measurement" in q_lower:
            return {
                "parameter_type": "noise_readout",
                "parameter_name": "readout_error",
                "original_value": 0.03,
                "counterfactual_value": 0.005,
                "objective": "Evaluate circuit output fidelity if readout mitigation or higher-fidelity measurement discriminators were deployed.",
                "expected_outcome": "Reduced bit-flip measurement noise, restoring contrast on dominant computational states.",
                "prioritization_score": 0.92,
                "feasibility": "High (Readout mitigation or better calibrated qubit measurement)",
                "simulation_override": {
                    "noise_model_type": "depolarizing_readout",
                    "noise_params": {"readout_error": 0.005, "two_qubit_error": 0.015}
                }
            }

        elif "gate noise" in q_lower or "two-qubit" in q_lower or "cnot" in q_lower or "cx" in q_lower:
            return {
                "parameter_type": "noise_gate",
                "parameter_name": "two_qubit_error",
                "original_value": 0.015,
                "counterfactual_value": 0.002,
                "objective": "Test fidelity gains if entangling 2-qubit gate errors were reduced (e.g. cross-resonance calibration).",
                "expected_outcome": "Diminished entanglement depolarization, significantly lowering total variation distance.",
                "prioritization_score": 0.88,
                "feasibility": "Medium (Requires lower-defect coupler or composite pulse sequence)",
                "simulation_override": {
                    "noise_model_type": "depolarizing_readout",
                    "noise_params": {"two_qubit_error": 0.002, "readout_error": 0.03}
                }
            }

        elif "thermal" in q_lower or "t1" in q_lower or "t2" in q_lower or "relaxation" in q_lower or "dephasing" in q_lower:
            return {
                "parameter_type": "noise_coherence",
                "parameter_name": "coherence_times",
                "original_value": {"t1_us": 50.0, "t2_us": 70.0},
                "counterfactual_value": {"t1_us": 150.0, "t2_us": 180.0},
                "objective": "Model the effect of extended qubit lifetime and dephasing times on accumulated circuit depth.",
                "expected_outcome": "Higher survival of superposition phases, reducing background uniform noise leakage.",
                "prioritization_score": 0.81,
                "feasibility": "Medium (Hardware fabrication upgrade or dynamical decoupling sequences)",
                "simulation_override": {
                    "noise_model_type": "thermal_relaxation",
                    "noise_params": {"t1_us": 150.0, "t2_us": 180.0}
                }
            }

        else:
            # General low-noise exploration
            return {
                "parameter_type": "noise_holistic",
                "parameter_name": "all_noise_attenuation",
                "original_value": 1.0,
                "counterfactual_value": 0.25,
                "objective": f"Assess hypothesis: '{user_query}'",
                "expected_outcome": "Benchmark sensitivity to combined physical noise attenuations.",
                "prioritization_score": 0.75,
                "feasibility": "High (Simulated counterfactual sandbox)",
                "simulation_override": {
                    "noise_model_type": "depolarizing_readout",
                    "noise_params": {"single_qubit_error": 0.0002, "two_qubit_error": 0.003, "readout_error": 0.008}
                }
            }

    @staticmethod
    def execute_counterfactual(
        circuit: QuantumCircuit,
        proposal: Dict[str, Any],
        ideal_probabilities: Dict[str, float],
        noisy_probabilities: Dict[str, float],
        shot_count: int = 2048
    ) -> Dict[str, Any]:
        """
        Executes the counterfactual simulation and evaluates improvement relative to both ideal and noisy baselines.
        """
        sim_override = proposal.get("simulation_override", {})
        noise_type = sim_override.get("noise_model_type", "depolarizing_readout")
        noise_params = sim_override.get("noise_params", {})

        cf_result = QuantumSimulatorService.simulate(
            circuit,
            simulation_mode="counterfactual",
            shot_count=shot_count,
            noise_model_type=noise_type,
            noise_params=noise_params
        )

        cf_probs = cf_result["probabilities"]

        # Compare counterfactual vs ideal baseline
        vs_ideal = StatisticsService.compare_distributions(
            ideal_probabilities, cf_probs, shots_p=shot_count, shots_q=shot_count
        )

        # Compare original noisy vs counterfactual
        vs_noisy = StatisticsService.compare_distributions(
            noisy_probabilities, cf_probs, shots_p=shot_count, shots_q=shot_count
        )

        # Baseline noisy vs ideal
        baseline_diff = StatisticsService.compare_distributions(
            ideal_probabilities, noisy_probabilities, shots_p=shot_count, shots_q=shot_count
        )

        # Fidelity recovery: how much TV distance to ideal was eliminated
        original_tv = baseline_diff["total_variation_distance"]
        counterfactual_tv = vs_ideal["total_variation_distance"]
        tv_reduction = max(0.0, original_tv - counterfactual_tv)
        recovery_pct = (tv_reduction / original_tv * 100.0) if original_tv > 1e-6 else 0.0

        cf_hash, summary, uncertainty = QuantumFingerprintService.generate_fingerprint(
            compute_canonical_circuit_hash(circuit),
            "counterfactual",
            shot_count,
            cf_probs,
            cf_result["observables"],
            cf_result["entropy"],
            circuit.num_qubits,
            circuit.depth()
        )

        return {
            "fingerprint_hash": cf_hash,
            "probabilities": cf_probs,
            "observables": cf_result["observables"],
            "entropy": cf_result["entropy"],
            "uncertainty_bounds": uncertainty,
            "total_variation_to_ideal": round(counterfactual_tv, 4),
            "tv_reduction_from_baseline": round(tv_reduction, 4),
            "fidelity_recovery_percent": round(recovery_pct, 1),
            "statistical_significance": vs_ideal["statistical_significance"],
            "summary_interpretation": f"Under the proposed counterfactual ({proposal['parameter_name']}), TV divergence drops from {original_tv:.3f} to {counterfactual_tv:.3f} ({recovery_pct:.1f}% fidelity recovery)."
        }

