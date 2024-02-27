import { MouseEventHandler } from 'react';
import TopSectionData from '../../../../../common/interfaces/codingEditor/TopSectionData';
import WebSocketServerMethods from '../../../../../common/interfaces/codingEditor/WebSocketServerMethods';

export default interface EditorTopSectionProps {
    topSectionData: TopSectionData,
    webSocketServerMethods: WebSocketServerMethods,
    loaded: boolean,
    isPlayer: boolean
}
