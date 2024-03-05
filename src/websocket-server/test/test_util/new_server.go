package test_util

import (
	"net/http"
	"net/http/httptest"
	"server/register_pair"
	"server/ws_endpoint"
)

func NewServer() *httptest.Server {
	mux := http.NewServeMux()

	mux.HandleFunc("/registerPair", register_pair.RegisterPair)
	mux.HandleFunc("/ws", ws_endpoint.WsEndpoint)

	//mock server
	return httptest.NewServer(mux)
}
