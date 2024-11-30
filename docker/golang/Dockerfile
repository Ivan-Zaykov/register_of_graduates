FROM golang:1.23 as dev
WORKDIR /root
COPY go.* ./

ENV GOPATH=/

RUN go mod download
#CMD ["go", "run", "main.go"]
ENTRYPOINT /bin/bash