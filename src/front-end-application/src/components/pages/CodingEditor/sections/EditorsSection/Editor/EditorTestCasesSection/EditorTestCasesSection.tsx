import { Grid, Typography } from '@mui/material';
import TestCaseIndicator from "./TestCaseIndicator/TestCaseIndicator";
import EditorTestCasesSectionProps from './EditorTestCasesSectionProps';

function EditorTestCasesSection(props: EditorTestCasesSectionProps) {
    return (
        <Grid container item mt={2}>
            <Grid item xs={0.5} />
            <Grid container direction="column" item xs={11}>
                <Grid item>
                    <Typography variant="aboveEditor" sx={{ m: 0, p: 0 }}>
                        Test Cases
                    </Typography>
                </Grid>
                <Grid container item>
                    <Grid item xs={0.5} />
                    {props.testCasesPassed.map((passed) =>
                        <Grid item xs={1}>
                            <TestCaseIndicator passed={passed} />
                        </Grid>
                    )}
                    <Grid item xs={0.5} />
                </Grid>
            </Grid>
            <Grid item xs={0.5} />
        </Grid>
    );
}

export default EditorTestCasesSection;