import { SERVERMSGTYPE, BEHAVIOUR, INFORMATION, FIELDUPDATE } from "../../../../../../../../enums/WebSocketServerEnums";
import InformationData from "../../../../../../../common/interfaces/WebSocketServer/InformationData";
import FieldUpdateData from "../../../../../../../common/interfaces/WebSocketServer/FieldUpdateData";
import ServerMsg from "../../../../../../../common/interfaces/WebSocketServer/ServerMsg";
import BehaviourData from "../../../../../../../common/interfaces/WebSocketServer/BehaviourData";
import * as RWS from 'reconnecting-websocket';
import ReconnectingWebSocket from 'reconnecting-websocket';
import CodingEditor from "../../../../../CodingEditor";

const addMessageListener = (socket: ReconnectingWebSocket, that: CodingEditor) => {
    socket.addEventListener('message', (event: RWS.Event) => {
        console.log(event)
        const myMsg = (event as any)?.data
        const msgObj: ServerMsg = JSON.parse(myMsg)
        console.log(msgObj)
        switch(msgObj.Type) {
            case SERVERMSGTYPE.Behaviour:
                const behaviourData: BehaviourData = msgObj.Data
                switch(behaviourData.Type) {
                    case BEHAVIOUR.TypeSlow:
                        that.setState({canTypeAt: null, typingSlow: behaviourData.Start});
                        break;
                    case BEHAVIOUR.Peek:
                        that.setState({ peeking: false });
                        break;
                    default:
                        break;
                }
                break;
            case SERVERMSGTYPE.Information:
                const infoData: InformationData = msgObj.Data
                switch(infoData.Type) {
                    case INFORMATION.Connection:
                        if(infoData.Info === "") {
                            console.log("Registered!");
                            that.sendInititalUpdates();
                        } else {
                            console.log("Registration Failed! " + infoData.Info);
                        }
                        break;
                    case INFORMATION.Error:
                        console.log("Error: " + infoData.Info);
                        break;
                    case INFORMATION.Loss:
                        console.log("YOU LOSE!!!");
                        that.setState({ lost: true });
                        break;
                    case INFORMATION.QuestionNum:
                        that.setState({ opponentQuestionNum: parseInt(infoData.Info) });
                        break;
                    default:
                        break;
                }
                break;
            case SERVERMSGTYPE.FieldUpdate:
                const fieldData: FieldUpdateData = msgObj.Data
                switch(fieldData.Type) {
                    case FIELDUPDATE.Code:
                        console.log("code update")
                        that.setState({ rightEditorCode: fieldData.NewValue });
                        break;
                    case FIELDUPDATE.Input:
                        that.setState({ rightInput: fieldData.NewValue });
                        break;
                    case FIELDUPDATE.Output:
                        that.setState({ rightOutput: fieldData.NewValue });
                        break;
                    case FIELDUPDATE.StandardOutput:
                        that.setState({ rightStandardOutput: fieldData.NewValue });
                        break;
                    case FIELDUPDATE.StandardError:
                        that.setState({ rightStandardError: fieldData.NewValue });
                        break;
                    case FIELDUPDATE.TestCases:
                        let newTestCases: boolean[] = fieldData.NewValue.split(" ").map((str: string) => str === "1")
                        that.setState({ rightTestCasesPassed: newTestCases });
                        break;
                    default:
                        break;                                                                                            
                }
                break;
            default:
                break
        }
    });
}

export default addMessageListener;