install:
	npm ci --omit=dev
	cd frontend && npm ci

build:
	cd frontend && npm run build

start:
	npx start-server -s ./frontend/dist

.PHONY: install build start
