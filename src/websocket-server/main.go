package main

import (
	"fmt"
	"log"
	"net/http"

	"server/register_pair"
	"server/ws_endpoint"
)

/*
SERVER replies with Msg as json
Message Types:
	Behaviour
		TypeSlow		- tell player to type slow
		Peek			- tell player to stop peeking
	Information
		Connection		- tell player if connection succeed
		Error			- give player an error message
		Loss			- inform player their opponent has won
		QuestionNum		- inform player their opponent is on a new question
	FieldUpdate
		Code			- give player their opponent's code editor input
		Input			- etc.
		Output
		StandardOutput
*/

/*
CLIENT sends message type and args i.e. <MsgType> <args[1]> <args[2]> ...
Message Types:
	ConnectionRequest		- indicates player wants to join the game with sid args[1]
	StartPeeking			- player using peek wildcard
	SlowOpponent			- player using typing speed wildcard
	Skip					- player is skipping a test case
	GiveFieldUpdate			- player is sending a field update (code, input, ...)
		same subtypes as SERVER FieldUpdate
	GiveQuestionNum			- indicates the player is now solving question args[1]
	Win						- the player has solved the final question
*/

func setupRoutes() {
	http.HandleFunc("/registerPair", register_pair.RegisterPair)
	http.HandleFunc("/ws", ws_endpoint.WsEndpoint)
}

func main() {
	fmt.Println("Start server...")
	setupRoutes()
	log.Fatal(http.ListenAndServe(":5000", nil))
}
