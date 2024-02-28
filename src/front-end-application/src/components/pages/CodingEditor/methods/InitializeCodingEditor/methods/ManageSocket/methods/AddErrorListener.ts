import * as RWS from 'reconnecting-websocket';
import ReconnectingWebSocket from 'reconnecting-websocket';

const addErrorListener = (socket: ReconnectingWebSocket) => {
    socket.addEventListener('error', (event: RWS.Event) => {
        console.log("Socket Error: ")
        console.log(event);
    });
}

export default addErrorListener;