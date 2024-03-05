package main

// Outgoing Message Types
const (
	Behaviour   int64 = 0
	Information       = 1
	FieldUpdate       = 2
)

// Behaviours
const (
	TypeSlow = 0
	Peek     = 1
)

// Information
const (
	Connection  = 0
	Error       = 1
	Loss        = 2
	QuestionNum = 3
)

// FieldUpdate
const (
	Code           = 0
	Input          = 1
	Output         = 2
	StandardOutput = 3
	StandardError  = 4
	TestCases      = 5
)

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
