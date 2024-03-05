package test

import (
	"server/enums"
	"server/structs"
	"server/test/test_util"
	"testing"

	"github.com/gorilla/websocket"
)

func TestTooFewArgs(t *testing.T) {
	server, ws1, ws2 := test_util.GameInit(t)
	defer server.Close()
	defer ws1.Close()
	defer ws2.Close()

	err := ws1.WriteMessage(websocket.TextMessage, []byte(""))
	if err != nil {
		t.Fatal("Failed to write")
	}

	msgType, dataAny := test_util.ReadMessage(ws1, t)
	if msgType != enums.Information {
		t.Fatalf("Wrong message type %d", msgType)
	}
	data, _ := dataAny.(structs.InformationData)
	if data.Type != enums.Error || data.Info == "" {
		t.Fatalf("Wrong error response: type=%d, info=%s", data.Type, data.Info)
	}
}
