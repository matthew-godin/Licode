package initialize_reader

import (
	"encoding/json"
	"errors"
	"log"
	"server/enums"
	"server/players"
	"server/structs"
	"server/ws_endpoint/reader/make_msg"
	"strconv"
	"strings"

	"github.com/gorilla/websocket"
)

func InitializeReader(conn *websocket.Conn, idData *structs.IdData, readerData *structs.ReaderData) (bool, error) {
	//read msg
	readerData.DefMsgType, readerData.P, readerData.Err = conn.ReadMessage()
	if readerData.Err != nil {
		log.Println(readerData.Err)
		readerData.ErrMsg, readerData.Err = json.Marshal(make_msg.MakeErrorMsg("Unknown"))
		return false, errors.New("general error")
	}

	//split into args
	readerData.Msg = string(readerData.P)
	readerData.Args = strings.Fields(readerData.Msg)
	if len(readerData.Args) < 1 {
		log.Println("Too few args")
		readerData.ErrMsg, readerData.Err = json.Marshal(make_msg.MakeErrorMsg("Too few args"))
		return false, errors.New("general error")
	}

	//parse the message type
	readerData.MsgType, readerData.Err = strconv.ParseInt(readerData.Args[0], 10, 32)
	if readerData.Err != nil {
		log.Println(readerData.Err)
		readerData.ErrMsg, readerData.Err = json.Marshal(make_msg.MakeErrorMsg("Invalid message type"))
		return false, errors.New("general error")
	}

	if !idData.IdSet && readerData.MsgType != enums.Connection {
		log.Println("Need an id")
		readerData.ErrMsg, readerData.Err = json.Marshal(make_msg.MakeErrorMsg("Need an id"))
		return false, errors.New("general error")
	}

	//check to see if the player has been unregistered
	readerData.Player, readerData.Ok = players.Players[idData.Id]
	if idData.IdSet && (!readerData.Ok || readerData.Player == nil || readerData.Player.Opponent == nil) {
		log.Println("unreged player intercepted")
		return true, nil
	}

	return false, nil
}
