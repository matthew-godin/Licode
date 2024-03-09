import Line from "./Line";

export interface QuestionStatementProps {
    scale: number,
    color: string,
    dataAos: string
}

function QuestionStatement(props: QuestionStatementProps) {
    let questionStatementString = "MMLSMSXMXSMSLMLSMXXSXSSX";
    let spacing = 0;

    return (
        <Line dataAos={props.dataAos} scale={props.scale} color={props.color} spacing={spacing} lineString={questionStatementString} />
    );
}

export default QuestionStatement;
