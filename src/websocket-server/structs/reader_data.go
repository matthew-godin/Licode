package structs

type ReaderData struct {
	ErrMsg     []byte
	MsgType    int64
	Msg        string
	Args       []string
	Player     *Player
	Ok         bool
	DefMsgType int
	P          []byte
	Err        error
}
