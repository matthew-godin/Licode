package test

import (
	"fmt"
	"server/enums"
	"server/structs"
	"server/test/test_util"
	"testing"

	"github.com/gorilla/websocket"
)

func TestFieldUpdateInvalidType(t *testing.T) {
	server, ws1, ws2 := test_util.GameInit(t)
	defer server.Close()
	defer ws1.Close()
	defer ws2.Close()

	err := ws1.WriteMessage(websocket.TextMessage, []byte(fmt.Sprintf("%d not a field type", enums.GiveFieldUpdate)))
	if err != nil {
		t.Fatal("Failed to write")
	}

	msgType, dataAny := test_util.ReadMessage(ws1, t)
	if msgType != enums.Information {
		t.Fatalf("Expected info got %d", msgType)
	}
	data, _ := dataAny.(structs.InformationData)
	if data.Type != enums.Error {
		t.Fatalf("Expected error gor %d", data.Type)
	}
	if data.Info == "" {
		t.Fatal("Expected error message")
	}
}
