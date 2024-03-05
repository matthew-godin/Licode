package make_msg

import (
	"server/enums"
	"server/structs"
)

func MakeFieldUpdateMsg(fType int, newValue string) structs.Msg {
	return structs.Msg{
		Type: enums.FieldUpdate,
		Data: structs.FieldUpdateData{
			Type:     fType,
			NewValue: newValue,
		},
	}
}
