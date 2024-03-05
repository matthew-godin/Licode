package msg_type_switch

import (
	"encoding/json"
	"fmt"
	"log"
	"server/enums"
	"server/players"
	"server/structs"
	"server/ws_endpoint/reader/make_msg"
	"server/ws_endpoint/reader/msg_type_switch/compute_new_value"
	"server/ws_endpoint/reader/msg_type_switch/connection_request"
	"server/ws_endpoint/reader/msg_type_switch/field_update"
	"server/ws_endpoint/reader/msg_type_switch/safe_write"
	"server/ws_endpoint/reader/msg_type_switch/win"
	"time"

	"github.com/gorilla/websocket"
)

func MsgTypeSwitch(conn *websocket.Conn, idData *structs.IdData, readerData *structs.ReaderData) {
	//handle dependent on message type
	switch readerData.MsgType {
	case enums.ConnectionRequest:
		connMsg, err := connection_request.ConnectionRequest(conn, idData, readerData)
		if err != nil {
			errMessage := err.Error()
			if errMessage == "connection failed" {
				goto ConnectionFailed
			} else if errMessage == "connection dropped" {
				goto ConnectionDropped
			}
		}
		break
	ConnectionFailed:
		if idData.IdSet {
			safe_write.SafeWrite2(idData.Id, readerData.DefMsgType, connMsg, false)
		} else {
			var data []byte
			data, readerData.Err = json.Marshal(connMsg)
			if readerData.Err == nil {
				log.Println("No id connection error")
				conn.WriteMessage(readerData.DefMsgType, data)
			}
		}
	ConnectionDropped:
		break
	case enums.GiveFieldUpdate:
		var newValue string = ""
		field, errMsg, exit, err := field_update.FieldUpdate(conn, idData, readerData)
		if err != nil {
			goto FieldUpdateFailed
		}
		if exit {
			break
		}
		newValue = compute_new_value.ComputeNewValue(readerData.Msg, readerData.MsgType, field)
		safe_write.SafeWrite2(players.Players[idData.Id].Opponent.Id, readerData.DefMsgType, make_msg.MakeFieldUpdateMsg(int(field), newValue), true)
		break
	FieldUpdateFailed:
		safe_write.SafeWrite2(idData.Id, readerData.DefMsgType, errMsg, false)
	case enums.StartPeeking:
		//after 15 seconds, tell the player to stop sending their code
		time.AfterFunc(15*time.Second, func() {
			log.Println("telling " + idData.Id + " to stop peeking")
			safe_write.SafeWrite2(idData.Id, readerData.DefMsgType, make_msg.MakePeekMsg(), true)
		})
	case enums.SlowOpponent:
		opponentId := players.Players[idData.Id].Opponent.Id
		//after 15 seconds, tell the opponent to stop
		//typing slowly
		callback := func() {
			time.AfterFunc(15*time.Second, func() {
				safe_write.SafeWrite2(opponentId, readerData.DefMsgType, make_msg.MakeSlowMsg(false), true)
			})
		}
		//tell opponent to start typing slowly
		safe_write.SafeWrite(opponentId, readerData.DefMsgType, make_msg.MakeSlowMsg(true), callback, true)
	case enums.Skip:
		//dumby response
		log.Println(fmt.Sprintf("Player %s is skipping", idData.Id))
	case enums.Win:
		opponentId, callback := win.Win(idData)
		safe_write.SafeWrite(opponentId, readerData.DefMsgType, make_msg.MakeLossMsg(), callback, true)
	case enums.GiveQuestionNum:
		//this player is on the next question, inform their opponent
		log.Println(fmt.Sprintf("Player %s is on question %s", idData.Id, readerData.Args[1]))
		opponentId := players.Players[idData.Id].Opponent.Id
		safe_write.SafeWrite2(opponentId, readerData.DefMsgType, make_msg.MakeQuestionNumMsg(readerData.Args[1]), true)
	default:
		//error
		log.Println("Invalid cmd")
	}
}
