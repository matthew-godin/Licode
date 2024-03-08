import Pill from "./Pill";

export interface MediumPillProps {
    scale: number,
    color: string,
    filter: string,
    height: number
}

function MediumPill(props: MediumPillProps) {
    return (
        <Pill width={1125} height={props.height} scale={props.scale} color={props.color} filter={props.filter} />
    );
}

export default MediumPill;