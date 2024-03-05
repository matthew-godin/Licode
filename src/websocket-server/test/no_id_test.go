package test

import (
	"fmt"
	"server/enums"
	"server/structs"
	"server/test/test_util"
	"testing"

	"github.com/gorilla/websocket"
)

func TestNoId(t *testing.T) {
	test_util.ClearState()

	server := test_util.NewServer()
	defer server.Close()

	ws := test_util.NewWS(server, t)
	err := ws.WriteMessage(websocket.TextMessage, []byte(fmt.Sprint(enums.Win)))
	if err != nil {
		t.Fatal("Failed to write")
	}

	msgType, dataAny := test_util.ReadMessage(ws, t)
	if msgType != enums.Information {
		t.Fatalf("Expected information got %d", msgType)
	}
	data, _ := dataAny.(structs.InformationData)
	if data.Type != enums.Error {
		t.Fatalf("Expected error got %d", msgType)
	}
	if data.Info == "" {
		t.Fatalf("Got empty error message")
	}
}
