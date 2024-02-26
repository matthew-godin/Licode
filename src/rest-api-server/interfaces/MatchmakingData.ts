import PlayerData from "./PlayerData.ts";

export default interface MatchmakingData {
    you: PlayerData,
    opponent: PlayerData,
}
