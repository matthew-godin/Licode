package field_update

import (
	"encoding/json"
	"errors"
	"log"
	"server/structs"
	"server/ws_endpoint/reader/make_msg"
	"strconv"

	"github.com/gorilla/websocket"
)

func FieldUpdate(conn *websocket.Conn, idData *structs.IdData, readerData *structs.ReaderData) (int64, structs.Msg, bool, error) {
	var field int64 = -1
	var errMsg structs.Msg

	if len(readerData.Args) < 2 {
		if idData.IdSet {
			errMsg = make_msg.MakeErrorMsg("too few args")
			return field, errMsg, false, errors.New("field update failed")
		} else {
			var data []byte
			data, readerData.Err = json.Marshal(make_msg.MakeErrorMsg("too few args"))
			if readerData.Err == nil {
				log.Println("No id field update error")
				conn.WriteMessage(readerData.DefMsgType, data)
			}
		}
		return field, errMsg, true, nil
	}
	field, readerData.Err = strconv.ParseInt(readerData.Args[1], 10, 32)
	if readerData.Err != nil {
		log.Println(readerData.Err)
		errMsg = make_msg.MakeErrorMsg("Invalid field type")
		return field, errMsg, false, errors.New("field update failed")
	}
	return field, errMsg, false, nil
}
