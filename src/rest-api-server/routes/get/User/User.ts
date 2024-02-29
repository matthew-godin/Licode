import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const user = async (context, client: Client, sids: { [name: string]: string }) => {
    try {
        let sid = await context.cookies.get('sid');
        if (sid && typeof sid === 'string') {
            let username = sids[sid as string];
            if (username) {
                await client.connect();
                const usernameResult = await client.queryArray("select email, username, num_wins, num_losses, elo_rating from users where username='"
                    + username + "'");
                context.response.body = {
                    user: {
                        email: usernameResult.rows[0][0] as string,
                        username: usernameResult.rows[0][1] as string,
                        numWins: usernameResult.rows[0][2] as number,
                        numLosses: usernameResult.rows[0][3] as number,
                        eloRating: usernameResult.rows[0][4] as number
                    }
                };
                await client.end();
                context.response.type = "json";
                return;
            }
        }
        context.response.body = {};
        context.response.type = "json";
    } catch (err) {
        console.log(err);
    }
};

export default user;
