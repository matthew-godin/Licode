import Ball from "./Ball";
import BallPill from "./BallPill";

export interface BallLineProps {
    scale: number,
    color: string,
    visible: boolean,
    dataAos: string
}

function BallLine(props: BallLineProps) {
    let ballLineStyle = {
        display: "flex"
    };
    let filter = props.visible ? "invert(0%)" : "invert(100%)";

    return (
        <div style={ballLineStyle}>
            <Ball dataAos={props.dataAos} scale={props.scale} color={props.color} filter={filter} />
            <BallPill dataAos={props.dataAos} scale={props.scale} color={props.color} filter={filter} />
            <BallPill dataAos={props.dataAos} scale={props.scale} color={props.color} filter={filter} />
        </div>
    );
}

export default BallLine;
