import EditorData from '../../interfaces/EditorData';
import EditorFlags from '../../interfaces/EditorFlags';
import WebSocketServerMethods from '../../interfaces/WebSocketServerMethods';

export default interface EditorsSectionProps {
    userEditorData: EditorData,
    opponentEditorData: EditorData,
    webSocketServerMethods: WebSocketServerMethods
    editorFlags: EditorFlags
}
