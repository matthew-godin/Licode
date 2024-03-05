package make_msg

import (
	"server/enums"
	"server/structs"
)

// ConnectMsg ctor
func MakeConnectMsg(err string) structs.Msg {
	return MakeInformationMsg(enums.Connection, err)
}
