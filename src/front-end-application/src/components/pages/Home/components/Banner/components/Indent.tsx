export interface IndentProps {
    scale: number,
    height: number
}

function Indent(props: IndentProps) {
    let width = 1875;
    let height = props.height;
    let margin = 187.5;
    let pillStyle = {
        width: width * props.scale + "px",
        height: height * props.scale + "px",
        marginLeft: margin * props.scale + "px",
        marginRight: margin * props.scale + "px"
    }

    return (
        <div style={pillStyle} />
    );
}

export default Indent;