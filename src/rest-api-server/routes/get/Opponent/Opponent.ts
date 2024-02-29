import MatchmakingData from "../../../interfaces/MatchmakingData.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const opponent = async (context, client: Client, sids: { [name: string]: string }, matches: { [name: string]: string }) => {
    try {
        let sid = await context.cookies.get('sid');
        if (sid && typeof sid === 'string') {
            let username = sids[sid as string];
            let opponentUsername = sids[matches[sid as string] as string];
            if (username && opponentUsername) {
                await client.connect();
                const usernameResult = await client.queryArray("select elo_rating from users where username='" + username + "'");
                const opponentUsernameResult = await client.queryArray("select elo_rating from users where username='" + opponentUsername + "'");
                const responseBody : MatchmakingData = {
                    you: {
                        username: username,
                        eloRating: usernameResult.rows[0][0] as number,
                        sid: sid,
                    },
                    opponent: {
                        username: opponentUsername,
                        eloRating: opponentUsernameResult.rows[0][0] as number,
                        sid: ''
                    },
                };
                context.response.body = responseBody;
                await client.end();
            }
        }
    } catch (err) {
        console.log(err);
    }
};

export default opponent;
