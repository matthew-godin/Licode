package make_msg

import (
	"server/enums"
	"server/structs"
)

// Peek ctor
func MakePeekMsg() structs.Msg {
	return MakeBehaviourMsg(enums.Peek, false)
}
