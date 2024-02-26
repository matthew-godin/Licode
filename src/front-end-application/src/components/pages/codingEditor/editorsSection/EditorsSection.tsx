import { Grid } from '@mui/material';
import Editor from './editor/Editor';
import EditorsSectionProps from './EditorsSectionProps';

function EditorsSection(props: EditorsSectionProps) {
    return (
        <Grid container item mt={0.5}>
            <Grid item xs={0.75} />
            <Editor editorData={props.userEditorData} editorFlags={props.editorFlags}
                webSocketServerMethods={props.webSocketServerMethods} isPlayer={true} />
            <Grid item xs={0.5} />
            <Editor editorData={props.opponentEditorData} editorFlags={props.editorFlags}
                webSocketServerMethods={props.webSocketServerMethods} isPlayer={false} />
            <Grid item xs={0.75} />
        </Grid>
    );
}

export default EditorsSection;