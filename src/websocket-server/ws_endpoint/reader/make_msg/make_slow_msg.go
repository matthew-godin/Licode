package make_msg

import (
	"server/enums"
	"server/structs"
)

// Slow ctor
func MakeSlowMsg(start bool) structs.Msg {
	return MakeBehaviourMsg(enums.TypeSlow, start)
}
