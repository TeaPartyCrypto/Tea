FROM golang:1.18-buster AS builder
WORKDIR /project
COPY . ./
RUN cd /project/cmd && go build -o /project/bin/be

FROM registry.access.redhat.com/ubi8/ubi-minimal
EXPOSE 8080
ENV KO_DATA_PATH /kodata
COPY --from=builder /project/cmd/kodata/ ${KO_DATA_PATH}/
COPY --from=builder /project/bin/be /be

ENTRYPOINT ["/be"]