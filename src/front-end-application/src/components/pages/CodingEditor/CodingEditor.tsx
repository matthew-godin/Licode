import * as React from "react";
import { Box, Grid } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import editorTheme from '../../themes/EditorTheme';
import { Navigate } from "react-router-dom";
import QuestionData from "../../common/interfaces/matchmaking/QuestionData";
import TestCasesPassed from "../../common/interfaces/matchmaking/TestCasesPassed";
import CodeSubmission from "../../common/interfaces/CodeSubmission";
import { MAX_TYPING_SPEED } from "../../../constants/WebSocketServerConstants";
import QuestionStatement from "./sections/questionStatement/QuestionStatement";
import EditorsSection from "./sections/editorsSection/EditorsSection";
import CodingEditorProps from "./CodingEditorProps";
import CodingEditorState, { defaultState } from "./CodingEditorState";
import EditorData from "./interfaces/EditorData";
import TopSectionData from "./interfaces/TopSectionData";
import EditorSectionData from "./interfaces/EditorSectionData";
import InputOutputSectionData from "./interfaces/InputOutputSectionData";
import WebSocketServerMethods from "./interfaces/WebSocketServerMethods";
import EditorFlags from "./interfaces/EditorFlags";
import RunButton from "./sections/runButton/RunButton";
import initializeCodingEditor from "./methods/InitializeCodingEditor";
import { FIELDUPDATE, CLIENTMSGTYPE } from "../../../enums/WebSocketServerEnums";

class CodingEditor extends React.Component<CodingEditorProps, CodingEditorState> {
    constructor(props: CodingEditorProps) {
        super(props);
        this.handleRun = this.handleRun.bind(this);
        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.peekOpponent = this.peekOpponent.bind(this);
        this.slowOpponent = this.slowOpponent.bind(this);
        this.skipTestCase = this.skipTestCase.bind(this);
        this.opponentEditorChange = this.opponentEditorChange.bind(this);
        this.sendCodeUpdate = this.sendCodeUpdate.bind(this);
        this.playerWon = this.playerWon.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
        this.sendInititalUpdates = this.sendInititalUpdates.bind(this);
        this.state = defaultState;
    }

    async componentDidMount() {
        initializeCodingEditor(this);
    }

    async handleRun () {
        this.setState({
            ringClass: "lds-dual-ring show-ring"
        });
        let codeSubmission: CodeSubmission = {
            value: '',
            input: '',
        }
        codeSubmission.value = this.state.code;
        codeSubmission.input = this.state.input;
        let res: TestCasesPassed = await fetch('/api/run', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(codeSubmission),
        }).then(response => response.json());

