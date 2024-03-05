package test_util

import "server/enums"

var FieldUpdateCases []FieldUpdateCase = []FieldUpdateCase{
	{Type: enums.Code, Value: "this is some code"},
	{Type: enums.Input, Value: "this is some input"},
	{Type: enums.TestCases, Value: "these are some test case results"},
}
