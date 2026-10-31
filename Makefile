.PHONY: help install-backend install-frontend dev-backend dev-frontend test-backend test-frontend docker-up docker-down

help:
	@echo "QuantumTrace AI Developer Commands:"
	@echo "  make install-backend   - Install backend dependencies"
	@echo "  make install-frontend  - Install frontend dependencies"
	@echo "  make dev-backend       - Run FastAPI backend development server"
	@echo "  make dev-frontend      - Run Vite frontend development server"
	@echo "  make test-backend      - Run backend pytest suite"
	@echo "  make test-frontend     - Run frontend vitest suite"
	@echo "  make docker-up         - Start services with docker-compose"
	@echo "  make docker-down       - Stop docker-compose services"

install-backend:
	cd backend && pip install -r requirements.txt

install-frontend:
	cd frontend && npm install

dev-backend:
	cd backend && python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

dev-frontend:
	cd frontend && npm run dev

test-backend:
	cd backend && pytest -v

test-frontend:
	cd frontend && npm run test

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

