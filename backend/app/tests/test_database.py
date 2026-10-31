import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database.session import Base
from app.database.models.models import Project, QuantumCircuit, SimulationRun, QuantumFingerprint

@pytest.fixture
def test_db():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    db = Session()
    yield db
    db.close()

def test_database_persistence_and_relationships(test_db):
    proj = Project(name="Test Project", description="Testing relationships")
    test_db.add(proj)
    test_db.commit()

    qc = QuantumCircuit(
        project_id=proj.id,
        name="test_circuit",
        source_code="qc = QuantumCircuit(2)",
        canonical_hash="testhash123",
        qubit_count=2,
        circuit_depth=1
    )
    test_db.add(qc)
    test_db.commit()

    run = SimulationRun(
        circuit_id=qc.id,
        simulation_mode="ideal",
        shot_count=1024,
        raw_counts={"00": 512, "11": 512},
        probabilities={"00": 0.5, "11": 0.5}
    )
    test_db.add(run)
    test_db.commit()

    fp = QuantumFingerprint(
        run_id=run.id,
        circuit_hash="testhash123",
        fingerprint_hash="fp12345",
        execution_mode="ideal"
    )
    test_db.add(fp)
    test_db.commit()

    # Query back
    retrieved_proj = test_db.query(Project).filter(Project.id == proj.id).first()
    assert len(retrieved_proj.circuits) == 1
    assert retrieved_proj.circuits[0].runs[0].fingerprint.fingerprint_hash == "fp12345"

