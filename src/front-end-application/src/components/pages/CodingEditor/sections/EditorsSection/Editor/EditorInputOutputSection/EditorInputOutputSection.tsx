import { Grid, Typography } from '@mui/material';
import EditorTextField from "./EditorTextField/EditorTextField";
import { processOpponentField } from '../../../../../../common/utils/Processing';
import EditorInputOutputSectionProps from './EditorInputOutputSectionProps';

function EditorInputOutputSection(props: EditorInputOutputSectionProps) {
    return (
        <Grid item container mt={1} alignItems="center">
            <Grid item container xs={2} direction="column" alignItems="center">
                <Grid item >
                    <Typography variant="inputOutput" sx={{ m: 0, p: 0 }}>
                        {props.name}
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={10}>
                <EditorTextField id="filled-multiline-static" multiline fullWidth rows={2} variant="filled"
                    value={props.isPlayer || props.peeking ? props.inputOutputSectionData.content
                        : processOpponentField(props.inputOutputSectionData.content)}
                    onChange={props.inputOutputSectionData.handleChange}
                    InputProps={{ readOnly: props.readOnly }} />
                {props.inputOutputSectionData.errorContent
                    && <span style={{color: "red"}}>{props.inputOutputSectionData.errorContent}</span>}
            </Grid>
        </Grid>
    );
}

export default EditorInputOutputSection;