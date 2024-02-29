import MatchmakingUser from "../../../../../interfaces/MatchmakingUser.ts";

const removeFromQueue = (queue: MatchmakingUser[], sid: string) => {
    for (let i = 0; i < queue.length; ++i) {
        if (queue[i].sid === sid) {
            queue.splice(i, 1);
        }
    }
}

export default removeFromQueue;
