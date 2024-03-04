package main

import (
	"encoding/json"
	"log"
)

// a msg to be stored in a player's inbox
// used to store messages that were supposed to
// be sent while they were disconnected
type Callback func()
type WrappedMsg struct {
	defMsgType int
	msg        Msg
	callback   Callback
}

// WrappedMsg ctor
func wrapMsg(defMsgType int, msg Msg, callback Callback) WrappedMsg {
	return WrappedMsg{
		defMsgType: defMsgType,
		msg:        msg,
		callback:   callback,
	}
}

// WrappedMsg ctor 2 (default callback)
func wrapMsg2(defMsgType int, msg Msg) WrappedMsg {
	return WrappedMsg{
		defMsgType: defMsgType,
		msg:        msg,
		callback:   func() {},
	}
}

func addMsg(id string, defMsgType int, msg Msg, callback Callback) {
	log.Println("delaying")
	players[id].inbox = append(players[id].inbox, wrapMsg(defMsgType, msg, callback))
}

// We detect a silent disconnect by failure to write
//
//	to a player's connection.
//
// This is a helper to put that logic in one place.
// It's minimal now, but various retry approaches might be needed.
// Returns true if the message was sent
// Returns false if the message was queued
func safeWrite(id string, defMsgType int, msg Msg, callback Callback, queueOnFail bool) bool {
	if players[id].conn == nil {
		players[id].mu.Lock()
		players[id].connected = false
		if queueOnFail {
			addMsg(id, defMsgType, msg, callback)
		}
		players[id].mu.Unlock()
		return false
	}

	data, err := json.Marshal(msg)
	if err != nil {
		log.Println(err)
		//really shouldn't happen
		return false
	}

	players[id].mu.Lock()
	err = players[id].conn.WriteMessage(defMsgType, data)
	players[id].mu.Unlock()
	if err != nil {
		players[id].mu.Lock()
		players[id].connected = false
		players[id].conn = nil
		players[id].mu.Unlock()
		if queueOnFail {
			addMsg(id, defMsgType, msg, callback)
		}
		return false
	}

	callback()
	return true
}

func safeWrite2(id string, defMsgType int, msg Msg, queueOnFail bool) bool {
	return safeWrite(id, defMsgType, msg, func() {}, queueOnFail)
}
