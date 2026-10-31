import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "QuantumTrace AI"
    APP_ENV: str = os.getenv("APP_ENV", "development")
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./quantumtrace.db")
    
    # IBM Quantum
    IBM_QUANTUM_TOKEN: str = os.getenv("IBM_QUANTUM_TOKEN", "")
    IBM_QUANTUM_INSTANCE: str = os.getenv("IBM_QUANTUM_INSTANCE", "ibm-q/open/main")
    
    # LLM Settings
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "mock")
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gpt-4o-mini")
    
    # BDH-CQ Reasoning
    ENABLE_BDHCQ: bool = os.getenv("ENABLE_BDHCQ", "true").lower() == "true"
    BDHCQ_MODE: str = os.getenv("BDHCQ_MODE", "adaptive")
    
    # Simulation Defaults
    DEFAULT_SHOTS: int = int(os.getenv("DEFAULT_SHOTS", "2048"))
    MAX_QUBITS: int = int(os.getenv("MAX_QUBITS", "20"))
    CIRCUIT_TIMEOUT_SECONDS: int = int(os.getenv("CIRCUIT_TIMEOUT_SECONDS", "30"))

settings = Settings()

