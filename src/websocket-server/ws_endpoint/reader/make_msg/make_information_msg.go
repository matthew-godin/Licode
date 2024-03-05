package make_msg

import (
	"server/enums"
	"server/structs"
)

func MakeInformationMsg(iType int, info string) structs.Msg {
	return structs.Msg{
		Type: enums.Information,
		Data: structs.InformationData{
			Type: iType,
			Info: info,
		},
	}
}
