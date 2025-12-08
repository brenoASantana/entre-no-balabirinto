.PHONY: help install dev build serve clean lint type-check format

help:
	@echo "Gungeon Game - Available Commands"
	@echo "=================================="
	@echo "make install      - Install dependencies"
	@echo "make dev          - Start development server"
	@echo "make build        - Build for production"
	@echo "make serve        - Preview production build"
	@echo "make clean        - Remove build and node_modules"
	@echo "make lint         - Run linter checks"
	@echo "make type-check   - Check TypeScript types"
	@echo "make format       - Format code with Prettier"
	@echo "make help         - Show this help message"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

serve:
	npm run serve

clean:
	rm -rf node_modules dist build .next out
	find . -name "*.log" -delete
	find . -name ".DS_Store" -delete

lint:
	npm run lint 2>/dev/null || echo "Linter not configured yet"

type-check:
	npx tsc --noEmit

format:
	npx prettier --write "src/**/*.{ts,tsx,css,json}"

watch:
	npm run dev

ci: install type-check build

.DEFAULT_GOAL := help
