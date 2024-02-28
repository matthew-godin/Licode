import * as React from "react";
import { Box, Grid } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import editorTheme from '../../themes/EditorTheme';
import { Navigate } from "react-router-dom";
import QuestionStatement from "./sections/QuestionStatement/QuestionStatement";
import EditorsSection from "./sections/EditorsSection/EditorsSection";
import CodingEditorProps from "./CodingEditorProps";
import CodingEditorState, { defaultState } from "./CodingEditorState";
import RunButton from "./sections/RunButton/RunButton";
import initializeCodingEditor from "./methods/InitializeCodingEditor/InitializeCodingEditor";
import { CLIENTMSGTYPE } from "../../../enums/WebSocketServerEnums";
import run from "./methods/Run/Run";
import { peek, skip, slow } from "./methods/WebSocketServer/WebSocketServer";
import { codeChange, inputChange, inputKeyDown } from "./methods/InputAndCodeChanges/InputAndCodeChanges";
import inititalUpdates from "./methods/InitialUpdates/InitialUpdates";
import { won } from "./methods/Predicates/Predicates";
import createCodingEditorData from "./methods/CreateCodingEditorData/CreateCodingEditorData";

class CodingEditor extends React.Component<CodingEditorProps, CodingEditorState> {
    constructor(props: CodingEditorProps) {
        super(props);
        this.handleRun = this.handleRun.bind(this);
        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.peekOpponent = this.peekOpponent.bind(this);
        this.slowOpponent = this.slowOpponent.bind(this);
        this.skipTestCase = this.skipTestCase.bind(this);
        this.opponentEditorChange = this.opponentEditorChange.bind(this);
        this.playerWon = this.playerWon.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
        this.sendInititalUpdates = this.sendInititalUpdates.bind(this);
        this.state = defaultState;
    }

    async componentDidMount() { initializeCodingEditor(this); }

    async handleRun () { run(this); };

    peekOpponent () { peek(this); }

    slowOpponent () { slow(this); }

    skipTestCase () { skip(this); }

    handleInputKeyDown (e: any) { inputKeyDown(e, this); }

    handleCodeChange (value: string, e: React.ChangeEvent<HTMLInputElement>) { codeChange(value, e, this); }

    opponentEditorChange (e: React.ChangeEvent<HTMLInputElement>) { console.log("Opponent Editor Change"); }

    handleInputChange (e: React.ChangeEvent<HTMLInputElement>) { inputChange(e, this); }

    playerWon(): boolean { return won(this); }

    stringifyBoolArray(boolArr: boolean[]) : string { return boolArr.map((v: boolean) => v ? "1" : "0").join(" "); }
    
    sendInititalUpdates() { inititalUpdates(this); }

    render() {
        console.log("rendering w peeking = " + (this.state.peeking ? "true" : "false"))
        if(this.playerWon()){
            if (this.state.questionNum == 3) {
                this.state.socket?.send(CLIENTMSGTYPE.Win.toString());
                return (
                    <Navigate to="/victory"/>
                );
            } else {
                this.state.socket?.send(CLIENTMSGTYPE.GiveQuestionNum.toString() + " " + (this.state.questionNum + 1).toString());
                this.setState({ testCasesPassed: [false, false, false, false, false, false, false, false],
                    questionNum: this.state.questionNum + 1 }, () => this.sendInititalUpdates());
            }
        } else if (this.state.lost) {
            return (
                <Navigate to="/defeat"/>
            );
        }
        let codingEditorData = createCodingEditorData(this);
        return (
            <ThemeProvider theme={editorTheme}>
                <Box sx={{ display: 'flex', height: '100%', bgcolor: 'primary.main', m: 0, p: 0 }}>
                    <Grid container direction="column">
                        <QuestionStatement questionLines={this.state.questionLines} />
                        <EditorsSection codingEditorData={codingEditorData} />
                        <RunButton handleRun={this.handleRun} ringClass={this.state.ringClass} />
                    </Grid>
                </Box>
            </ThemeProvider>
        );
    }
}

export default CodingEditor;
