import Line from "./Line";

export interface ErrorProps {
    scale: number,
    color: string,
    spacing: number,
    lineString: string,
    dataAos: string
}

function Error(props: ErrorProps) {
    let editorStyle = {
        display: "flex",
        marginTop: 375 * props.scale + "px"
    };

    return (
        <div style={editorStyle}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center",
                width: 2625 * 2 * props.scale + "px"  }} />
            <Line dataAos={props.dataAos} scale={props.scale} color={props.color} spacing={props.spacing} lineString={props.lineString} />
        </div>
    );
}

export default Error;
