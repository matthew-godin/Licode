package connection_request

import (
	"errors"
	"log"
	"server/players"
	"server/structs"
	"server/ws_endpoint/reader/make_msg"
	"server/ws_endpoint/reader/msg_type_switch/is_registered"
	"server/ws_endpoint/reader/msg_type_switch/safe_write"

	"github.com/gorilla/websocket"
)

func ConnectionRequest(conn *websocket.Conn, idData *structs.IdData, readerData *structs.ReaderData) (structs.Msg, error) {
	var connMsg structs.Msg

	//ensure there's an id
	if len(readerData.Args) < 2 {
		log.Println("Need an id")
		connMsg = make_msg.MakeErrorMsg("Need an id")
		return connMsg, errors.New("connection failed")
	}

	idData.Id = readerData.Args[1]

	//ensure the player has been registered
	if !is_registered.IsRegistered(idData.Id) {
		log.Println("Error: not registered.")
		connMsg = make_msg.MakeErrorMsg("id not registered")
		return connMsg, errors.New("connection failed")
	}

	if players.Players[idData.Id].Connected {
		//maybe want to error, but what if they silently disconnected?
		log.Println("Already connected")
	}
	players.Players[idData.Id].Mu.Lock()
	//ensure we know the player is connected
	players.Players[idData.Id].Connected = true
	//ensure their connection is up to date (i.e. not an invalid pointer
	//from a dropped connection.)
	players.Players[idData.Id].Conn = conn
	players.Players[idData.Id].Mu.Unlock()

	//give missed updates
	for len(players.Players[idData.Id].Inbox) > 0 {
		log.Println("from inbox")
		if safe_write.SafeWrite(idData.Id,
			players.Players[idData.Id].Inbox[0].DefMsgType, players.Players[idData.Id].Inbox[0].Msg,
			players.Players[idData.Id].Inbox[0].Callback, false) {
			players.Players[idData.Id].Mu.Lock()
			players.Players[idData.Id].Inbox = players.Players[idData.Id].Inbox[1:]
			players.Players[idData.Id].Mu.Unlock()
		} else {
			return connMsg, errors.New("connection dropped")
		}
	}

	//try to give a positive acknowledgment
	connMsg = make_msg.MakeConnectMsg("")
	safe_write.SafeWrite2(idData.Id, readerData.DefMsgType, connMsg, false)
	idData.IdSet = true
	return connMsg, nil
}
