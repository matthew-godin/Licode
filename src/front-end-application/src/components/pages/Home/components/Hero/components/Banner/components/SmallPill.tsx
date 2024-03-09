import Pill from "./Pill";

export interface SmallPillProps {
    scale: number,
    color: string,
    filter: string,
    height: number,
    dataAos: string
}

function SmallPill(props: SmallPillProps) {
    return (
        <Pill dataAos={props.dataAos} width={375} height={props.height} scale={props.scale} color={props.color} filter={props.filter} />
    );
}

export default SmallPill;