"""
Deliberately Inverted CNOT Control/Target Bug:
Intended to entangle with q0 as control, but mistakenly calls cx(1, 0).
"""
from qiskit import QuantumCircuit

qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(1, 0) # BUG: control is 1 (which is |0>), so target 0 never flips!
qc.measure(0, 0)
qc.measure(1, 1)

