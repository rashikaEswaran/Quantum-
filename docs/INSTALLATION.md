# QuantumTrace AI: Installation & Startup Guide

## Prerequisites
- Python 3.10+ (tested and running on Python 3.13)
- Node.js 18+ (tested on Node v24)
- PostgreSQL (Optional: SQLite is configured automatically out of the box for immediate local development)

## Quick Start (Local Development)

### 1. Backend Setup
```bash
cd backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- The backend initializes the database schema automatically.
- API interactive docs available at: `http://127.0.0.1:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
npm run dev
```
- Open `http://localhost:5173` in your browser.

### 3. Running Backend Tests
```bash
$env:PYTHONPATH="backend"; python -m pytest -v backend/app/tests
```

