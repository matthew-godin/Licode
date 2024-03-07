import { Grid } from '@mui/material';
import QuestionLine from "./components/QuestionLine";

export interface QuestionStatementProps {
    questionLines: string[]
}

function QuestionStatement(props: QuestionStatementProps) {
    return (
        <Grid container item mt={1}>
            <Grid item xs={1} />
            <Grid container direction="column" item xs={10}>
                <Grid item mt={2}>
                    <QuestionLine question={props.questionLines[0]} />
                </Grid>
                <Grid item mt={1.5}>
                    <QuestionLine question={props.questionLines[1]} />
                </Grid>
                <Grid item mt={1.5}>
                    <QuestionLine question={props.questionLines[2]} />
                </Grid>
            </Grid>
            <Grid item xs ={1} />
        </Grid>
    );
}

export default QuestionStatement;