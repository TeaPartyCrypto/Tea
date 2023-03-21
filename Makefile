run:
	@cd packages/backend && make run

staging:
	@cd packages/backend && make staging

build:
	@cd packages/backend && make build

release:
	@cd packages/backend && make release

debug:
	@make build
	@make run

image:
	@cd packages/backend && gcloud builds submit --tag gcr.io/mineonlium/tea --project mineonlium
