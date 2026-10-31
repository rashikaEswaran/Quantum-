"""
Readout Permutation Bug:
Qubit 0 is measured into classical bit c[1], and qubit 1 into c[0].
"""
from qiskit import QuantumCircuit

qc = QuantumCircuit(2, 2)
qc.x(0)  # Prepare |01> (q0=1, q1=0)
qc.measure(0, 1)  # Mapping inversion
qc.measure(1, 0)

