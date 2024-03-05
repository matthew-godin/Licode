package test

import (
	"fmt"
	"server/enums"
	"server/structs"
	"server/test/test_util"
	"testing"

	"github.com/gorilla/websocket"
)

func TestQuestionNum(t *testing.T) {
	server, ws1, ws2 := test_util.GameInit(t)
	defer server.Close()
	defer ws1.Close()
	defer ws2.Close()

	qNum := "2"

	err := ws1.WriteMessage(websocket.TextMessage, []byte(fmt.Sprintf("%d %s", enums.GiveQuestionNum, qNum)))
	if err != nil {
		t.Fatal("Failed to win")
	}

	msgType, dataAny := test_util.ReadMessage(ws2, t)
	if msgType != enums.Information {
		t.Fatalf("Wrong message type %d", msgType)
	}
	data, _ := dataAny.(structs.InformationData)

	if data.Type != enums.QuestionNum {
		t.Fatalf("Wrong info type %d", data.Type)
	}
	if data.Info != qNum {
		t.Fatalf("Wrong question number")
	}
}
