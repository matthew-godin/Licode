import Pill from "./Pill";

export interface LargePillProps {
    scale: number,
    color: string,
    filter: string,
    height: number
}

function LargePill(props: LargePillProps) {
    return (
        <Pill width={1875} height={props.height} scale={props.scale} color={props.color} filter={props.filter} />
    );
}

export default LargePill;