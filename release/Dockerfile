FROM golang:1.18-buster AS builder
WORKDIR /project
ENV KO_DATA_PATH /project/kodata

COPY tea ./
COPY kodata ${KO_DATA_PATH}/

EXPOSE 8081

ENTRYPOINT ["/project/tea"]