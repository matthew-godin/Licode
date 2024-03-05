package test

import (
	"server/pair_management"
	"server/players"
	"server/structs"
	"server/test/test_util"
	"testing"
)

func TestRemovePair(t *testing.T) {
	test_util.ClearState()

	pair_management.AddPair(structs.Pair{Id1: "id1", Id2: "id2"})
	if len(players.Players) != 2 {
		t.Error("Valid Pair Not Added (in remove test)")
	}
	pair_management.RemovePair("id1")
	if len(players.Players) != 0 {
		t.Error("Pair Not Removed")
	}
}
