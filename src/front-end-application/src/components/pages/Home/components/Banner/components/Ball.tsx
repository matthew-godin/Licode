export interface BallProps {
    scale: number,
    color: string,
    filter: string
}

function Ball(props: BallProps) {
    let width = 1125;
    let height = width;
    let borderRadius = width / 2;
    let margin = 375;
    let ballStyle = {
        width: width * props.scale + "px",
        height: height * props.scale + "px",
        borderRadius: borderRadius * props.scale + "px",
        backgroundColor: props.color,
        marginLeft: margin * props.scale + "px",
        marginRight: margin * props.scale + "px",
        filter: props.filter
    }

    return (
        <div style={ballStyle} />
    );
}

export default Ball;
