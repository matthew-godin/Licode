package test

import (
	"fmt"
	"server/enums"
	"server/test/test_util"
	"testing"

	"github.com/gorilla/websocket"
)

func TestSkip(t *testing.T) {
	server, ws1, ws2 := test_util.GameInit(t)
	defer server.Close()
	defer ws1.Close()
	defer ws2.Close()

	err := ws1.WriteMessage(websocket.TextMessage, []byte(fmt.Sprint(enums.Skip)))
	if err != nil {
		t.Fatal("Failed to skip")
	}
}
