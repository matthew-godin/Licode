package test

import (
	"server/structs"
	"server/test/test_util"
	"testing"
)

// test one-off pair registration (called by deno)
func TestRegisterPair(t *testing.T) {
	for i := 0; i < len(test_util.PairRegs); i++ {
		test_util.ClearState()
		server := test_util.NewServer()
		defer server.Close()

		statusCode, out := test_util.MockRegPair(structs.Pair{Id1: test_util.PairRegs[i].Id1, Id2: test_util.PairRegs[i].Id2}, server, t)
		if (statusCode != 200 || out != "") && test_util.PairRegs[i].Expected {
			t.Errorf("Registration Failed w status %d and output %s", statusCode, out)
		} else if statusCode == 200 && out == "" && !test_util.PairRegs[i].Expected {
			t.Errorf("Pair (%s, %s) incorrectly registered", test_util.PairRegs[i].Id1, test_util.PairRegs[i].Id2)
		}
	}
}
