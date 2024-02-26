import { Grid } from '@mui/material';
import Editor from './editor/Editor';
import EditorsSectionProps from './EditorsSectionProps';

function EditorsSection(props: EditorsSectionProps) {
    return (
        <Grid container item mt={0.5}>
            <Grid item xs={0.75} />
            <Editor username="You" eloRating={props.eloRating} loaded={props.loaded} skipTestCase={props.skipTestCase} slowOpponent={props.slowOpponent}
                peekOpponent={props.peekOpponent} questionNum={props.questionNum} code={props.code} handleCodeChange={props.handleCodeChange}
                input={props.input} handleInputChange={props.handleInputChange} standardOutput={props.standardOutput} standardError={props.standardError}
                output={props.output} testCasesPassed={props.testCasesPassed} peeking={props.peeking} isPlayer={true} />
            <Grid item xs={0.5} />
            <Editor username={props.opponentUsername} eloRating={props.opponentEloRating} loaded={props.loaded} skipTestCase={props.skipTestCase}
                slowOpponent={props.slowOpponent} peekOpponent={props.peekOpponent} questionNum={props.opponentQuestionNum} code={props.rightEditorCode}
                handleCodeChange={props.handleCodeChange} input={props.rightInput} handleInputChange={props.handleInputChange}
                standardOutput={props.rightStandardOutput} standardError={props.rightStandardError} output={props.rightOutput}
                testCasesPassed={props.rightTestCasesPassed} peeking={props.peeking} isPlayer={false} />
            <Grid item xs={0.75} />
        </Grid>
    );
}

export default EditorsSection;