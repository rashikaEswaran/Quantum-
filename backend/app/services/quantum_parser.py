import ast
import hashlib
import re
from typing import Dict, Any, Tuple, Optional, List
from qiskit import QuantumCircuit
from app.core.security import validate_quantum_code_safety
from app.core.logging import logger

def compute_canonical_circuit_hash(circuit: QuantumCircuit) -> str:
    """
    Computes a deterministic cryptographic SHA-256 hash for a quantum circuit
    based on its normalized gate sequence, qubits, clbits, and parameters.
    Does NOT use Python's non-deterministic process hash().
    """
    hasher = hashlib.sha256()
    hasher.update(f"qubits:{circuit.num_qubits};clbits:{circuit.num_clbits};".encode("utf-8"))
    
    canonical_instructions = []
    for instruction in circuit.data:
        op = instruction.operation
        q_indices = [circuit.find_bit(q).index for q in instruction.qubits]
        c_indices = [circuit.find_bit(c).index for c in instruction.clbits]
        
        # Round parameters to 6 decimal places to prevent float precision divergence
        params = []
        for p in op.params:
            if isinstance(p, (int, float)):
                params.append(f"{float(p):.6f}")
            else:
                params.append(str(p))
                
        canonical_str = f"{op.name}:q={q_indices}:c={c_indices}:p={params}"
        canonical_instructions.append(canonical_str)

    hasher.update(";".join(canonical_instructions).encode("utf-8"))
    return hasher.hexdigest()


class QuantumParserService:
    @staticmethod
    def parse_and_validate(code_str: str) -> Tuple[Optional[QuantumCircuit], Dict[str, Any], List[str]]:
        """
        Safely validates and executes Python quantum code to extract the QuantumCircuit object.
        Returns (QuantumCircuit, metadata_dict, errors).
        """
        is_safe, safety_issues = validate_quantum_code_safety(code_str)
        if not is_safe:
            return None, {}, safety_issues

        # Create isolated execution scope with allowed quantum tools
        scope = {
            "QuantumCircuit": QuantumCircuit,
            "qc": None,
            "circuit": None
        }
        
        # Pre-import safe modules
        try:
            import numpy as np
            import math
            scope["np"] = np
            scope["math"] = math
        except ImportError:
            pass

        try:
            # Execute code safely inside isolated scope
            exec(code_str, scope)
        except Exception as e:
            return None, {}, [f"Circuit execution error: {str(e)}"]

        # Locate QuantumCircuit instance in scope
        circuit = None
        for val in scope.values():
            if isinstance(val, QuantumCircuit):
                circuit = val
                break

        if circuit is None:
            return None, {}, ["No QuantumCircuit object instantiated in provided code. Define 'qc = QuantumCircuit(...)"]

        # Extract gate counts
        gate_counts = {}
        for inst in circuit.data:
            name = inst.operation.name
            gate_counts[name] = gate_counts.get(name, 0) + 1

        canonical_hash = compute_canonical_circuit_hash(circuit)

        metadata = {
            "qubit_count": circuit.num_qubits,
            "clbit_count": circuit.num_clbits,
            "circuit_depth": circuit.depth(),
            "gate_counts": gate_counts,
            "canonical_hash": canonical_hash,
            "instruction_count": len(circuit.data)
        }

        return circuit, metadata, []

