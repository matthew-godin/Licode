# Websocket Server Installation

Download the Go archive at https://go.dev/dl/.

```bash
rm -rf /usr/local/go
tar -C /usr/local -xzf go1.22.0.linux-amd64.tar.gz
go install github.com/gorilla/websocket@latest
```

Start the Websocket server with the following command.

```bash
go run server.go
```

In production, use the following command.

```bash
go run server.go &
```
