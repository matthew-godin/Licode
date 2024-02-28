import MatchmakingData from "../../../common/interfaces/matchmaking/MatchmakingData";
import QuestionData from "../../../common/interfaces/matchmaking/QuestionData";
import ReconnectingWebSocket from 'reconnecting-websocket';
import * as RWS from 'reconnecting-websocket';
import { SERVERMSGTYPE, BEHAVIOUR, INFORMATION, FIELDUPDATE, CLIENTMSGTYPE } from "../../../../enums/WebSocketServerEnums";
import ServerMsg from "../../../common/interfaces/WebSocketServer/ServerMsg";
import BehaviourData from "../../../common/interfaces/WebSocketServer/BehaviourData";
import InformationData from "../../../common/interfaces/WebSocketServer/InformationData";
import FieldUpdateData from "../../../common/interfaces/WebSocketServer/FieldUpdateData";
import CodingEditor from "../CodingEditor";

const initializeCodingEditor = async (that: CodingEditor) => {
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
    that.setState({
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

    if(that.state.socket == null) return;
    that.state.socket.addEventListener('open', (event: RWS.Event) => {
        console.log(`Successfully Connected with sid: ${that.state.sid}`);
        that.state.socket?.send(`${CLIENTMSGTYPE.ConnectionRequest} ${that.state.sid}`);
    });
    
    that.state.socket.addEventListener('close', (event: RWS.CloseEvent) => {
        console.log("Client Closed!")
        that.state.socket?.send(`${CLIENTMSGTYPE.ConnectionRequest} ${that.state.sid}`);
        //sock.send("Client Closed!")
        //probably need some reconnect scheme
        //may need to make a helper for all writing to
        //server to detect disconnects
    });
    
    that.state.socket.addEventListener('message', (event: RWS.Event) => {
        console.log(event)
        const myMsg = (event as any)?.data
        const msgObj: ServerMsg = JSON.parse(myMsg)
        console.log(msgObj)
        switch(msgObj.Type) {
            case SERVERMSGTYPE.Behaviour:
                const behaviourData: BehaviourData = msgObj.Data
                switch(behaviourData.Type) {
                    case BEHAVIOUR.TypeSlow:
                        that.setState({canTypeAt: null, typingSlow: behaviourData.Start})
                        break;
                    case BEHAVIOUR.Peek:
                        //stop peaking
                        //behaviourData.Start should always be false, the server
                        //only asks us to stop peeking
                        that.setState({
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
                            that.sendInititalUpdates()
                        } else {
                            console.log("Registration Failed! " + infoData.Info)
                        }
                        break;
                    case INFORMATION.Error:
                        console.log("Error: " + infoData.Info)
                        break;
                    case INFORMATION.Loss:
                        console.log("YOU LOSE!!!")
                        that.setState({
                            lost: true
                        })
                        break;
                    case INFORMATION.QuestionNum:
                        that.setState({
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
                        that.setState({
                            rightEditorCode: fieldData.NewValue
                        })
                        break;
                    case FIELDUPDATE.Input:
                        that.setState({
                            rightInput: fieldData.NewValue
                        })
                        break;
                    case FIELDUPDATE.Output:
                        that.setState({
                            rightOutput: fieldData.NewValue
                        })
                        break;
                    case FIELDUPDATE.StandardOutput:
                        that.setState({
                            rightStandardOutput: fieldData.NewValue
                        })
                        break;
                    case FIELDUPDATE.StandardError:
                        that.setState({
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
                        that.setState({
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

    that.state.socket.addEventListener('error', (event: RWS.Event) => {
        console.log("Socket Error: ")
        console.log(event);
    });

    //attach a keydown listener to the left code editor
    document.getElementsByClassName("ace_editor")[0].addEventListener("keydown", that.handleInputKeyDown)
}

export default initializeCodingEditor;