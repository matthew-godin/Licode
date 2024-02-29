import { Application, Router, RouterContext, Status } from "https://deno.land/x/oak/mod.ts";
import MatchmakingData from "./interfaces/MatchmakingData.ts";
import QuestionData from "./interfaces/QuestionData.ts";
import TestCasesPassed from "./interfaces/TestCasesPassed.ts";
import HelloWorld from "./interfaces/HelloWorld.ts";
import AuthUser from "./interfaces/AuthUser.ts";
import MatchmakingUser from "./interfaces/MatchmakingUser.ts";
import CodeSubmission from "./interfaces/CodeSubmission.ts";
import TestResult from "./interfaces/TestResult.ts";
import QuestionInformation from "./interfaces/QuestionInformation.ts";
import { validateEmail, validatePassword, validateUsername } from "./Validation.ts";
import loadTestCases from "./methods/LoadTestCases/LoadTestCases.ts";
import addToQueue from "./methods/AddToQueue/AddToQueue.ts";
import checkIfFoundInQueue from "./methods/CheckIfFoundInQueue/CheckIfFoundInQueue.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { crypto } from "https://deno.land/std@0.132.0/crypto/mod.ts";
import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/async.ts";
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
let helloWorldVar: HelloWorld = { text: 'Hello World' };
let sids: { [name: string]: string } = {};
let sidsProgress: { [name: string]: number } = {};
let sidsQuestions: { [name: string]: QuestionInformation[] } = {};
let matchmakingQueue25: MatchmakingUser[] = [];
let matchmakingQueue50: MatchmakingUser[] = [];
let matchmakingQueue100: MatchmakingUser[] = [];
let matchmakingQueue200: MatchmakingUser[] = [];
let matchmakingQueue500: MatchmakingUser[] = [];
let matches: { [name: string]: string } = {};

loadTestCases(client);

const port: number = +env.LICODE_PORT || 3000;
app.addEventListener("error", (evt) => {
    console.log(evt.error);
});

