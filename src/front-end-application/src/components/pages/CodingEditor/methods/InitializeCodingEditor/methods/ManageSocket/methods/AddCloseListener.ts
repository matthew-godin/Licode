import * as RWS from 'reconnecting-websocket';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { CLIENTMSGTYPE } from "../../../../../../../../enums/WebSocketServerEnums";

const addCloseListener = (socket: ReconnectingWebSocket, sid: string) => {
    socket.addEventListener('close', (event: RWS.CloseEvent) => {
        console.log("Client Closed!")
        socket?.send(`${CLIENTMSGTYPE.ConnectionRequest} ${sid}`);
    });
}

export default addCloseListener;