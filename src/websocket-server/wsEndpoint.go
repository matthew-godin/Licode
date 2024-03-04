package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

// maybe do diagnostics to adjust these values
// I believe we want the usage of each to be roughly
// 50% at all times
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func wsEndpoint(w http.ResponseWriter, r *http.Request) {
	//dumby cors checker
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}

	log.Println("Client Connected on Web Socket")
	reader(ws)
}
