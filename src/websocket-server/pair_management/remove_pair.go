package pair_management

import (
	"log"
	"server/players"
)

func RemovePair(id string) {
	players.PlayersMU.Lock()

	//remove player
	player, ok := players.Players[id]
	if ok {
		if player.Opponent != nil {
			opponent, ok := players.Players[player.Opponent.Id]
			if ok && opponent.Opponent.Id == id {
				delete(players.Players, player.Opponent.Id)
			} else {
				//error?
			}
		}

		log.Println("Removing Player")
		delete(players.Players, id)
	}

	players.PlayersMU.Unlock()
}
