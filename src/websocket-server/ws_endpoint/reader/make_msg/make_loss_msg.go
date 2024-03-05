package make_msg

import (
	"server/enums"
	"server/structs"
)

// Loss ctor
func MakeLossMsg() structs.Msg {
	return MakeInformationMsg(enums.Loss, "")
}
