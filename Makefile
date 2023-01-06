run:
	@cd packages/backend && make run

staging:
	@cd packages/backend && make staging

build:
	@cd packages/backend && make build

debug:
	@make build
	@make run

image:
	@make build
	@cd packages/backend && gcloud builds submit --tag gcr.io/mineonlium/tea