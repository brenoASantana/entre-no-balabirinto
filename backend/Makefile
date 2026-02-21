.PHONY: help install build run test clean fmt lint

help:
	@echo "🚀 Entre no Balabirinto - Backend Makefile"
	@echo "=========================================="
	@echo "Available commands:"
	@echo "  make install    - Download dependencies"
	@echo "  make build      - Build the binary"
	@echo "  make run        - Run the server (development)"
	@echo "  make run-prod   - Run the server (production)"
	@echo "  make test       - Run tests"
	@echo "  make fmt        - Format code"
	@echo "  make lint       - Lint code"
	@echo "  make clean      - Remove build artifacts"
	@echo "  make docker     - Build Docker image"

install:
	@echo "📦 Installing dependencies..."
	go mod download
	go mod tidy

build:
	@echo "🔨 Building..."
	CGO_ENABLED=1 go build -o leaderboard-api -v .

run:
	@echo "🚀 Running server (Development)..."
	go run . -port :8080 -db leaderboard.db

run-prod:
	@echo "🚀 Running server (Production)..."
	./leaderboard-api -port :8080 -db leaderboard.db

test:
	@echo "🧪 Running tests..."
	go test -v -race ./...

fmt:
	@echo "🎨 Formatting code..."
	go fmt ./...

lint:
	@echo "🔍 Linting code..."
	golangci-lint run ./... || true

clean:
	@echo "🧹 Cleaning..."
	rm -f leaderboard-api
	rm -f leaderboard.db
	go clean

docker:
	@echo "🐳 Building Docker image..."
	docker build -t leaderboard-api:latest .

docker-run:
	@echo "🐳 Running Docker container..."
	docker run -p 8080:8080 -v /tmp/leaderboard:/data leaderboard-api:latest
