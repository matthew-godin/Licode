package test

import (
	"fmt"
	"server/enums"
	"server/structs"
	"server/test/test_util"
	"testing"

	"github.com/gorilla/websocket"
)

// test client connection process
func TestConnection(t *testing.T) {
	//clear player list, like server just started
	test_util.ClearState()

	server := test_util.NewServer()
	defer server.Close()

	//register pair
	test_util.RegValidPair(structs.Pair{Id1: "id1", Id2: "id2"}, server, t)

	//make a websocket connection
	ws := test_util.NewWS(server, t)
	defer ws.Close()

	//send connection request (with id)
	if err := ws.WriteMessage(websocket.TextMessage, []byte(fmt.Sprintf("%d %s", enums.ConnectionRequest, "id1"))); err != nil {
		t.Fatalf("%v", err)
	}
	//read server's response
	msgType, dataAny := test_util.ReadMessage(ws, t)
	if msgType != enums.Information {
		t.Fatalf("Wrong response type %d", msgType)
	}
	data, ok := dataAny.(structs.InformationData)
	if !ok {
		t.Fatal("Wrong response data type")
	}
	if data.Type != enums.Connection {
		t.Fatal("Wrong response data.type")
	}
	if data.Info != "" {
		t.Fatalf("Connection failed because %s", data.Info)
	}
}
