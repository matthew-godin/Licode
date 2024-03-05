package test_util

import (
	"net/http/httptest"
	"server/structs"
	"testing"
)

func RegValidPair(pair structs.Pair, server *httptest.Server, t *testing.T) {
	statusCode, out := MockRegPair(structs.Pair{Id1: "id1", Id2: "id2"}, server, t)
	if statusCode != 200 || out != "" {
		t.Fatalf("Registration failed in TestConnection")
	}
}
