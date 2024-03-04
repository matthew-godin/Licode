package main

import (
	"encoding/json"
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/websocket"
)

// the "reader" that communicates with the
// websocket throughout its lifecycle
func reader(conn *websocket.Conn) {
	var id string
	var idSet bool = false

	//parse a command, do the thing
	for {
		//variables declared before gotos
		var errMsg []byte
		var msgType int64
		var msg string
		var args []string
		var player *Player
		var ok bool

		//read msg
		defMsgType, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			errMsg, err = json.Marshal(makeErrorMsg("Unknown"))
			goto GeneralError
		}

		//split into args
		msg = string(p)
		args = strings.Fields(msg)
		if len(args) < 1 {
			log.Println("Too few args")
			errMsg, err = json.Marshal(makeErrorMsg("Too few args"))
			goto GeneralError
		}

		//log.Println(msg)

		//parse the message type
		msgType, err = strconv.ParseInt(args[0], 10, 32)
		if err != nil {
			log.Println(err)
			errMsg, err = json.Marshal(makeErrorMsg("Invalid message type"))
			goto GeneralError
		}

		if !idSet && msgType != Connection {
			log.Println("Need an id")
			errMsg, err = json.Marshal(makeErrorMsg("Need an id"))
			goto GeneralError
		}

		//check to see if the player has been unregistered
		player, ok = players[id]
		if idSet && (!ok || player == nil || player.opponent == nil) {
			log.Println("unreged player intercepted")
			return
		}

		//handle dependent on message type
		switch msgType {
		case ConnectionRequest:
			var connMsg Msg
			var data []byte

			//ensure there's an id
			if len(args) < 2 {
				log.Println("Need an id")
				connMsg = makeErrorMsg("Need an id")
				goto ConnectionFailed
			}

			id = args[1]

			//ensure the player has been registered
			if !isRegistered(id) {
				log.Println("Error: not registered.")
				connMsg = makeErrorMsg("id not registered")
				goto ConnectionFailed
			}

			if players[id].connected {
				//maybe want to error, but what if they silently disconnected?
				log.Println("Already connected")
			}
			players[id].mu.Lock()
			//ensure we know the player is connected
			players[id].connected = true
			//ensure their connection is up to date (i.e. not an invalid pointer
			//from a dropped connection.)
			players[id].conn = conn
			players[id].mu.Unlock()

			//give missed updates
			for len(players[id].inbox) > 0 {
				log.Println("from inbox")
				if safeWrite(id, players[id].inbox[0].defMsgType, players[id].inbox[0].msg, players[id].inbox[0].callback, false) {
					players[id].mu.Lock()
					players[id].inbox = players[id].inbox[1:]
					players[id].mu.Unlock()
				} else {
					goto ConnectionDropped
				}
			}

			//try to give a positive acknowledgment
			connMsg = makeConnectMsg("")
			safeWrite2(id, defMsgType, connMsg, false)
			idSet = true
			break
		ConnectionFailed:
			if idSet {
				safeWrite2(id, defMsgType, connMsg, false)
			} else {
				data, err = json.Marshal(connMsg)
				if err == nil {
					log.Println("No id connection error")
					conn.WriteMessage(defMsgType, data)
				}
			}
		ConnectionDropped:
			break
		case GiveFieldUpdate:
			var i int = -1
			var j int = -1
			var newValue string = ""
			var msgTypeStr string = ""
			var fieldTypeStr string = ""
			var field int64 = -1
			var errMsg Msg = makeErrorMsg("")

			if len(args) < 2 {
				if idSet {
					errMsg = makeErrorMsg("too few args")
					goto FieldUpdateFailed
				} else {
					data, err := json.Marshal(makeErrorMsg("too few args"))
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
				errMsg = makeErrorMsg("Invalid field type")
				goto FieldUpdateFailed
			}

			newValue = msg
			//recover newValue
			msgTypeStr = fmt.Sprint(msgType)
			fieldTypeStr = fmt.Sprint(field)
			i = 0
			//read white space
			for ; i < len(newValue) && newValue[i] == ' '; i += 1 {
			}
			//read msgType
			j = 0
			for j < len(msgTypeStr) && (i+j) < len(newValue) && newValue[i+j] == msgTypeStr[j] {
				j += 1
			}
			i += j
			//read white space
			for ; i < len(newValue) && newValue[i] == ' '; i += 1 {
			}
			//read field type
			j = 0
			for j < len(fieldTypeStr) && (i+j) < len(newValue) && newValue[i+j] == fieldTypeStr[j] {
				j += 1
			}
			i += j
			//read white space
			for ; i < len(newValue) && newValue[i] == ' '; i += 1 {
			}
			//read newValue
			if i < len(newValue) {
				log.Println(fmt.Sprintf("Taking %s from %s", newValue[i:], newValue))
				newValue = newValue[i:]
			} else {
				log.Println(fmt.Sprintf("Nothing left in %s", newValue))
				newValue = ""
			}

			safeWrite2(players[id].opponent.id, defMsgType, makeFieldUpdateMsg(int(field), newValue), true)
			break
		FieldUpdateFailed:
			safeWrite2(id, defMsgType, errMsg, false)
			break
		case StartPeeking:
			//after 15 seconds, tell the player to stop sending their code
			time.AfterFunc(15*time.Second, func() {
				log.Println("telling " + id + " to stop peeking")
				safeWrite2(id, defMsgType, makePeekMsg(), true)
			})
			break
		case SlowOpponent:
			opponentId := players[id].opponent.id
			//after 15 seconds, tell the opponent to stop
			//typing slowly
			callback := func() {
				time.AfterFunc(15*time.Second, func() {
					safeWrite2(opponentId, defMsgType, makeSlowMsg(false), true)
				})
			}
			//tell opponent to start typing slowly
			safeWrite(opponentId, defMsgType, makeSlowMsg(true), callback, true)
			break
		case Skip:
			//dumby response
			log.Println(fmt.Sprintf("Player %s is skipping", id))
			break
		case Win:
			//this player is indicating that they won,
			//give their opponent the bad news
			log.Println(fmt.Sprintf("Player %s won!", id))
			opponentId := players[id].opponent.id
			//make callback to unregister pair after giving the bad news
			callback := func() {
				//unregister
				removePair(id)
			}
			safeWrite(opponentId, defMsgType, makeLossMsg(), callback, true)
			break
		case GiveQuestionNum:
			//this player is on the next question, inform their opponent
			log.Println(fmt.Sprintf("Player %s is on question %s", id, args[1]))
			opponentId := players[id].opponent.id
			safeWrite2(opponentId, defMsgType, makeQuestionNumMsg(args[1]), true)
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
