import TopSectionData from '../../../../../../interfaces/TopSectionData';
import WebSocketServerMethods from '../../../../../../interfaces/WebSocketServerMethods';

export default interface EditorTopSectionProps {
    topSectionData: TopSectionData,
    webSocketServerMethods: WebSocketServerMethods,
    loaded: boolean,
    isPlayer: boolean
}