router
    .get("/api/hello-world", (context) => {
        try {
            context.response.body = helloWorldVar;
        } catch (err) {
            console.log(err);
        }
    })
    .post("/api/post-hello-world", async (context: RouterContext<any>) => {
        if (!context.request.hasBody) {
            context.throw(Status.BadRequest, "Bad Request");
        }
        const body = context.request.body;
        let helloWorld: Partial<HelloWorld> | undefined;
        if (body.type() === "json") {
            helloWorld = await body.json();
        } else if (body.type() === "form") {
            helloWorld = {};
            for (const [key, value] of await body.form()) {
                helloWorld[key as keyof HelloWorld] = value;
            }
        } else if (body.type() === "form-data") {
            const formData = await body.formData();
            helloWorld = formData.fields;
        }
        if (helloWorld) {
            context.assert(typeof helloWorld.text === "string", Status.BadRequest);
            helloWorldVar = helloWorld as HelloWorld;
            context.response.status = Status.OK;
            context.response.body = helloWorld;
            context.response.type = "json";
            return;
        }
        context.throw(Status.BadRequest, "Bad Request");
    })
    .post("/api/register", async (context: RouterContext<any>) => {
        let sid = await context.cookies.get('sid');
        if (!sid) {
            sid = await nanoid(40);
            context.cookies.set('sid', sid);
        }
        try {
            if (!context.request.hasBody) {
                context.throw(Status.BadRequest, "Bad Request");
            }
            const body = context.request.body;
            let user: Partial<AuthUser> | undefined;
            if (body.type() === "json") {
                user = await body.json();
            }
            if (user) {
                context.assert(
                    typeof user?.email?.value === "string"
                    && typeof user?.username?.value === "string"
                    && typeof user?.password?.value === "string", Status.BadRequest);
                context.response.status = Status.OK;

                 //redo validation, can't trust front-end
                var password : string = user?.password?.value ?? "";
                var email : string = user?.email?.value ?? "";
                var username : string = user?.username?.value ?? "";
                var validationMessage = validateUsername(username, true);
                if (validationMessage !== "") {
                    context.response.body = { text: validationMessage };
                    return;
                }
                validationMessage = validateEmail(email, true);
                if (validationMessage !== "") {
                    context.response.body = { text: validationMessage };
                    return;
                }
                validationMessage = validatePassword(password, true);
                if (validationMessage !== "") {
                    context.response.body = { text: validationMessage };
                    return;
                }


                await client.connect();
                const usernameResult = await client.queryArray("select username from users where username='"
                    + user?.username?.value + "'");
                if (usernameResult.rows.length < 1) {
                    let emailLowerCase: string | undefined = user?.email?.value?.toLowerCase();
                    const emailResult = await client.queryArray("select email from users where email='"
                        + emailLowerCase + "'");
                    if (emailResult.rows.length < 1) {
                        let saltHexString = '';
                        for (let i = 0; i < 32; ++i) {
                            saltHexString += Math.floor(Math.random() * Math.pow(2, 32)).toString(16);
                        }
                        let saltHexStringLength = saltHexString.length;
                        for (let i = 0; i < 256 - saltHexStringLength; ++i) {
                            saltHexString = "0" + saltHexString;
                        }
                        let textEncoder = new TextEncoder();
                        let hashedPasswordUint8Array = new Uint8Array(await crypto.subtle.digest('SHA3-512',
                            textEncoder.encode(user?.password?.value + saltHexString)));
                        let hashedPasswordHexString = '';
                        for (let i = 0; i < hashedPasswordUint8Array.length; ++i) {
                            hashedPasswordHexString += (hashedPasswordUint8Array[i] < 16 ? "0" : "")
                                + hashedPasswordUint8Array[i].toString(16);
                        }
                        let hashedPasswordHexStringLength = hashedPasswordHexString.length;
                        for (let i = 0; i < 128 - hashedPasswordHexStringLength; ++i) {
                            hashedPasswordHexString = "0" + hashedPasswordHexString;
                        }
                        await client.queryArray(
                            "insert into public.users(email, username, hashed_password, salt, num_wins, num_losses, created_at, updated_at, elo_rating, has_2400_rating_history)"
                            + " values ('" + emailLowerCase + "', '" + user?.username?.value + "', '"
                            + "\\x" + hashedPasswordHexString + "', '" + "\\x" + saltHexString + "', '0', '0', now(), now(), '1000', 'false')");
                        let sid = await nanoid(40);
                        sids[sid] = user.username.value;
                        await context.cookies.set('sid', sid);
                        context.response.body = user;
                    } else {
                        context.response.body = { text: 'Given Email Already Exists' };
                    }
                } else {
                    context.response.body = { text: 'Given Username Already Exists' };
                }
                await client.end();
                context.response.type = "json";
                return;
            }
            context.throw(Status.BadRequest, "Bad Request");
        } catch (err) {
            console.log(err);
        }
    })
    .post("/api/login", async (context: RouterContext<any>) => {
        try {
            if (!context.request.hasBody) {
                context.throw(Status.BadRequest, "Bad Request");
            }
            const body = context.request.body;
            let user: Partial<AuthUser> | undefined;
            if (body.type() === "json") {
                user = await body.json();
            }
            if (user) {
                context.assert(
                    typeof user?.email?.value === "string"
                    && typeof user?.password?.value === "string", Status.BadRequest);
                let emailLowerCase: string | undefined = user?.email?.value?.toLowerCase();
                context.response.status = Status.OK;
                await client.connect();
                const usernameResult = await client.queryArray("select email, username, hashed_password, salt from users where username='"
                    + emailLowerCase + "'");
                if (usernameResult.rows.length < 1) {
                    const emailResult = await client.queryArray("select email, username, hashed_password, salt from users where email='"
                        + emailLowerCase + "'");
                    if (emailResult.rows.length < 1) {
                        context.response.body = { text: 'Given Email or Username Does Not Exist' };
                    } else {
                        let saltHexString = '';
                        for (let i = 0; i < (emailResult.rows[0][3] as Uint8Array).length; ++i) {
                            saltHexString += ((emailResult.rows[0][3] as Uint8Array)[i] < 16 ? "0" : "")
                                + (emailResult.rows[0][3] as Uint8Array)[i].toString(16);
                        }
                        let textEncoder = new TextEncoder();
                        let hashedPasswordUint8Array = new Uint8Array(await crypto.subtle.digest('SHA3-512',
                            textEncoder.encode(user?.password?.value + saltHexString)));
                        let hashedPasswordHexString = '';
                        for (let i = 0; i < hashedPasswordUint8Array.length; ++i) {
                            hashedPasswordHexString += (hashedPasswordUint8Array[i] < 16 ? "0" : "")
                                + hashedPasswordUint8Array[i].toString(16);
                        }
                        let serverHashedPasswordHexString = '';
                        for (let i = 0; i < (emailResult.rows[0][2] as Uint8Array).length; ++i) {
                            serverHashedPasswordHexString += ((emailResult.rows[0][2] as Uint8Array)[i] < 16 ? "0" : "")
                                + (emailResult.rows[0][2] as Uint8Array)[i].toString(16);
                        }
                        if (hashedPasswordHexString === serverHashedPasswordHexString) {
                            let foundUser = {
                                email: { value: emailResult.rows[0][0] as string },
                                username: { value: emailResult.rows[0][1] as string },
                            }
                            let sid = await nanoid(40);
                            sids[sid] = foundUser.username.value;
                            await context.cookies.set('sid', sid);
                            context.response.body = foundUser;
                        } else {
                            context.response.body = { text: 'Wrong Password' };
                        }
                    }
                } else {
                    let saltHexString = '';
                    for (let i = 0; i < (usernameResult.rows[0][3] as Uint8Array).length; ++i) {
                        saltHexString += ((usernameResult.rows[0][3] as Uint8Array)[i] < 16 ? "0" : "")
                            + (usernameResult.rows[0][3] as Uint8Array)[i].toString(16);
                    }
                    let textEncoder = new TextEncoder();
                    let hashedPasswordUint8Array = new Uint8Array(await crypto.subtle.digest('SHA3-512',
                        textEncoder.encode(user?.password?.value + saltHexString)));
                    let hashedPasswordHexString = '';
                    for (let i = 0; i < hashedPasswordUint8Array.length; ++i) {
                        hashedPasswordHexString += (hashedPasswordUint8Array[i] < 16 ? "0" : "")
                            + hashedPasswordUint8Array[i].toString(16);
                    }
                    let serverHashedPasswordHexString = '';
                    for (let i = 0; i < (usernameResult.rows[0][2] as Uint8Array).length; ++i) {
                        serverHashedPasswordHexString += ((usernameResult.rows[0][2] as Uint8Array)[i] < 16 ? "0" : "")
                            + (usernameResult.rows[0][2] as Uint8Array)[i].toString(16);
                    }
                    if (hashedPasswordHexString === serverHashedPasswordHexString) {
                        let foundUser = {
                            email: { value: usernameResult.rows[0][0] as string },
                            username: { value: usernameResult.rows[0][1] as string }
                        }
                        let sid = await nanoid(40);
                        sids[sid] = foundUser.username.value;
                        await context.cookies.set('sid', sid);
                        context.response.body = foundUser;
                    } else {
                        context.response.body = { text: 'Wrong Password' };
                    }
                }
                await client.end();
                context.response.type = "json";
                return;
            }
            context.throw(Status.BadRequest, "Bad Request");
        } catch (err) {
            console.log(err);
        }
    })
    .get("/api/user", async (context) => {
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
    })
    .get("/api/opponent", async (context) => {
        try {
            let sid = await context.cookies.get('sid');
            if (sid && typeof sid === 'string') {
                let username = sids[sid as string];
                let opponentUsername = sids[matches[sid as string] as string];
                if (username && opponentUsername) {
                    await client.connect();
                    const usernameResult = await client.queryArray("select elo_rating from users where username='"
                        + username + "'");
                    const opponentUsernameResult = await client.queryArray("select elo_rating from users where username='"
                        + opponentUsername + "'");
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
    })
    .get("/api/question", async (context) => {
        try {
            let sid = await context.cookies.get('sid');
            if (sid && typeof sid === 'string') {
                await client.connect();
                const questionResult = await client.queryArray("select question, function_signature, default_custom_input from questions where id = "
                    + sidsQuestions[sid][sidsProgress[sid]].questionId.toString());
                console.log("UUU");
                console.log(sidsQuestions[sid][sidsProgress[sid]].questionId.toString());
                console.log("III");
                const responseBody : QuestionData = {
                    question: questionResult.rows[0][0] as string,
                    function_signature: questionResult.rows[0][1] as string,
                    default_custom_input: questionResult.rows[0][2] as string,
                };
                context.response.body = responseBody;
                await client.end();
            }
        } catch (err) {
            console.log(err);
        }
    })
    .get("/api/matchmaking", async (context) => {
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
                    let queues: MatchmakingUser[][] = [matchmakingQueue25, matchmakingQueue50, matchmakingQueue100, matchmakingQueue200];
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
                        matchmakingQueue500, matchmakingUser, 500, context)) {
                        while (!(await checkIfFoundInQueue(client, sids, matches, 1000, matchmakingUser, username, context))) { }
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }
    })
    .get("/api/logout", async (context) => {
        try {
            let sid = await context.cookies.get('sid');
            if (sid && typeof sid === 'string') {
                await context.cookies.delete('sid');
                delete sids[sid as string];
                context.response.body = { text: 'Successfully Logged Out' };
            }
        } catch (err) {
            console.log(err);
        }
    })
    .post("/api/run", async (context: RouterContext<any>) => {
        // context.response.status = Status.OK;
        // const dumbyResult: TestCasesPassed = {
        //     testCasesPassed: [true, true, true, true, true, true, true, true, true, true, true],
        //     standardOutput: "Test Standard Output",
        //     output: "Test Output"
        // }
        // context.response.body = dumbyResult
        // return
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
                    context.assert(typeof code?.value === "string", Status.BadRequest);
                    context.assert(typeof code?.input === "string", Status.BadRequest);
                    context.response.status = Status.OK;
                    console.log("ZZZ");
                    console.log(code.value);
                    console.log("XXX");
                    await Deno.writeTextFile("./sandbox/answer.py", code.value);
                    await Deno.writeTextFile("./sandbox/answerCustomInput.py", code.value);
                    let inputLines: string[] = code.input.split('\n');
                    let customInputContent: string = '';
                    let questionInformation: QuestionInformation = sidsQuestions[sid][sidsProgress[sid]];
                    for (let i = 0; i < questionInformation.inputFormat.length; ++i) {
                        console.log("OOO");
                        console.log(questionInformation.inputFormat[i]);
                        console.log("PPP");
                        if (questionInformation.inputFormat[i] == 'n') {
                            customInputContent += parseInt(inputLines[i]).toString() + '\n';
                        } else if (questionInformation.inputFormat[i] == 'a') {
                            let inputCommaSeparatedValues: string[] = inputLines[i].split('[')[1].split(']')[0].split(',');
                            console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
                            console.log(inputCommaSeparatedValues);
                            console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS");
                            customInputContent += inputCommaSeparatedValues.length.toString() + '\n';
                            for (let i = 0; i < inputCommaSeparatedValues.length; ++i) {
                                customInputContent += parseInt(inputCommaSeparatedValues[i]).toString() + '\n';
                            }
                            console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC");
                            console.log(customInputContent);
                            console.log("VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
                        } else if (questionInformation.inputFormat[i] == 'aa') {
                            let inputCommaSeparatedValues: string[] = inputLines[i].split('[[')[1].split(']]')[0].split('],[');
                            customInputContent += inputCommaSeparatedValues.length.toString() + '\n';
                            for (let i = 0; i < inputCommaSeparatedValues.length; ++i) {
                                let inputCCommaSeparatedValues: string[] = inputLines[i].split(',');
                                customInputContent += inputCCommaSeparatedValues.length.toString() + '\n'
                                for (let j = 0; j < inputCCommaSeparatedValues.length; ++j) {
                                    customInputContent += parseInt(inputCCommaSeparatedValues[i]).toString() + '\n';
                                }
                            }
                        }
                    }
                    if (questionInformation.outputFormat.length > 0) {
                        console.log("NNN");
                        console.log(questionInformation.outputFormat[0]);
                        console.log("MMM");
                    }
                    console.log("AAA");
                    await Deno.writeTextFile("./sandbox/customInput.in", customInputContent);
                    console.log("AAB");
                    const reportProcess = await Deno.run({
                        cmd: ["./makeReport.sh"],
                        cwd: "./sandbox/" + questionInformation.questionId.toString(),
                        stdout: "piped"
                    });
                    console.log("ABB");
                    await reportProcess.output();
                    console.log("BBB");
                    let jsonResults: String = await Deno.readTextFile("./sandbox/reportFromPySandbox.txt");
                    console.log("!!!");
                    console.log(jsonResults);
                    console.log("@@@");
                    let standardOutputResults: string = await Deno.readTextFile("./sandbox/standardOutputFromPySandbox.txt");
                    let standardErrorResults: string = await Deno.readTextFile("./sandbox/standardErrorFromPySandbox.txt");
                    console.log("STDERRSTDERRSTDERRSTDERRSTDERRSTDERRSTDERRSTDERRSTDERRSTDERR");
                    console.log(standardErrorResults);
                    console.log("RERERERERERERERERERERERERERERERERERERERERERERERERERERERERERE");
                    let outputResults: string = await Deno.readTextFile("./sandbox/outputFromPySandbox.txt");
                    let outputResultsSplit: string[] = outputResults.split('\n');
                    let actualOutputResults: string = '';
                    if (questionInformation.outputFormat.length > 0) {
                        if (questionInformation.outputFormat[0] == 'n') {
                            if (outputResultsSplit.length > 0) {
                                actualOutputResults += outputResultsSplit[0];
                            }
                        } else if (questionInformation.outputFormat[0] == 'a') {
                            let n: number = 0;
                            if (outputResultsSplit.length > 0) {
                                n = parseInt(outputResultsSplit[0]);
                            }
                            if (n > 0 && outputResultsSplit.length > 1) {
                                actualOutputResults += '[' + outputResultsSplit[1];
                            }
                            for (let i = 1; i < n; ++i) {
                                actualOutputResults += ', ' + outputResultsSplit[i + 1];
                            }
                            if (n > 0) {
                                actualOutputResults += ']'
                            }
                        } else if (questionInformation.outputFormat[0] == 'aa') {
                            let n: number = 0;
                            let nn: number = 0;
                            let k: number = 0;
                            console.log("###");
                            console.log(outputResultsSplit);
                            console.log("$$$");
                            if (outputResultsSplit.length > 0) {
                                n = parseInt(outputResultsSplit[k++]);
                            }
                            if (n > 0) {
                                actualOutputResults += '[[';
                                if (outputResultsSplit.length > 1) {
                                    nn = parseInt(outputResultsSplit[k++]);
                                }
                                if (nn > 0 && outputResultsSplit.length > 2) {
                                    actualOutputResults += outputResultsSplit[k++];
                                }
                                for (let i = 1; i < nn; ++i) {
                                    actualOutputResults += ', ' + outputResultsSplit[k++];
                                }
                                actualOutputResults += ']'
                            }
                            for (let i = 1; i < n; ++i) {
                                actualOutputResults += ', [';
                                nn = parseInt(outputResultsSplit[k++]);
                                if (nn > 0) {
                                    actualOutputResults += outputResultsSplit[k++];
                                }
                                for (let j = 1; j < nn; ++j) {
                                    actualOutputResults += ', ' + outputResultsSplit[k++];
                                }
                                actualOutputResults += ']'
                            }
                            if (n > 0) {
                                actualOutputResults += ']'
                            }
                        }
                    }
                    console.log("CCC");
                    console.log(standardOutputResults);
                    console.log("DDD");
                    console.log(actualOutputResults);
                    console.log("EEE");
                    jsonResults = jsonResults.replace(/\s/g, "");
                    jsonResults = jsonResults.substring(0, jsonResults.length - 2) + "]"
                    let testResults: TestResult[]  = JSON.parse(jsonResults.toString());
                    let testCasesPassed: TestCasesPassed = {
                        testCasesPassed: testResults.sort((t1, t2) => {
                            //returns the difference of the test numbers (so [2 1 10] -> [1 2 10] and not -> [1 10 2])
                            return +(t1.testName.replace("test", "")) - +(t2.testName.replace("test", ""));
                        }).map((tr: TestResult) => tr.passed),
                        standardOutput: standardOutputResults,
                        standardError: standardErrorResults,
                        output: actualOutputResults,
                    };
                    console.log("11111111111111111111111111");
                    /*if (++iiiCounter % 3 === 0) {
                        for (let i = 0; i < testCasesPassed.testCasesPassed.length; ++i) {
                            testCasesPassed.testCasesPassed[i] = true;
                        }
                    }*/
                    if (!testCasesPassed.testCasesPassed.some(element => !element) && ++sidsProgress[sid] === 3) {
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
                    }
                    context.response.body = testCasesPassed;
                    console.log("2222222222222222");
                }
            }
        } catch (err) {
            console.log(err);
        }
    })
    .get("/api/wildcardEndpoint", async (context) => {
        context.response.body = { endpoint: 
            prod ? "wss://matthew-godin.com/ws" : "ws://localhost:5000/ws"
        };
    });
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
