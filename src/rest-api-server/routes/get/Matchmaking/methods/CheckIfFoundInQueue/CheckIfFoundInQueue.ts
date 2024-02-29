import MatchmakingUser from "../../../../../interfaces/MatchmakingUser.ts";
import delay from "./methods/Delay.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const checkIfFoundInQueue = async (client: Client, sids: { [name: string]: string },
    matches: { [name: string]: string }, delayTime: number, matchmakingUser: MatchmakingUser,
    username: string, context: any) => {
    await delay(delayTime);
    if (matchmakingUser.sid in matches) {
        let opponentUsername = sids[matches[matchmakingUser.sid]];
        await client.connect();
        const usernameResult = await client.queryArray("select elo_rating from users where username='"
            + username + "'");
        let opponentEloRating = usernameResult.rows[0][0] as number;
        await client.end();
        context.response.body = {
            username: sids[matchmakingUser.sid],
            eloRating: matchmakingUser.eloRating,
            opponentUsername: opponentUsername,
            opponentEloRating: opponentEloRating,
        };
        return true;
    }
    return false;
};

export default checkIfFoundInQueue;
