# Start with Go's tooling
FROM golang:1.16-alpine
WORKDIR /minesweeper

# Gather dependencies
COPY go.mod ./
COPY go.sum ./
RUN go mod download

# Compile the application
COPY *.go ./
COPY logic/*.go ./logic/
COPY repo/*.go ./repo/
COPY static-assets/ ./static-assets/
COPY templates/ ./templates/
RUN go build -o minesweeper

CMD [ "/minesweeper/minesweeper" ]