        if (res.testCasesPassed) {
            if (this.state.skipping) {
                for (let i = 0; i < res.testCasesPassed.length; ++i) {
                    if (!res.testCasesPassed[i]) {
                        res.testCasesPassed[i] = true;
                        break;
                    }
                }
            }
            this.sendFieldUpdate(FIELDUPDATE.TestCases, this.stringifyBoolArray(res.testCasesPassed));
            this.setState({ testCasesPassed: res.testCasesPassed });
        }
        if (res.standardOutput || res.standardOutput === '') {
            this.sendFieldUpdate(FIELDUPDATE.StandardOutput, res.standardOutput);
            this.setState({ standardOutput: res.standardOutput });
        }
        if (res.standardError || res.standardError === '') {
            this.sendFieldUpdate(FIELDUPDATE.StandardError, res.standardError);
            this.setState({ standardError: res.standardError });
        }
        if (res.output || res.output === '') {
            this.sendFieldUpdate(FIELDUPDATE.Output, res.output);
            this.setState({ output: res.output });
        }
        let hasWon = true;
        for (let i = 0; i < res.testCasesPassed.length; ++i) {
            if (!res.testCasesPassed[i]) {
                hasWon = false;
                break;
            }
        }
        console.log("AAA");
        console.log(hasWon);
        console.log(this.state.questionNum);
        console.log("BBB");
        if (hasWon && this.state.questionNum < 4) {
            console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
            const questionData: QuestionData = await fetch('/api/question').then(response => response.json());
            let initialQuestionLines = questionData.question.split(';');
            for (let i = 0; i < 3 - initialQuestionLines.length; ++i) {
                initialQuestionLines.push('');
            }
            let inputLines = questionData.default_custom_input.split(';');
            let initialInput = '';
            if (inputLines.length > 0) {
                initialInput += inputLines[0];
            }
            for (let i = 1; i < inputLines.length; ++i) {
                initialInput += '\n' + inputLines[i];
            }
            this.setState({ questionLines: initialQuestionLines, code: questionData.function_signature + '\n    ', input: initialInput,
                standardOutput: '', standardError: '', output: '', skipping: false });
            this.sendFieldUpdate(FIELDUPDATE.Code, this.state.code);
            this.sendFieldUpdate(FIELDUPDATE.Input, this.state.input);
            this.sendFieldUpdate(FIELDUPDATE.StandardOutput, this.state.standardOutput);
            this.sendFieldUpdate(FIELDUPDATE.StandardError, this.state.standardError);
            this.sendFieldUpdate(FIELDUPDATE.Output, this.state.output);
        }
        this.setState({
            ringClass: "lds-dual-ring hide-ring"
        });
    };

    peekOpponent () {
        console.log("Sending Peek");
        this.state.socket?.send(CLIENTMSGTYPE.StartPeeking.toString());
        this.setState({
            peeking: true
        });
    }
    slowOpponent () {
        console.log("Sending Slow");
        this.state.socket?.send(CLIENTMSGTYPE.SlowOpponent.toString());
    }
    skipTestCase () {
        console.log("Sending Skip");
        this.setState({
            skipping: true
        });
        let newTestCasesPassed = Array.from(this.state.testCasesPassed);
        for (let i = 0; i < this.state.testCasesPassed.length; ++i) {
            if (!this.state.testCasesPassed[i]) {
                newTestCasesPassed[i] = true;
                this.setState({
                    testCasesPassed: newTestCasesPassed
                });
                break;
            }
        }
        this.state.socket?.send(CLIENTMSGTYPE.Skip.toString());
        this.sendFieldUpdate(FIELDUPDATE.TestCases, this.stringifyBoolArray(newTestCasesPassed));
    }

    sendFieldUpdate(type: number, newValue: string) {
        this.state.socket?.send(CLIENTMSGTYPE.GiveFieldUpdate.toString() + " " + type.toString() + " " + newValue)
    }

    sendCodeUpdate(code: string) {
        this.sendFieldUpdate(FIELDUPDATE.Code, code)
    }

    handleInputKeyDown (e: any) {
        //if we're typing slow and we can't type yet
        //      cancel the event
        //if we're typing slow, but can type
        //      record the time when we can type again in canTypeAt
        if(this.state.typingSlow && this.state.canTypeAt != null && (new Date() < this.state.canTypeAt)) {
            e.preventDefault()
        } else if(this.state.typingSlow) {
            //1000 / MAX_TYPING_SPEED = milliseconds per character typed
            this.setState({canTypeAt: new Date(new Date().getTime() + 1000 / MAX_TYPING_SPEED)})
        }
    }

    handleCodeChange (value: string, e: React.ChangeEvent<HTMLInputElement>) {
        this.sendFieldUpdate(FIELDUPDATE.Code, value);
        this.setState({
            code: value
        });
    }

    opponentEditorChange (e: React.ChangeEvent<HTMLInputElement>) {
        console.log("Opponent Editor Change")
    }

    handleInputChange (e: React.ChangeEvent<HTMLInputElement>) {
        this.sendFieldUpdate(FIELDUPDATE.Input, e.currentTarget.value);
        this.setState({ input: e.currentTarget.value });
    }

    playerWon() : boolean {
        const testsPassed: number = this.state.testCasesPassed.reduce((numPassed: number, passed: boolean) => {
            if (passed) {
                return numPassed + 1;
            } else {
                return numPassed;
            }
        }, 0);
        return testsPassed == 11;
    }

    stringifyBoolArray(boolArr: boolean[]) : string {
        return boolArr.map((v: boolean) => v ? "1" : "0").join(" ")
    }
    
    sendInititalUpdates() {
        //code
        this.sendCodeUpdate(this.state.code)
        //input
        this.sendFieldUpdate(FIELDUPDATE.Input, this.state.input)
        //test cases
        this.sendFieldUpdate(FIELDUPDATE.TestCases, this.stringifyBoolArray(this.state.testCasesPassed))

        console.log("sent initial updates")

        //(standard) output???
    }

    render() {
        // const rightEditorCode: string = "!@#$%^&*()!@#$%^&*()\n    !@#$%^&*(\n        !@#$%^&*",
        //     rightInput = "*#&#^#%@&@*\n*";
        console.log("rendering w peeking = " + (this.state.peeking ? "true" : "false"))
        if(this.playerWon()){
            if (this.state.questionNum == 3) {
                this.state.socket?.send(CLIENTMSGTYPE.Win.toString())
                return <Navigate to="/victory"/>
            } else {
                this.state.socket?.send(CLIENTMSGTYPE.GiveQuestionNum.toString() + " " + (this.state.questionNum + 1).toString())
                this.setState({ testCasesPassed: [false, false, false, false, false, false, false, false],
                    questionNum: this.state.questionNum + 1 }, () => this.sendInititalUpdates());
            }
        } else if (this.state.lost) {
            return <Navigate to="/defeat"/>
        }
        let userTopSectionData: TopSectionData = {
            username: this.state.username,
            eloRating: this.state.eloRating,
            questionNum: this.state.questionNum
        };
        let userEditorSectionData: EditorSectionData = {
            code: this.state.code,
            handleCodeChange: this.handleCodeChange
        };
        let userInputData: InputOutputSectionData = {
            content: this.state.input,
            handleChange: this.handleInputChange
        };
        let userStandardOutputData: InputOutputSectionData = {
            content: this.state.standardOutput,
            errorContent: this.state.standardError,
            handleChange: () => {}
        };
        let userOutputData: InputOutputSectionData = {
            content: this.state.output,
            handleChange: () => {}
        };
        let userEditorData: EditorData = {
            topSectionData: userTopSectionData,
            editorSectionData: userEditorSectionData,
            inputData: userInputData,
            standardOutputData: userStandardOutputData,
            outputData: userOutputData,
            testCasesPassed: this.state.testCasesPassed
        }
        let opponentTopSectionData: TopSectionData = {
            username: this.state.opponentUsername,
            eloRating: this.state.opponentEloRating,
            questionNum: this.state.opponentQuestionNum
        };
        let opponentEditorSectionData: EditorSectionData = {
            code: this.state.rightEditorCode,
            handleCodeChange: this.handleCodeChange
        };
        let opponentInputData: InputOutputSectionData = {
            content: this.state.rightInput,
            handleChange: this.handleInputChange
        };
        let opponentStandardOutputData: InputOutputSectionData = {
            content: this.state.rightStandardOutput,
            errorContent: this.state.rightStandardError,
            handleChange: () => {}
        };
        let opponentOutputData: InputOutputSectionData = {
            content: this.state.rightOutput,
            handleChange: () => {}
        };
        let opponentEditorData: EditorData = {
            topSectionData: opponentTopSectionData,
            editorSectionData: opponentEditorSectionData,
            inputData: opponentInputData,
            standardOutputData: opponentStandardOutputData,
            outputData: opponentOutputData,
            testCasesPassed: this.state.rightTestCasesPassed
        }
        let webSocketServerMethods: WebSocketServerMethods = {
            skipTestCase: this.skipTestCase,
            slowOpponent: this.slowOpponent,
            peekOpponent: this.peekOpponent
        };
        let editorFlags: EditorFlags = {
            loaded: this.state.loaded,
            peeking: this.state.peeking
        };
        return (
            <ThemeProvider theme={editorTheme}>
                <Box sx={{ display: 'flex', height: '100%', bgcolor: 'primary.main', m: 0, p: 0 }}>
                    <Grid container direction="column">
                        <QuestionStatement questionLines={this.state.questionLines} />
                        <EditorsSection userEditorData={userEditorData} opponentEditorData={opponentEditorData}
                            webSocketServerMethods={webSocketServerMethods} editorFlags={editorFlags} />
                        <RunButton handleRun={this.handleRun} ringClass={this.state.ringClass} />
                    </Grid>
                </Box>
            </ThemeProvider>
        );
    }
}

export default CodingEditor;