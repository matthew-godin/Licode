package test_util

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"server/structs"
	"testing"
)

func MockRegPair(pair structs.Pair, server *httptest.Server, t *testing.T) (int, string) {
	reqBody, err := json.Marshal(pair)
	if err != nil {
		t.Fatalf("%v", err)
	}

	res, err := http.Post(server.URL+"/registerPair", "application/json", bytes.NewBuffer(reqBody))
	if err != nil {
		t.Fatalf("%v", err)
	}
	defer res.Body.Close()
	out, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Fatalf("%v", err)
	}

	return res.StatusCode, string(out)
}
