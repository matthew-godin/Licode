package main

import (
	"sync"

	"github.com/gorilla/websocket"
)

// the state of a player
type Player struct {
	//has the player arrived at the code editor
	connected bool

	//id provided by matchmaking
	id string

	//id of the player's opponent
	opponent *Player

	//the player's connection
	conn *websocket.Conn

	//queue of messages to be sent
	inbox []WrappedMsg

	mu sync.Mutex
}
