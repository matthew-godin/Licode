package make_msg

import (
	"server/enums"
	"server/structs"
)

func MakeBehaviourMsg(bType int, start bool) structs.Msg {
	return structs.Msg{
		Type: enums.Behaviour,
		Data: structs.BehaviourData{
			Type:  bType,
			Start: start,
		},
	}
}
