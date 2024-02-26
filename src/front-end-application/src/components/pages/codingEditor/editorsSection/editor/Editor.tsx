import { Grid } from '@mui/material';
import EditorTopSection from './editorTopSection/EditorTopSection';
import EditorSection from './editorSection/EditorSection';
import EditorInputOutputSection from './editorInputOutputSection/EditorInputOutputSection';
import EditorTestCasesSection from './editorTestCasesSection/EditorTestCasesSection';
import EditorProps from './EditorProps';

function Editor(props: EditorProps) {
    return (
        <Grid container direction="column" item xs={5}>
            <EditorTopSection username={props.username} eloRating={props.eloRating} loaded={props.loaded} skipTestCase={props.skipTestCase}
                slowOpponent={props.slowOpponent} peekOpponent={props.peekOpponent} questionNum={props.questionNum} isPlayer={props.isPlayer} />
            <EditorSection code={props.code} handleCodeChange={props.handleCodeChange} peeking={props.peeking} isPlayer={props.isPlayer} />
            <EditorInputOutputSection name="Input" handleChange={props.handleInputChange} content={props.input} peeking={props.peeking}
                isPlayer={props.isPlayer} readOnly={!props.isPlayer} />
            <EditorInputOutputSection name="Standard Output" handleChange={() => {}} content={props.standardOutput} errorContent={props.standardError}
                peeking={props.peeking} isPlayer={props.isPlayer} readOnly={!props.isPlayer} />
            <EditorInputOutputSection name="Output" handleChange={() => {}} content={props.output}
                peeking={props.peeking} isPlayer={props.isPlayer} readOnly={true} />
            <EditorTestCasesSection testCasesPassed={props.testCasesPassed} />
        </Grid>
    );
}

export default Editor;