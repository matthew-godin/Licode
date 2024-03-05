package test

import (
	"fmt"
	"server/enums"
	"server/structs"
	"server/test/test_util"
	"testing"

	"github.com/gorilla/websocket"
)

// this will take 15s
func TestSlow(t *testing.T) {
	server, ws1, ws2 := test_util.GameInit(t)
	defer server.Close()
	defer ws1.Close()
	defer ws2.Close()

	err := ws1.WriteMessage(websocket.TextMessage, []byte(fmt.Sprint(enums.SlowOpponent)))
	if err != nil {
		t.Fatal("Failed to slow")
	}

	msgType, dataAny := test_util.ReadMessage(ws2, t)

	if msgType != enums.Behaviour {
		t.Fatalf("Wrong message type %d", msgType)
	}
	data, _ := dataAny.(structs.BehaviourData)

	//we should get a START TypeSlow message
	if data.Type != enums.TypeSlow {
		t.Fatal("Not peek")
	}
	if !data.Start {
		t.Fatal("Wrong instruction")
	}

	msgType, dataAny = test_util.ReadMessage(ws2, t)

	if msgType != enums.Behaviour {
		t.Fatalf("Wrong message type %d", msgType)
	}
	data, _ = dataAny.(structs.BehaviourData)

	//we should get a STOP TypeSlow message
	if data.Type != enums.TypeSlow {
		t.Fatal("Not peek")
	}
	if data.Start {
		t.Fatal("Wrong instruction")
	}
}
