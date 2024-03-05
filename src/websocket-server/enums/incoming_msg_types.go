package enums

// incoming messages
// int64 because of strconv.Parse return type
const (
	ConnectionRequest int64 = 0
	StartPeeking            = 1
	SlowOpponent            = 2
	Skip                    = 3
	GiveFieldUpdate         = 4
	GiveQuestionNum         = 5
	Win                     = 6
)
