package main

// helper to check if the map
// contains id
func isRegistered(id string) bool {
	_, ok := players[id]
	return ok
}
