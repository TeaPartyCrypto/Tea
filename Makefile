run:
	@cd packages/backend && make run

staging:
	@KO_DATA_PATH=cmd/kodata/ SAAS_ADDRESS="http://104.37.251.139:8080" go run cmd/main.go

build:
	@cd packages/backend && make build

debug:
	@make build
	@make run

image:
	@make build
	@cd packages/backend && gcloud builds submit --tag gcr.io/mineonlium/tea