import uuid
from typing import List, Dict, Any, Optional
from qiskit import QuantumCircuit
from app.schemas.schemas import StaticFinding

class StaticAnalyzerService:
    @staticmethod
    def analyze_circuit(
        circuit: QuantumCircuit, 
        source_code: str, 
        expected_distribution: Optional[Dict[str, float]] = None
    ) -> List[StaticFinding]:
        findings: List[StaticFinding] = []
        
        # 1. Check for measurements
        has_measurement = any(inst.operation.name == "measure" for inst in circuit.data)
        if not has_measurement:
            findings.append(StaticFinding(
                finding_id=f"FIND-MEAS-{uuid.uuid4().hex[:6]}",
                category="Measurement",
                severity="warning",
                affected_qubits=list(range(circuit.num_qubits)),
                explanation="No measurement operations detected in the quantum circuit.",
                evidence=f"Circuit has {circuit.num_qubits} qubits and {circuit.num_clbits} clbits, but 0 measure gates.",
                confidence=1.0,
                suggested_action="Add `qc.measure_all()` or explicit `qc.measure(q, c)` mappings before sampling counts."
            ))

        # 2. Check measurement mapping alignment (e.g., measuring qubit i into clbit j where i != j without explicit intention)
        measurement_mappings = {}
        for inst in circuit.data:
            if inst.operation.name == "measure":
                q_idx = circuit.find_bit(inst.qubits[0]).index
                c_idx = circuit.find_bit(inst.clbits[0]).index
                measurement_mappings[q_idx] = c_idx

        # If qubits are measured into mismatched classical bits
        for q_idx, c_idx in measurement_mappings.items():
            if q_idx != c_idx:
                findings.append(StaticFinding(
                    finding_id=f"FIND-MAP-{uuid.uuid4().hex[:6]}",
                    category="Readout Mapping",
                    severity="info",
                    affected_qubits=[q_idx],
                    explanation=f"Qubit q[{q_idx}] is measured into classical bit c[{c_idx}].",
                    evidence=f"qc.measure({q_idx}, {c_idx}) creates an inverted or permuted bitstring ordering.",
                    confidence=0.85,
                    suggested_action="Verify if the classical bit permutation is deliberate or if q[0]->c[0] was intended."
                ))

        # 3. Check for disconnected / idle qubits
        touched_qubits = set()
        for inst in circuit.data:
            for q in inst.qubits:
                touched_qubits.add(circuit.find_bit(q).index)

        all_qubits = set(range(circuit.num_qubits))
        idle_qubits = all_qubits - touched_qubits
        if idle_qubits:
            findings.append(StaticFinding(
                finding_id=f"FIND-IDLE-{uuid.uuid4().hex[:6]}",
                category="Structural Anomaly",
                severity="warning",
                affected_qubits=list(idle_qubits),
                explanation=f"Qubits {sorted(list(idle_qubits))} are allocated but never touched by any quantum gates.",
                evidence=f"Total allocated qubits: {circuit.num_qubits}; untouched: {sorted(list(idle_qubits))}.",
                confidence=0.95,
                suggested_action="Remove unused qubits or check if operations were inadvertently assigned to the wrong register index."
            ))

        # 4. Check for consecutive redundant gates (e.g. H followed directly by H, or X followed by X on the same qubit)
        qubit_last_gate: Dict[int, str] = {}
        for inst in circuit.data:
            op_name = inst.operation.name
            if len(inst.qubits) == 1:
                q_idx = circuit.find_bit(inst.qubits[0]).index
                prev_op = qubit_last_gate.get(q_idx)
                if prev_op in ["h", "x", "y", "z"] and prev_op == op_name:
                    findings.append(StaticFinding(
                        finding_id=f"FIND-SELF-INV-{uuid.uuid4().hex[:6]}",
                        category="Gate Redundancy",
                        severity="info",
                        affected_qubits=[q_idx],
                        explanation=f"Consecutive self-inverse gate '{op_name.upper()}' applied on qubit {q_idx}.",
                        evidence=f"Two successive '{op_name.upper()}' gates cancel to identity: U*U = I.",
                        confidence=0.90,
                        suggested_action="Review whether intermediate operations were omitted between the gates."
                    ))
                qubit_last_gate[q_idx] = op_name
            else:
                for q in inst.qubits:
                    q_idx = circuit.find_bit(q).index
                    qubit_last_gate[q_idx] = op_name

        # 5. Check circuit depth and gate count vs decoherence vulnerability
        if circuit.depth() > 40:
            findings.append(StaticFinding(
                finding_id=f"FIND-DEPTH-{uuid.uuid4().hex[:6]}",
                category="Decoherence Risk",
                severity="warning",
                affected_qubits=list(range(circuit.num_qubits)),
                explanation=f"Circuit depth is {circuit.depth()}, which poses elevated risk of T1/T2 decoherence on NISQ processors.",
                evidence=f"Depth {circuit.depth()} exceeds typical coherent two-qubit execution budgets on noisy backends.",
                confidence=0.80,
                suggested_action="Consider circuit transpilation with higher optimization levels or dynamical decoupling."
            ))

        return findings

