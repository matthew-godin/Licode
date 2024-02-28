import EditorData from "./EditorData";
import EditorFlags from "./EditorFlags";
import WebSocketServerMethods from "./WebSocketServerMethods";

export default interface CodingEditorData {
    userEditorData: EditorData;
    opponentEditorData: EditorData;
    webSocketServerMethods: WebSocketServerMethods;
    editorFlags: EditorFlags;
}
