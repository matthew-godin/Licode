export interface PillProps {
    width: number,
    height: number,
    scale: number,
    color: string,
    filter: string
}

function Pill(props: PillProps) {
    let width = props.width;
    let height = props.height;
    let borderRadius = 187.5;
    let margin = 187.5;
    let pillStyle = {
        width: width * props.scale + "px",
        height: height * props.scale + "px",
        borderRadius: borderRadius * props.scale + "px",
        backgroundColor: props.color,
        marginLeft: margin * props.scale + "px",
        marginRight: margin * props.scale + "px",
        filter: props.filter
    }

    return (
        <div style={pillStyle} />
    );
}

export default Pill;
