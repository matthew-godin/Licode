import { MAX_TYPING_SPEED } from "../../../../../constants/WebSocketServerConstants";
import { FIELDUPDATE } from "../../../../../enums/WebSocketServerEnums";
import CodingEditor from "../../CodingEditor"
import { sendFieldUpdate } from "../InitialUpdates/InitialUpdates";

export const inputKeyDown = (e: any, that: CodingEditor) => {
    //if we're typing slow and we can't type yet
    //      cancel the event
    //if we're typing slow, but can type
    //      record the time when we can type again in canTypeAt
    if(that.state.typingSlow && that.state.canTypeAt != null && (new Date() < that.state.canTypeAt)) {
        e.preventDefault()
    } else if(that.state.typingSlow) {
        //1000 / MAX_TYPING_SPEED = milliseconds per character typed
        that.setState({canTypeAt: new Date(new Date().getTime() + 1000 / MAX_TYPING_SPEED)})
    }
};

export const codeChange = (value: string, e: React.ChangeEvent<HTMLInputElement>, that: CodingEditor) => {
    sendFieldUpdate(that, FIELDUPDATE.Code, value);
    that.setState({
        code: value
    });
};

export const inputChange = (e: React.ChangeEvent<HTMLInputElement>, that: CodingEditor) => {
    sendFieldUpdate(that, FIELDUPDATE.Input, e.currentTarget.value);
    that.setState({ input: e.currentTarget.value });
};
