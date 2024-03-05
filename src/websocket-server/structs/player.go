package structs

import (
	"sync"

	"github.com/gorilla/websocket"
)

// the state of a player
type Player struct {
	//has the player arrived at the code editor
	Connected bool

	//id provided by matchmaking
	Id string

	//id of the player's opponent
	Opponent *Player

	//the player's connection
	Conn *websocket.Conn

	//queue of messages to be sent
	Inbox []WrappedMsg

	Mu sync.Mutex
}

// Player ctor
func NewPlayer(connected bool, id string) *Player {
	return &Player{
		Connected: connected,
		Id:        id,
		Opponent:  nil,
		Conn:      nil,
	}
}
