import Line from "./Line";

export interface LeftEditorProps {
    scale: number,
    color: string,
    strings: string[],
    lastString: string
}

function EditorText(props: LeftEditorProps) {
    let editorTextStyle = {
    };
    let spacing = 375 * 1 / 2;

    return (
        <div style={editorTextStyle}>
            {props.strings.map((s) => 
                <>
                    <Line scale={props.scale} color={props.color} spacing={spacing} lineString={s} />
                </>
            )}
            {props.lastString && <Line scale={props.scale} color={props.color} spacing={spacing} lineString={props.lastString} selected={true} />}
        </div>
    );
}

export default EditorText;
