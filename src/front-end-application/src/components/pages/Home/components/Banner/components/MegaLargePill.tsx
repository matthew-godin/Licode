import Pill from "./Pill";

export interface MegaLargePillProps {
    scale: number,
    color: string,
    filter: string,
    height: number
}

function MegaLargePill(props: MegaLargePillProps) {
    return (
        <Pill width={2625 * 3} height={props.height} scale={props.scale} color={props.color} filter={props.filter} />
    );
}

export default MegaLargePill;