import SmallPill from "./SmallPill";
import MediumPill from "./MediumPill";
import LargePill from "./LargePill";
import ExtraLargePill from "./ExtraLargePill";
import MegaLargePill from "./MegaLargePill";
import Indent from "./Indent";

export interface LineProps {
    scale: number,
    color: string,
    spacing: number,
    lineString: string,
    selected?: boolean
}

function Line(props: LineProps) {
    let backgroundColor = props.selected ? props.color : "transparent";
    let filter = props.selected ? "invert(100%)" : "invert(0%)";
    let pillHeight = 375;
    let lineStyle = {
        display: "flex",
        backgroundColor: backgroundColor,
        height: (props.spacing * 2 + pillHeight) * props.scale + "px",
        alignItems: "center",
        borderRadius: props.spacing * props.scale + "px"
    };

    return (
        <div style={lineStyle}>
            {props.lineString.split('').map((size) => {
                switch (size) {
                    case "S":
                        return <SmallPill scale={props.scale} color={props.color} filter={filter} height={pillHeight} />
                    case "M":
                        return <MediumPill scale={props.scale} color={props.color} filter={filter} height={pillHeight} />
                    case "L":
                        return <LargePill scale={props.scale} color={props.color} filter={filter} height={pillHeight} />
                    case "X":
                        return <ExtraLargePill scale={props.scale} color={props.color} filter={filter} height={pillHeight} />
                    case "G":
                        return <MegaLargePill scale={props.scale} color={props.color} filter={filter} height={pillHeight} />
                    case "I":
                        return <Indent scale={props.scale} height={pillHeight} />
                }
            })}
        </div>
    );
}

export default Line;
