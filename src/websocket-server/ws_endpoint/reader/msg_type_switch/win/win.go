package win

import (
	"log"
	"server/pair_management"
	"server/players"
	"server/structs"
)

func Win(idData *structs.IdData) (string, func()) {
	//this player is indicating that they won,
	//give their opponent the bad news
	log.Printf("Player %s won!\n", idData.Id)
	opponentId := players.Players[idData.Id].Opponent.Id
	//make callback to unregister pair after giving the bad news
	callback := func() {
		//unregister
		pair_management.RemovePair(idData.Id)
	}
	return opponentId, callback
}
