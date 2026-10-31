"""
Bell State Preparation: |Φ⁺⟩ = (|00⟩ + |11⟩)/√2
Expected distribution:
{"00": 0.5, "11": 0.5}
"""
from qiskit import QuantumCircuit

qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.measure(0, 0)
qc.measure(1, 1)

