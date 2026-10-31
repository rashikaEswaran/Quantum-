import uuid
from typing import List, Dict, Any, Tuple
from qiskit import QuantumCircuit
from app.services.simulator import QuantumSimulatorService
from app.services.statistics_service import StatisticsService
from app.services.fingerprint_service import QuantumFingerprintService
from app.services.quantum_parser import compute_canonical_circuit_hash

class CheckpointService:
    @staticmethod
    def generate_checkpoints(circuit: QuantumCircuit, target_segments: int = 4) -> List[Dict[str, Any]]:
        """
        Partitions a quantum circuit into meaningful execution checkpoints.
        Preserves complete prefix semantics by constructing valid prefix circuits up to each boundary.
        """
        total_instructions = len(circuit.data)
        if total_instructions <= 2:
            step = 1
        else:
            step = max(1, total_instructions // target_segments)

        checkpoints = []
        indices = list(range(step, total_instructions + 1, step))
        if indices[-1] < total_instructions:
            indices.append(total_instructions)

        for i, cut_idx in enumerate(indices):
            # Create prefix circuit containing all operations from start up to cut_idx
            prefix_qc = QuantumCircuit(circuit.num_qubits, circuit.num_clbits)
            involved_qubits = set()
            
            for inst in circuit.data[:cut_idx]:
                op = inst.operation
                q_indices = [circuit.find_bit(q).index for q in inst.qubits]
                c_indices = [circuit.find_bit(c).index for c in inst.clbits]
                prefix_qc.append(op, q_indices, c_indices)
                involved_qubits.update(q_indices)

            checkpoints.append({
                "checkpoint_index": i + 1,
                "name": f"Checkpoint {i + 1}: Gates 1 to {cut_idx}",
                "gate_range_start": 0,
                "gate_range_end": cut_idx,
                "involved_qubits": sorted(list(involved_qubits)),
                "prefix_circuit": prefix_qc,
                "instruction_count": cut_idx
            })

        return checkpoints

    @staticmethod
    def evaluate_checkpoints(
        circuit: QuantumCircuit,
        shot_count: int = 2048,
        noise_model_type: str = "depolarizing_readout"
    ) -> List[Dict[str, Any]]:
        """
        Executes prefix simulations for every checkpoint under both ideal and noisy conditions.
        Measures the progression of state divergence across the timeline.
        """
        raw_checkpoints = CheckpointService.generate_checkpoints(circuit)
        evaluated_checkpoints = []
        earliest_divergence_found = False

        for cp in raw_checkpoints:
            prefix_qc: QuantumCircuit = cp["prefix_circuit"]
            
            # 1. Ideal prefix simulation
            ideal_res = QuantumSimulatorService.simulate(
                prefix_qc,
                simulation_mode="ideal",
                shot_count=shot_count
            )
            
            # 2. Noisy prefix simulation
            noisy_res = QuantumSimulatorService.simulate(
                prefix_qc,
                simulation_mode="noisy",
                shot_count=shot_count,
                noise_model_type=noise_model_type
            )

            # 3. Compare ideal vs noisy at this prefix
            stats = StatisticsService.compare_distributions(
                ideal_res["probabilities"],
                noisy_res["probabilities"],
                shots_p=shot_count,
                shots_q=shot_count
            )

            tv = stats["total_variation_distance"]
            is_suspected = False
            # First checkpoint where TV distance exceeds 0.08 is flagged as primary suspect
            if tv >= 0.08 and not earliest_divergence_found:
                is_suspected = True
                earliest_divergence_found = True

            prefix_hash = compute_canonical_circuit_hash(prefix_qc)
            ideal_fp, _, _ = QuantumFingerprintService.generate_fingerprint(
                prefix_hash, "ideal", shot_count,
                ideal_res["probabilities"], ideal_res["observables"],
                ideal_res["entropy"], prefix_qc.num_qubits, prefix_qc.depth()
            )
            noisy_fp, _, _ = QuantumFingerprintService.generate_fingerprint(
                prefix_hash, "noisy", shot_count,
                noisy_res["probabilities"], noisy_res["observables"],
                noisy_res["entropy"], prefix_qc.num_qubits, prefix_qc.depth()
            )

            evaluated_checkpoints.append({
                "checkpoint_index": cp["checkpoint_index"],
                "name": cp["name"],
                "gate_range_end": cp["gate_range_end"],
                "involved_qubits": cp["involved_qubits"],
                "total_variation_distance": tv,
                "hellinger_distance": stats["hellinger_distance"],
                "jensen_shannon_divergence": stats["jensen_shannon_divergence"],
                "is_suspected_divergence": is_suspected,
                "ideal_distribution": ideal_res["probabilities"],
                "noisy_distribution": noisy_res["probabilities"],
                "ideal_fingerprint_hash": ideal_fp,
                "noisy_fingerprint_hash": noisy_fp
            })

        return evaluated_checkpoints

