package compute_new_value

import (
	"fmt"
	"log"
)

func ComputeNewValue(newValue string, msgType int64, field int64) string {
	//recover newValue
	msgTypeStr := fmt.Sprint(msgType)
	fieldTypeStr := fmt.Sprint(field)
	i := 0
	//read white space
	for ; i < len(newValue) && newValue[i] == ' '; i += 1 {
	}
	//read msgType
	j := 0
	for j < len(msgTypeStr) && (i+j) < len(newValue) && newValue[i+j] == msgTypeStr[j] {
		j += 1
	}
	i += j
	//read white space
	for ; i < len(newValue) && newValue[i] == ' '; i += 1 {
	}
	//read field type
	j = 0
	for j < len(fieldTypeStr) && (i+j) < len(newValue) && newValue[i+j] == fieldTypeStr[j] {
		j += 1
	}
	i += j
	//read white space
	for ; i < len(newValue) && newValue[i] == ' '; i += 1 {
	}
	//read newValue
	if i < len(newValue) {
		log.Printf("Taking %s from %s\n", newValue[i:], newValue)
		newValue = newValue[i:]
	} else {
		log.Printf("Nothing left in %s\n", newValue)
		newValue = ""
	}
	return newValue
}
