package test

import (
	"fmt"
	"server/enums"
	"server/structs"
	"server/test/test_util"
	"testing"

	"github.com/gorilla/websocket"
)

func TestConnectionInbox(t *testing.T) {
	//clear player list, like server just started
	test_util.ClearState()

	server := test_util.NewServer()
	defer server.Close()

	id1 := "id1"
	id2 := "id2"

	//register pair
	test_util.RegValidPair(structs.Pair{Id1: id1, Id2: id2}, server, t)

	//make a websocket connection
	ws1 := test_util.NewWS(server, t)
	defer ws1.Close()

	//send connection request (with id)
	if err := ws1.WriteMessage(websocket.TextMessage, []byte(fmt.Sprintf("%d %s", enums.ConnectionRequest, id1))); err != nil {
		t.Fatalf("%v", err)
	}
	//read server's response
	msgType, dataAny := test_util.ReadMessage(ws1, t)
	if msgType != enums.Information {
		t.Fatalf("Wrong response type %d", msgType)
	}
	data, _ := dataAny.(structs.InformationData)
	if data.Type != enums.Connection {
		t.Fatal("Wrong response data.type")
	}
	if data.Info != "" {
		t.Fatalf("Connection failed because %s", data.Info)
	}

	//send an update
	code := "this is some code"
	ws1.WriteMessage(websocket.TextMessage, []byte(fmt.Sprintf("%d %d %s", enums.GiveFieldUpdate, enums.Code, code)))

	//make opponent
	ws2 := test_util.NewWS(server, t)
	defer ws2.Close()

	//send connection request (with id)
	if err := ws2.WriteMessage(websocket.TextMessage, []byte(fmt.Sprintf("%d %s", enums.ConnectionRequest, id2))); err != nil {
		t.Fatalf("%v", err)
	}

	//read connect confirmation and update from inbox
	for i := 0; i < 2; i++ {
		msgType, dataAny = test_util.ReadMessage(ws2, t)
		if msgType == enums.Information {
			data, _ = dataAny.(structs.InformationData)
			if data.Type != enums.Connection {
				t.Fatal("Wrong response data.type")
			}
			if data.Info != "" {
				t.Fatalf("Connection failed because %s", data.Info)
			}
		} else if msgType == enums.FieldUpdate {
			data, _ := dataAny.(structs.FieldUpdateData)
			if data.Type != enums.Code {
				t.Fatalf("Expected fieldupdate got %d", data.Type)
			}
			if data.NewValue != code {
				t.Fatalf("Expected %s got %s", code, data.NewValue)
			}
		} else {
			t.Fatalf("Expected info or connection got %d", msgType)
		}
	}
}
