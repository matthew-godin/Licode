package test_util

import (
	"server/players"
	"server/structs"
)

func ClearState() {
	players.Players = make(map[string]*structs.Player)
}
