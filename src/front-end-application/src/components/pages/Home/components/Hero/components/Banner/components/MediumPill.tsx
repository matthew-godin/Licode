import Pill from "./Pill";

export interface MediumPillProps {
    scale: number,
    color: string,
    filter: string,
    height: number,
    dataAos: string
}

function MediumPill(props: MediumPillProps) {
    return (
        <Pill dataAos={props.dataAos} width={1125} height={props.height} scale={props.scale} color={props.color} filter={props.filter} />
    );
}

export default MediumPill;