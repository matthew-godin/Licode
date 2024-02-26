import PlayerData from "./PlayerData";

export default interface MatchmakingData {
    you: PlayerData,
    opponent: PlayerData,
}
