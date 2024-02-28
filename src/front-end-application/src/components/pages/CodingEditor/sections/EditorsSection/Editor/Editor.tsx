import { Grid } from '@mui/material';
import EditorTopSection from './EditorTopSection/EditorTopSection';
import EditorSection from './EditorSection/EditorSection';
import EditorInputOutputSection from './EditorInputOutputSection/EditorInputOutputSection';
import EditorTestCasesSection from './EditorTestCasesSection/EditorTestCasesSection';
import EditorProps from './EditorProps';

function Editor(props: EditorProps) {
    return (
        <Grid container direction="column" item xs={5}>
            <EditorTopSection topSectionData={props.editorData.topSectionData} loaded={props.editorFlags.loaded}
                webSocketServerMethods={props.webSocketServerMethods} isPlayer={props.isPlayer} />
            <EditorSection editorSectionData={props.editorData.editorSectionData}
                peeking={props.editorFlags.peeking} isPlayer={props.isPlayer} />
            <EditorInputOutputSection name="Input" inputOutputSectionData={props.editorData.inputData}
                peeking={props.editorFlags.peeking} isPlayer={props.isPlayer} readOnly={!props.isPlayer} />
            <EditorInputOutputSection name="Standard Output" inputOutputSectionData={props.editorData.standardOutputData}
                peeking={props.editorFlags.peeking} isPlayer={props.isPlayer} readOnly={!props.isPlayer} />
            <EditorInputOutputSection name="Output" inputOutputSectionData={props.editorData.outputData}
                peeking={props.editorFlags.peeking} isPlayer={props.isPlayer} readOnly={true} />
            <EditorTestCasesSection testCasesPassed={props.editorData.testCasesPassed} />
        </Grid>
    );
}

export default Editor;