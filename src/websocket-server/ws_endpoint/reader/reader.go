package reader

import (
	"encoding/json"
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"

	"server/enums"
	"server/pair_management"
	"server/players"
	"server/structs"
	"server/ws_endpoint/reader/compute_new_value"
	"server/ws_endpoint/reader/is_registered"
	"server/ws_endpoint/reader/make_msg"
	"server/ws_endpoint/reader/safe_write"

	"github.com/gorilla/websocket"
)

// the "reader" that communicates with the
// websocket throughout its lifecycle
func Reader(conn *websocket.Conn) {
	var id string
	var idSet bool = false

	//parse a command, do the thing
	for {
		//variables declared before gotos
		var errMsg []byte
		var msgType int64
		var msg string
		var args []string
		var player *structs.Player
		var ok bool

		//read msg
		defMsgType, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			errMsg, err = json.Marshal(make_msg.MakeErrorMsg("Unknown"))
			goto GeneralError
		}

		//split into args
		msg = string(p)
		args = strings.Fields(msg)
		if len(args) < 1 {
			log.Println("Too few args")
			errMsg, err = json.Marshal(make_msg.MakeErrorMsg("Too few args"))
			goto GeneralError
		}

		//log.Println(msg)

		//parse the message type
		msgType, err = strconv.ParseInt(args[0], 10, 32)
		if err != nil {
			log.Println(err)
			errMsg, err = json.Marshal(make_msg.MakeErrorMsg("Invalid message type"))
			goto GeneralError
		}

		if !idSet && msgType != enums.Connection {
			log.Println("Need an id")
			errMsg, err = json.Marshal(make_msg.MakeErrorMsg("Need an id"))
			goto GeneralError
		}

		//check to see if the player has been unregistered
		player, ok = players.Players[id]
		if idSet && (!ok || player == nil || player.Opponent == nil) {
			log.Println("unreged player intercepted")
			return
		}

		//handle dependent on message type
		switch msgType {
		case enums.ConnectionRequest:
			var connMsg structs.Msg
			var data []byte

			//ensure there's an id
			if len(args) < 2 {
				log.Println("Need an id")
				connMsg = make_msg.MakeErrorMsg("Need an id")
				goto ConnectionFailed
			}

			id = args[1]

			//ensure the player has been registered
			if !is_registered.IsRegistered(id) {
				log.Println("Error: not registered.")
				connMsg = make_msg.MakeErrorMsg("id not registered")
				goto ConnectionFailed
			}

			if players.Players[id].Connected {
				//maybe want to error, but what if they silently disconnected?
				log.Println("Already connected")
			}
			players.Players[id].Mu.Lock()
			//ensure we know the player is connected
			players.Players[id].Connected = true
			//ensure their connection is up to date (i.e. not an invalid pointer
			//from a dropped connection.)
			players.Players[id].Conn = conn
			players.Players[id].Mu.Unlock()

			//give missed updates
			for len(players.Players[id].Inbox) > 0 {
				log.Println("from inbox")
				if safe_write.SafeWrite(id, players.Players[id].Inbox[0].DefMsgType, players.Players[id].Inbox[0].Msg, players.Players[id].Inbox[0].Callback, false) {
					players.Players[id].Mu.Lock()
					players.Players[id].Inbox = players.Players[id].Inbox[1:]
					players.Players[id].Mu.Unlock()
				} else {
					goto ConnectionDropped
				}
			}

			//try to give a positive acknowledgment
			connMsg = make_msg.MakeConnectMsg("")
			safe_write.SafeWrite2(id, defMsgType, connMsg, false)
			idSet = true
			break
		ConnectionFailed:
			if idSet {
				safe_write.SafeWrite2(id, defMsgType, connMsg, false)
			} else {
				data, err = json.Marshal(connMsg)
				if err == nil {
					log.Println("No id connection error")
					conn.WriteMessage(defMsgType, data)
				}
			}
		ConnectionDropped:
			break
		case enums.GiveFieldUpdate:
			var newValue string = ""
			var field int64 = -1
			var errMsg structs.Msg = make_msg.MakeErrorMsg("")

			if len(args) < 2 {
				if idSet {
					errMsg = make_msg.MakeErrorMsg("too few args")
					goto FieldUpdateFailed
				} else {
					data, err := json.Marshal(make_msg.MakeErrorMsg("too few args"))
					if err == nil {
						log.Println("No id field update error")
						conn.WriteMessage(defMsgType, data)
					}
				}
				break
			}
			field, err = strconv.ParseInt(args[1], 10, 32)
			if err != nil {
				log.Println(err)
				errMsg = make_msg.MakeErrorMsg("Invalid field type")
				goto FieldUpdateFailed
			}
			newValue = compute_new_value.ComputeNewValue(msg, msgType, field)
			safe_write.SafeWrite2(players.Players[id].Opponent.Id, defMsgType, make_msg.MakeFieldUpdateMsg(int(field), newValue), true)
			break
		FieldUpdateFailed:
			safe_write.SafeWrite2(id, defMsgType, errMsg, false)
			break
		case enums.StartPeeking:
			//after 15 seconds, tell the player to stop sending their code
			time.AfterFunc(15*time.Second, func() {
				log.Println("telling " + id + " to stop peeking")
				safe_write.SafeWrite2(id, defMsgType, make_msg.MakePeekMsg(), true)
			})
			break
		case enums.SlowOpponent:
			opponentId := players.Players[id].Opponent.Id
			//after 15 seconds, tell the opponent to stop
			//typing slowly
			callback := func() {
				time.AfterFunc(15*time.Second, func() {
					safe_write.SafeWrite2(opponentId, defMsgType, make_msg.MakeSlowMsg(false), true)
				})
			}
			//tell opponent to start typing slowly
			safe_write.SafeWrite(opponentId, defMsgType, make_msg.MakeSlowMsg(true), callback, true)
			break
		case enums.Skip:
			//dumby response
			log.Println(fmt.Sprintf("Player %s is skipping", id))
			break
		case enums.Win:
			//this player is indicating that they won,
			//give their opponent the bad news
			log.Println(fmt.Sprintf("Player %s won!", id))
			opponentId := players.Players[id].Opponent.Id
			//make callback to unregister pair after giving the bad news
			callback := func() {
				//unregister
				pair_management.RemovePair(id)
			}
			safe_write.SafeWrite(opponentId, defMsgType, make_msg.MakeLossMsg(), callback, true)
			break
		case enums.GiveQuestionNum:
			//this player is on the next question, inform their opponent
			log.Println(fmt.Sprintf("Player %s is on question %s", id, args[1]))
			opponentId := players.Players[id].Opponent.Id
			safe_write.SafeWrite2(opponentId, defMsgType, make_msg.MakeQuestionNumMsg(args[1]), true)
			break
		default:
			//error
			log.Println("Invalid cmd")
			break
		}
		continue

	GeneralError:
		if err != nil {
			log.Println(err)
		}
		log.Println("general error")
		conn.WriteMessage(defMsgType, errMsg)
		break
	}
}
