install:
	npm ci --omit=dev
	cd frontend && npm ci

build:
	cd frontend && npm run build
	cp -r frontend/build ./build

start:
	npx start-server

.PHONY: install build start
