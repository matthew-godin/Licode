package main

import (
	"fmt"
	"log"
	"net/http"
)

// test method
// query response with r
// write response with w
// format write with fmt
// log on server with log
func homePage(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Home Page")
	log.Println("Home Page")
}
