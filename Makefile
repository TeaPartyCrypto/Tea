run:
	@KO_DATA_PATH=cmd/kodata/ SAAS_ADDRESS="http://localhost:45005" go run cmd/main.go

staging:
	@KO_DATA_PATH=cmd/kodata/ SAAS_ADDRESS="http://104.37.251.139:8080" go run cmd/main.go

build:
	@cd cmd && go build -o tea main.go && mv tea ../public/tea
	@cd fe && yarn build
	@cd fe && rm -rf kodata &&  mv build kodata && rm -rf ../cmd/kodata && rm -rf ../public/kodata && cp -r kodata ../cmd/kodata && cp -r kodata ../public/kodata


debug:
	@make build
	@make run

image:
	@make build
	@docker build -t imaybeagod/tea . && docker push imaybeagod/tea