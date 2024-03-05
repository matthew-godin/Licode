package make_msg

import (
	"server/enums"
	"server/structs"
)

// Error ctor
func MakeErrorMsg(what string) structs.Msg {
	return MakeInformationMsg(enums.Error, what)
}
