import BallLine from "./BallLine";
import Editor from "./Editor";
import InputOutput from "./InputOutput";
import Line from "./Line";
import Error from "./Error";

export interface SideEditorProps {
    scale: number,
    color: string,
    marginTop: number,
    marginMiddle: number,
    usernameString: string,
    wildcardsVisible: boolean,
    questionString: string,
    editorStrings: string[],
    editorLastString: string,
    inputString: string,
    standardOutputString: string,
    standardErrorString: string,
    outputString: string,
    dataAos: string
}

function SideEditor(props: SideEditorProps) {
    let sideEditorStyle = {
        marginRight: props.marginMiddle * props.scale + "px",
        marginTop: (props.marginTop - 375) * props.scale + "px",
    };
    let spacing = 375 * 1;

    return (
        <div style={sideEditorStyle}>
            <Line dataAos={props.dataAos} scale={props.scale} color={props.color} spacing={spacing} lineString={props.usernameString} />
            <BallLine dataAos={props.dataAos} scale={props.scale} color={props.color} visible={props.wildcardsVisible} />
            <Line dataAos={props.dataAos} scale={props.scale} color={props.color} spacing={spacing} lineString={props.questionString} />
            <Editor dataAos={props.dataAos} scale={props.scale} color={props.color} strings={props.editorStrings} lastString={props.editorLastString} />
            <InputOutput dataAos={props.dataAos} scale={props.scale} color={props.color} lineString={props.inputString} />
            <InputOutput dataAos={props.dataAos} scale={props.scale} color={props.color} lineString={props.standardOutputString} />
            <Error dataAos={props.dataAos} scale={props.scale} color={props.color} spacing={spacing} lineString={props.standardErrorString} />
            <InputOutput dataAos={props.dataAos} scale={props.scale} color={props.color} lineString={props.outputString} />
        </div>
    );
}

export default SideEditor;
