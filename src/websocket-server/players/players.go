package players

import (
	"sync"

	"server/structs"
)

// list to store players
var Players = make(map[string]*structs.Player)
var PlayersMU sync.Mutex
