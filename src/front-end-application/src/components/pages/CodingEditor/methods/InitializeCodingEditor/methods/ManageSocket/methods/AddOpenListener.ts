import * as RWS from 'reconnecting-websocket';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { CLIENTMSGTYPE } from "../../../../../../../../enums/WebSocketServerEnums";

const addOpenListener = (socket: ReconnectingWebSocket, sid: string) => {
    socket.addEventListener('open', (event: RWS.Event) => {
        console.log(`Successfully Connected with sid: ${sid}`);
        socket?.send(`${CLIENTMSGTYPE.ConnectionRequest} ${sid}`);
    });
}

export default addOpenListener;