"""
GHZ Tripartite Entanglement: (|000⟩ + |111⟩)/√2
Expected distribution:
{"000": 0.5, "111": 0.5}
"""
from qiskit import QuantumCircuit

qc = QuantumCircuit(3, 3)
qc.h(0)
qc.cx(0, 1)
qc.cx(1, 2)
qc.measure(0, 0)
qc.measure(1, 1)
qc.measure(2, 2)

