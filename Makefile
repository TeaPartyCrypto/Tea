run:
	@cd packages/backend && make run

staging:
	@cd packages/backend && make staging

prod:
	@cd packages/backend && make prod

build:
	@cd packages/backend && yarn i && make build

release:
	@cd packages/backend && make release

debug:
	@make build
	@make run

image:
	@make build
	@cd packages/backend && gcloud builds submit --tag gcr.io/mineonlium/tea --project mineonlium 
