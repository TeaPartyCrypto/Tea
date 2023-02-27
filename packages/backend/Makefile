run:
	@KO_DATA_PATH=cmd/kodata/ SAAS_ADDRESS="http://localhost:45005" go run cmd/main.go

staging:
	@KO_DATA_PATH=cmd/kodata/ SAAS_ADDRESS="http://34.172.60.163:8080" go run cmd/main.go

build:
	@cd cmd && go mod tidy && go build -o ../../../release/tea main.go
	@cd ../react-app && yarn && yarn build
	@cd ../react-app && rm -rf ../backend/cmd/kodata  &&  mv build kodata && cp -r kodata ../../release/  && mv kodata ../backend/cmd/kodata 

debug:
	@make build
	@make run

image:
	@docker build -t imaybeagod/tea . && docker push imaybeagod/tea
