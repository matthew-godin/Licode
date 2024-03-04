package main

// ConnectMsg ctor
func makeConnectMsg(err string) Msg {
	return makeInformationMsg(Connection, err)
}

// Peek ctor
func makePeekMsg() Msg {
	return makeBehaviourMsg(Peek, false)
}

// Slow ctor
func makeSlowMsg(start bool) Msg {
	return makeBehaviourMsg(TypeSlow, start)
}

// CodeUpdate ctor
func makeCodeUpdateMsg(code string) Msg {
	return makeFieldUpdateMsg(Code, code)
}

// Error ctor
func makeErrorMsg(what string) Msg {
	return makeInformationMsg(Error, what)
}

// Loss ctor
func makeLossMsg() Msg {
	return makeInformationMsg(Loss, "")
}

// QuestionNum ctor
func makeQuestionNumMsg(questionNum string) Msg {
	return makeInformationMsg(QuestionNum, questionNum)
}
