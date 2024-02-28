import { FIELDUPDATE, CLIENTMSGTYPE } from "../../../../../enums/WebSocketServerEnums";
import { sendFieldUpdate } from "../InitialUpdates/InitialUpdates";
import CodingEditor from "../../CodingEditor";

export const peek = (that: CodingEditor) => {
    console.log("Sending Peek");
    that.state.socket?.send(CLIENTMSGTYPE.StartPeeking.toString());
    that.setState({
        peeking: true
    });
};

export const slow = (that: CodingEditor) => {
    console.log("Sending Slow");
    that.state.socket?.send(CLIENTMSGTYPE.SlowOpponent.toString());
};

export const skip = (that: CodingEditor) => {
    console.log("Sending Skip");
    that.setState({
        skipping: true
    });
    let newTestCasesPassed = Array.from(that.state.testCasesPassed);
    for (let i = 0; i < that.state.testCasesPassed.length; ++i) {
        if (!that.state.testCasesPassed[i]) {
            newTestCasesPassed[i] = true;
            that.setState({
                testCasesPassed: newTestCasesPassed
            });
            break;
        }
    }
    that.state.socket?.send(CLIENTMSGTYPE.Skip.toString());
    sendFieldUpdate(that, FIELDUPDATE.TestCases, that.stringifyBoolArray(newTestCasesPassed));
};
