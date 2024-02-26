import { Grid, IconButton, Typography } from '@mui/material';
import PlayerInformation from './playerInformation/PlayerInformation';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SpeedIcon from '@mui/icons-material/Speed';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import EditorTextField from "./editorTexField/EditorTextField";
import TestCaseIndicator from "./testCaseIndicator/TestCaseIndicator";
import EditorProps from './EditorProps';

const processOpponentField = (field: string): string => {
    var r = 0
    var randomChars : string = "#!$*?~"
    var ret = field.replace(/[^\s]/g, (substr: string, ..._args: any[]) : string => {
        const oldR = r
        r = (r + 1) % randomChars.length
        return randomChars[oldR]
    })  

    return ret
}  

function Editor(props: EditorProps) {
    return (
        <Grid container direction="column" item xs={5}>
            <Grid container item mt={2}>
                <Grid item xs={0.5} />
                <Grid container direction="column" item xs={11}>
                    <Grid item>
                        <PlayerInformation loaded={props.loaded} username={props.username}
                            eloRating={props.eloRating} />
                    </Grid>
                    <Grid container sx={{ visibility: props.isPlayer ? 'visible' : 'hidden' }}>
                        <Grid item xs="auto">
                            <IconButton color="button" onClick={props.skipTestCase}>
                                <CheckCircleIcon sx={{ fontSize: 32 }} />
                            </IconButton>
                        </Grid>
                        <Grid item xs="auto">
                            <IconButton color="button" onClick={props.slowOpponent}>
                                <SpeedIcon sx={{ fontSize: 32 }} />
                            </IconButton>
                        </Grid>
                        <Grid item xs="auto">
                            <IconButton color="button" onClick={props.peekOpponent}>
                                <RemoveRedEyeIcon sx={{ fontSize: 32 }} />
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography variant="aboveEditor" sx={{ m: 0, p: 0 }}>
                            Question {props.questionNum}/3
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={0.5} />
            </Grid>
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
            <Grid item container mt={1} alignItems="center">
                <Grid item container xs={2} direction="column" alignItems="center">
                    <Grid item >
                        <Typography variant="inputOutput" sx={{ m: 0, p: 0 }}>
                            Input
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={10}>
                    <EditorTextField id="filled-multiline-static" multiline fullWidth rows={2} variant="filled"
                        value={props.isPlayer || props.peeking ? props.input : processOpponentField(props.input)}
                        onChange={props.handleInputChange}
                        InputProps={{ readOnly: !props.isPlayer }} />
                </Grid>
            </Grid>
            <Grid item container mt={1} alignItems="center">
                <Grid item container xs={2} direction="column" alignItems="center">
                    <Grid item >
                        <Typography variant="inputOutput" sx={{ m: 0, p: 0 }}>
                            Standard Output
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={10}>
                    <EditorTextField id="filled-multiline-static" multiline fullWidth rows={2} variant="filled"
                        value={props.isPlayer || props.peeking ? props.standardOutput : processOpponentField(props.standardOutput)}
                        InputProps={{ readOnly: !props.isPlayer }} />
                    <span style={{color: "red"}}>{props.standardError}</span>
                </Grid>
            </Grid>
            <Grid item container mt={1} alignItems="center">
                <Grid item container xs={2} direction="column" alignItems="center">
                    <Grid item >
                        <Typography variant="inputOutput" sx={{ m: 0, p: 0 }}>
                            Output
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={10}>
                    <EditorTextField id="filled-multiline-static" multiline fullWidth rows={2} variant="filled"
                        value={props.isPlayer || props.peeking ? props.output : processOpponentField(props.output)}
                        InputProps={{ readOnly: true }} />
                </Grid>
            </Grid>
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
                        <Grid item xs={1}>
                            <TestCaseIndicator passed={props.testCasesPassed[0]} />
                        </Grid>
                        <Grid item xs={1}>
                            <TestCaseIndicator passed={props.testCasesPassed[1]} />
                        </Grid>
                        <Grid item xs={1}>
                            <TestCaseIndicator passed={props.testCasesPassed[2]} />
                        </Grid>
                        <Grid item xs={1}>
                            <TestCaseIndicator passed={props.testCasesPassed[3]} />
                        </Grid>
                        <Grid item xs={1}>
                            <TestCaseIndicator passed={props.testCasesPassed[4]} />
                        </Grid>
                        <Grid item xs={1}>
                            <TestCaseIndicator passed={props.testCasesPassed[5]} />
                        </Grid>
                        <Grid item xs={1}>
                            <TestCaseIndicator passed={props.testCasesPassed[6]} />
                        </Grid>
                        <Grid item xs={1}>
                            <TestCaseIndicator passed={props.testCasesPassed[7]} />
                        </Grid>
                        <Grid item xs={1}>
                            <TestCaseIndicator passed={props.testCasesPassed[8]} />
                        </Grid>
                        <Grid item xs={1}>
                            <TestCaseIndicator passed={props.testCasesPassed[9]} />
                        </Grid>
                        <Grid item xs={1}>
                            <TestCaseIndicator passed={props.testCasesPassed[10]} />
                        </Grid>
                        <Grid item xs={0.5} />
                    </Grid>
                </Grid>
                <Grid item xs={0.5} />
            </Grid>
        </Grid>
    );
}

export default Editor;