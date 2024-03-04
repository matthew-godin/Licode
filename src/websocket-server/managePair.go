package main

import (
	"fmt"
	"log"
)

// Player ctor
func newPlayer(connected bool, id string) *Player {
	return &Player{
		connected: connected,
		id:        id,
		opponent:  nil,
		conn:      nil,
	}
}

// input to the /register method
// specifies two players that will
// compete
type Pair struct {
	Id1 string `json:"Id1"`
	Id2 string `json:"Id2"`
}

func addPair(pair Pair) {
	playersMU.Lock()

	//make first new player
	players[pair.Id1] = newPlayer(false, pair.Id1)
	//same for second
	players[pair.Id2] = newPlayer(false, pair.Id2)

	//link players together
	players[pair.Id1].opponent = players[pair.Id2]
	players[pair.Id2].opponent = players[pair.Id1]

	log.Println(fmt.Sprintf("registered pair: %s, %s", pair.Id1, pair.Id2))

	playersMU.Unlock()
}

func removePair(id string) {
	playersMU.Lock()

	//remove player
	player, ok := players[id]
	if ok {
		if player.opponent != nil {
			opponent, ok := players[player.opponent.id]
			if ok && opponent.opponent.id == id {
				delete(players, player.opponent.id)
			} else {
				//error?
			}
		}

		log.Println("Removing Player")
		delete(players, id)
	}

	playersMU.Unlock()
}
