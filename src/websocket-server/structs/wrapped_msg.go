package structs

// a msg to be stored in a player's inbox
// used to store messages that were supposed to
// be sent while they were disconnected
type WrappedMsg struct {
	DefMsgType int
	Msg        Msg
	Callback   Callback
}
