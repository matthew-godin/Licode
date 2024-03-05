package test_util

import (
	"encoding/json"
	"server/enums"
	"server/structs"
	"testing"

	"github.com/gorilla/websocket"
)

func ReadMessage(ws *websocket.Conn, t *testing.T) (int64, any) {
	_, p, err := ws.ReadMessage()
	if err != nil {
		t.Fatalf("%v", err)
	}

	var serverMsg structs.Msg
	err = json.Unmarshal(p, &serverMsg)
	if err != nil {
		t.Fatalf("%v", err)
	}

	data, ok := serverMsg.Data.(map[string]any)
	if !ok {
		t.Fatal(serverMsg)
	}
	typeAny, ok := data["Type"]
	if !ok {
		t.Fatal("No type in Data field")
	}
	typeF, ok := typeAny.(float64)
	if !ok {
		t.Fatal("Wrong type type in Data field")
	}

	typeI := int(typeF)

	switch serverMsg.Type {
	case enums.Behaviour:
		start, ok := data["Start"].(bool)
		if !ok {
			t.Fatal("Wrong behaviour start type")
		}
		serverMsg.Data = structs.BehaviourData{
			Type:  typeI,
			Start: start,
		}
		break
	case enums.Information:
		info, ok := data["Info"].(string)
		if !ok {
			t.Fatal("Wrong info info type")
		}
		serverMsg.Data = structs.InformationData{
			Type: typeI,
			Info: info,
		}
		break
	case enums.FieldUpdate:
		newValue, ok := data["NewValue"].(string)
		if !ok {
			t.Fatal("Wrong field update NewValue type")
		}
		serverMsg.Data = structs.FieldUpdateData{
			Type:     typeI,
			NewValue: newValue,
		}
		break
	default:
		t.Fatalf("Unknown Message Type %d", serverMsg.Type)
	}
	return serverMsg.Type, serverMsg.Data
}
