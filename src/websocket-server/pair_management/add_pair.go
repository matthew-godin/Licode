package pair_management

import (
	"fmt"
	"log"

	"server/players"
	"server/structs"
)

func AddPair(pair structs.Pair) {
	players.PlayersMU.Lock()

	//make first new player
	players.Players[pair.Id1] = structs.NewPlayer(false, pair.Id1)
	//same for second
	players.Players[pair.Id2] = structs.NewPlayer(false, pair.Id2)

	//link players together
	players.Players[pair.Id1].Opponent = players.Players[pair.Id2]
	players.Players[pair.Id2].Opponent = players.Players[pair.Id1]

	log.Println(fmt.Sprintf("registered pair: %s, %s", pair.Id1, pair.Id2))

	players.PlayersMU.Unlock()
}
