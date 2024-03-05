package test

import (
	"fmt"
	"server/enums"
	"server/players"
	"server/structs"
	"server/test/test_util"
	"testing"

	"github.com/gorilla/websocket"
)

func TestWin(t *testing.T) {
	server, ws1, ws2 := test_util.GameInit(t)
	defer server.Close()
	defer ws1.Close()
	defer ws2.Close()

	err := ws1.WriteMessage(websocket.TextMessage, []byte(fmt.Sprint(enums.Win)))
	if err != nil {
		t.Fatal("Failed to win")
	}

	msgType, dataAny := test_util.ReadMessage(ws2, t)
	if msgType != enums.Information {
		t.Fatalf("Wrong message type %d", msgType)
	}
	data, _ := dataAny.(structs.InformationData)
	if data.Type != enums.Loss || data.Info != "" {
		t.Fatalf("Wrong message: Type=%d Info=%s", data.Type, data.Info)
	}

	players.PlayersMU.Lock()
	numPlayers := len(players.Players)
	players.PlayersMU.Unlock()

	if numPlayers != 0 {
		t.Fatalf("Too many players %d", numPlayers)
	}
}
