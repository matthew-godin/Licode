import Pill from "./Pill";

export interface ExtraLargePillProps {
    scale: number,
    color: string,
    filter: string,
    height: number,
    dataAos: string
}

function ExtraLargePill(props: ExtraLargePillProps) {
    return (
        <Pill dataAos={props.dataAos} width={2625} height={props.height} scale={props.scale} color={props.color} filter={props.filter} />
    );
}

export default ExtraLargePill;