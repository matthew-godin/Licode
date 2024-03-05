package test_util

import (
	"fmt"
	"net/http/httptest"
	"server/enums"
	"server/structs"
	"testing"

	"github.com/gorilla/websocket"
)

func GameInit(t *testing.T) (*httptest.Server, *websocket.Conn, *websocket.Conn) {
	//clear player list, like server just started
	ClearState()

	server := NewServer()

	id1 := "id1"
	id2 := "id2"

	//register pair
	RegValidPair(structs.Pair{Id1: id1, Id2: id2}, server, t)

	//make a websocket connection
	ws1 := NewWS(server, t)
	err := ws1.WriteMessage(websocket.TextMessage, []byte(fmt.Sprintf("%d %s", enums.ConnectionRequest, id1)))
	if err != nil {
		t.Fatalf("Failed to connect")
	}

	//make another
	ws2 := NewWS(server, t)
	err = ws2.WriteMessage(websocket.TextMessage, []byte(fmt.Sprintf("%d %s", enums.ConnectionRequest, id2)))
	if err != nil {
		t.Fatalf("Failed to connect")
	}

	//read connection msgs
	ReadMessage(ws1, t)
	ReadMessage(ws2, t)

	return server, ws1, ws2
}
