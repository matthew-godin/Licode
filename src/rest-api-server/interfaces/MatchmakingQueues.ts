import MatchmakingUser from "./MatchmakingUser.ts";

export default interface MatchmakingQueues {
    matchmakingQueue25: MatchmakingUser[];
    matchmakingQueue50: MatchmakingUser[];
    matchmakingQueue100: MatchmakingUser[];
    matchmakingQueue200: MatchmakingUser[];
    matchmakingQueue500: MatchmakingUser[];
};