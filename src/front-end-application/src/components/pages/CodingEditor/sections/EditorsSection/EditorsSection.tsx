import { Grid } from '@mui/material';
import Editor from './Editor/Editor';
import EditorsSectionProps from './EditorsSectionProps';

function EditorsSection(props: EditorsSectionProps) {
    return (
        <Grid container item mt={0.5}>
            <Grid item xs={0.75} />
            <Editor isPlayer={true} webSocketServerMethods={props.codingEditorData.webSocketServerMethods}
                editorData={props.codingEditorData.userEditorData} editorFlags={props.codingEditorData.editorFlags} />
            <Grid item xs={0.5} />
            <Editor isPlayer={false} webSocketServerMethods={props.codingEditorData.webSocketServerMethods}
                editorData={props.codingEditorData.opponentEditorData} editorFlags={props.codingEditorData.editorFlags} />
            <Grid item xs={0.75} />
        </Grid>
    );
}

export default EditorsSection;