package safe_write

import (
	"encoding/json"
	"log"
	"server/players"
	"server/structs"
)

// We detect a silent disconnect by failure to write
//
//	to a player's connection.
//
// This is a helper to put that logic in one place.
// It's minimal now, but various retry approaches might be needed.
// Returns true if the message was sent
// Returns false if the message was queued
func SafeWrite(id string, defMsgType int, msg structs.Msg, callback structs.Callback, queueOnFail bool) bool {
	if players.Players[id].Conn == nil {
		players.Players[id].Mu.Lock()
		players.Players[id].Connected = false
		if queueOnFail {
			addMsg(id, defMsgType, msg, callback)
		}
		players.Players[id].Mu.Unlock()
		return false
	}

	data, err := json.Marshal(msg)
	if err != nil {
		log.Println(err)
		//really shouldn't happen
		return false
	}

	players.Players[id].Mu.Lock()
	err = players.Players[id].Conn.WriteMessage(defMsgType, data)
	players.Players[id].Mu.Unlock()
	if err != nil {
		players.Players[id].Mu.Lock()
		players.Players[id].Connected = false
		players.Players[id].Conn = nil
		players.Players[id].Mu.Unlock()
		if queueOnFail {
			addMsg(id, defMsgType, msg, callback)
		}
		return false
	}

	callback()
	return true
}

func SafeWrite2(id string, defMsgType int, msg structs.Msg, queueOnFail bool) bool {
	return SafeWrite(id, defMsgType, msg, func() {}, queueOnFail)
}
