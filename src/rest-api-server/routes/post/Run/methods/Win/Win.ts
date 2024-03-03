import QuestionInformation from "../../../../../interfaces/QuestionInformation.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const win = async (client: Client, sids: { [name: string]: string }, sidsQuestions: { [name: string]: QuestionInformation[] },
    sidsProgress: { [name: string]: number }, matches: { [name: string]: string }, sid: string) => {
    let opponentSid = matches[sid];
    delete matches[sid];
    delete matches[opponentSid];
    delete sidsProgress[sid];
    delete sidsProgress[opponentSid];
    delete sidsQuestions[sid];
    delete sidsQuestions[opponentSid];
    let numWins: number,
        numGames: number,
        eloRating: number,
        has2400RatingHistory: boolean = false,
        opponentNumLosses: number,
        opponentNumGames: number,
        opponentEloRating: number,
        opponentHas2400RatingHistory: boolean = false;
    let username = sids[sid as string];
    if (username) {
        await client.connect();
        const usernameResult = await client.queryArray("select num_wins, num_losses, elo_rating, has_2400_rating_history from users where username='"
            + username + "'");
        numWins = usernameResult.rows[0][0] as number;
        numGames = numWins + (usernameResult.rows[0][1] as number);
        eloRating = usernameResult.rows[0][2] as number;
        has2400RatingHistory = usernameResult.rows[0][3] as boolean;
        await client.end();
        let opponentUsername = sids[opponentSid as string];
        if (opponentUsername) {
            await client.connect();
            const usernameResult = await client.queryArray(
                "select num_wins, num_losses, elo_rating, has_2400_rating_history from users where username='"
                + opponentUsername + "'");
            opponentNumLosses = usernameResult.rows[0][1] as number;
            opponentNumGames = (usernameResult.rows[0][0] as number) + opponentNumLosses;
            opponentEloRating = usernameResult.rows[0][2] as number;
            opponentHas2400RatingHistory = usernameResult.rows[0][3] as boolean;
            await client.end();
            ++numWins;
            let eloRatingVariation: number = 1 - 1.0 / (1 + Math.pow(10, (opponentEloRating - eloRating) / 400.0));
            eloRating += Math.floor((numGames < 30 ? (eloRating < 2300 ? 40 : 20) : (has2400RatingHistory ? 10 : 20)) * eloRatingVariation);
            ++opponentNumLosses;
            opponentEloRating -= Math.ceil((opponentNumGames < 30 ? (opponentEloRating < 2300 ? 40 : 20) : (opponentHas2400RatingHistory ? 10 : 20))
                * eloRatingVariation);
            if (username) {
                await client.connect();
                await client.queryArray("update users set num_wins = " + numWins.toString()
                    + ", elo_rating = " + eloRating.toString() + ", has_2400_rating_history = "
                    + (has2400RatingHistory || eloRating >= 2400).toString() + " where username='"
                    + username + "'");
                await client.end();
            }
            if (opponentUsername) {
                await client.connect();
                await client.queryArray("update users set num_losses = " + opponentNumLosses.toString()
                    + ", elo_rating = " + opponentEloRating.toString() + ", has_2400_rating_history = "
                    + (opponentHas2400RatingHistory || opponentEloRating >= 2400).toString() + " where username='"
                    + opponentUsername + "'");
                await client.end();
            }
        }
    }
};

export default win;
