import Pill from "./Pill";

export interface LargePillProps {
    scale: number,
    color: string,
    filter: string,
    height: number,
    dataAos: string
}

function LargePill(props: LargePillProps) {
    return (
        <Pill dataAos={props.dataAos} width={1875} height={props.height} scale={props.scale} color={props.color} filter={props.filter} />
    );
}

export default LargePill;