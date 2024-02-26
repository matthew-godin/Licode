import * as React from "react";
import { Box, Grid } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import editorTheme from '../../themes/EditorTheme';
import { Navigate } from "react-router-dom";
import MatchmakingData from '../../common/interfaces/matchmaking/MatchmakingData';
import QuestionData from "../../common/interfaces/matchmaking/QuestionData";
import TestCasesPassed from "../../common/interfaces/matchmaking/TestCasesPassed";
import ReconnectingWebSocket from 'reconnecting-websocket';
import * as RWS from 'reconnecting-websocket';
import { SERVERMSGTYPE, BEHAVIOUR, INFORMATION, FIELDUPDATE, CLIENTMSGTYPE } from "../../../enums/WebSocketServerEnums";
import ServerMsg from "../../common/interfaces/webSocketServer/ServerMsg";
import BehaviourData from "../../common/interfaces/webSocketServer/BehaviourData";
import InformationData from "../../common/interfaces/webSocketServer/InformationData";
import FieldUpdateData from "../../common/interfaces/webSocketServer/FieldUpdateData";
import CodeSubmission from "../../common/interfaces/CodeSubmission";
import { MAX_TYPING_SPEED } from "../../../constants/WebSocketServerConstants";
import ColorButton from "./colorButton/ColorButton";
import QuestionStatement from "./questionStatement/QuestionStatement";
import EditorsSection from "./editorsSection/EditorsSection";
import CodingEditorProps from "./CodingEditorProps";
import CodingEditorState from "./CodingEditorState";

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
        this.sendInititalUpdates = this.sendInititalUpdates.bind(this)
        this.state = {
            username: '',
            eloRating: 5000,
            opponentUsername: '',
            opponentEloRating: 5000,
            loaded: false,
            testCasesPassed: [false, false, false, false, false, false, false, false, false, false, false],
            rightEditorCode: '',
            socket: null,
            sid: '',
            typingSlow: false,
            canTypeAt: null,
            sendingCodeUpdates: false,
            firstMsg: true,
            peeking: false,
            lost: false,
            skipping: false,
            code: '',
            input: '',
            standardOutput: '',
            standardError: '',
            output: '',
            rightInput: '',
            rightStandardOutput: '',
            rightStandardError: '',
            rightOutput: '',
            rightTestCasesPassed: [false, false, false, false, false, false, false, false, false, false, false],
            questionNum: 1,
            opponentQuestionNum: 1,
            questionLines: ['', '', ''],
            ringClass: 'ds-dual-ring hide-ring',
        }
    }

    async componentDidMount() {
        console.log("Attempting Connection...");
        const data: MatchmakingData = await fetch('/api/opponent').then(response => response.json());
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
        const wsEndpoint : string = await fetch("/api/wildcardEndpoint").then(response => response.json()).then(jsn => jsn.endpoint);
        this.setState({
            username: data.you.username,
            eloRating: data.you.eloRating,
            opponentUsername: data.opponent.username,
            opponentEloRating: data.opponent.eloRating,
            sid: data.you.sid,
            socket: new ReconnectingWebSocket(wsEndpoint),
            loaded: true,
            questionLines: initialQuestionLines,
            code: questionData.function_signature + '\n    ',
            input: initialInput,
        });

        if(this.state.socket == null) return;
        this.state.socket.addEventListener('open', (event: RWS.Event) => {
            console.log(`Successfully Connected with sid: ${this.state.sid}`);
            this.state.socket?.send(`${CLIENTMSGTYPE.ConnectionRequest} ${this.state.sid}`);
        });
        
        this.state.socket.addEventListener('close', (event: RWS.CloseEvent) => {
            console.log("Client Closed!")
            this.state.socket?.send(`${CLIENTMSGTYPE.ConnectionRequest} ${this.state.sid}`);
            //sock.send("Client Closed!")
            //probably need some reconnect scheme
            //may need to make a helper for all writing to
            //server to detect disconnects
        });
        
        this.state.socket.addEventListener('message', (event: RWS.Event) => {
            console.log(event)
            const myMsg = (event as any)?.data
            const msgObj: ServerMsg = JSON.parse(myMsg)
            console.log(msgObj)
            switch(msgObj.Type) {
                case SERVERMSGTYPE.Behaviour:
                    const behaviourData: BehaviourData = msgObj.Data
                    switch(behaviourData.Type) {
                        case BEHAVIOUR.TypeSlow:
                            this.setState({canTypeAt: null, typingSlow: behaviourData.Start})
                            break;
                        case BEHAVIOUR.Peek:
                            //stop peaking
                            //behaviourData.Start should always be false, the server
                            //only asks us to stop peeking
                            this.setState({
                                peeking: false
                            })
                            break;
                        default:
                            //error?
                            break;
                    }
                    break;
                case SERVERMSGTYPE.Information:
                    const infoData: InformationData = msgObj.Data
                    switch(infoData.Type) {
                        case INFORMATION.Connection:
                            if(infoData.Info === "") {
                                console.log("Registered!")
                                this.sendInititalUpdates()
                            } else {
                                console.log("Registration Failed! " + infoData.Info)
                            }
                            break;
                        case INFORMATION.Error:
                            console.log("Error: " + infoData.Info)
                            break;
                        case INFORMATION.Loss:
                            console.log("YOU LOSE!!!")
                            this.setState({
                                lost: true
                            })
                            break;
                        case INFORMATION.QuestionNum:
                            this.setState({
                                opponentQuestionNum: parseInt(infoData.Info)
                            })
                            break;
                        default:
                            //error?
                            break;
                    }
                    break;
                case SERVERMSGTYPE.FieldUpdate:
                    const fieldData: FieldUpdateData = msgObj.Data
                    switch(fieldData.Type) {
                        case FIELDUPDATE.Code:
                            //receiving a code update
                            console.log("code update")
                            this.setState({
                                rightEditorCode: fieldData.NewValue
                            })
                            break;
                        case FIELDUPDATE.Input:
                            this.setState({
                                rightInput: fieldData.NewValue
                            })
                            break;
                        case FIELDUPDATE.Output:
                            this.setState({
                                rightOutput: fieldData.NewValue
                            })
                            break;
                        case FIELDUPDATE.StandardOutput:
                            this.setState({
                                rightStandardOutput: fieldData.NewValue
                            })
                            break;
                        case FIELDUPDATE.StandardError:
                            this.setState({
                                rightStandardError: fieldData.NewValue
                            })
                            break;
                        case FIELDUPDATE.TestCases:
                            let newTestCases: boolean[] = fieldData.NewValue.split(" ").map((str: string) => str === "1")
                            // if(newTestCases.reduce((count: number, passed: boolean, idx: number) => {
                            //     return passed ? (count + 1) : count
                            // }, 0) === 11){
                            //     newTestCases = [false, false, false, false, false, false, false, false, false, false, false]
                            // }
                            this.setState({
                                rightTestCasesPassed: newTestCases
                            })
                            break;
                        default:
                            //error?
                            break;                                                                                            
                    }
                    break;
                default:
                    //error?
                    break
            }
        });

        this.state.socket.addEventListener('error', (event: RWS.Event) => {
            console.log("Socket Error: ")
            console.log(event);
        });

        //attach a keydown listener to the left code editor
        document.getElementsByClassName("ace_editor")[0].addEventListener("keydown", this.handleInputKeyDown)
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
        return (
            <ThemeProvider theme={editorTheme}>
                <Box sx={{ display: 'flex', height: '100%', bgcolor: 'primary.main', m: 0, p: 0 }}>
                    <Grid container direction="column">
                        <QuestionStatement questionLines={this.state.questionLines} />
                        <EditorsSection eloRating={this.state.eloRating} opponentUsername={this.state.opponentUsername}
                            opponentEloRating={this.state.opponentEloRating} skipTestCase={this.skipTestCase} slowOpponent={this.slowOpponent}
                            loaded={this.state.loaded} peekOpponent={this.peekOpponent} questionNum={this.state.questionNum} code={this.state.code}
                            handleCodeChange={this.handleCodeChange} input={this.state.input} handleInputChange={this.handleInputChange}
                            standardOutput={this.state.standardOutput} standardError={this.state.standardError} output={this.state.output}
                            testCasesPassed={this.state.testCasesPassed} opponentQuestionNum={this.state.opponentQuestionNum}
                            peeking={this.state.peeking} rightEditorCode={this.state.rightEditorCode} rightInput={this.state.rightInput}
                            rightOutput={this.state.rightOutput} rightStandardOutput={this.state.rightStandardOutput}
                            rightStandardError={this.state.rightStandardError} rightTestCasesPassed={this.state.rightTestCasesPassed} />
                        <Grid container item mt={1.5}>
                            <Grid item xs={0.5} />
                            <Grid item xs={1.5}>
                                <ColorButton variant="contained" sx={{ minWidth: 125, fontSize: 24 }} onClick={this.handleRun}>
                                    Run
                                </ColorButton>
                                <div className={this.state.ringClass}></div>
                            </Grid>
                            <Grid item xs={10} />
                        </Grid>
                    </Grid>
                </Box>
            </ThemeProvider>
        );
    }
}

export default CodingEditor;