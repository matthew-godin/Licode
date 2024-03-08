import Ball from "./Ball";
import BallPill from "./BallPill";

export interface BallLineProps {
    scale: number,
    color: string,
    visible: boolean
}

function BallLine(props: BallLineProps) {
    let ballLineStyle = {
        display: "flex"
    };
    let filter = props.visible ? "invert(0%)" : "invert(100%)";

    return (
        <div style={ballLineStyle}>
            <Ball scale={props.scale} color={props.color} filter={filter} />
            <BallPill scale={props.scale} color={props.color} filter={filter} />
            <BallPill scale={props.scale} color={props.color} filter={filter} />
        </div>
    );
}

export default BallLine;
