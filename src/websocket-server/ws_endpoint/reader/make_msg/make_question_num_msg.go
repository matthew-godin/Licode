package make_msg

import (
	"server/enums"
	"server/structs"
)

// QuestionNum ctor
func MakeQuestionNumMsg(questionNum string) structs.Msg {
	return MakeInformationMsg(enums.QuestionNum, questionNum)
}
