import { Application, Router, RouterContext, Status } from "https://deno.land/x/oak/mod.ts";
import QuestionInformation from "./interfaces/QuestionInformation.ts";
import MatchmakingQueues from "./interfaces/MatchmakingQueues.ts";
import loadTestCases from "./methods/LoadTestCases/LoadTestCases.ts";
import register from "./routes/post/Register/Register.ts";
import login from "./routes/post/Login/Login.ts";
import user from "./routes/get/User/User.ts";
import opponent from "./routes/get/Opponent/Opponent.ts";
import question from "./routes/get/Question/Question.ts";
import matchmaking from "./routes/get/Matchmaking/Matchmaking.ts";
import logout from "./routes/get/Logout/Logout.ts";
import run from "./routes/post/Run/Run.ts";
import wildcardEndpoint from "./routes/get/WildcardEndpoint/WildcardEndpoint.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { parse } from "https://deno.land/std@0.143.0/flags/mod.ts";

const client = new Client({
    user: "licode",
    database: "licode",
    password: "edocil",
    hostname: "localhost",
    port: 5432,
    tls: {
        enabled: false,
        enforce: false,
    },
});
const env = Deno.env.toObject();
const args = parse(Deno.args, { alias: {"prod": "p"}, boolean: ["prod"] })
const prod : boolean = args.prod
const app = new Application();
const router = new Router();
let sids: { [name: string]: string } = {};
let sidsProgress: { [name: string]: number } = {};
let sidsQuestions: { [name: string]: QuestionInformation[] } = {};
let matchmakingQueues: MatchmakingQueues = {
    matchmakingQueue25: [],
    matchmakingQueue50: [],
    matchmakingQueue100: [],
    matchmakingQueue200: [],
    matchmakingQueue500: []
};
let matches: { [name: string]: string } = {};

loadTestCases(client);

const port: number = +env.LICODE_PORT || 3000;
app.addEventListener("error", (evt) => {
    console.log(evt.error);
});

router
    .post("/api/register", async (context: RouterContext<any>) => { await register(context, client, sids); })
    .post("/api/login", async (context: RouterContext<any>) => { await login(context, client, sids); })
    .get("/api/user", async (context) => { await user(context, client, sids); })
    .get("/api/opponent", async (context) => { await opponent(context, client, sids, matches); })
    .get("/api/question", async (context) => { await question(context, client, sidsQuestions, sidsProgress); })
    .get("/api/matchmaking", async (context) => { await matchmaking(context, prod, client, sids, sidsProgress, sidsQuestions, matches, matchmakingQueues); })
    .get("/api/logout", async (context) => { await logout(context, sids); })
    .post("/api/run", async (context: RouterContext<any>) => { await run(context, client, sids, sidsQuestions, sidsProgress, matches); })
    .get("/api/wildcardEndpoint", async (context) => { wildcardEndpoint(context, prod); });
app.use(router.routes());
app.use(router.allowedMethods());
app.use(async (context) => {
    if (!context.request.url.pathname.endsWith('.js')
        && !context.request.url.pathname.endsWith('.png')
        && !context.request.url.pathname.endsWith('.ico')
        && !context.request.url.pathname.endsWith('.txt')
        && !context.request.url.pathname.endsWith('.css'))	{
        context.request.url.pathname = '/';
    }
    await context.send({
        root: `${Deno.cwd()}/react-app/build`,
        index: "index.html",
    });
});
console.log("Running on port", port);
await app.listen({ port });
