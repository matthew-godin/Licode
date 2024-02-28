import { FIELDUPDATE, CLIENTMSGTYPE } from "../../../../../enums/WebSocketServerEnums";
import CodingEditor from "../../CodingEditor"

export const sendFieldUpdate = (that: CodingEditor, type: number, newValue: string) => {
    that.state.socket?.send(CLIENTMSGTYPE.GiveFieldUpdate.toString() + " " + type.toString() + " " + newValue);
}

const sendCodeUpdate = (that: CodingEditor, code: string) => {
    sendFieldUpdate(that, FIELDUPDATE.Code, code);
}

const inititalUpdates = (that: CodingEditor) => {
    //code
    sendCodeUpdate(that, that.state.code)
    //input
    sendFieldUpdate(that, FIELDUPDATE.Input, that.state.input)
    //test cases
    sendFieldUpdate(that, FIELDUPDATE.TestCases, that.stringifyBoolArray(that.state.testCasesPassed))

    console.log("sent initial updates")

    //(standard) output???
}

export default inititalUpdates;
