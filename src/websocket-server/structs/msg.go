package structs

// the only struct sent to clients
type Msg struct {
	Type int64 `json:"Type"`
	Data any   `json:"Data"`
}
