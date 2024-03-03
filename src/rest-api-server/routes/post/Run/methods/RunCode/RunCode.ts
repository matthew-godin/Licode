import { RouterContext, Status } from "https://deno.land/x/oak/mod.ts";
import CodeSubmission from "../../../../../interfaces/CodeSubmission.ts";
import QuestionInformation from "../../../../../interfaces/QuestionInformation.ts";
import TestCasesPassed from "../../../../../interfaces/TestCasesPassed.ts";
import executeCode from "./methods/ExecuteCode.ts";
import processResults from "./methods/processResults.ts";

const runCode = async (context: RouterContext<any>, code: Partial<CodeSubmission> | undefined,
    sidsQuestions: { [name: string]: QuestionInformation[] }, sidsProgress: { [name: string]: number }, sid: string): Promise<TestCasesPassed> => {
    context.assert(typeof code?.value === "string", Status.BadRequest);
    context.assert(typeof code?.input === "string", Status.BadRequest);
    context.response.status = Status.OK;
    let questionInformation: QuestionInformation = sidsQuestions[sid][sidsProgress[sid]];
    await executeCode(code, questionInformation);
    return await processResults(questionInformation);
};

export default runCode;
