install:
	npm ci --omit=dev
	cd frontend && npm ci

build:
	cd frontend && npm run build
	mkdir -p build
	cp -r frontend/dist/* build/

start:
	npx start-server

.PHONY: install build start
