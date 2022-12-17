run:
	@KO_DATA_PATH=cmd/kodata/ SAAS_ADDRESS="http://localhost:45005" go run cmd/main.go

staging:
	@KO_DATA_PATH=cmd/kodata/ SAAS_ADDRESS="http://104.37.251.139:8080" go run cmd/main.go

build:
	@cd ../react-app && yarn build
	@cd ../react-app && rm -rf ../backend/cmd/kodata  &&  mv build kodata && mv kodata ../backend/cmd/kodata 

debug:
	@make build
	@make run

image:
	@docker build -t imaybeagod/tea . && docker push imaybeagod/tea