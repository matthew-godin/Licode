package test

import (
	"server/structs"
	"server/test/test_util"
	"testing"
)

// test duplicate registration
func TestRegisterDup(t *testing.T) {
	test_util.ClearState()

	server := test_util.NewServer()
	defer server.Close()

	pair := structs.Pair{
		Id1: "id1",
		Id2: "id2",
	}

	statusCode, out := test_util.MockRegPair(pair, server, t)

	if statusCode != 200 || out != "" {
		t.Fatalf("Failed to register: statusCode=%d, out=%s", statusCode, out)
	}

	statusCode, out = test_util.MockRegPair(pair, server, t)
	if statusCode != 200 || out != "" {
		t.Fatalf("Failed to reregister: statusCode=%d, out=%s", statusCode, out)
	}
}
