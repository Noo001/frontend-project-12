install:
	npm ci

build:
	cd frontend && npm run build

start:
	npx start-server -s ./frontend/dist

.PHONY: install build start
