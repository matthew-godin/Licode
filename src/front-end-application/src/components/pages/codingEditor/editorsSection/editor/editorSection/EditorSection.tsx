import { Grid } from '@mui/material';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import { processOpponentField } from '../../../../../common/utils/Processing';
import EditorSectionProps from './EditorSectionProps';

function EditorSection(props: EditorSectionProps) {
    return (
        <Grid item mt={1}>
            <AceEditor
                mode={props.isPlayer ? "python" : "text"}
                theme="github"
                name="filled-multiline-static"
                fontSize={14}
                readOnly={!props.isPlayer}
                highlightActiveLine={props.isPlayer}
                value = {props.isPlayer || props.peeking ? props.code : processOpponentField(props.code)}
                onChange={props.handleCodeChange}
                setOptions={props.isPlayer ? {
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true
                } : {}}
                editorProps={{ $blockScrolling: true }}
            />
        </Grid>
    );
}

export default EditorSection;