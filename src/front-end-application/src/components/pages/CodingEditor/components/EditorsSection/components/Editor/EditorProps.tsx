import EditorData from "../../../../interfaces/EditorData";
import EditorFlags from "../../../../interfaces/EditorFlags";
import WebSocketServerMethods from "../../../../interfaces/WebSocketServerMethods";

export default interface EditorProps {
    editorData: EditorData,
    webSocketServerMethods: WebSocketServerMethods,
    editorFlags: EditorFlags,
    isPlayer: boolean
}
