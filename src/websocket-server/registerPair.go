package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

// register a pair of players who will compete
func registerPair(w http.ResponseWriter, r *http.Request) {
	//need to give 404 or something unless it's from licode
	log.Println(r.Header.Values("Origin"))
	//if r.Header.Values("Origin")[0] != "licode.io" {
	//	w.WriteHeader(404)
	//}

	//try to read body
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(400)
		log.Println(err)
		return
	}

	//parse body
	var pair Pair
	log.Println(fmt.Sprintf("parsing body: %s", body))
	err = json.Unmarshal([]byte(body), &pair)
	if err != nil {
		w.WriteHeader(400)
		log.Println(err)
		return
	}

	log.Println(fmt.Sprintf("attempting to register %s, %s", pair.Id1, pair.Id2))

	//make sure ids are distinct
	if pair.Id1 == pair.Id2 {
		w.WriteHeader(405)
		w.Write([]byte("Error: Id1 and Id2 must be distinct."))
		return
	}

	//see if players are already registered
	player1, ok1 := players[pair.Id1]
	player2, ok2 := players[pair.Id2]

	if !(ok1 || ok2) {
		//neither are registered
		w.WriteHeader(200)
	} else if ok1 && ok2 && player1.opponent != nil && player2.opponent != nil &&
		player1.opponent.id == pair.Id2 && player2.opponent.id == pair.Id1 {
		//this is a duplicate, it's fine but we don't want to add it again
		w.WriteHeader(200)
		return
	} else {
		w.WriteHeader(405)
		if ok1 && ok2 {
			//one of the players has a different opponent
			w.Write([]byte("Error: At least one player has a different partner."))
		} else {
			//one player is registered, one isn't
			w.Write([]byte("Error: One player already registered."))
		}
		return
	}

	addPair(pair)
}
