import InputOutputRectangle from "./InputOutputRectangle";
import Line from "./Line";

export interface InputOutputProps {
    scale: number,
    color: string,
    lineString: string,
    dataAos: string
}

function InputOutput(props: InputOutputProps) {
    let editorStyle = {
        display: "flex",
        marginTop: 375 * props.scale + "px"
    };

    return (
        <div style={editorStyle}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center",
                width: 2625 * 2 * props.scale + "px", height: 2625 * props.scale + "px"  }}>
                <Line dataAos={props.dataAos} scale={props.scale} color={props.color} spacing={0} lineString={props.lineString} />
            </div>
            <InputOutputRectangle dataAos={props.dataAos} scale={props.scale} color={props.color} />
        </div>
    );
}

export default InputOutput;
