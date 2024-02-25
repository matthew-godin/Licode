/*
SERVER replies with Msg as json
Message Types:
	Behaviour
		TypeSlow		- tell player to type slow
		Peek			- tell player to stop peeking
	Information
		Connection		- tell player if connection succeed
		Error			- give player an error message
		Loss			- inform player their opponent has won
		QuestionNum		- inform player their opponent is on a new question
	FieldUpdate
		Code			- give player their opponent's code editor input
		Input			- etc.
		Output
		StandardOutput
*/

/*
CLIENT sends message type and args i.e. <MsgType> <args[1]> <args[2]> ...
Message Types:
	ConnectionRequest		- indicates player wants to join the game with sid args[1]
	StartPeeking			- player using peek wildcard
	SlowOpponent			- player using typing speed wildcard
	Skip					- player is skipping a test case
	GiveFieldUpdate			- player is sending a field update (code, input, ...)
		same subtypes as SERVER FieldUpdate
	GiveQuestionNum			- indicates the player is now solving question args[1]
	Win						- the player has solved the final question
*/

//Server message top level types
export enum SERVERMSGTYPE {
	Behaviour   = 0,
	Information = 1,
	FieldUpdate = 2,
}

//Behaviour subtypes
export enum BEHAVIOUR {
	TypeSlow = 0,
	Peek     = 1,
}

//Information subtypes
export enum INFORMATION {
	Connection  = 0,
	Error       = 1,
	Loss        = 2,
	QuestionNum = 3,
}

//FieldUpdate subtypes
export enum FIELDUPDATE {
	Code           = 0,
	Input          = 1,
	Output         = 2,
	StandardOutput = 3,
    StandardError  = 4,
    TestCases      = 5,
}

//client messages
export enum CLIENTMSGTYPE {
	ConnectionRequest       = 0,
	StartPeeking            = 1,
	SlowOpponent            = 2,
	Skip                    = 3,
	GiveFieldUpdate         = 4,
	GiveQuestionNum         = 5,
	Win                     = 6,
}
