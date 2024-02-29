import addToQueue from "./methods/AddToQueue/AddToQueue.ts";
import checkIfFoundInQueue from "./methods/CheckIfFoundInQueue/CheckIfFoundInQueue.ts";
import removeFromQueue from "./methods/RemoveFromQueue/RemoveFromQueue.ts";
import MatchmakingUser from "../../../interfaces/MatchmakingUser.ts";
import QuestionInformation from "../../../interfaces/QuestionInformation.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import MatchmakingQueues from "../../../interfaces/MatchmakingQueues.ts";

const matchmaking = async (context, prod: boolean, client: Client, sids: { [name: string]: string }, sidsProgress: { [name: string]: number },
    sidsQuestions: { [name: string]: QuestionInformation[] }, matches: { [name: string]: string },
    matchmakingQueues: MatchmakingQueues) => {
    try {
        let sid = await context.cookies.get('sid');
        if (sid && typeof sid === 'string') {
            let username = sids[sid as string];
            if (username) {
                await client.connect();
                const usernameResult = await client.queryArray("select elo_rating from users where username='"
                    + username + "'");
                let matchmakingUser: MatchmakingUser = {
                    eloRating: usernameResult.rows[0][0] as number,
                    sid: sid,
                }
                await client.end();
                let queues: MatchmakingUser[][] = [
                    matchmakingQueues.matchmakingQueue25,
                    matchmakingQueues.matchmakingQueue50,
                    matchmakingQueues.matchmakingQueue100,
                    matchmakingQueues.matchmakingQueue200
                ];
                let ranges: number[] = [25, 50, 100, 200];
                let delayTimesNums: number[] = [1, 5, 10, 60];
                let foundMatch: boolean = false;
                for (let i = 0; i < queues.length; ++i) {
                    if (foundMatch = await addToQueue(prod, client, sids, sidsProgress, sidsQuestions, matches,
                        queues[i], matchmakingUser, ranges[i], context)) {
                        break;
                    } else {
                        for (let j = 0; j < delayTimesNums[i]; ++j) {
                            if (foundMatch = await checkIfFoundInQueue(client, sids, matches, 1000, matchmakingUser, username, context)) {
                                break;
                            }
                        }
                        if (foundMatch) {
                            break;
                        }
                        removeFromQueue(queues[i], sid);
                    }
                }
                if (!foundMatch && !addToQueue(prod, client, sids, sidsProgress, sidsQuestions, matches,
                    matchmakingQueues.matchmakingQueue500, matchmakingUser, 500, context)) {
                    while (!(await checkIfFoundInQueue(client, sids, matches, 1000, matchmakingUser, username, context))) { }
                }
            }
        }
    } catch (err) {
        console.log(err);
    }
};

export default matchmaking;
