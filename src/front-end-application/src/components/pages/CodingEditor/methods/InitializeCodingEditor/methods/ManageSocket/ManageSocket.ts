import CodingEditor from "../../../../CodingEditor";
import addCloseListener from './methods/AddCloseListener';
import addOpenListener from './methods/AddOpenListener';
import addMessageListener from './methods/AddMessageListener';
import addErrorListener from "./methods/AddErrorListener";

const manageSocket = (that: CodingEditor) => {
    if(that.state.socket == null) {
        return;
    }
    addOpenListener(that.state.socket, that.state.sid);
    addCloseListener(that.state.socket, that.state.sid);
    addMessageListener(that.state.socket, that);
    addErrorListener(that.state.socket);
}

export default manageSocket;