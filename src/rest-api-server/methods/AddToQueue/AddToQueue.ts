import MatchmakingUser from "../../interfaces/MatchmakingUser.ts";
import QuestionInformation from "../../interfaces/QuestionInformation.ts";
import registerPairEndPoint from "./methods/RegisterPairEndPoint/RegisterPairEndPoint.ts";
import selectQuestions from "./methods/SelectQuestions.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const addToQueue = async (prod: boolean, client: Client, sids: { [name: string]: string },
    sidsProgress: { [name: string]: number }, sidsQuestions: { [name: string]: QuestionInformation[] },
    matches: { [name: string]: string }, queue: MatchmakingUser[], matchmakingUser: MatchmakingUser,
    range: number, context: any) => {
    queue.push(matchmakingUser);
    for (let i = 0; i < queue.length; ++i) {
        if (queue[i].sid != matchmakingUser.sid
            && Math.abs(matchmakingUser.eloRating - queue[i].eloRating) <= range) {
            matches[queue[i].sid] = matchmakingUser.sid;
            matches[matchmakingUser.sid] = queue[i].sid;
            sidsProgress[queue[i].sid] = 0;
            sidsProgress[matchmakingUser.sid] = 0;
            //can call goServer/registerPair here
            console.log("attempting register pair " + matchmakingUser.sid + ", " + queue[i].sid);
            const response = await fetch(registerPairEndPoint(prod), {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Id1: matchmakingUser.sid,
                    Id2: queue[i].sid,
                }),
            }); //TODO - Check response 
            console.log(response.status);
            //can probably eliminate this, main purpose of this api
            //method is to match users and register them with the go server
            context.response.body = {
                username: sids[matchmakingUser.sid],
                eloRating: matchmakingUser.eloRating,
                opponentUsername: sids[queue[i].sid],
                opponentEloRating: queue[i].eloRating,
            };
            queue.splice(i, 1);
            queue.pop();
            selectQuestions(client, sidsQuestions, matches, matchmakingUser);
            return true;
        }
    }
    return false;
}

export default addToQueue;
