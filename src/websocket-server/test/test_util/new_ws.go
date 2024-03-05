package test_util

import (
	"fmt"
	"log"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gorilla/websocket"
)

func NewWS(server *httptest.Server, t *testing.T) *websocket.Conn {
	//get ws equivalent url
	u := "ws" + strings.TrimPrefix(server.URL, "http") + "/ws"
	log.Println(fmt.Sprintf("u: %s", u))

	//connect
	ws, _, err := websocket.DefaultDialer.Dial(u, nil)
	if err != nil {
		t.Fatalf("%v", err)
	}
	return ws
}
