import { ChangeEventHandler, useState, useEffect } from 'react';
import { Grid, IconButton, Typography } from '@mui/material';
import PlayerInformation from './playerInformation/PlayerInformation';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SpeedIcon from '@mui/icons-material/Speed';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { MouseEventHandler } from 'react';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import EditorTextField from "./editorTexField/EditorTextField";
import TestCaseIndicator from "./testCaseIndicator/TestCaseIndicator";

export interface EditorsSectionProps {
    eloRating: number,
    opponentUsername: string,
    opponentEloRating: number,
    loaded: boolean,
    skipTestCase: MouseEventHandler<HTMLButtonElement>,
    slowOpponent: MouseEventHandler<HTMLButtonElement>,
    peekOpponent: MouseEventHandler<HTMLButtonElement>,
    questionNum: number,
    code: string,
    handleCodeChange: (value: string, event?: any) => void,
    input: string,
    handleInputChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
    standardOutput: string,
    standardError: string,
    output: string,
    testCasesPassed: boolean[],
    opponentQuestionNum: number,
    peeking: boolean,
    rightEditorCode: string,
    rightInput: string,
    rightOutput: string,
    rightStandardOutput: string,
    rightStandardError: string,
    rightTestCasesPassed: boolean[],
}

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

function EditorsSection(props: EditorsSectionProps) {
    return (
        <Grid container item mt={0.5}>
            <Grid item xs={0.75} />
            <Grid container direction="column" item xs={5}>
                <Grid container item mt={2}>
                    <Grid item xs={0.5} />
                    <Grid container direction="column" item xs={11}>
                        <Grid item>
                            <PlayerInformation loaded={props.loaded} username="You" eloRating={props.eloRating} />
                        </Grid>
                        <Grid container>
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
                        mode="python"
                        theme="github"
                        name="filled-multiline-static"
                        fontSize={14}
                        value={props.code}
                        onChange={props.handleCodeChange}
                        setOptions={{
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: true,
                            enableSnippets: true
                        }}
                        editorProps={{ $blockScrolling: true}}
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
                            value={props.input} onChange={props.handleInputChange} />
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
                            InputProps={{ readOnly: true }} value={props.standardOutput} />
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
                            InputProps={{ readOnly: true }} value={props.output} />
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
            <Grid item xs={0.5} />
            <Grid container direction="column" item xs={5}>
                <Grid container item mt={2}>
                    <Grid item xs={0.5} />
                    <Grid container direction="column" item xs={11}>
                        <Grid item>
                            <PlayerInformation loaded={props.loaded} username={props.opponentUsername}
                                eloRating={props.opponentEloRating} />
                        </Grid>
                        <Grid container sx={{ visibility: 'hidden' }}>
                            <Grid item xs="auto">
                                <IconButton color="button">
                                    <CheckCircleIcon sx={{ fontSize: 32 }} />
                                </IconButton>
                            </Grid>
                            <Grid item xs="auto">
                                <IconButton color="button">
                                    <SpeedIcon sx={{ fontSize: 32 }} />
                                </IconButton>
                            </Grid>
                            <Grid item xs="auto">
                                <IconButton color="button">
                                    <RemoveRedEyeIcon sx={{ fontSize: 32 }} />
                                </IconButton>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Typography variant="aboveEditor" sx={{ m: 0, p: 0 }}>
                                Question {props.opponentQuestionNum}/3
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={0.5} />
                </Grid>
                <Grid item mt={1}>
                    <AceEditor
                        mode="text"
                        theme="github"
                        name="filled-multiline-static"
                        fontSize={14}
                        readOnly={true}
                        highlightActiveLine={false}
                        value = {props.peeking ? props.rightEditorCode : processOpponentField(props.rightEditorCode)}
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
                            value={props.peeking ? props.rightInput : processOpponentField(props.rightInput)}
                            InputProps={{ readOnly: true }} />
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
                            value={props.peeking ? props.rightStandardOutput : processOpponentField(props.rightStandardOutput)}
                            InputProps={{ readOnly: true }} />
                        <span style={{color: "red"}}>{props.rightStandardError}</span>
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
                            value={props.peeking ? props.rightOutput : processOpponentField(props.rightOutput)}
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
                                <TestCaseIndicator passed={props.rightTestCasesPassed[0]} />
                            </Grid>
                            <Grid item xs={1}>
                                <TestCaseIndicator passed={props.rightTestCasesPassed[1]} />
                            </Grid>
                            <Grid item xs={1}>
                                <TestCaseIndicator passed={props.rightTestCasesPassed[2]} />
                            </Grid>
                            <Grid item xs={1}>
                                <TestCaseIndicator passed={props.rightTestCasesPassed[3]} />
                            </Grid>
                            <Grid item xs={1}>
                                <TestCaseIndicator passed={props.rightTestCasesPassed[4]} />
                            </Grid>
                            <Grid item xs={1}>
                                <TestCaseIndicator passed={props.rightTestCasesPassed[5]} />
                            </Grid>
                            <Grid item xs={1}>
                                <TestCaseIndicator passed={props.rightTestCasesPassed[6]} />
                            </Grid>
                            <Grid item xs={1}>
                                <TestCaseIndicator passed={props.rightTestCasesPassed[7]} />
                            </Grid>
                            <Grid item xs={1}>
                                <TestCaseIndicator passed={props.rightTestCasesPassed[8]} />
                            </Grid>
                            <Grid item xs={1}>
                                <TestCaseIndicator passed={props.rightTestCasesPassed[9]} />
                            </Grid>
                            <Grid item xs={1}>
                                <TestCaseIndicator passed={props.rightTestCasesPassed[10]} />
                            </Grid>
                            <Grid item xs={0.5} />
                        </Grid>
                    </Grid>
                    <Grid item xs={0.5} />
                </Grid>
            </Grid>
            <Grid item xs={0.75} />
        </Grid>
    );
}

export default EditorsSection;