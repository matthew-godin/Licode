export interface InputOutputRectangleProps {
    scale: number,
    color: string
}

function InputOutputRectangle(props: InputOutputRectangleProps) {
    let height = 2625;
    let width = height * 8;
    let borderRadius = 375;
    let margin = 375;
    let editorRectangleStyle = {
        width: width * props.scale + "px",
        height: height * props.scale + "px",
        borderRadius: borderRadius * props.scale + "px",
        backgroundColor: props.color,
        marginLeft: margin * props.scale + "px",
        marginRight: margin * props.scale + "px"
    }

    return (
        <div style={editorRectangleStyle} />
    );
}

export default InputOutputRectangle;
