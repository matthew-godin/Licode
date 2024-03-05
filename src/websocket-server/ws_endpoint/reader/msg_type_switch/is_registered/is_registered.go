package is_registered

import "server/players"

// helper to check if the map
// contains id
func IsRegistered(id string) bool {
	_, ok := players.Players[id]
	return ok
}
