package test

import (
	"fmt"
	"server/enums"
	"server/structs"
	"server/test/test_util"
	"testing"

	"github.com/gorilla/websocket"
)

func TestFieldUpdates(t *testing.T) {
	server, ws1, ws2 := test_util.GameInit(t)
	defer server.Close()
	defer ws1.Close()
	defer ws2.Close()

	for i := 0; i < len(test_util.FieldUpdateCases); i++ {
		var u1 *websocket.Conn
		var u2 *websocket.Conn

		if i%2 == 0 {
			u1 = ws1
			u2 = ws2
		} else {
			u1 = ws2
			u2 = ws1
		}

		//user one sends a field update
		err := u1.WriteMessage(websocket.TextMessage, []byte(fmt.Sprintf("%d %d %s", enums.GiveFieldUpdate, test_util.FieldUpdateCases[i].Type, test_util.FieldUpdateCases[i].Value)))
		if err != nil {
			t.Fatalf("Failed to send field update")
		}

		//user two recieves a message
		msgType, dataAny := test_util.ReadMessage(u2, t)
		if msgType != enums.FieldUpdate {
			t.Fatalf("Wrong response type %d", msgType)
		} //the message is a FieldUpdate

		data, _ := dataAny.(structs.FieldUpdateData)

		if data.Type != test_util.FieldUpdateCases[i].Type {
			t.Fatalf("Wrong field type %d", data.Type)
		} //it is updating the right field

		if data.NewValue != test_util.FieldUpdateCases[i].Value {
			t.Fatalf("Wrong value %s", data.NewValue)
		} //it delivered the correct value
	}
}
