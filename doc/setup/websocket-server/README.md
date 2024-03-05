# WebSocket Server Installation

Download the Go archive at https://go.dev/dl/.

Run the following commands to install Go and the Gorilla WebSocket package.

```bash
rm -rf /usr/local/go
tar -C /usr/local -xzf go1.22.0.linux-amd64.tar.gz
go install github.com/gorilla/websocket@latest
```

Start the WebSocket server with the following command.

```bash
go run .
```

In production, use the following command.

```bash
go run . &
```
