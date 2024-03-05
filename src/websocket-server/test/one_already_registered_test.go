package test

import (
	"server/structs"
	"server/test/test_util"
	"testing"
)

// test one already registered
func TestOneAlreadyRegistered(t *testing.T) {
	test_util.ClearState()

	server := test_util.NewServer()
	defer server.Close()

	pair1 := structs.Pair{
		Id1: "id1",
		Id2: "id2",
	}

	pair2 := structs.Pair{
		Id1: "id1",
		Id2: "id3",
	}

	statusCode, out := test_util.MockRegPair(pair1, server, t)

	if statusCode != 200 || out != "" {
		t.Fatalf("Failed to register: statusCode=%d, out=%s", statusCode, out)
	}

	statusCode, out = test_util.MockRegPair(pair2, server, t)
	if statusCode != 405 || out == "" {
		t.Fatalf("Wrong error response: statusCode=%d, out=%s", statusCode, out)
	}
}
