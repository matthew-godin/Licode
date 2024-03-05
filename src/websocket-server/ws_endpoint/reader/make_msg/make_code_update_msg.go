package make_msg

import (
	"server/enums"
	"server/structs"
)

// CodeUpdate ctor
func MakeCodeUpdateMsg(code string) structs.Msg {
	return MakeFieldUpdateMsg(enums.Code, code)
}
