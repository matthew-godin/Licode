package test

import (
	"fmt"
	"server/enums"
	"server/structs"
	"server/test/test_util"
	"testing"

	"github.com/gorilla/websocket"
)

// uncomment for about 5% more coverage, takes 30 seconds to complete
// this will take 15s
func TestPeek(t *testing.T) {
	server, ws1, ws2 := test_util.GameInit(t)
	defer server.Close()
	defer ws1.Close()
	defer ws2.Close()

	err := ws1.WriteMessage(websocket.TextMessage, []byte(fmt.Sprint(enums.StartPeeking)))
	if err != nil {
		t.Fatal("Failed to peek")
	}
	msgType, dataAny := test_util.ReadMessage(ws1, t)
	if msgType != enums.Behaviour {
		t.Fatalf("Wrong message type %d", msgType)
	}

	data, _ := dataAny.(structs.BehaviourData)

	if data.Type != enums.Peek {
		t.Fatal("Wrong behaviour")
	}

	if data.Start {
		t.Fatal("Wrong instruction")
	}
}
