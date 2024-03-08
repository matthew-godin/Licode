import Pill from "./Pill";

export interface SmallPillProps {
    scale: number,
    color: string,
    filter: string,
    height: number
}

function SmallPill(props: SmallPillProps) {
    return (
        <Pill width={375} height={props.height} scale={props.scale} color={props.color} filter={props.filter} />
    );
}

export default SmallPill;