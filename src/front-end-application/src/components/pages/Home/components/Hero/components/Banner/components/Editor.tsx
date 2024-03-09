import EditorRectangle from "./EditorRectangle";
import EditorText from "./EditorText";

export interface EditorProps {
    scale: number,
    color: string,
    strings: string[],
    lastString: string,
    dataAos: string
}

function Editor(props: EditorProps) {
    let editorStyle = {
        display: "flex"
    };

    return (
        <div style={editorStyle}>
            <EditorRectangle dataAos={props.dataAos} scale={props.scale} color={props.color} />
            <EditorText dataAos={props.dataAos} scale={props.scale} color={props.color} strings={props.strings} lastString={props.lastString} />
        </div>
    );
}

export default Editor;
