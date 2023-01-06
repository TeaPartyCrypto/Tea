FROM golang:1.18-buster AS builder
WORKDIR /project
COPY . ./
RUN cd /project/cmd && go build -o /project/bin/be

ENV KO_DATA_PATH /project/kodata
COPY /cmd/kodata/ ${KO_DATA_PATH}/
EXPOSE 8081
USER root

ENTRYPOINT ["/project/bin/be"]