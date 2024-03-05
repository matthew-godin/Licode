package reader

import (
	"log"

	"server/structs"
	"server/ws_endpoint/reader/initialize_reader"
	"server/ws_endpoint/reader/msg_type_switch"

	"github.com/gorilla/websocket"
)

// the "reader" that communicates with the
// websocket throughout its lifecycle
func Reader(conn *websocket.Conn) {
	var idData structs.IdData
	idData.IdSet = false

	//parse a command, do the thing
	for {
		//variables declared before gotos
		var readerData structs.ReaderData

		exit, err := initialize_reader.InitializeReader(conn, &idData, &readerData)
		if err != nil {
			goto GeneralError
		} else if exit {
			return
		}
		msg_type_switch.MsgTypeSwitch(conn, &idData, &readerData)
		continue

	GeneralError:
		if readerData.Err != nil {
			log.Println(readerData.Err)
		}
		log.Println("general error")
		conn.WriteMessage(readerData.DefMsgType, readerData.ErrMsg)
		break
	}
}
