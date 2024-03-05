package safe_write

import (
	"log"
	"server/players"
	"server/structs"
)

func addMsg(id string, defMsgType int, msg structs.Msg, callback structs.Callback) {
	log.Println("delaying")
	players.Players[id].Inbox = append(players.Players[id].Inbox, wrapMsg(defMsgType, msg, callback))
}
