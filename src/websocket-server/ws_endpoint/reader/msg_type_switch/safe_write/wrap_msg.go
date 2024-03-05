package safe_write

import "server/structs"

// WrappedMsg ctor
func wrapMsg(defMsgType int, msg structs.Msg, callback structs.Callback) structs.WrappedMsg {
	return structs.WrappedMsg{
		DefMsgType: defMsgType,
		Msg:        msg,
		Callback:   callback,
	}
}

// WrappedMsg ctor 2 (default callback)
func wrapMsg2(defMsgType int, msg structs.Msg) structs.WrappedMsg {
	return structs.WrappedMsg{
		DefMsgType: defMsgType,
		Msg:        msg,
		Callback:   func() {},
	}
}
