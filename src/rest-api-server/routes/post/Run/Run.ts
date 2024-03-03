import { RouterContext, Status } from "https://deno.land/x/oak/mod.ts";
import CodeSubmission from "../../../interfaces/CodeSubmission.ts";
import QuestionInformation from "../../../interfaces/QuestionInformation.ts";
import TestCasesPassed from "../../../interfaces/TestCasesPassed.ts";
import runCode from "./methods/RunCode/RunCode.ts";
import win from "./methods/Win/Win.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const run = async (context: RouterContext<any>, client: Client, sids: { [name: string]: string },
    sidsQuestions: { [name: string]: QuestionInformation[] }, sidsProgress: { [name: string]: number },
    matches: { [name: string]: string }) => {
    try {
        let sid = await context.cookies.get('sid');
        if (sid && typeof sid === 'string') {
            if (!context.request.hasBody) {
                context.throw(Status.BadRequest, "Bad Request");
            }
            const body = context.request.body;
            let code: Partial<CodeSubmission> | undefined;
            if (body.type() === "json") {
                code = await body.json();
            }
            if (code) {
                let testCasesPassed: TestCasesPassed = await runCode(context, code, sidsQuestions, sidsProgress, sid);
                if (!testCasesPassed.testCasesPassed.some(element => !element) && ++sidsProgress[sid] === 3) {
                    await win(client, sids, sidsQuestions, sidsProgress, matches, sid);
                }
                context.response.body = testCasesPassed;
            }
        }
    } catch (err) {
        console.log(err);
    }
};

export default run;
