import EditorData from '../../../common/interfaces/codingEditor/EditorData';
import EditorFlags from '../../../common/interfaces/codingEditor/EditorFlags';
import WebSocketServerMethods from '../../../common/interfaces/codingEditor/WebSocketServerMethods';

export default interface EditorsSectionProps {
    userEditorData: EditorData,
    opponentEditorData: EditorData,
    webSocketServerMethods: WebSocketServerMethods
    editorFlags: EditorFlags
}
