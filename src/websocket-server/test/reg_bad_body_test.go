package test

import (
	"bytes"
	"io/ioutil"
	"net/http"
	"server/test/test_util"
	"testing"
)

func TestRegBadBody(t *testing.T) {
	test_util.ClearState()
	server := test_util.NewServer()
	defer server.Close()

	res, err := http.Post(server.URL+"/registerPair", "application/json", bytes.NewBuffer([]byte("bad body")))
	if err != nil {
		t.Fatalf("%v", err)
	}
	defer res.Body.Close()
	_, err = ioutil.ReadAll(res.Body)
	if err != nil {
		t.Fatalf("%v", err)
	}
	if res.StatusCode != 400 {
		t.Fatal("Wrong error response")
	}
}
