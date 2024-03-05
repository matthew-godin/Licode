package test

import (
	"fmt"
	"server/enums"
	"server/structs"
	"server/test/test_util"
	"testing"

	"github.com/gorilla/websocket"
)

func TestConnectNoReg(t *testing.T) {
	//clear player list, like server just started
	test_util.ClearState()

	server := test_util.NewServer()
	defer server.Close()

	//don't register pair

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
		t.Fatalf("Expected info got %d", msgType)
	}
	data, _ := dataAny.(structs.InformationData)

	if data.Type != enums.Error {
		t.Fatalf("Expected error got %d", data.Type)
	}
	if data.Info == "" {
		t.Fatalf("Expected error message")
	}
}
