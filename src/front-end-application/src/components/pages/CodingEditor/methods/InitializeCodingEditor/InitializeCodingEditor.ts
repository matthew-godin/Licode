import CodingEditor from "../../CodingEditor";
import setState from "./methods/SetState/SetState";
import manageSocket from './methods/ManageSocket/ManageSocket';
import manageEditor from "./methods/ManageEditor/ManageEditor";

const initializeCodingEditor = async (that: CodingEditor) => {
    await setState(that);
    manageSocket(that);
    manageEditor(that);
}

export default initializeCodingEditor;