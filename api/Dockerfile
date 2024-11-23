FROM golang:1.20.1 as dev
WORKDIR /root
COPY go.* ./
RUN go mod download
COPY . .
CMD ["go", "run", "main.go"]