import { Application, Router, Status, } from "https://deno.land/x/oak/mod.ts";
import { Client } from "https://deno.land/x/postgres@v0.15.0/mod.ts";
import { crypto } from "https://deno.land/std@0.132.0/crypto/mod.ts";
import { nanoid } from 'https://deno.land/x/nanoid@v3.0.0/async.ts';
import { ensureDir } from 'https://deno.land/std@0.136.0/fs/mod.ts';
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
const app = new Application();
const router = new Router();
const numQuestionsPerMatch = 3;
let helloWorldVar = { text: 'Hello World' };
let sids = {};
let sidsProgress = {};
let sidsQuestions = {};
let matchmakingQueue25 = [];
let matchmakingQueue50 = [];
let matchmakingQueue100 = [];
let matchmakingQueue200 = [];
let matchmakingQueue500 = [];
let matches = {};
const numTestCases = 11;
function generateTestCaseString(allTestCases, format, j) {
    let testCaseString = '';
    let testCase = allTestCases[j].split(';');
    let k = 0;
    let m = 0;
    let mMax = 0;
    let n = 0;
    let nMax = 0;
    let insideArray = false;
    let insideArrayArray = false;
    for (let l = 0; l < testCase.length; ++l) {
        if (format[k] == 'n') {
            testCaseString += testCase[l] + '\n';
            ++k;
        }
        else if (format[k] == 'a') {
            if (insideArray) {
                if (m < mMax) {
                    testCaseString += testCase[l] + '\n';
                    ++m;
                }
                else {
                    insideArray = false;
                    ++k;
                }
            }
            else {
                testCaseString += testCase[l] + '\n';
                m = 0;
                mMax = parseInt(testCase[l]);
                insideArray = true;
            }
        }
        else if (format[k] == 'aa') {
            if (insideArray) {
                if (m < mMax) {
                    if (insideArrayArray) {
                        if (n < nMax) {
                            testCaseString += testCase[l] + '\n';
                            ++n;
                        }
                        else {
                            insideArrayArray = false;
                            ++m;
                        }
                    }
                    else {
                        testCaseString += testCase[l] + '\n';
                        n = 0;
                        nMax = parseInt(testCase[l]);
                        insideArrayArray = true;
                    }
                }
                else {
                    insideArray = false;
                    ++k;
                }
            }
            else {
                testCaseString += testCase[l] + '\n';
                m = 0;
                mMax = parseInt(testCase[l]);
                insideArray = true;
            }
        }
    }
    return testCaseString;
}
function generateStubString(inputFormat, outputFormat, functionSignature, normalStub) {
    let stubString = '\n\nimport sys\n\nif __name__ == "__main__":\n';
    for (let i = 0; i < inputFormat.length; ++i) {
        if (inputFormat[i] == 'n') {
            stubString += '    p' + i.toString() + ' = int(input())\n    print("G", end="", file=sys.stderr)\n    print(p' + i.toString() + ', end="", file=sys.stderr)\n    print("H", end="", file=sys.stderr)\n';
        }
        else if (inputFormat[i] == 'a') {
            stubString += '    n' + i.toString() + ' = int(input())\n    print("G", end="", file=sys.stderr)\n    print(n' + i.toString() + ', end="", file=sys.stderr)\n    print("H", end="", file=sys.stderr)\n    p' + i.toString() + ' = []\n    nums = []\n    for i in range(n' + i.toString() + '):\n        gh = int(input())\n        print("G", end="", file=sys.stderr)\n        print(gh, end="", file=sys.stderr)\n        print("H", end="", file=sys.stderr)\n        nums.append(gh)\n';
        }
        else if (inputFormat[i] == 'aa') {
            stubString += '    n' + i.toString() + ' = int(input())\n    p' + i.toString() + ' = []\n    for i in range(n' + i.toString() + '):\n        nn' + i.toString() + ' = int(input())\n        pp' + i.toString() + ' = []\n        for j in range(nn' + i.toString() + '):\n            pp' + i.toString() + '.append(int(input()))\n        p' + i.toString() + '.append(pp' + i.toString() + ')\n';
        }
    }
    stubString += '    result = ' + functionSignature.split('(')[0].split('def ')[1] + '(';
    if (inputFormat.length > 0) {
        stubString += 'p0';
    }
    for (let i = 1; i < inputFormat.length; ++i) {
        stubString += ', p' + i.toString();
    }
    stubString += ')\n';
    if (normalStub) {
        stubString += '    print("v10zg57ZIUF6vjZgSPaDY70TQff8wTHXgodX2otrDMEay0WlS36MjDhHH054uRrFxGHHSegvGcA7eaqB")\n';
        if (outputFormat.length > 0) {
            if (outputFormat[0] == 'n') {
                stubString += '    print(result)\n';
            }
            else if (outputFormat[0] == 'a') {
                stubString += '    print(len(result))\n    for r in result:\n        print(r)\n';
            }
            else if (outputFormat[0] == 'aa') {
                stubString += '    print(len(result))\n    for r in result:\n        print(len(r))\n        for rr in r:\n            print(rr)\n';
            }
        }
    }
    return stubString;
}
function generateCleanString(outputFormat, normalClean) {
    let cleanString = 'import sys\n\nif __name__ == "__main__":\n';
    if (normalClean) {
        cleanString += '    while True:\n        tryInput = input()\n        print("OK", end="", file=sys.stderr)\n        print(tryInput, end="", file=sys.stderr)\n        print("PL", end="", file=sys.stderr)\n        if (tryInput == "v10zg57ZIUF6vjZgSPaDY70TQff8wTHXgodX2otrDMEay0WlS36MjDhHH054uRrFxGHHSegvGcA7eaqB"):\n            break\n';
    }
    if (outputFormat.length > 0) {
        if (outputFormat[0] == 'n') {
            cleanString += '    qw = input()\n    print("Q", end="", file=sys.stderr)\n    print(qw, end="", file=sys.stderr)\n    print("W", end="", file=sys.stderr)\n    print(qw)\n';
        }
        else if (outputFormat[0] == 'a') {
            cleanString += '    n = int(input())\n    print("Q", end="", file=sys.stderr)\n    print(n, end="", file=sys.stderr)\n    print("W", end="", file=sys.stderr)\n    nums = []\n    for i in range(n):\n        qw = int(input())\n        print("Q", end="", file=sys.stderr)\n        print(qw, end="", file=sys.stderr)\n        print("W", end="", file=sys.stderr)\n        nums.append(qw)\n    nums.sort()\n    print(n)\n    for i in range(n):\n        print(nums[i])';
        }
        else if (outputFormat[0] == 'aa') {
            cleanString += '    n = int(input())\n    print("Q", end="", file=sys.stderr)\n    print(n, end="", file=sys.stderr)\n    print("W", end="", file=sys.stderr)\n    nns = []\n    nums = []\n    for i in range(n):\n        nn = int(input())\n        print("Q", end="", file=sys.stderr)\n        print(nn, end="", file=sys.stderr)\n        print("W", end="", file=sys.stderr)\n        nns.append(nn)\n        nnums = []\n        for j in range(nn):\n            qw = int(input())\n            print("Q", end="", file=sys.stderr)\n            print(qw, end="", file=sys.stderr)\n            print("W", end="", file=sys.stderr)\n            nnums.append(qw)\n        nnums.sort()\n        nums.append(nnums)\n    nums.sort()\n    print(n)\n    for i in range(n):\n        print(nns[i])\n        for j in range(nns[i]):\n            print(nums[i][j])\n';
        }
    }
    return cleanString;
}
function generateMakeReportString(i) {
    return '#!/bin/bash\n\n(cat stub.py) >> ../answer.py\n(cat stubCustomInput.py) >> ../answerCustomInput.py\n\ncontainerID=$(docker run -dit py-sandbox)\ndocker cp TestInputs/ ${containerID}:home/TestEnvironment/TestInputs/\ndocker cp TestOutputs/ ${containerID}:home/TestEnvironment/TestOutputs/\ndocker cp ../answer.py ${containerID}:home/TestEnvironment/answer.py\ndocker cp ../customInput.in ${containerID}:home/TestEnvironment/customInput.in\ndocker cp ../answerCustomInput.py ${containerID}:home/TestEnvironment/answerCustomInput.py\ndocker cp clean.py ${containerID}:home/TestEnvironment/clean.py\ndocker cp cleanOutput.py ${containerID}:home/TestEnvironment/cleanOutput.py\n\ndocker exec ${containerID} sh -c "cd home/TestEnvironment/ && timeout 10 ./makeReport.sh"\n\ndocker cp ${containerID}:home/TestEnvironment/report.txt reportFromPySandbox.txt\ndocker cp ${containerID}:home/TestEnvironment/standardOutput.txt standardOutputFromPySandbox.txt\ndocker cp ${containerID}:home/TestEnvironment/output.txt outputFromPySandbox.txt\n\ndocker kill ${containerID}\n\ndocker rm ${containerID}\n\n';
}
async function loadTestCases() {
    await client.connect();
    const questionsResult = await client.queryArray("select count(*) from questions");
    let numQuestions = Number(questionsResult.rows[0][0]);
    await client.end();
    for (let i = 1; i <= numQuestions; ++i) {
        await client.connect();
        const selectedResult = await client.queryArray("select function_signature, input_output_format, test_cases from questions where id = " + i.toString());
        let functionSignature = selectedResult.rows[0][0];
        let inputOutputFormat = selectedResult.rows[0][1];
        let testCases = selectedResult.rows[0][2];
        await client.end();
        let inputOutputFormats = inputOutputFormat.split('|');
        let inputFormat = inputOutputFormats[0].split(';');
        inputFormat.shift();
        let outputFormat = inputOutputFormats[1].split(';');
        outputFormat.shift();
        let allTestCases = testCases.split('|');
        for (let j = 0; j < numTestCases; ++j) {
            await ensureDir("./sandbox/" + i.toString() + "/TestInputs/");
            await ensureDir("./sandbox/" + i.toString() + "/TestOutputs/");
            await Deno.writeTextFile("./sandbox/" + i.toString() + "/TestInputs/test" + (j + 1).toString() + ".in", generateTestCaseString(allTestCases, inputFormat, j));
        }
        let secondHalfThreshold = 2 * numTestCases;
        for (let j = 11; j < secondHalfThreshold; ++j) {
            await Deno.writeTextFile("./sandbox/" + i.toString() + "/TestOutputs/test" + (j - 10).toString() + ".out", generateTestCaseString(allTestCases, outputFormat, j));
        }
        await Deno.writeTextFile("./sandbox/" + i.toString() + "/stub.py", generateStubString(inputFormat, outputFormat, functionSignature, true));
        await Deno.writeTextFile("./sandbox/" + i.toString() + "/stubCustomInput.py", generateStubString(inputFormat, outputFormat, functionSignature, false));
        await Deno.writeTextFile("./sandbox/" + i.toString() + "/clean.py", generateCleanString(outputFormat, true));
        await Deno.writeTextFile("./sandbox/" + i.toString() + "/cleanOutput.py", generateCleanString(outputFormat, false));
        await Deno.writeTextFile("./sandbox/" + i.toString() + "/makeReport.sh", generateMakeReportString(i));
        await Deno.run({
            cmd: ["chmod", "u+x", "makeReport.sh"],
            cwd: "./sandbox/" + i.toString()
        });
    }
}
loadTestCases();
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
async function selectQuestions(matchmakingUser) {
    await client.connect();
    const questionsResult = await client.queryArray("select count(*) from questions");
    let numQuestions = Number(questionsResult.rows[0][0]);
    await client.end();
    let questionsSelected = [];
    let randomPermutation = [];
    for (let i = 0; i < numQuestions; ++i) {
        randomPermutation[i] = i;
    }
    for (let i = 0; i < numQuestionsPerMatch; ++i) {
        let j = Math.floor(Math.random() * numQuestions);
        [randomPermutation[i], randomPermutation[j]] = [randomPermutation[j], randomPermutation[i]];
    }
    for (let i = 0; i < numQuestionsPerMatch; ++i) {
        questionsSelected.push(randomPermutation[i] + 1);
    }
    let questionsInformation = [];
    for (let i = 0; i < questionsSelected.length; ++i) {
        let inputOutputFormat = '';
        for (;;) {
            try {
                await client.connect();
                const selectedResult = await client.queryArray("select input_output_format from questions where id = "
                    + questionsSelected[i].toString());
                console.log("RRR");
                console.log(questionsSelected[i].toString());
                console.log("QQQ");
                console.log(selectedResult);
                console.log("WWW");
                inputOutputFormat = selectedResult.rows[0][0];
                await client.end();
                break;
            }
            catch (error) {
                console.log(error);
            }
        }
        let inputOutputFormats = inputOutputFormat.split('|');
        let inputFormat = inputOutputFormats[0].split(';');
        inputFormat.shift();
        let outputFormat = inputOutputFormats[1].split(';');
        outputFormat.shift();
        let questionInformation = { questionId: questionsSelected[i], inputFormat: inputFormat, outputFormat: outputFormat };
        questionsInformation.push(questionInformation);
    }
    sidsQuestions[matchmakingUser.sid] = questionsInformation;
    sidsQuestions[matches[matchmakingUser.sid]] = questionsInformation;
}
async function addToQueue(queue, matchmakingUser, range, context) {
    queue.push(matchmakingUser);
    for (let i = 0; i < queue.length; ++i) {
        if (queue[i].sid != matchmakingUser.sid
            && Math.abs(matchmakingUser.eloRating - queue[i].eloRating) <= range) {
            matches[queue[i].sid] = matchmakingUser.sid;
            matches[matchmakingUser.sid] = queue[i].sid;
            sidsProgress[queue[i].sid] = 0;
            sidsProgress[matchmakingUser.sid] = 0;
            console.log("attempting register pair " + matchmakingUser.sid + ", " + queue[i].sid);
            const response = await fetch("http://localhost:5000/registerPair", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Id1: matchmakingUser.sid,
                    Id2: queue[i].sid,
                }),
            });
            console.log(response.status);
            context.response.body = {
                username: sids[matchmakingUser.sid],
                eloRating: matchmakingUser.eloRating,
                opponentUsername: sids[queue[i].sid],
                opponentEloRating: queue[i].eloRating,
            };
            queue.splice(i, 1);
            queue.pop();
            selectQuestions(matchmakingUser);
            return true;
        }
    }
    return false;
}
async function checkIfFoundInQueue(delayTime, matchmakingUser, username, context) {
    await delay(delayTime);
    if (matchmakingUser.sid in matches) {
        let opponentUsername = sids[matches[matchmakingUser.sid]];
        await client.connect();
        const usernameResult = await client.queryArray("select elo_rating from users where username='"
            + username + "'");
        let opponentEloRating = usernameResult.rows[0][0];
        await client.end();
        context.response.body = {
            username: sids[matchmakingUser.sid],
            eloRating: matchmakingUser.eloRating,
            opponentUsername: opponentUsername,
            opponentEloRating: opponentEloRating,
        };
        return true;
    }
    return false;
}
function removeFromQueue(queue, sid) {
    for (let i = 0; i < queue.length; ++i) {
        if (queue[i].sid === sid) {
            queue.splice(i, 1);
        }
    }
}
const port = +env.LICODE_PORT || 3000;
app.addEventListener("error", (evt) => {
    console.log(evt.error);
});
router
    .get("/api/hello-world", (context) => {
    try {
        context.response.body = helloWorldVar;
    }
    catch (err) {
        console.log(err);
    }
})
    .post("/api/post-hello-world", async (context) => {
    if (!context.request.hasBody) {
        context.throw(Status.BadRequest, "Bad Request");
    }
    const body = context.request.body();
    let helloWorld;
    if (body.type === "json") {
        helloWorld = await body.value;
    }
    else if (body.type === "form") {
        helloWorld = {};
        for (const [key, value] of await body.value) {
            helloWorld[key] = value;
        }
    }
    else if (body.type === "form-data") {
        const formData = await body.value.read();
        helloWorld = formData.fields;
    }
    if (helloWorld) {
        context.assert(typeof helloWorld.text === "string", Status.BadRequest);
        helloWorldVar = helloWorld;
        context.response.status = Status.OK;
        context.response.body = helloWorld;
        context.response.type = "json";
        return;
    }
    context.throw(Status.BadRequest, "Bad Request");
})
    .post("/api/register", async (context) => {
    let sid = await context.cookies.get('sid');
    if (!sid) {
        sid = await nanoid(40);
        context.cookies.set('sid', sid);
    }
    try {
        if (!context.request.hasBody) {
            context.throw(Status.BadRequest, "Bad Request");
        }
        const body = context.request.body();
        let user;
        if (body.type === "json") {
            user = await body.value;
        }
        if (user) {
            context.assert(typeof user?.email?.value === "string"
                && typeof user?.username?.value === "string"
                && typeof user?.password?.value === "string", Status.BadRequest);
            context.response.status = Status.OK;
            await client.connect();
            const usernameResult = await client.queryArray("select username from users where username='"
                + user?.username?.value + "'");
            if (usernameResult.rows.length < 1) {
                const emailResult = await client.queryArray("select email from users where email='"
                    + user?.email?.value + "'");
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
                    let hashedPasswordUint8Array = new Uint8Array(await crypto.subtle.digest('SHA3-512', textEncoder.encode(user?.password?.value + saltHexString)));
                    let hashedPasswordHexString = '';
                    for (let i = 0; i < hashedPasswordUint8Array.length; ++i) {
                        hashedPasswordHexString += (hashedPasswordUint8Array[i] < 16 ? "0" : "")
                            + hashedPasswordUint8Array[i].toString(16);
                    }
                    let hashedPasswordHexStringLength = hashedPasswordHexString.length;
                    for (let i = 0; i < 128 - hashedPasswordHexStringLength; ++i) {
                        hashedPasswordHexString = "0" + hashedPasswordHexString;
                    }
                    await client.queryArray("insert into public.users(email, username, hashed_password, salt, num_wins, num_losses, created_at, updated_at, elo_rating, has_2400_rating_history)"
                        + " values ('" + user?.email?.value + "', '" + user?.username?.value + "', '"
                        + "\\x" + hashedPasswordHexString + "', '" + "\\x" + saltHexString + "', '0', '0', now(), now(), '1000', 'false')");
                    let sid = await nanoid(40);
                    sids[sid] = user.username.value;
                    await context.cookies.set('sid', sid);
                    context.response.body = user;
                }
                else {
                    context.response.body = { text: 'Given Email Already Exists' };
                }
            }
            else {
                context.response.body = { text: 'Given Username Already Exists' };
            }
            await client.end();
            context.response.type = "json";
            return;
        }
        context.throw(Status.BadRequest, "Bad Request");
    }
    catch (err) {
        console.log(err);
    }
})
    .post("/api/login", async (context) => {
    try {
        if (!context.request.hasBody) {
            context.throw(Status.BadRequest, "Bad Request");
        }
        const body = context.request.body();
        let user;
        if (body.type === "json") {
            user = await body.value;
        }
        if (user) {
            context.assert(typeof user?.email?.value === "string"
                && typeof user?.password?.value === "string", Status.BadRequest);
            context.response.status = Status.OK;
            await client.connect();
            const usernameResult = await client.queryArray("select email, username, hashed_password, salt from users where username='"
                + user?.email?.value + "'");
            if (usernameResult.rows.length < 1) {
                const emailResult = await client.queryArray("select email, username, hashed_password, salt from users where email='"
                    + user?.email?.value + "'");
                if (emailResult.rows.length < 1) {
                    context.response.body = { text: 'Given Email or Username Does Not Exist' };
                }
                else {
                    let saltHexString = '';
                    for (let i = 0; i < emailResult.rows[0][3].length; ++i) {
                        saltHexString += (emailResult.rows[0][3][i] < 16 ? "0" : "")
                            + emailResult.rows[0][3][i].toString(16);
                    }
                    let textEncoder = new TextEncoder();
                    let hashedPasswordUint8Array = new Uint8Array(await crypto.subtle.digest('SHA3-512', textEncoder.encode(user?.password?.value + saltHexString)));
                    let hashedPasswordHexString = '';
                    for (let i = 0; i < hashedPasswordUint8Array.length; ++i) {
                        hashedPasswordHexString += (hashedPasswordUint8Array[i] < 16 ? "0" : "")
                            + hashedPasswordUint8Array[i].toString(16);
                    }
                    let serverHashedPasswordHexString = '';
                    for (let i = 0; i < emailResult.rows[0][2].length; ++i) {
                        serverHashedPasswordHexString += (emailResult.rows[0][2][i] < 16 ? "0" : "")
                            + emailResult.rows[0][2][i].toString(16);
                    }
                    if (hashedPasswordHexString === serverHashedPasswordHexString) {
                        let foundUser = {
                            email: { value: emailResult.rows[0][0] },
                            username: { value: emailResult.rows[0][1] },
                            password: { value: '' },
                        };
                        let sid = await nanoid(40);
                        sids[sid] = foundUser.username.value;
                        await context.cookies.set('sid', sid);
                        context.response.body = foundUser;
                    }
                    else {
                        context.response.body = { text: 'Wrong Password' };
                    }
                }
            }
            else {
                let saltHexString = '';
                for (let i = 0; i < usernameResult.rows[0][3].length; ++i) {
                    saltHexString += (usernameResult.rows[0][3][i] < 16 ? "0" : "")
                        + usernameResult.rows[0][3][i].toString(16);
                }
                let textEncoder = new TextEncoder();
                let hashedPasswordUint8Array = new Uint8Array(await crypto.subtle.digest('SHA3-512', textEncoder.encode(user?.password?.value + saltHexString)));
                let hashedPasswordHexString = '';
                for (let i = 0; i < hashedPasswordUint8Array.length; ++i) {
                    hashedPasswordHexString += (hashedPasswordUint8Array[i] < 16 ? "0" : "")
                        + hashedPasswordUint8Array[i].toString(16);
                }
                let serverHashedPasswordHexString = '';
                for (let i = 0; i < usernameResult.rows[0][2].length; ++i) {
                    serverHashedPasswordHexString += (usernameResult.rows[0][2][i] < 16 ? "0" : "")
                        + usernameResult.rows[0][2][i].toString(16);
                }
                if (hashedPasswordHexString === serverHashedPasswordHexString) {
                    let foundUser = {
                        email: { value: usernameResult.rows[0][0] },
                        username: { value: usernameResult.rows[0][1] },
                        password: { value: '' },
                    };
                    let sid = await nanoid(40);
                    sids[sid] = foundUser.username.value;
                    await context.cookies.set('sid', sid);
                    context.response.body = foundUser;
                }
                else {
                    context.response.body = { text: 'Wrong Password' };
                }
            }
            await client.end();
            context.response.type = "json";
            return;
        }
        context.throw(Status.BadRequest, "Bad Request");
    }
    catch (err) {
        console.log(err);
    }
})
    .get("/api/user", async (context) => {
    try {
        let sid = await context.cookies.get('sid');
        if (sid && typeof sid === 'string') {
            let username = sids[sid];
            if (username) {
                await client.connect();
                const usernameResult = await client.queryArray("select email, username, num_wins, num_losses, elo_rating from users where username='"
                    + username + "'");
                let foundUser = {
                    email: { value: usernameResult.rows[0][0] },
                    username: { value: usernameResult.rows[0][1] },
                    password: { value: '' },
                };
                context.response.body = {
                    user: foundUser,
                    numWins: usernameResult.rows[0][2],
                    numLosses: usernameResult.rows[0][3],
                    eloRating: usernameResult.rows[0][4],
                };
                await client.end();
            }
        }
    }
    catch (err) {
        console.log(err);
    }
})
    .get("/api/opponent", async (context) => {
    try {
        let sid = await context.cookies.get('sid');
        if (sid && typeof sid === 'string') {
            let username = sids[sid];
            let opponentUsername = sids[matches[sid]];
            if (username && opponentUsername) {
                await client.connect();
                const usernameResult = await client.queryArray("select elo_rating from users where username='"
                    + username + "'");
                const opponentUsernameResult = await client.queryArray("select elo_rating from users where username='"
                    + opponentUsername + "'");
                const responseBody = {
                    you: {
                        username: username,
                        eloRating: usernameResult.rows[0][0],
                        sid: sid,
                    },
                    opponent: {
                        username: opponentUsername,
                        eloRating: opponentUsernameResult.rows[0][0],
                        sid: ''
                    },
                };
                context.response.body = responseBody;
                await client.end();
            }
        }
    }
    catch (err) {
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
            const responseBody = {
                question: questionResult.rows[0][0],
                function_signature: questionResult.rows[0][1],
                default_custom_input: questionResult.rows[0][2],
            };
            context.response.body = responseBody;
            await client.end();
        }
    }
    catch (err) {
        console.log(err);
    }
})
    .get("/api/matchmaking", async (context) => {
    try {
        let sid = await context.cookies.get('sid');
        if (sid && typeof sid === 'string') {
            let username = sids[sid];
            if (username) {
                await client.connect();
                const usernameResult = await client.queryArray("select elo_rating from users where username='"
                    + username + "'");
                let matchmakingUser = {
                    eloRating: usernameResult.rows[0][0],
                    sid: sid,
                };
                await client.end();
                let queues = [matchmakingQueue25, matchmakingQueue50, matchmakingQueue100, matchmakingQueue200];
                let ranges = [25, 50, 100, 200];
                let delayTimesNums = [1, 5, 10, 60];
                let foundMatch = false;
                for (let i = 0; i < queues.length; ++i) {
                    if (foundMatch = await addToQueue(queues[i], matchmakingUser, ranges[i], context)) {
                        break;
                    }
                    else {
                        for (let j = 0; j < delayTimesNums[i]; ++j) {
                            if (foundMatch = await checkIfFoundInQueue(1000, matchmakingUser, username, context)) {
                                break;
                            }
                        }
                        if (foundMatch) {
                            break;
                        }
                        removeFromQueue(queues[i], sid);
                    }
                }
                if (!foundMatch && !addToQueue(matchmakingQueue500, matchmakingUser, 500, context)) {
                    while (!(await checkIfFoundInQueue(1000, matchmakingUser, username, context))) { }
                }
            }
        }
    }
    catch (err) {
        console.log(err);
    }
})
    .get("/api/logout", async (context) => {
    try {
        let sid = await context.cookies.get('sid');
        if (sid && typeof sid === 'string') {
            delete sids[sid];
            context.response.body = { text: 'Successfully Logged Out' };
        }
    }
    catch (err) {
        console.log(err);
    }
})
    .post("/api/run", async (context) => {
    try {
        let sid = await context.cookies.get('sid');
        if (sid && typeof sid === 'string') {
            if (!context.request.hasBody) {
                context.throw(Status.BadRequest, "Bad Request");
            }
            const body = context.request.body();
            let code;
            if (body.type === "json") {
                code = await body.value;
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
                let inputLines = code.input.split('\n');
                let customInputContent = '';
                let questionInformation = sidsQuestions[sid][sidsProgress[sid]];
                for (let i = 0; i < questionInformation.inputFormat.length; ++i) {
                    console.log("OOO");
                    console.log(questionInformation.inputFormat[i]);
                    console.log("PPP");
                    if (questionInformation.inputFormat[i] == 'n') {
                        customInputContent += parseInt(inputLines[i]).toString() + '\n';
                    }
                    else if (questionInformation.inputFormat[i] == 'a') {
                        let inputCommaSeparatedValues = inputLines[i].split('[')[1].split(']')[0].split(',');
                        customInputContent += inputCommaSeparatedValues.length.toString() + '\n';
                        for (let i = 0; i < inputCommaSeparatedValues.length; ++i) {
                            customInputContent += parseInt(inputCommaSeparatedValues[i]).toString() + '\n';
                        }
                    }
                    else if (questionInformation.inputFormat[i] == 'aa') {
                        let inputCommaSeparatedValues = inputLines[i].split('[[')[1].split(']]')[0].split('],[');
                        customInputContent += inputCommaSeparatedValues.length.toString() + '\n';
                        for (let i = 0; i < inputCommaSeparatedValues.length; ++i) {
                            let inputCCommaSeparatedValues = inputLines[i].split(',');
                            customInputContent += inputCCommaSeparatedValues.length.toString() + '\n';
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
                let jsonResults = await Deno.readTextFile("./sandbox/reportFromPySandbox.txt");
                let standardOutputResults = await Deno.readTextFile("./sandbox/standardOutputFromPySandbox.txt");
                let outputResults = await Deno.readTextFile("./sandbox/outputFromPySandbox.txt");
                console.log("CCC");
                console.log(standardOutputResults);
                console.log("DDD");
                console.log(outputResults);
                console.log("EEE");
                jsonResults = jsonResults.replace(/\s/g, "");
                jsonResults = jsonResults.substring(0, jsonResults.length - 2) + "]";
                let testResults = JSON.parse(jsonResults.toString());
                let testCasesPassed = {
                    testCasesPassed: testResults.map((tr) => tr.passed),
                    standardOutput: standardOutputResults,
                    output: outputResults,
                };
                if (!testCasesPassed.testCasesPassed.some(element => !element) && ++sidsProgress[sid] === 3) {
                    let opponentSid = matches[sid];
                    delete matches[sid];
                    delete matches[opponentSid];
                    delete sidsProgress[sid];
                    delete sidsProgress[opponentSid];
                    delete sidsQuestions[sid];
                    delete sidsQuestions[opponentSid];
                    let numWins, numGames, eloRating, has2400RatingHistory = false, opponentNumLosses, opponentNumGames, opponentEloRating, opponentHas2400RatingHistory = false;
                    let username = sids[sid];
                    if (username) {
                        await client.connect();
                        const usernameResult = await client.queryArray("select num_wins, num_losses, elo_rating, has_2400_rating_history from users where username='"
                            + username + "'");
                        numWins = usernameResult.rows[0][0];
                        numGames = numWins + usernameResult.rows[0][1];
                        eloRating = usernameResult.rows[0][2];
                        has2400RatingHistory = usernameResult.rows[0][3];
                        await client.end();
                        let opponentUsername = sids[opponentSid];
                        if (opponentUsername) {
                            await client.connect();
                            const usernameResult = await client.queryArray("select num_wins, num_losses, elo_rating, has_2400_rating_history from users where username='"
                                + opponentUsername + "'");
                            opponentNumLosses = usernameResult.rows[0][1];
                            opponentNumGames = usernameResult.rows[0][0] + opponentNumLosses;
                            opponentEloRating = usernameResult.rows[0][2];
                            opponentHas2400RatingHistory = usernameResult.rows[0][3];
                            await client.end();
                            ++numWins;
                            let eloRatingVariation = 1 - 1.0 / (1 + Math.pow(10, (opponentEloRating - eloRating) / 400.0));
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
            }
        }
    }
    catch (err) {
        console.log(err);
    }
});
app.use(router.routes());
app.use(router.allowedMethods());
app.use(async (context) => {
    if (!context.request.url.pathname.endsWith('.js')
        && !context.request.url.pathname.endsWith('.png')
        && !context.request.url.pathname.endsWith('.ico')
        && !context.request.url.pathname.endsWith('.txt')) {
        context.request.url.pathname = '/';
    }
    await context.send({
        root: `${Deno.cwd()}/react-app/build`,
        index: "index.html",
    });
});
console.log("Running on port", port);
await app.listen({ port });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibW9kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDSCxXQUFXLEVBQ1gsTUFBTSxFQUVOLE1BQU0sR0FFVCxNQUFNLGdDQUFnQyxDQUFDO0FBTXhDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQztBQUNyRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDckUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLDRDQUE0QyxDQUFBO0FBQ25FLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSx5Q0FBeUMsQ0FBQztBQUNwRSxNQUFNLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQztJQUN0QixJQUFJLEVBQUUsUUFBUTtJQUNkLFFBQVEsRUFBRSxRQUFRO0lBQ2xCLFFBQVEsRUFBRSxRQUFRO0lBQ2xCLFFBQVEsRUFBRSxXQUFXO0lBQ3JCLElBQUksRUFBRSxJQUFJO0lBQ1YsR0FBRyxFQUFFO1FBQ0QsT0FBTyxFQUFFLEtBQUs7UUFDZCxPQUFPLEVBQUUsS0FBSztLQUNqQjtDQUNKLENBQUMsQ0FBQztBQUNILE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDaEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztBQUM5QixNQUFNLE1BQU0sR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO0FBaUM1QixNQUFNLG9CQUFvQixHQUFHLENBQUMsQ0FBQztBQUUvQixJQUFJLGFBQWEsR0FBZSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsQ0FBQztBQUV4RCxJQUFJLElBQUksR0FBK0IsRUFBRSxDQUFDO0FBRTFDLElBQUksWUFBWSxHQUErQixFQUFFLENBQUM7QUFFbEQsSUFBSSxhQUFhLEdBQThDLEVBQUUsQ0FBQztBQUVsRSxJQUFJLGtCQUFrQixHQUFzQixFQUFFLENBQUM7QUFDL0MsSUFB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LE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1dBQzlDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUNuRCxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO0tBQ3RDO0lBQ0QsTUFBTSxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQ2YsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxrQkFBa0I7UUFDckMsS0FBSyxFQUFFLFlBQVk7S0FDdEIsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3JDLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICAgIEFwcGxpY2F0aW9uLFxuICAgIFJvdXRlcixcbiAgICBSb3V0ZXJDb250ZXh0LFxuICAgIFN0YXR1cyxcbiAgICBzZW5kLFxufSBmcm9tIFwiaHR0cHM6Ly9kZW5vLmxhbmQveC9vYWsvbW9kLnRzXCI7XG5cbmltcG9ydCB7IE1hdGNobWFraW5nRGF0YSB9IGZyb20gXCIuL3JlYWN0LWFwcC9zcmMvY29tcG9uZW50cy9jb21tb24vaW50ZXJmYWNlcy9tYXRjaG1ha2luZ0RhdGEudHNcIjtcbmltcG9ydCB7IFF1ZXN0aW9uRGF0YSB9IGZyb20gXCIuL3JlYWN0LWFwcC9zcmMvY29tcG9uZW50cy9jb21tb24vaW50ZXJmYWNlcy9tYXRjaG1ha2luZ0RhdGEudHNcIjtcbmltcG9ydCB7IFRlc3RDYXNlc1Bhc3NlZCB9IGZyb20gXCIuL3JlYWN0LWFwcC9zcmMvY29tcG9uZW50cy9jb21tb24vaW50ZXJmYWNlcy9tYXRjaG1ha2luZ0RhdGEudHNcIjtcblxuaW1wb3J0IHsgQ2xpZW50IH0gZnJvbSBcImh0dHBzOi8vZGVuby5sYW5kL3gvcG9zdGdyZXNAdjAuMTUuMC9tb2QudHNcIjtcbmltcG9ydCB7IGNyeXB0byB9IGZyb20gXCJodHRwczovL2Rlbm8ubGFuZC9zdGRAMC4xMzIuMC9jcnlwdG8vbW9kLnRzXCI7XG5pbXBvcnQgeyBuYW5vaWQgfSBmcm9tICdodHRwczovL2Rlbm8ubGFuZC94L25hbm9pZEB2My4wLjAvYXN5bmMudHMnXG5pbXBvcnQgeyBlbnN1cmVEaXIgfSBmcm9tICdodHRwczovL2Rlbm8ubGFuZC9zdGRAMC4xMzYuMC9mcy9tb2QudHMnO1xuY29uc3QgY2xpZW50ID0gbmV3IENsaWVudCh7XG4gICAgdXNlcjogXCJsaWNvZGVcIixcbiAgICBkYXRhYmFzZTogXCJsaWNvZGVcIixcbiAgICBwYXNzd29yZDogXCJlZG9jaWxcIixcbiAgICBob3N0bmFtZTogXCJsb2NhbGhvc3RcIixcbiAgICBwb3J0OiA1NDMyLFxuICAgIHRsczoge1xuICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgZW5mb3JjZTogZmFsc2UsXG4gICAgfSxcbn0pO1xuY29uc3QgZW52ID0gRGVuby5lbnYudG9PYmplY3QoKTtcbmNvbnN0IGFwcCA9IG5ldyBBcHBsaWNhdGlvbigpO1xuY29uc3Qgcm91dGVyID0gbmV3IFJvdXRlcigpO1xuXG5pbnRlcmZhY2UgSGVsbG9Xb3JsZCB7XG4gICAgdGV4dDogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgVXNlciB7XG4gICAgZW1haWw6IHsgdmFsdWU6IHN0cmluZyB9O1xuICAgIHVzZXJuYW1lOiB7IHZhbHVlOiBzdHJpbmcgfTtcbiAgICBwYXNzd29yZDogeyB2YWx1ZTogc3RyaW5nIH07XG59XG5cbmludGVyZmFjZSBNYXRjaG1ha2luZ1VzZXIge1xuICAgIGVsb1JhdGluZzogbnVtYmVyO1xuICAgIHNpZDogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgQ29kZVN1Ym1pc3Npb24ge1xuICAgIHZhbHVlOiBzdHJpbmc7XG4gICAgaW5wdXQ6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIFRlc3RSZXN1bHQge1xuICAgIHRlc3ROYW1lOiBzdHJpbmcsXG4gICAgcGFzc2VkOiBib29sZWFuXG59XG5cbmludGVyZmFjZSBRdWVzdGlvbkluZm9ybWF0aW9uIHtcbiAgICBxdWVzdGlvbklkOiBudW1iZXIsXG4gICAgaW5wdXRGb3JtYXQ6IHN0cmluZ1tdLFxuICAgIG91dHB1dEZvcm1hdDogc3RyaW5nW10sXG59XG5cbmNvbnN0IG51bVF1ZXN0aW9uc1Blck1hdGNoID0gMztcblxubGV0IGhlbGxvV29ybGRWYXI6IEhlbGxvV29ybGQgPSB7IHRleHQ6ICdIZWxsbyBXb3JsZCcgfTtcblxubGV0IHNpZHM6IHsgW25hbWU6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG5cbmxldCBzaWRzUHJvZ3Jlc3M6IHsgW25hbWU6IHN0cmluZ106IG51bWJlciB9ID0ge307XG5cbmxldCBzaWRzUXVlc3Rpb25zOiB7IFtuYW1lOiBzdHJpbmddOiBRdWVzdGlvbkluZm9ybWF0aW9uW10gfSA9IHt9O1xuXG5sZXQgbWF0Y2htYWtpbmdRdWV1ZTI1OiBNYXRjaG1ha2luZ1VzZXJbXSA9IFtdO1xubGV0IG1hdGNobWFraW5nUXVldWU1MDogTWF0Y2htYWtpbmdVc2VyW10gPSBbXTtcbmxldCBtYXRjaG1ha2luZ1F1ZXVlMTAwOiBNYXRjaG1ha2luZ1VzZXJbXSA9IFtdO1xubGV0IG1hdGNobWFraW5nUXVldWUyMDA6IE1hdGNobWFraW5nVXNlcltdID0gW107XG5sZXQgbWF0Y2htYWtpbmdRdWV1ZTUwMDogTWF0Y2htYWtpbmdVc2VyW10gPSBbXTtcblxubGV0IG1hdGNoZXM6IHsgW25hbWU6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG5cbmNvbnN0IG51bVRlc3RDYXNlczogbnVtYmVyID0gMTE7XG5cbmZ1bmN0aW9uIGdlbmVyYXRlVGVzdENhc2VTdHJpbmcoYWxsVGVzdENhc2VzOiBzdHJpbmdbXSwgZm9ybWF0OiBzdHJpbmdbXSwgajogbnVtYmVyKSB7XG4gICAgbGV0IHRlc3RDYXNlU3RyaW5nID0gJyc7XG4gICAgbGV0IHRlc3RDYXNlID0gYWxsVGVzdENhc2VzW2pdLnNwbGl0KCc7Jyk7XG4gICAgbGV0IGsgPSAwO1xuICAgIGxldCBtID0gMDtcbiAgICBsZXQgbU1heCA9IDA7XG4gICAgbGV0IG4gPSAwO1xuICAgIGxldCBuTWF4ID0gMDtcbiAgICBsZXQgaW5zaWRlQXJyYXkgPSBmYWxzZTtcbiAgICBsZXQgaW5zaWRlQXJyYXlBcnJheSA9IGZhbHNlO1xuICAgIGZvciAobGV0IGwgPSAwOyBsIDwgdGVzdENhc2UubGVuZ3RoOyArK2wpIHtcbiAgICAgICAgaWYgKGZvcm1hdFtrXSA9PSAnbicpIHtcbiAgICAgICAgICAgIHRlc3RDYXNlU3RyaW5nICs9IHRlc3RDYXNlW2xdICsgJ1xcbic7XG4gICAgICAgICAgICArK2s7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0W2tdID09ICdhJykge1xuICAgICAgICAgICAgaWYgKGluc2lkZUFycmF5KSB7XG4gICAgICAgICAgICAgICAgaWYgKG0gPCBtTWF4KSB7XG4gICAgICAgICAgICAgICAgICAgIHRlc3RDYXNlU3RyaW5nICs9IHRlc3RDYXNlW2xdICsgJ1xcbic7XG4gICAgICAgICAgICAgICAgICAgICsrbTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpbnNpZGVBcnJheSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICArK2s7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0ZXN0Q2FzZVN0cmluZyArPSB0ZXN0Q2FzZVtsXSArICdcXG4nO1xuICAgICAgICAgICAgICAgIG0gPSAwO1xuICAgICAgICAgICAgICAgIG1NYXggPSBwYXJzZUludCh0ZXN0Q2FzZVtsXSk7XG4gICAgICAgICAgICAgICAgaW5zaWRlQXJyYXkgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdFtrXSA9PSAnYWEnKSB7XG4gICAgICAgICAgICBpZiAoaW5zaWRlQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBpZiAobSA8IG1NYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluc2lkZUFycmF5QXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuIDwgbk1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RDYXNlU3RyaW5nICs9IHRlc3RDYXNlW2xdICsgJ1xcbic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKytuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNpZGVBcnJheUFycmF5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyttO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVzdENhc2VTdHJpbmcgKz0gdGVzdENhc2VbbF0gKyAnXFxuJztcbiAgICAgICAgICAgICAgICAgICAgICAgIG4gPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgbk1heCA9IHBhcnNlSW50KHRlc3RDYXNlW2xdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc2lkZUFycmF5QXJyYXkgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaW5zaWRlQXJyYXkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgKytrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGVzdENhc2VTdHJpbmcgKz0gdGVzdENhc2VbbF0gKyAnXFxuJztcbiAgICAgICAgICAgICAgICBtID0gMDtcbiAgICAgICAgICAgICAgICBtTWF4ID0gcGFyc2VJbnQodGVzdENhc2VbbF0pO1xuICAgICAgICAgICAgICAgIGluc2lkZUFycmF5ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGVzdENhc2VTdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlU3R1YlN0cmluZyhpbnB1dEZvcm1hdDogc3RyaW5nW10sIG91dHB1dEZvcm1hdDogc3RyaW5nW10sIGZ1bmN0aW9uU2lnbmF0dXJlOiBzdHJpbmcsIG5vcm1hbFN0dWI6IGJvb2xlYW4pIHtcbiAgICBsZXQgc3R1YlN0cmluZyA9ICdcXG5cXG5pbXBvcnQgc3lzXFxuXFxuaWYgX19uYW1lX18gPT0gXCJfX21haW5fX1wiOlxcbic7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dEZvcm1hdC5sZW5ndGg7ICsraSkge1xuICAgICAgICBpZiAoaW5wdXRGb3JtYXRbaV0gPT0gJ24nKSB7XG4gICAgICAgICAgICBzdHViU3RyaW5nICs9ICcgICAgcCcgKyBpLnRvU3RyaW5nKCkgKyAnID0gaW50KGlucHV0KCkpXFxuICAgIHByaW50KFwiR1wiLCBlbmQ9XCJcIiwgZmlsZT1zeXMuc3RkZXJyKVxcbiAgICBwcmludChwJyArIGkudG9TdHJpbmcoKSArICcsIGVuZD1cIlwiLCBmaWxlPXN5cy5zdGRlcnIpXFxuICAgIHByaW50KFwiSFwiLCBlbmQ9XCJcIiwgZmlsZT1zeXMuc3RkZXJyKVxcbic7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5wdXRGb3JtYXRbaV0gPT0gJ2EnKSB7XG4gICAgICAgICAgICBzdHViU3RyaW5nICs9ICcgICAgbicgKyBpLnRvU3RyaW5nKCkgKyAnID0gaW50KGlucHV0KCkpXFxuICAgIHByaW50KFwiR1wiLCBlbmQ9XCJcIiwgZmlsZT1zeXMuc3RkZXJyKVxcbiAgICBwcmludChuJyArIGkudG9TdHJpbmcoKSArICcsIGVuZD1cIlwiLCBmaWxlPXN5cy5zdGRlcnIpXFxuICAgIHByaW50KFwiSFwiLCBlbmQ9XCJcIiwgZmlsZT1zeXMuc3RkZXJyKVxcbiAgICBwJyArIGkudG9TdHJpbmcoKSArICcgPSBbXVxcbiAgICBudW1zID0gW11cXG4gICAgZm9yIGkgaW4gcmFuZ2UobicgKyBpLnRvU3RyaW5nKCkgKyAnKTpcXG4gICAgICAgIGdoID0gaW50KGlucHV0KCkpXFxuICAgICAgICBwcmludChcIkdcIiwgZW5kPVwiXCIsIGZpbGU9c3lzLnN0ZGVycilcXG4gICAgICAgIHByaW50KGdoLCBlbmQ9XCJcIiwgZmlsZT1zeXMuc3RkZXJyKVxcbiAgICAgICAgcHJpbnQoXCJIXCIsIGVuZD1cIlwiLCBmaWxlPXN5cy5zdGRlcnIpXFxuICAgICAgICBudW1zLmFwcGVuZChnaClcXG4nO1xuICAgICAgICB9IGVsc2UgaWYgKGlucHV0Rm9ybWF0W2ldID09ICdhYScpIHtcbiAgICAgICAgICAgIHN0dWJTdHJpbmcgKz0gJyAgICBuJyArIGkudG9TdHJpbmcoKSArICcgPSBpbnQoaW5wdXQoKSlcXG4gICAgcCcgKyBpLnRvU3RyaW5nKCkgKyAnID0gW11cXG4gICAgZm9yIGkgaW4gcmFuZ2UobicgKyBpLnRvU3RyaW5nKCkgKyAnKTpcXG4gICAgICAgIG5uJyArIGkudG9TdHJpbmcoKSArICcgPSBpbnQoaW5wdXQoKSlcXG4gICAgICAgIHBwJyArIGkudG9TdHJpbmcoKSArICcgPSBbXVxcbiAgICAgICAgZm9yIGogaW4gcmFuZ2Uobm4nICsgaS50b1N0cmluZygpICsgJyk6XFxuICAgICAgICAgICAgcHAnICsgaS50b1N0cmluZygpICsgJy5hcHBlbmQoaW50KGlucHV0KCkpKVxcbiAgICAgICAgcCcgKyBpLnRvU3RyaW5nKCkgKyAnLmFwcGVuZChwcCcgKyBpLnRvU3RyaW5nKCkgKyAnKVxcbic7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3R1YlN0cmluZyArPSAnICAgIHJlc3VsdCA9ICcgKyBmdW5jdGlvblNpZ25hdHVyZS5zcGxpdCgnKCcpWzBdLnNwbGl0KCdkZWYgJylbMV0gKyAnKCc7XG4gICAgaWYgKGlucHV0Rm9ybWF0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgc3R1YlN0cmluZyArPSAncDAnO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IGlucHV0Rm9ybWF0Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHN0dWJTdHJpbmcgKz0gJywgcCcgKyBpLnRvU3RyaW5nKClcbiAgICB9XG4gICAgc3R1YlN0cmluZyArPSAnKVxcbic7XG4gICAgaWYgKG5vcm1hbFN0dWIpIHtcbiAgICAgICAgc3R1YlN0cmluZyArPSAnICAgIHByaW50KFwidjEwemc1N1pJVUY2dmpaZ1NQYURZNzBUUWZmOHdUSFhnb2RYMm90ckRNRWF5MFdsUzM2TWpEaEhIMDU0dVJyRnhHSEhTZWd2R2NBN2VhcUJcIilcXG4nXG4gICAgICAgIGlmIChvdXRwdXRGb3JtYXQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKG91dHB1dEZvcm1hdFswXSA9PSAnbicpIHtcbiAgICAgICAgICAgICAgICBzdHViU3RyaW5nICs9ICcgICAgcHJpbnQocmVzdWx0KVxcbic7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG91dHB1dEZvcm1hdFswXSA9PSAnYScpIHtcbiAgICAgICAgICAgICAgICBzdHViU3RyaW5nICs9ICcgICAgcHJpbnQobGVuKHJlc3VsdCkpXFxuICAgIGZvciByIGluIHJlc3VsdDpcXG4gICAgICAgIHByaW50KHIpXFxuJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3V0cHV0Rm9ybWF0WzBdID09ICdhYScpIHtcbiAgICAgICAgICAgICAgICBzdHViU3RyaW5nICs9ICcgICAgcHJpbnQobGVuKHJlc3VsdCkpXFxuICAgIGZvciByIGluIHJlc3VsdDpcXG4gICAgICAgIHByaW50KGxlbihyKSlcXG4gICAgICAgIGZvciByciBpbiByOlxcbiAgICAgICAgICAgIHByaW50KHJyKVxcbic7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN0dWJTdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQ2xlYW5TdHJpbmcob3V0cHV0Rm9ybWF0OiBzdHJpbmdbXSwgbm9ybWFsQ2xlYW46IGJvb2xlYW4pIHtcbiAgICBsZXQgY2xlYW5TdHJpbmcgPSAnaW1wb3J0IHN5c1xcblxcbmlmIF9fbmFtZV9fID09IFwiX19tYWluX19cIjpcXG4nO1xuICAgIGlmIChub3JtYWxDbGVhbikge1xuICAgICAgICBjbGVhblN0cmluZyArPSAnICAgIHdoaWxlIFRydWU6XFxuICAgICAgICB0cnlJbnB1dCA9IGlucHV0KClcXG4gICAgICAgIHByaW50KFwiT0tcIiwgZW5kPVwiXCIsIGZpbGU9c3lzLnN0ZGVycilcXG4gICAgICAgIHByaW50KHRyeUlucHV0LCBlbmQ9XCJcIiwgZmlsZT1zeXMuc3RkZXJyKVxcbiAgICAgICAgcHJpbnQoXCJQTFwiLCBlbmQ9XCJcIiwgZmlsZT1zeXMuc3RkZXJyKVxcbiAgICAgICAgaWYgKHRyeUlucHV0ID09IFwidjEwemc1N1pJVUY2dmpaZ1NQYURZNzBUUWZmOHdUSFhnb2RYMm90ckRNRWF5MFdsUzM2TWpEaEhIMDU0dVJyRnhHSEhTZWd2R2NBN2VhcUJcIik6XFxuICAgICAgICAgICAgYnJlYWtcXG4nO1xuICAgIH1cbiAgICBpZiAob3V0cHV0Rm9ybWF0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKG91dHB1dEZvcm1hdFswXSA9PSAnbicpIHtcbiAgICAgICAgICAgIGNsZWFuU3RyaW5nICs9ICcgICAgcXcgPSBpbnB1dCgpXFxuICAgIHByaW50KFwiUVwiLCBlbmQ9XCJcIiwgZmlsZT1zeXMuc3RkZXJyKVxcbiAgICBwcmludChxdywgZW5kPVwiXCIsIGZpbGU9c3lzLnN0ZGVycilcXG4gICAgcHJpbnQoXCJXXCIsIGVuZD1cIlwiLCBmaWxlPXN5cy5zdGRlcnIpXFxuICAgIHByaW50KHF3KVxcbic7XG4gICAgICAgIH0gZWxzZSBpZiAob3V0cHV0Rm9ybWF0WzBdID09ICdhJykge1xuICAgICAgICAgICAgY2xlYW5TdHJpbmcgKz0gJyAgICBuID0gaW50KGlucHV0KCkpXFxuICAgIHByaW50KFwiUVwiLCBlbmQ9XCJcIiwgZmlsZT1zeXMuc3RkZXJyKVxcbiAgICBwcmludChuLCBlbmQ9XCJcIiwgZmlsZT1zeXMuc3RkZXJyKVxcbiAgICBwcmludChcIldcIiwgZW5kPVwiXCIsIGZpbGU9c3lzLnN0ZGVycilcXG4gICAgbnVtcyA9IFtdXFxuICAgIGZvciBpIGluIHJhbmdlKG4pOlxcbiAgICAgICAgcXcgPSBpbnQoaW5wdXQoKSlcXG4gICAgICAgIHByaW50KFwiUVwiLCBlbmQ9XCJcIiwgZmlsZT1zeXMuc3RkZXJyKVxcbiAgICAgICAgcHJpbnQocXcsIGVuZD1cIlwiLCBmaWxlPXN5cy5zdGRlcnIpXFxuICAgICAgICBwcmludChcIldcIiwgZW5kPVwiXCIsIGZpbGU9c3lzLnN0ZGVycilcXG4gICAgICAgIG51bXMuYXBwZW5kKHF3KVxcbiAgICBudW1zLnNvcnQoKVxcbiAgICBwcmludChuKVxcbiAgICBmb3IgaSBpbiByYW5nZShuKTpcXG4gICAgICAgIHByaW50KG51bXNbaV0pJztcbiAgICAgICAgfSBlbHNlIGlmIChvdXRwdXRGb3JtYXRbMF0gPT0gJ2FhJykge1xuICAgICAgICAgICAgY2xlYW5TdHJpbmcgKz0gJyAgICBuID0gaW50KGlucHV0KCkpXFxuICAgIHByaW50KFwiUVwiLCBlbmQ9XCJcIiwgZmlsZT1zeXMuc3RkZXJyKVxcbiAgICBwcmludChuLCBlbmQ9XCJcIiwgZmlsZT1zeXMuc3RkZXJyKVxcbiAgICBwcmludChcIldcIiwgZW5kPVwiXCIsIGZpbGU9c3lzLnN0ZGVycilcXG4gICAgbm5zID0gW11cXG4gICAgbnVtcyA9IFtdXFxuICAgIGZvciBpIGluIHJhbmdlKG4pOlxcbiAgICAgICAgbm4gPSBpbnQoaW5wdXQoKSlcXG4gICAgICAgIHByaW50KFwiUVwiLCBlbmQ9XCJcIiwgZmlsZT1zeXMuc3RkZXJyKVxcbiAgICAgICAgcHJpbnQobm4sIGVuZD1cIlwiLCBmaWxlPXN5cy5zdGRlcnIpXFxuICAgICAgICBwcmludChcIldcIiwgZW5kPVwiXCIsIGZpbGU9c3lzLnN0ZGVycilcXG4gICAgICAgIG5ucy5hcHBlbmQobm4pXFxuICAgICAgICBubnVtcyA9IFtdXFxuICAgICAgICBmb3IgaiBpbiByYW5nZShubik6XFxuICAgICAgICAgICAgcXcgPSBpbnQoaW5wdXQoKSlcXG4gICAgICAgICAgICBwcmludChcIlFcIiwgZW5kPVwiXCIsIGZpbGU9c3lzLnN0ZGVycilcXG4gICAgICAgICAgICBwcmludChxdywgZW5kPVwiXCIsIGZpbGU9c3lzLnN0ZGVycilcXG4gICAgICAgICAgICBwcmludChcIldcIiwgZW5kPVwiXCIsIGZpbGU9c3lzLnN0ZGVycilcXG4gICAgICAgICAgICBubnVtcy5hcHBlbmQocXcpXFxuICAgICAgICBubnVtcy5zb3J0KClcXG4gICAgICAgIG51bXMuYXBwZW5kKG5udW1zKVxcbiAgICBudW1zLnNvcnQoKVxcbiAgICBwcmludChuKVxcbiAgICBmb3IgaSBpbiByYW5nZShuKTpcXG4gICAgICAgIHByaW50KG5uc1tpXSlcXG4gICAgICAgIGZvciBqIGluIHJhbmdlKG5uc1tpXSk6XFxuICAgICAgICAgICAgcHJpbnQobnVtc1tpXVtqXSlcXG4nO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjbGVhblN0cmluZztcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVNYWtlUmVwb3J0U3RyaW5nKGk6IG51bWJlcikge1xuICAgIC8vcmV0dXJuICcjIS9iaW4vYmFzaFxcblxcbihjYXQgc3R1Yi5weSkgPj4gYW5zd2VyLnB5XFxuKGNhdCBzdHViQ3VzdG9tSW5wdXQucHkpID4+IGFuc3dlckN1c3RvbUlucHV0LnB5XFxuXFxuY29udGFpbmVySUQ9JChkb2NrZXIgcnVuIC1kaXQgcHktc2FuZGJveClcXG5kb2NrZXIgY3AgVGVzdElucHV0cy8gJHtjb250YWluZXJJRH06aG9tZS9UZXN0RW52aXJvbm1lbnQvVGVzdElucHV0cy9cXG5kb2NrZXIgY3AgVGVzdE91dHB1dHMvICR7Y29udGFpbmVySUR9OmhvbWUvVGVzdEVudmlyb25tZW50L1Rlc3RPdXRwdXRzL1xcbmRvY2tlciBjcCBhbnN3ZXIucHkgJHtjb250YWluZXJJRH06aG9tZS9UZXN0RW52aXJvbm1lbnQvYW5zd2VyLnB5XFxuZG9ja2VyIGNwIGN1c3RvbUlucHV0LmluICR7Y29udGFpbmVySUR9OmhvbWUvVGVzdEVudmlyb25tZW50L2N1c3RvbUlucHV0LmluXFxuZG9ja2VyIGNwIGFuc3dlckN1c3RvbUlucHV0LnB5ICR7Y29udGFpbmVySUR9OmhvbWUvVGVzdEVudmlyb25tZW50L2Fuc3dlckN1c3RvbUlucHV0LnB5XFxuZG9ja2VyIGNwIGNsZWFuLnB5ICR7Y29udGFpbmVySUR9OmhvbWUvVGVzdEVudmlyb25tZW50L2NsZWFuLnB5XFxuXFxuZG9ja2VyIGV4ZWMgJHtjb250YWluZXJJRH0gc2ggLWMgXCJjZCBob21lL1Rlc3RFbnZpcm9ubWVudC8gJiYgdGltZW91dCAxMCAuL21ha2VSZXBvcnQuc2hcIlxcblxcbmRvY2tlciBjcCAke2NvbnRhaW5lcklEfTpob21lL1Rlc3RFbnZpcm9ubWVudC9yZXBvcnQudHh0IHJlcG9ydEZyb21QeVNhbmRib3gudHh0XFxuZG9ja2VyIGNwICR7Y29udGFpbmVySUR9OmhvbWUvVGVzdEVudmlyb25tZW50L3N0YW5kYXJkT3V0cHV0LnR4dCBzdGFuZGFyZE91dHB1dEZyb21QeVNhbmRib3gudHh0XFxuZG9ja2VyIGNwICR7Y29udGFpbmVySUR9OmhvbWUvVGVzdEVudmlyb25tZW50L291dHB1dC50eHQgb3V0cHV0RnJvbVB5U2FuZGJveC50eHRcXG5cXG5kb2NrZXIga2lsbCAke2NvbnRhaW5lcklEfVxcblxcbmRvY2tlciBybSAke2NvbnRhaW5lcklEfVxcblxcbic7XG4gICAgcmV0dXJuICcjIS9iaW4vYmFzaFxcblxcbihjYXQgc3R1Yi5weSkgPj4gLi4vYW5zd2VyLnB5XFxuKGNhdCBzdHViQ3VzdG9tSW5wdXQucHkpID4+IC4uL2Fuc3dlckN1c3RvbUlucHV0LnB5XFxuXFxuY29udGFpbmVySUQ9JChkb2NrZXIgcnVuIC1kaXQgcHktc2FuZGJveClcXG5kb2NrZXIgY3AgVGVzdElucHV0cy8gJHtjb250YWluZXJJRH06aG9tZS9UZXN0RW52aXJvbm1lbnQvVGVzdElucHV0cy9cXG5kb2NrZXIgY3AgVGVzdE91dHB1dHMvICR7Y29udGFpbmVySUR9OmhvbWUvVGVzdEVudmlyb25tZW50L1Rlc3RPdXRwdXRzL1xcbmRvY2tlciBjcCAuLi9hbnN3ZXIucHkgJHtjb250YWluZXJJRH06aG9tZS9UZXN0RW52aXJvbm1lbnQvYW5zd2VyLnB5XFxuZG9ja2VyIGNwIC4uL2N1c3RvbUlucHV0LmluICR7Y29udGFpbmVySUR9OmhvbWUvVGVzdEVudmlyb25tZW50L2N1c3RvbUlucHV0LmluXFxuZG9ja2VyIGNwIC4uL2Fuc3dlckN1c3RvbUlucHV0LnB5ICR7Y29udGFpbmVySUR9OmhvbWUvVGVzdEVudmlyb25tZW50L2Fuc3dlckN1c3RvbUlucHV0LnB5XFxuZG9ja2VyIGNwIGNsZWFuLnB5ICR7Y29udGFpbmVySUR9OmhvbWUvVGVzdEVudmlyb25tZW50L2NsZWFuLnB5XFxuZG9ja2VyIGNwIGNsZWFuT3V0cHV0LnB5ICR7Y29udGFpbmVySUR9OmhvbWUvVGVzdEVudmlyb25tZW50L2NsZWFuT3V0cHV0LnB5XFxuXFxuZG9ja2VyIGV4ZWMgJHtjb250YWluZXJJRH0gc2ggLWMgXCJjZCBob21lL1Rlc3RFbnZpcm9ubWVudC8gJiYgdGltZW91dCAxMCAuL21ha2VSZXBvcnQuc2hcIlxcblxcbmRvY2tlciBjcCAke2NvbnRhaW5lcklEfTpob21lL1Rlc3RFbnZpcm9ubWVudC9yZXBvcnQudHh0IHJlcG9ydEZyb21QeVNhbmRib3gudHh0XFxuZG9ja2VyIGNwICR7Y29udGFpbmVySUR9OmhvbWUvVGVzdEVudmlyb25tZW50L3N0YW5kYXJkT3V0cHV0LnR4dCBzdGFuZGFyZE91dHB1dEZyb21QeVNhbmRib3gudHh0XFxuZG9ja2VyIGNwICR7Y29udGFpbmVySUR9OmhvbWUvVGVzdEVudmlyb25tZW50L291dHB1dC50eHQgb3V0cHV0RnJvbVB5U2FuZGJveC50eHRcXG5cXG5kb2NrZXIga2lsbCAke2NvbnRhaW5lcklEfVxcblxcbmRvY2tlciBybSAke2NvbnRhaW5lcklEfVxcblxcbic7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGxvYWRUZXN0Q2FzZXMoKSB7XG4gICAgYXdhaXQgY2xpZW50LmNvbm5lY3QoKTtcbiAgICBjb25zdCBxdWVzdGlvbnNSZXN1bHQgPSBhd2FpdCBjbGllbnQucXVlcnlBcnJheShcInNlbGVjdCBjb3VudCgqKSBmcm9tIHF1ZXN0aW9uc1wiKTtcbiAgICBsZXQgbnVtUXVlc3Rpb25zID0gTnVtYmVyKHF1ZXN0aW9uc1Jlc3VsdC5yb3dzWzBdWzBdIGFzIG51bWJlcik7XG4gICAgYXdhaXQgY2xpZW50LmVuZCgpO1xuICAgIGZvciAobGV0IGk6IG51bWJlciA9IDE7IGkgPD0gbnVtUXVlc3Rpb25zOyArK2kpIHtcbiAgICAgICAgYXdhaXQgY2xpZW50LmNvbm5lY3QoKTtcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRSZXN1bHQgPSBhd2FpdCBjbGllbnQucXVlcnlBcnJheShcInNlbGVjdCBmdW5jdGlvbl9zaWduYXR1cmUsIGlucHV0X291dHB1dF9mb3JtYXQsIHRlc3RfY2FzZXMgZnJvbSBxdWVzdGlvbnMgd2hlcmUgaWQgPSBcIiArIGkudG9TdHJpbmcoKSk7XG4gICAgICAgIGxldCBmdW5jdGlvblNpZ25hdHVyZTogc3RyaW5nID0gc2VsZWN0ZWRSZXN1bHQucm93c1swXVswXSBhcyBzdHJpbmc7XG4gICAgICAgIGxldCBpbnB1dE91dHB1dEZvcm1hdCA9IHNlbGVjdGVkUmVzdWx0LnJvd3NbMF1bMV0gYXMgc3RyaW5nO1xuICAgICAgICBsZXQgdGVzdENhc2VzID0gc2VsZWN0ZWRSZXN1bHQucm93c1swXVsyXSBhcyBzdHJpbmc7XG4gICAgICAgIGF3YWl0IGNsaWVudC5lbmQoKTtcbiAgICAgICAgbGV0IGlucHV0T3V0cHV0Rm9ybWF0cyA9IGlucHV0T3V0cHV0Rm9ybWF0LnNwbGl0KCd8Jyk7XG4gICAgICAgIGxldCBpbnB1dEZvcm1hdDogc3RyaW5nW10gPSBpbnB1dE91dHB1dEZvcm1hdHNbMF0uc3BsaXQoJzsnKTtcbiAgICAgICAgaW5wdXRGb3JtYXQuc2hpZnQoKTtcbiAgICAgICAgbGV0IG91dHB1dEZvcm1hdDogc3RyaW5nW10gPSBpbnB1dE91dHB1dEZvcm1hdHNbMV0uc3BsaXQoJzsnKTtcbiAgICAgICAgb3V0cHV0Rm9ybWF0LnNoaWZ0KCk7XG4gICAgICAgIGxldCBhbGxUZXN0Q2FzZXM6IHN0cmluZ1tdID0gdGVzdENhc2VzLnNwbGl0KCd8Jyk7XG4gICAgICAgIGZvciAobGV0IGo6IG51bWJlciA9IDA7IGogPCBudW1UZXN0Q2FzZXM7ICsraikge1xuICAgICAgICAgICAgYXdhaXQgZW5zdXJlRGlyKFwiLi9zYW5kYm94L1wiICsgaS50b1N0cmluZygpICsgXCIvVGVzdElucHV0cy9cIik7XG4gICAgICAgICAgICBhd2FpdCBlbnN1cmVEaXIoXCIuL3NhbmRib3gvXCIgKyBpLnRvU3RyaW5nKCkgKyBcIi9UZXN0T3V0cHV0cy9cIik7XG4gICAgICAgICAgICBhd2FpdCBEZW5vLndyaXRlVGV4dEZpbGUoXCIuL3NhbmRib3gvXCIgKyBpLnRvU3RyaW5nKCkgKyBcIi9UZXN0SW5wdXRzL3Rlc3RcIiArIChqICsgMSkudG9TdHJpbmcoKSArIFwiLmluXCIsXG4gICAgICAgICAgICAgICAgZ2VuZXJhdGVUZXN0Q2FzZVN0cmluZyhhbGxUZXN0Q2FzZXMsIGlucHV0Rm9ybWF0LCBqKSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHNlY29uZEhhbGZUaHJlc2hvbGQgPSAyICogbnVtVGVzdENhc2VzO1xuICAgICAgICBmb3IgKGxldCBqID0gMTE7IGogPCBzZWNvbmRIYWxmVGhyZXNob2xkOyArK2opIHtcbiAgICAgICAgICAgIGF3YWl0IERlbm8ud3JpdGVUZXh0RmlsZShcIi4vc2FuZGJveC9cIiArIGkudG9TdHJpbmcoKSArIFwiL1Rlc3RPdXRwdXRzL3Rlc3RcIiArIChqIC0gMTApLnRvU3RyaW5nKCkgKyBcIi5vdXRcIixcbiAgICAgICAgICAgICAgICBnZW5lcmF0ZVRlc3RDYXNlU3RyaW5nKGFsbFRlc3RDYXNlcywgb3V0cHV0Rm9ybWF0LCBqKSk7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgRGVuby53cml0ZVRleHRGaWxlKFwiLi9zYW5kYm94L1wiICsgaS50b1N0cmluZygpICsgXCIvc3R1Yi5weVwiLCBnZW5lcmF0ZVN0dWJTdHJpbmcoaW5wdXRGb3JtYXQsIG91dHB1dEZvcm1hdCxcbiAgICAgICAgICAgIGZ1bmN0aW9uU2lnbmF0dXJlLCB0cnVlKSk7XG4gICAgICAgIGF3YWl0IERlbm8ud3JpdGVUZXh0RmlsZShcIi4vc2FuZGJveC9cIiArIGkudG9TdHJpbmcoKSArIFwiL3N0dWJDdXN0b21JbnB1dC5weVwiLCBnZW5lcmF0ZVN0dWJTdHJpbmcoaW5wdXRGb3JtYXQsIG91dHB1dEZvcm1hdCxcbiAgICAgICAgICAgIGZ1bmN0aW9uU2lnbmF0dXJlLCBmYWxzZSkpO1xuICAgICAgICBhd2FpdCBEZW5vLndyaXRlVGV4dEZpbGUoXCIuL3NhbmRib3gvXCIgKyBpLnRvU3RyaW5nKCkgKyBcIi9jbGVhbi5weVwiLCBnZW5lcmF0ZUNsZWFuU3RyaW5nKG91dHB1dEZvcm1hdCwgdHJ1ZSkpO1xuICAgICAgICBhd2FpdCBEZW5vLndyaXRlVGV4dEZpbGUoXCIuL3NhbmRib3gvXCIgKyBpLnRvU3RyaW5nKCkgKyBcIi9jbGVhbk91dHB1dC5weVwiLCBnZW5lcmF0ZUNsZWFuU3RyaW5nKG91dHB1dEZvcm1hdCwgZmFsc2UpKTtcbiAgICAgICAgYXdhaXQgRGVuby53cml0ZVRleHRGaWxlKFwiLi9zYW5kYm94L1wiICsgaS50b1N0cmluZygpICsgXCIvbWFrZVJlcG9ydC5zaFwiLCBnZW5lcmF0ZU1ha2VSZXBvcnRTdHJpbmcoaSkpO1xuICAgICAgICBhd2FpdCBEZW5vLnJ1bih7XG4gICAgICAgICAgICBjbWQ6IFtcImNobW9kXCIsIFwidSt4XCIsIFwibWFrZVJlcG9ydC5zaFwiXSxcbiAgICAgICAgICAgIGN3ZDogXCIuL3NhbmRib3gvXCIgKyBpLnRvU3RyaW5nKClcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5sb2FkVGVzdENhc2VzKCk7XG5cbmZ1bmN0aW9uIGRlbGF5KHRpbWU6IG51bWJlcikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGltZSkpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBzZWxlY3RRdWVzdGlvbnMobWF0Y2htYWtpbmdVc2VyOiBNYXRjaG1ha2luZ1VzZXIpIHtcbiAgICBhd2FpdCBjbGllbnQuY29ubmVjdCgpO1xuICAgIGNvbnN0IHF1ZXN0aW9uc1Jlc3VsdCA9IGF3YWl0IGNsaWVudC5xdWVyeUFycmF5KFwic2VsZWN0IGNvdW50KCopIGZyb20gcXVlc3Rpb25zXCIpO1xuICAgIGxldCBudW1RdWVzdGlvbnMgPSBOdW1iZXIocXVlc3Rpb25zUmVzdWx0LnJvd3NbMF1bMF0gYXMgbnVtYmVyKTtcbiAgICBhd2FpdCBjbGllbnQuZW5kKCk7XG4gICAgbGV0IHF1ZXN0aW9uc1NlbGVjdGVkOiBudW1iZXJbXSA9IFtdO1xuICAgIGxldCByYW5kb21QZXJtdXRhdGlvbjogbnVtYmVyW10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVF1ZXN0aW9uczsgKytpKSB7XG4gICAgICAgIHJhbmRvbVBlcm11dGF0aW9uW2ldID0gaTtcbiAgICB9XG4gICAgLy8gUGFydGlhbCBGaXNoZXItWWF0ZXMgQWxnb3JpdGhtIGZvciByYW5kb20gc2VsZWN0aW9uIG9mIHF1ZXN0aW9uc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtUXVlc3Rpb25zUGVyTWF0Y2g7ICsraSkge1xuICAgICAgICBsZXQgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG51bVF1ZXN0aW9ucyk7XG4gICAgICAgIFtyYW5kb21QZXJtdXRhdGlvbltpXSwgcmFuZG9tUGVybXV0YXRpb25bal1dID0gW3JhbmRvbVBlcm11dGF0aW9uW2pdLCByYW5kb21QZXJtdXRhdGlvbltpXV07XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtUXVlc3Rpb25zUGVyTWF0Y2g7ICsraSkge1xuICAgICAgICBxdWVzdGlvbnNTZWxlY3RlZC5wdXNoKHJhbmRvbVBlcm11dGF0aW9uW2ldICsgMSk7XG4gICAgfVxuICAgIGxldCBxdWVzdGlvbnNJbmZvcm1hdGlvbjogUXVlc3Rpb25JbmZvcm1hdGlvbltdID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBxdWVzdGlvbnNTZWxlY3RlZC5sZW5ndGg7ICsraSkge1xuICAgICAgICBsZXQgaW5wdXRPdXRwdXRGb3JtYXQgPSAnJztcbiAgICAgICAgZm9yICg7Oykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBhd2FpdCBjbGllbnQuY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkUmVzdWx0ID0gYXdhaXQgY2xpZW50LnF1ZXJ5QXJyYXkoXCJzZWxlY3QgaW5wdXRfb3V0cHV0X2Zvcm1hdCBmcm9tIHF1ZXN0aW9ucyB3aGVyZSBpZCA9IFwiXG4gICAgICAgICAgICAgICAgICAgICsgcXVlc3Rpb25zU2VsZWN0ZWRbaV0udG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSUlJcIik7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocXVlc3Rpb25zU2VsZWN0ZWRbaV0udG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJRUVFcIik7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZWN0ZWRSZXN1bHQpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiV1dXXCIpO1xuICAgICAgICAgICAgICAgIGlucHV0T3V0cHV0Rm9ybWF0ID0gc2VsZWN0ZWRSZXN1bHQucm93c1swXVswXSBhcyBzdHJpbmc7XG4gICAgICAgICAgICAgICAgYXdhaXQgY2xpZW50LmVuZCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGlucHV0T3V0cHV0Rm9ybWF0cyA9IGlucHV0T3V0cHV0Rm9ybWF0LnNwbGl0KCd8Jyk7XG4gICAgICAgIGxldCBpbnB1dEZvcm1hdDogc3RyaW5nW10gPSBpbnB1dE91dHB1dEZvcm1hdHNbMF0uc3BsaXQoJzsnKTtcbiAgICAgICAgaW5wdXRGb3JtYXQuc2hpZnQoKTtcbiAgICAgICAgbGV0IG91dHB1dEZvcm1hdDogc3RyaW5nW10gPSBpbnB1dE91dHB1dEZvcm1hdHNbMV0uc3BsaXQoJzsnKTtcbiAgICAgICAgb3V0cHV0Rm9ybWF0LnNoaWZ0KCk7XG4gICAgICAgIGxldCBxdWVzdGlvbkluZm9ybWF0aW9uOiBRdWVzdGlvbkluZm9ybWF0aW9uID0geyBxdWVzdGlvbklkOiBxdWVzdGlvbnNTZWxlY3RlZFtpXSwgaW5wdXRGb3JtYXQ6IGlucHV0Rm9ybWF0LCBvdXRwdXRGb3JtYXQ6IG91dHB1dEZvcm1hdCB9O1xuICAgICAgICBxdWVzdGlvbnNJbmZvcm1hdGlvbi5wdXNoKHF1ZXN0aW9uSW5mb3JtYXRpb24pO1xuICAgIH1cbiAgICBzaWRzUXVlc3Rpb25zW21hdGNobWFraW5nVXNlci5zaWRdID0gcXVlc3Rpb25zSW5mb3JtYXRpb247XG4gICAgc2lkc1F1ZXN0aW9uc1ttYXRjaGVzW21hdGNobWFraW5nVXNlci5zaWRdXSA9IHF1ZXN0aW9uc0luZm9ybWF0aW9uO1xufVxuXG5hc3luYyBmdW5jdGlvbiBhZGRUb1F1ZXVlIChxdWV1ZTogTWF0Y2htYWtpbmdVc2VyW10sIG1hdGNobWFraW5nVXNlcjogTWF0Y2htYWtpbmdVc2VyLCByYW5nZTogbnVtYmVyLCBjb250ZXh0OiBhbnkpIHtcbiAgICBxdWV1ZS5wdXNoKG1hdGNobWFraW5nVXNlcik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7ICsraSkge1xuICAgICAgICBpZiAocXVldWVbaV0uc2lkICE9IG1hdGNobWFraW5nVXNlci5zaWRcbiAgICAgICAgICAgICAgICAmJiBNYXRoLmFicyhtYXRjaG1ha2luZ1VzZXIuZWxvUmF0aW5nIC0gcXVldWVbaV0uZWxvUmF0aW5nKSA8PSByYW5nZSkge1xuICAgICAgICAgICAgbWF0Y2hlc1txdWV1ZVtpXS5zaWRdID0gbWF0Y2htYWtpbmdVc2VyLnNpZDtcbiAgICAgICAgICAgIG1hdGNoZXNbbWF0Y2htYWtpbmdVc2VyLnNpZF0gPSBxdWV1ZVtpXS5zaWQ7XG4gICAgICAgICAgICBzaWRzUHJvZ3Jlc3NbcXVldWVbaV0uc2lkXSA9IDA7XG4gICAgICAgICAgICBzaWRzUHJvZ3Jlc3NbbWF0Y2htYWtpbmdVc2VyLnNpZF0gPSAwO1xuICAgICAgICAgICAgLy9jYW4gY2FsbCBnb1NlcnZlci9yZWdpc3RlclBhaXIgaGVyZVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJhdHRlbXB0aW5nIHJlZ2lzdGVyIHBhaXIgXCIgKyBtYXRjaG1ha2luZ1VzZXIuc2lkICsgXCIsIFwiICsgcXVldWVbaV0uc2lkKVxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcImh0dHA6Ly9sb2NhbGhvc3Q6NTAwMC9yZWdpc3RlclBhaXJcIiwge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICBJZDE6IG1hdGNobWFraW5nVXNlci5zaWQsXG4gICAgICAgICAgICAgICAgICAgIElkMjogcXVldWVbaV0uc2lkLFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgfSk7IC8vVE9ETyAtIENoZWNrIHJlc3BvbnNlIFxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzKTtcbiAgICAgICAgICAgIC8vY2FuIHByb2JhYmx5IGVsaW1pbmF0ZSB0aGlzLCBtYWluIHB1cnBvc2Ugb2YgdGhpcyBhcGlcbiAgICAgICAgICAgIC8vbWV0aG9kIGlzIHRvIG1hdGNoIHVzZXJzIGFuZCByZWdpc3RlciB0aGVtIHdpdGggdGhlIGdvIHNlcnZlclxuICAgICAgICAgICAgY29udGV4dC5yZXNwb25zZS5ib2R5ID0ge1xuICAgICAgICAgICAgICAgIHVzZXJuYW1lOiBzaWRzW21hdGNobWFraW5nVXNlci5zaWRdLFxuICAgICAgICAgICAgICAgIGVsb1JhdGluZzogbWF0Y2htYWtpbmdVc2VyLmVsb1JhdGluZyxcbiAgICAgICAgICAgICAgICBvcHBvbmVudFVzZXJuYW1lOiBzaWRzW3F1ZXVlW2ldLnNpZF0sXG4gICAgICAgICAgICAgICAgb3Bwb25lbnRFbG9SYXRpbmc6IHF1ZXVlW2ldLmVsb1JhdGluZyxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBxdWV1ZS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBxdWV1ZS5wb3AoKTtcbiAgICAgICAgICAgIHNlbGVjdFF1ZXN0aW9ucyhtYXRjaG1ha2luZ1VzZXIpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjaGVja0lmRm91bmRJblF1ZXVlKGRlbGF5VGltZTogbnVtYmVyLCBtYXRjaG1ha2luZ1VzZXI6IE1hdGNobWFraW5nVXNlciwgdXNlcm5hbWU6IHN0cmluZywgY29udGV4dDogYW55KSB7XG4gICAgYXdhaXQgZGVsYXkoZGVsYXlUaW1lKTtcbiAgICBpZiAobWF0Y2htYWtpbmdVc2VyLnNpZCBpbiBtYXRjaGVzKSB7XG4gICAgICAgIGxldCBvcHBvbmVudFVzZXJuYW1lID0gc2lkc1ttYXRjaGVzW21hdGNobWFraW5nVXNlci5zaWRdXTtcbiAgICAgICAgYXdhaXQgY2xpZW50LmNvbm5lY3QoKTtcbiAgICAgICAgY29uc3QgdXNlcm5hbWVSZXN1bHQgPSBhd2FpdCBjbGllbnQucXVlcnlBcnJheShcInNlbGVjdCBlbG9fcmF0aW5nIGZyb20gdXNlcnMgd2hlcmUgdXNlcm5hbWU9J1wiXG4gICAgICAgICAgICArIHVzZXJuYW1lICsgXCInXCIpO1xuICAgICAgICBsZXQgb3Bwb25lbnRFbG9SYXRpbmcgPSB1c2VybmFtZVJlc3VsdC5yb3dzWzBdWzBdIGFzIG51bWJlcjtcbiAgICAgICAgYXdhaXQgY2xpZW50LmVuZCgpO1xuICAgICAgICBjb250ZXh0LnJlc3BvbnNlLmJvZHkgPSB7XG4gICAgICAgICAgICB1c2VybmFtZTogc2lkc1ttYXRjaG1ha2luZ1VzZXIuc2lkXSxcbiAgICAgICAgICAgIGVsb1JhdGluZzogbWF0Y2htYWtpbmdVc2VyLmVsb1JhdGluZyxcbiAgICAgICAgICAgIG9wcG9uZW50VXNlcm5hbWU6IG9wcG9uZW50VXNlcm5hbWUsXG4gICAgICAgICAgICBvcHBvbmVudEVsb1JhdGluZzogb3Bwb25lbnRFbG9SYXRpbmcsXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUZyb21RdWV1ZShxdWV1ZTogTWF0Y2htYWtpbmdVc2VyW10sIHNpZDogc3RyaW5nKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7ICsraSkge1xuICAgICAgICBpZiAocXVldWVbaV0uc2lkID09PSBzaWQpIHtcbiAgICAgICAgICAgIHF1ZXVlLnNwbGljZShpLCAxKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY29uc3QgcG9ydDogbnVtYmVyID0gK2Vudi5MSUNPREVfUE9SVCB8fCAzMDAwO1xuYXBwLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCAoZXZ0KSA9PiB7XG4gICAgY29uc29sZS5sb2coZXZ0LmVycm9yKTtcbn0pO1xucm91dGVyXG4gICAgLmdldChcIi9hcGkvaGVsbG8td29ybGRcIiwgKGNvbnRleHQpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnRleHQucmVzcG9uc2UuYm9keSA9IGhlbGxvV29ybGRWYXI7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgfVxuICAgIH0pXG4gICAgLnBvc3QoXCIvYXBpL3Bvc3QtaGVsbG8td29ybGRcIiwgYXN5bmMgKGNvbnRleHQ6IFJvdXRlckNvbnRleHQ8YW55PikgPT4ge1xuICAgICAgICBpZiAoIWNvbnRleHQucmVxdWVzdC5oYXNCb2R5KSB7XG4gICAgICAgICAgICBjb250ZXh0LnRocm93KFN0YXR1cy5CYWRSZXF1ZXN0LCBcIkJhZCBSZXF1ZXN0XCIpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGJvZHkgPSBjb250ZXh0LnJlcXVlc3QuYm9keSgpO1xuICAgICAgICBsZXQgaGVsbG9Xb3JsZDogUGFydGlhbDxIZWxsb1dvcmxkPiB8IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKGJvZHkudHlwZSA9PT0gXCJqc29uXCIpIHtcbiAgICAgICAgICAgIGhlbGxvV29ybGQgPSBhd2FpdCBib2R5LnZhbHVlO1xuICAgICAgICB9IGVsc2UgaWYgKGJvZHkudHlwZSA9PT0gXCJmb3JtXCIpIHtcbiAgICAgICAgICAgIGhlbGxvV29ybGQgPSB7fTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIGF3YWl0IGJvZHkudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBoZWxsb1dvcmxkW2tleSBhcyBrZXlvZiBIZWxsb1dvcmxkXSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGJvZHkudHlwZSA9PT0gXCJmb3JtLWRhdGFcIikge1xuICAgICAgICAgICAgY29uc3QgZm9ybURhdGEgPSBhd2FpdCBib2R5LnZhbHVlLnJlYWQoKTtcbiAgICAgICAgICAgIGhlbGxvV29ybGQgPSBmb3JtRGF0YS5maWVsZHM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhlbGxvV29ybGQpIHtcbiAgICAgICAgICAgIGNvbnRleHQuYXNzZXJ0KHR5cGVvZiBoZWxsb1dvcmxkLnRleHQgPT09IFwic3RyaW5nXCIsIFN0YXR1cy5CYWRSZXF1ZXN0KTtcbiAgICAgICAgICAgIGhlbGxvV29ybGRWYXIgPSBoZWxsb1dvcmxkIGFzIEhlbGxvV29ybGQ7XG4gICAgICAgICAgICBjb250ZXh0LnJlc3BvbnNlLnN0YXR1cyA9IFN0YXR1cy5PSztcbiAgICAgICAgICAgIGNvbnRleHQucmVzcG9uc2UuYm9keSA9IGhlbGxvV29ybGQ7XG4gICAgICAgICAgICBjb250ZXh0LnJlc3BvbnNlLnR5cGUgPSBcImpzb25cIjtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb250ZXh0LnRocm93KFN0YXR1cy5CYWRSZXF1ZXN0LCBcIkJhZCBSZXF1ZXN0XCIpO1xuICAgIH0pXG4gICAgLnBvc3QoXCIvYXBpL3JlZ2lzdGVyXCIsIGFzeW5jIChjb250ZXh0OiBSb3V0ZXJDb250ZXh0PGFueT4pID0+IHtcbiAgICAgICAgbGV0IHNpZCA9IGF3YWl0IGNvbnRleHQuY29va2llcy5nZXQoJ3NpZCcpO1xuICAgICAgICBpZiAoIXNpZCkge1xuICAgICAgICAgICAgc2lkID0gYXdhaXQgbmFub2lkKDQwKTtcbiAgICAgICAgICAgIGNvbnRleHQuY29va2llcy5zZXQoJ3NpZCcsIHNpZCk7XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICghY29udGV4dC5yZXF1ZXN0Lmhhc0JvZHkpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0LnRocm93KFN0YXR1cy5CYWRSZXF1ZXN0LCBcIkJhZCBSZXF1ZXN0XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgYm9keSA9IGNvbnRleHQucmVxdWVzdC5ib2R5KCk7XG4gICAgICAgICAgICBsZXQgdXNlcjogUGFydGlhbDxVc2VyPiB8IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGlmIChib2R5LnR5cGUgPT09IFwianNvblwiKSB7XG4gICAgICAgICAgICAgICAgdXNlciA9IGF3YWl0IGJvZHkudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgICAgICAgIGNvbnRleHQuYXNzZXJ0KFxuICAgICAgICAgICAgICAgICAgICB0eXBlb2YgdXNlcj8uZW1haWw/LnZhbHVlID09PSBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgICAgICYmIHR5cGVvZiB1c2VyPy51c2VybmFtZT8udmFsdWUgPT09IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgJiYgdHlwZW9mIHVzZXI/LnBhc3N3b3JkPy52YWx1ZSA9PT0gXCJzdHJpbmdcIiwgU3RhdHVzLkJhZFJlcXVlc3QpO1xuICAgICAgICAgICAgICAgIGNvbnRleHQucmVzcG9uc2Uuc3RhdHVzID0gU3RhdHVzLk9LO1xuICAgICAgICAgICAgICAgIGF3YWl0IGNsaWVudC5jb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdXNlcm5hbWVSZXN1bHQgPSBhd2FpdCBjbGllbnQucXVlcnlBcnJheShcInNlbGVjdCB1c2VybmFtZSBmcm9tIHVzZXJzIHdoZXJlIHVzZXJuYW1lPSdcIlxuICAgICAgICAgICAgICAgICAgICArIHVzZXI/LnVzZXJuYW1lPy52YWx1ZSArIFwiJ1wiKTtcbiAgICAgICAgICAgICAgICBpZiAodXNlcm5hbWVSZXN1bHQucm93cy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVtYWlsUmVzdWx0ID0gYXdhaXQgY2xpZW50LnF1ZXJ5QXJyYXkoXCJzZWxlY3QgZW1haWwgZnJvbSB1c2VycyB3aGVyZSBlbWFpbD0nXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgdXNlcj8uZW1haWw/LnZhbHVlICsgXCInXCIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZW1haWxSZXN1bHQucm93cy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2FsdEhleFN0cmluZyA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzMjsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2FsdEhleFN0cmluZyArPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBNYXRoLnBvdygyLCAzMikpLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzYWx0SGV4U3RyaW5nTGVuZ3RoID0gc2FsdEhleFN0cmluZy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDI1NiAtIHNhbHRIZXhTdHJpbmdMZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhbHRIZXhTdHJpbmcgPSBcIjBcIiArIHNhbHRIZXhTdHJpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGV4dEVuY29kZXIgPSBuZXcgVGV4dEVuY29kZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBoYXNoZWRQYXNzd29yZFVpbnQ4QXJyYXkgPSBuZXcgVWludDhBcnJheShhd2FpdCBjcnlwdG8uc3VidGxlLmRpZ2VzdCgnU0hBMy01MTInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRFbmNvZGVyLmVuY29kZSh1c2VyPy5wYXNzd29yZD8udmFsdWUgKyBzYWx0SGV4U3RyaW5nKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGhhc2hlZFBhc3N3b3JkSGV4U3RyaW5nID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhhc2hlZFBhc3N3b3JkVWludDhBcnJheS5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc2hlZFBhc3N3b3JkSGV4U3RyaW5nICs9IChoYXNoZWRQYXNzd29yZFVpbnQ4QXJyYXlbaV0gPCAxNiA/IFwiMFwiIDogXCJcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBoYXNoZWRQYXNzd29yZFVpbnQ4QXJyYXlbaV0udG9TdHJpbmcoMTYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGhhc2hlZFBhc3N3b3JkSGV4U3RyaW5nTGVuZ3RoID0gaGFzaGVkUGFzc3dvcmRIZXhTdHJpbmcubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMjggLSBoYXNoZWRQYXNzd29yZEhleFN0cmluZ0xlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzaGVkUGFzc3dvcmRIZXhTdHJpbmcgPSBcIjBcIiArIGhhc2hlZFBhc3N3b3JkSGV4U3RyaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgY2xpZW50LnF1ZXJ5QXJyYXkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpbnNlcnQgaW50byBwdWJsaWMudXNlcnMoZW1haWwsIHVzZXJuYW1lLCBoYXNoZWRfcGFzc3dvcmQsIHNhbHQsIG51bV93aW5zLCBudW1fbG9zc2VzLCBjcmVhdGVkX2F0LCB1cGRhdGVkX2F0LCBlbG9fcmF0aW5nLCBoYXNfMjQwMF9yYXRpbmdfaGlzdG9yeSlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCIgdmFsdWVzICgnXCIgKyB1c2VyPy5lbWFpbD8udmFsdWUgKyBcIicsICdcIiArIHVzZXI/LnVzZXJuYW1lPy52YWx1ZSArIFwiJywgJ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBcIlxcXFx4XCIgKyBoYXNoZWRQYXNzd29yZEhleFN0cmluZyArIFwiJywgJ1wiICsgXCJcXFxceFwiICsgc2FsdEhleFN0cmluZyArIFwiJywgJzAnLCAnMCcsIG5vdygpLCBub3coKSwgJzEwMDAnLCAnZmFsc2UnKVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzaWQgPSBhd2FpdCBuYW5vaWQoNDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2lkc1tzaWRdID0gdXNlci51c2VybmFtZS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGNvbnRleHQuY29va2llcy5zZXQoJ3NpZCcsIHNpZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnJlc3BvbnNlLmJvZHkgPSB1c2VyO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5yZXNwb25zZS5ib2R5ID0geyB0ZXh0OiAnR2l2ZW4gRW1haWwgQWxyZWFkeSBFeGlzdHMnIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnJlc3BvbnNlLmJvZHkgPSB7IHRleHQ6ICdHaXZlbiBVc2VybmFtZSBBbHJlYWR5IEV4aXN0cycgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYXdhaXQgY2xpZW50LmVuZCgpO1xuICAgICAgICAgICAgICAgIGNvbnRleHQucmVzcG9uc2UudHlwZSA9IFwianNvblwiO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnRleHQudGhyb3coU3RhdHVzLkJhZFJlcXVlc3QsIFwiQmFkIFJlcXVlc3RcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgfVxuICAgIH0pXG4gICAgLnBvc3QoXCIvYXBpL2xvZ2luXCIsIGFzeW5jIChjb250ZXh0OiBSb3V0ZXJDb250ZXh0PGFueT4pID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICghY29udGV4dC5yZXF1ZXN0Lmhhc0JvZHkpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0LnRocm93KFN0YXR1cy5CYWRSZXF1ZXN0LCBcIkJhZCBSZXF1ZXN0XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgYm9keSA9IGNvbnRleHQucmVxdWVzdC5ib2R5KCk7XG4gICAgICAgICAgICBsZXQgdXNlcjogUGFydGlhbDxVc2VyPiB8IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGlmIChib2R5LnR5cGUgPT09IFwianNvblwiKSB7XG4gICAgICAgICAgICAgICAgdXNlciA9IGF3YWl0IGJvZHkudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgICAgICAgIGNvbnRleHQuYXNzZXJ0KFxuICAgICAgICAgICAgICAgICAgICB0eXBlb2YgdXNlcj8uZW1haWw/LnZhbHVlID09PSBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgICAgICYmIHR5cGVvZiB1c2VyPy5wYXNzd29yZD8udmFsdWUgPT09IFwic3RyaW5nXCIsIFN0YXR1cy5CYWRSZXF1ZXN0KTtcbiAgICAgICAgICAgICAgICBjb250ZXh0LnJlc3BvbnNlLnN0YXR1cyA9IFN0YXR1cy5PSztcbiAgICAgICAgICAgICAgICBhd2FpdCBjbGllbnQuY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHVzZXJuYW1lUmVzdWx0ID0gYXdhaXQgY2xpZW50LnF1ZXJ5QXJyYXkoXCJzZWxlY3QgZW1haWwsIHVzZXJuYW1lLCBoYXNoZWRfcGFzc3dvcmQsIHNhbHQgZnJvbSB1c2VycyB3aGVyZSB1c2VybmFtZT0nXCJcbiAgICAgICAgICAgICAgICAgICAgKyB1c2VyPy5lbWFpbD8udmFsdWUgKyBcIidcIik7XG4gICAgICAgICAgICAgICAgaWYgKHVzZXJuYW1lUmVzdWx0LnJvd3MubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbWFpbFJlc3VsdCA9IGF3YWl0IGNsaWVudC5xdWVyeUFycmF5KFwic2VsZWN0IGVtYWlsLCB1c2VybmFtZSwgaGFzaGVkX3Bhc3N3b3JkLCBzYWx0IGZyb20gdXNlcnMgd2hlcmUgZW1haWw9J1wiXG4gICAgICAgICAgICAgICAgICAgICAgICArIHVzZXI/LmVtYWlsPy52YWx1ZSArIFwiJ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVtYWlsUmVzdWx0LnJvd3MubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5yZXNwb25zZS5ib2R5ID0geyB0ZXh0OiAnR2l2ZW4gRW1haWwgb3IgVXNlcm5hbWUgRG9lcyBOb3QgRXhpc3QnIH07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2FsdEhleFN0cmluZyA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAoZW1haWxSZXN1bHQucm93c1swXVszXSBhcyBVaW50OEFycmF5KS5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhbHRIZXhTdHJpbmcgKz0gKChlbWFpbFJlc3VsdC5yb3dzWzBdWzNdIGFzIFVpbnQ4QXJyYXkpW2ldIDwgMTYgPyBcIjBcIiA6IFwiXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgKGVtYWlsUmVzdWx0LnJvd3NbMF1bM10gYXMgVWludDhBcnJheSlbaV0udG9TdHJpbmcoMTYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRleHRFbmNvZGVyID0gbmV3IFRleHRFbmNvZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaGFzaGVkUGFzc3dvcmRVaW50OEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYXdhaXQgY3J5cHRvLnN1YnRsZS5kaWdlc3QoJ1NIQTMtNTEyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0RW5jb2Rlci5lbmNvZGUodXNlcj8ucGFzc3dvcmQ/LnZhbHVlICsgc2FsdEhleFN0cmluZykpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBoYXNoZWRQYXNzd29yZEhleFN0cmluZyA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoYXNoZWRQYXNzd29yZFVpbnQ4QXJyYXkubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYXNoZWRQYXNzd29yZEhleFN0cmluZyArPSAoaGFzaGVkUGFzc3dvcmRVaW50OEFycmF5W2ldIDwgMTYgPyBcIjBcIiA6IFwiXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgaGFzaGVkUGFzc3dvcmRVaW50OEFycmF5W2ldLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzZXJ2ZXJIYXNoZWRQYXNzd29yZEhleFN0cmluZyA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAoZW1haWxSZXN1bHQucm93c1swXVsyXSBhcyBVaW50OEFycmF5KS5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZlckhhc2hlZFBhc3N3b3JkSGV4U3RyaW5nICs9ICgoZW1haWxSZXN1bHQucm93c1swXVsyXSBhcyBVaW50OEFycmF5KVtpXSA8IDE2ID8gXCIwXCIgOiBcIlwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIChlbWFpbFJlc3VsdC5yb3dzWzBdWzJdIGFzIFVpbnQ4QXJyYXkpW2ldLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNoZWRQYXNzd29yZEhleFN0cmluZyA9PT0gc2VydmVySGFzaGVkUGFzc3dvcmRIZXhTdHJpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZm91bmRVc2VyOiBVc2VyID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogeyB2YWx1ZTogZW1haWxSZXN1bHQucm93c1swXVswXSBhcyBzdHJpbmcgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU6IHsgdmFsdWU6IGVtYWlsUmVzdWx0LnJvd3NbMF1bMV0gYXMgc3RyaW5nIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkOiB7IHZhbHVlOiAnJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2lkID0gYXdhaXQgbmFub2lkKDQwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaWRzW3NpZF0gPSBmb3VuZFVzZXIudXNlcm5hbWUudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgY29udGV4dC5jb29raWVzLnNldCgnc2lkJywgc2lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnJlc3BvbnNlLmJvZHkgPSBmb3VuZFVzZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQucmVzcG9uc2UuYm9keSA9IHsgdGV4dDogJ1dyb25nIFBhc3N3b3JkJyB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNhbHRIZXhTdHJpbmcgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAodXNlcm5hbWVSZXN1bHQucm93c1swXVszXSBhcyBVaW50OEFycmF5KS5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2FsdEhleFN0cmluZyArPSAoKHVzZXJuYW1lUmVzdWx0LnJvd3NbMF1bM10gYXMgVWludDhBcnJheSlbaV0gPCAxNiA/IFwiMFwiIDogXCJcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArICh1c2VybmFtZVJlc3VsdC5yb3dzWzBdWzNdIGFzIFVpbnQ4QXJyYXkpW2ldLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgdGV4dEVuY29kZXIgPSBuZXcgVGV4dEVuY29kZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGhhc2hlZFBhc3N3b3JkVWludDhBcnJheSA9IG5ldyBVaW50OEFycmF5KGF3YWl0IGNyeXB0by5zdWJ0bGUuZGlnZXN0KCdTSEEzLTUxMicsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0RW5jb2Rlci5lbmNvZGUodXNlcj8ucGFzc3dvcmQ/LnZhbHVlICsgc2FsdEhleFN0cmluZykpKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGhhc2hlZFBhc3N3b3JkSGV4U3RyaW5nID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGFzaGVkUGFzc3dvcmRVaW50OEFycmF5Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNoZWRQYXNzd29yZEhleFN0cmluZyArPSAoaGFzaGVkUGFzc3dvcmRVaW50OEFycmF5W2ldIDwgMTYgPyBcIjBcIiA6IFwiXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBoYXNoZWRQYXNzd29yZFVpbnQ4QXJyYXlbaV0udG9TdHJpbmcoMTYpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxldCBzZXJ2ZXJIYXNoZWRQYXNzd29yZEhleFN0cmluZyA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8ICh1c2VybmFtZVJlc3VsdC5yb3dzWzBdWzJdIGFzIFVpbnQ4QXJyYXkpLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXJIYXNoZWRQYXNzd29yZEhleFN0cmluZyArPSAoKHVzZXJuYW1lUmVzdWx0LnJvd3NbMF1bMl0gYXMgVWludDhBcnJheSlbaV0gPCAxNiA/IFwiMFwiIDogXCJcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArICh1c2VybmFtZVJlc3VsdC5yb3dzWzBdWzJdIGFzIFVpbnQ4QXJyYXkpW2ldLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoaGFzaGVkUGFzc3dvcmRIZXhTdHJpbmcgPT09IHNlcnZlckhhc2hlZFBhc3N3b3JkSGV4U3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZm91bmRVc2VyOiBVc2VyID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiB7IHZhbHVlOiB1c2VybmFtZVJlc3VsdC5yb3dzWzBdWzBdIGFzIHN0cmluZyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lOiB7IHZhbHVlOiB1c2VybmFtZVJlc3VsdC5yb3dzWzBdWzFdIGFzIHN0cmluZyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkOiB7IHZhbHVlOiAnJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNpZCA9IGF3YWl0IG5hbm9pZCg0MCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaWRzW3NpZF0gPSBmb3VuZFVzZXIudXNlcm5hbWUudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBjb250ZXh0LmNvb2tpZXMuc2V0KCdzaWQnLCBzaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5yZXNwb25zZS5ib2R5ID0gZm91bmRVc2VyO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5yZXNwb25zZS5ib2R5ID0geyB0ZXh0OiAnV3JvbmcgUGFzc3dvcmQnIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYXdhaXQgY2xpZW50LmVuZCgpO1xuICAgICAgICAgICAgICAgIGNvbnRleHQucmVzcG9uc2UudHlwZSA9IFwianNvblwiO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnRleHQudGhyb3coU3RhdHVzLkJhZFJlcXVlc3QsIFwiQmFkIFJlcXVlc3RcIik7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgfVxuICAgIH0pXG4gICAgLmdldChcIi9hcGkvdXNlclwiLCBhc3luYyAoY29udGV4dCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHNpZCA9IGF3YWl0IGNvbnRleHQuY29va2llcy5nZXQoJ3NpZCcpO1xuICAgICAgICAgICAgaWYgKHNpZCAmJiB0eXBlb2Ygc2lkID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGxldCB1c2VybmFtZSA9IHNpZHNbc2lkIGFzIHN0cmluZ107XG4gICAgICAgICAgICAgICAgaWYgKHVzZXJuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGNsaWVudC5jb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVzZXJuYW1lUmVzdWx0ID0gYXdhaXQgY2xpZW50LnF1ZXJ5QXJyYXkoXCJzZWxlY3QgZW1haWwsIHVzZXJuYW1lLCBudW1fd2lucywgbnVtX2xvc3NlcywgZWxvX3JhdGluZyBmcm9tIHVzZXJzIHdoZXJlIHVzZXJuYW1lPSdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgKyB1c2VybmFtZSArIFwiJ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZvdW5kVXNlcjogVXNlciA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiB7IHZhbHVlOiB1c2VybmFtZVJlc3VsdC5yb3dzWzBdWzBdIGFzIHN0cmluZyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU6IHsgdmFsdWU6IHVzZXJuYW1lUmVzdWx0LnJvd3NbMF1bMV0gYXMgc3RyaW5nIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogeyB2YWx1ZTogJycgfSxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnJlc3BvbnNlLmJvZHkgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyOiBmb3VuZFVzZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBudW1XaW5zOiB1c2VybmFtZVJlc3VsdC5yb3dzWzBdWzJdIGFzIG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bUxvc3NlczogdXNlcm5hbWVSZXN1bHQucm93c1swXVszXSBhcyBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbG9SYXRpbmc6IHVzZXJuYW1lUmVzdWx0LnJvd3NbMF1bNF0gYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBjbGllbnQuZW5kKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgIH1cbiAgICB9KVxuICAgIC5nZXQoXCIvYXBpL29wcG9uZW50XCIsIGFzeW5jIChjb250ZXh0KSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2lkID0gYXdhaXQgY29udGV4dC5jb29raWVzLmdldCgnc2lkJyk7XG4gICAgICAgICAgICBpZiAoc2lkICYmIHR5cGVvZiBzaWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgbGV0IHVzZXJuYW1lID0gc2lkc1tzaWQgYXMgc3RyaW5nXTtcbiAgICAgICAgICAgICAgICBsZXQgb3Bwb25lbnRVc2VybmFtZSA9IHNpZHNbbWF0Y2hlc1tzaWQgYXMgc3RyaW5nXSBhcyBzdHJpbmddO1xuICAgICAgICAgICAgICAgIGlmICh1c2VybmFtZSAmJiBvcHBvbmVudFVzZXJuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGNsaWVudC5jb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVzZXJuYW1lUmVzdWx0ID0gYXdhaXQgY2xpZW50LnF1ZXJ5QXJyYXkoXCJzZWxlY3QgZWxvX3JhdGluZyBmcm9tIHVzZXJzIHdoZXJlIHVzZXJuYW1lPSdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgKyB1c2VybmFtZSArIFwiJ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3Bwb25lbnRVc2VybmFtZVJlc3VsdCA9IGF3YWl0IGNsaWVudC5xdWVyeUFycmF5KFwic2VsZWN0IGVsb19yYXRpbmcgZnJvbSB1c2VycyB3aGVyZSB1c2VybmFtZT0nXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgb3Bwb25lbnRVc2VybmFtZSArIFwiJ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2VCb2R5IDogTWF0Y2htYWtpbmdEYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgeW91OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsb1JhdGluZzogdXNlcm5hbWVSZXN1bHQucm93c1swXVswXSBhcyBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2lkOiBzaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgb3Bwb25lbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VybmFtZTogb3Bwb25lbnRVc2VybmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbG9SYXRpbmc6IG9wcG9uZW50VXNlcm5hbWVSZXN1bHQucm93c1swXVswXSBhcyBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2lkOiAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5yZXNwb25zZS5ib2R5ID0gcmVzcG9uc2VCb2R5O1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBjbGllbnQuZW5kKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgIH1cbiAgICB9KVxuICAgIC5nZXQoXCIvYXBpL3F1ZXN0aW9uXCIsIGFzeW5jIChjb250ZXh0KSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2lkID0gYXdhaXQgY29udGV4dC5jb29raWVzLmdldCgnc2lkJyk7XG4gICAgICAgICAgICBpZiAoc2lkICYmIHR5cGVvZiBzaWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgY2xpZW50LmNvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBxdWVzdGlvblJlc3VsdCA9IGF3YWl0IGNsaWVudC5xdWVyeUFycmF5KFwic2VsZWN0IHF1ZXN0aW9uLCBmdW5jdGlvbl9zaWduYXR1cmUsIGRlZmF1bHRfY3VzdG9tX2lucHV0IGZyb20gcXVlc3Rpb25zIHdoZXJlIGlkID0gXCJcbiAgICAgICAgICAgICAgICAgICAgKyBzaWRzUXVlc3Rpb25zW3NpZF1bc2lkc1Byb2dyZXNzW3NpZF1dLnF1ZXN0aW9uSWQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVVVVcIik7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coc2lkc1F1ZXN0aW9uc1tzaWRdW3NpZHNQcm9ncmVzc1tzaWRdXS5xdWVzdGlvbklkLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSUlJXCIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlQm9keSA6IFF1ZXN0aW9uRGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb246IHF1ZXN0aW9uUmVzdWx0LnJvd3NbMF1bMF0gYXMgc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbl9zaWduYXR1cmU6IHF1ZXN0aW9uUmVzdWx0LnJvd3NbMF1bMV0gYXMgc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0X2N1c3RvbV9pbnB1dDogcXVlc3Rpb25SZXN1bHQucm93c1swXVsyXSBhcyBzdHJpbmcsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBjb250ZXh0LnJlc3BvbnNlLmJvZHkgPSByZXNwb25zZUJvZHk7XG4gICAgICAgICAgICAgICAgYXdhaXQgY2xpZW50LmVuZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgIH1cbiAgICB9KVxuICAgIC5nZXQoXCIvYXBpL21hdGNobWFraW5nXCIsIGFzeW5jIChjb250ZXh0KSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2lkID0gYXdhaXQgY29udGV4dC5jb29raWVzLmdldCgnc2lkJyk7XG4gICAgICAgICAgICBpZiAoc2lkICYmIHR5cGVvZiBzaWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgbGV0IHVzZXJuYW1lID0gc2lkc1tzaWQgYXMgc3RyaW5nXTtcbiAgICAgICAgICAgICAgICBpZiAodXNlcm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgY2xpZW50LmNvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdXNlcm5hbWVSZXN1bHQgPSBhd2FpdCBjbGllbnQucXVlcnlBcnJheShcInNlbGVjdCBlbG9fcmF0aW5nIGZyb20gdXNlcnMgd2hlcmUgdXNlcm5hbWU9J1wiXG4gICAgICAgICAgICAgICAgICAgICAgICArIHVzZXJuYW1lICsgXCInXCIpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgbWF0Y2htYWtpbmdVc2VyOiBNYXRjaG1ha2luZ1VzZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbG9SYXRpbmc6IHVzZXJuYW1lUmVzdWx0LnJvd3NbMF1bMF0gYXMgbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2lkOiBzaWQsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgY2xpZW50LmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcXVldWVzOiBNYXRjaG1ha2luZ1VzZXJbXVtdID0gW21hdGNobWFraW5nUXVldWUyNSwgbWF0Y2htYWtpbmdRdWV1ZTUwLCBtYXRjaG1ha2luZ1F1ZXVlMTAwLCBtYXRjaG1ha2luZ1F1ZXVlMjAwXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJhbmdlczogbnVtYmVyW10gPSBbMjUsIDUwLCAxMDAsIDIwMF07XG4gICAgICAgICAgICAgICAgICAgIGxldCBkZWxheVRpbWVzTnVtczogbnVtYmVyW10gPSBbMSwgNSwgMTAsIDYwXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZvdW5kTWF0Y2g6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBxdWV1ZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmb3VuZE1hdGNoID0gYXdhaXQgYWRkVG9RdWV1ZShxdWV1ZXNbaV0sIG1hdGNobWFraW5nVXNlciwgcmFuZ2VzW2ldLCBjb250ZXh0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGRlbGF5VGltZXNOdW1zW2ldOyArK2opIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvdW5kTWF0Y2ggPSBhd2FpdCBjaGVja0lmRm91bmRJblF1ZXVlKDEwMDAsIG1hdGNobWFraW5nVXNlciwgdXNlcm5hbWUsIGNvbnRleHQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZm91bmRNYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlRnJvbVF1ZXVlKHF1ZXVlc1tpXSwgc2lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIWZvdW5kTWF0Y2ggJiYgIWFkZFRvUXVldWUobWF0Y2htYWtpbmdRdWV1ZTUwMCwgbWF0Y2htYWtpbmdVc2VyLCA1MDAsIGNvbnRleHQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoIShhd2FpdCBjaGVja0lmRm91bmRJblF1ZXVlKDEwMDAsIG1hdGNobWFraW5nVXNlciwgdXNlcm5hbWUsIGNvbnRleHQpKSkgeyB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgfVxuICAgIH0pXG4gICAgLmdldChcIi9hcGkvbG9nb3V0XCIsIGFzeW5jIChjb250ZXh0KSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2lkID0gYXdhaXQgY29udGV4dC5jb29raWVzLmdldCgnc2lkJyk7XG4gICAgICAgICAgICBpZiAoc2lkICYmIHR5cGVvZiBzaWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHNpZHNbc2lkIGFzIHN0cmluZ107XG4gICAgICAgICAgICAgICAgY29udGV4dC5yZXNwb25zZS5ib2R5ID0geyB0ZXh0OiAnU3VjY2Vzc2Z1bGx5IExvZ2dlZCBPdXQnIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgfVxuICAgIH0pXG4gICAgLnBvc3QoXCIvYXBpL3J1blwiLCBhc3luYyAoY29udGV4dDogUm91dGVyQ29udGV4dDxhbnk+KSA9PiB7XG4gICAgICAgIC8vIGNvbnRleHQucmVzcG9uc2Uuc3RhdHVzID0gU3RhdHVzLk9LO1xuICAgICAgICAvLyBjb25zdCBkdW1ieVJlc3VsdDogVGVzdENhc2VzUGFzc2VkID0ge1xuICAgICAgICAvLyAgICAgdGVzdENhc2VzUGFzc2VkOiBbdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZV0sXG4gICAgICAgIC8vICAgICBzdGFuZGFyZE91dHB1dDogXCJUZXN0IFN0YW5kYXJkIE91dHB1dFwiLFxuICAgICAgICAvLyAgICAgb3V0cHV0OiBcIlRlc3QgT3V0cHV0XCJcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyBjb250ZXh0LnJlc3BvbnNlLmJvZHkgPSBkdW1ieVJlc3VsdFxuICAgICAgICAvLyByZXR1cm5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzaWQgPSBhd2FpdCBjb250ZXh0LmNvb2tpZXMuZ2V0KCdzaWQnKTtcbiAgICAgICAgICAgIGlmIChzaWQgJiYgdHlwZW9mIHNpZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWNvbnRleHQucmVxdWVzdC5oYXNCb2R5KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQudGhyb3coU3RhdHVzLkJhZFJlcXVlc3QsIFwiQmFkIFJlcXVlc3RcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGJvZHkgPSBjb250ZXh0LnJlcXVlc3QuYm9keSgpO1xuICAgICAgICAgICAgICAgIGxldCBjb2RlOiBQYXJ0aWFsPENvZGVTdWJtaXNzaW9uPiB8IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBpZiAoYm9keS50eXBlID09PSBcImpzb25cIikge1xuICAgICAgICAgICAgICAgICAgICBjb2RlID0gYXdhaXQgYm9keS52YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5hc3NlcnQodHlwZW9mIGNvZGU/LnZhbHVlID09PSBcInN0cmluZ1wiLCBTdGF0dXMuQmFkUmVxdWVzdCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuYXNzZXJ0KHR5cGVvZiBjb2RlPy5pbnB1dCA9PT0gXCJzdHJpbmdcIiwgU3RhdHVzLkJhZFJlcXVlc3QpO1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LnJlc3BvbnNlLnN0YXR1cyA9IFN0YXR1cy5PSztcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJaWlpcIik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvZGUudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlhYWFwiKTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgRGVuby53cml0ZVRleHRGaWxlKFwiLi9zYW5kYm94L2Fuc3dlci5weVwiLCBjb2RlLnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgRGVuby53cml0ZVRleHRGaWxlKFwiLi9zYW5kYm94L2Fuc3dlckN1c3RvbUlucHV0LnB5XCIsIGNvZGUudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW5wdXRMaW5lczogc3RyaW5nW10gPSBjb2RlLmlucHV0LnNwbGl0KCdcXG4nKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGN1c3RvbUlucHV0Q29udGVudDogc3RyaW5nID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGxldCBxdWVzdGlvbkluZm9ybWF0aW9uOiBRdWVzdGlvbkluZm9ybWF0aW9uID0gc2lkc1F1ZXN0aW9uc1tzaWRdW3NpZHNQcm9ncmVzc1tzaWRdXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBxdWVzdGlvbkluZm9ybWF0aW9uLmlucHV0Rm9ybWF0Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk9PT1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHF1ZXN0aW9uSW5mb3JtYXRpb24uaW5wdXRGb3JtYXRbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQUFBcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocXVlc3Rpb25JbmZvcm1hdGlvbi5pbnB1dEZvcm1hdFtpXSA9PSAnbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXN0b21JbnB1dENvbnRlbnQgKz0gcGFyc2VJbnQoaW5wdXRMaW5lc1tpXSkudG9TdHJpbmcoKSArICdcXG4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChxdWVzdGlvbkluZm9ybWF0aW9uLmlucHV0Rm9ybWF0W2ldID09ICdhJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbnB1dENvbW1hU2VwYXJhdGVkVmFsdWVzOiBzdHJpbmdbXSA9IGlucHV0TGluZXNbaV0uc3BsaXQoJ1snKVsxXS5zcGxpdCgnXScpWzBdLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VzdG9tSW5wdXRDb250ZW50ICs9IGlucHV0Q29tbWFTZXBhcmF0ZWRWYWx1ZXMubGVuZ3RoLnRvU3RyaW5nKCkgKyAnXFxuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRDb21tYVNlcGFyYXRlZFZhbHVlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXN0b21JbnB1dENvbnRlbnQgKz0gcGFyc2VJbnQoaW5wdXRDb21tYVNlcGFyYXRlZFZhbHVlc1tpXSkudG9TdHJpbmcoKSArICdcXG4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocXVlc3Rpb25JbmZvcm1hdGlvbi5pbnB1dEZvcm1hdFtpXSA9PSAnYWEnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGlucHV0Q29tbWFTZXBhcmF0ZWRWYWx1ZXM6IHN0cmluZ1tdID0gaW5wdXRMaW5lc1tpXS5zcGxpdCgnW1snKVsxXS5zcGxpdCgnXV0nKVswXS5zcGxpdCgnXSxbJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VzdG9tSW5wdXRDb250ZW50ICs9IGlucHV0Q29tbWFTZXBhcmF0ZWRWYWx1ZXMubGVuZ3RoLnRvU3RyaW5nKCkgKyAnXFxuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRDb21tYVNlcGFyYXRlZFZhbHVlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5wdXRDQ29tbWFTZXBhcmF0ZWRWYWx1ZXM6IHN0cmluZ1tdID0gaW5wdXRMaW5lc1tpXS5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXN0b21JbnB1dENvbnRlbnQgKz0gaW5wdXRDQ29tbWFTZXBhcmF0ZWRWYWx1ZXMubGVuZ3RoLnRvU3RyaW5nKCkgKyAnXFxuJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGlucHV0Q0NvbW1hU2VwYXJhdGVkVmFsdWVzLmxlbmd0aDsgKytqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXN0b21JbnB1dENvbnRlbnQgKz0gcGFyc2VJbnQoaW5wdXRDQ29tbWFTZXBhcmF0ZWRWYWx1ZXNbaV0pLnRvU3RyaW5nKCkgKyAnXFxuJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAocXVlc3Rpb25JbmZvcm1hdGlvbi5vdXRwdXRGb3JtYXQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJOTk5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhxdWVzdGlvbkluZm9ybWF0aW9uLm91dHB1dEZvcm1hdFswXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk1NTVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkFBQVwiKTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgRGVuby53cml0ZVRleHRGaWxlKFwiLi9zYW5kYm94L2N1c3RvbUlucHV0LmluXCIsIGN1c3RvbUlucHV0Q29udGVudCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQUFCXCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXBvcnRQcm9jZXNzID0gYXdhaXQgRGVuby5ydW4oe1xuICAgICAgICAgICAgICAgICAgICAgICAgY21kOiBbXCIuL21ha2VSZXBvcnQuc2hcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjd2Q6IFwiLi9zYW5kYm94L1wiICsgcXVlc3Rpb25JbmZvcm1hdGlvbi5xdWVzdGlvbklkLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGRvdXQ6IFwicGlwZWRcIlxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJBQkJcIik7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHJlcG9ydFByb2Nlc3Mub3V0cHV0KCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQkJCXCIpO1xuICAgICAgICAgICAgICAgICAgICBsZXQganNvblJlc3VsdHM6IFN0cmluZyA9IGF3YWl0IERlbm8ucmVhZFRleHRGaWxlKFwiLi9zYW5kYm94L3JlcG9ydEZyb21QeVNhbmRib3gudHh0XCIpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgc3RhbmRhcmRPdXRwdXRSZXN1bHRzOiBzdHJpbmcgPSBhd2FpdCBEZW5vLnJlYWRUZXh0RmlsZShcIi4vc2FuZGJveC9zdGFuZGFyZE91dHB1dEZyb21QeVNhbmRib3gudHh0XCIpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgb3V0cHV0UmVzdWx0czogc3RyaW5nID0gYXdhaXQgRGVuby5yZWFkVGV4dEZpbGUoXCIuL3NhbmRib3gvb3V0cHV0RnJvbVB5U2FuZGJveC50eHRcIik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ0NDXCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzdGFuZGFyZE91dHB1dFJlc3VsdHMpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRERFwiKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cob3V0cHV0UmVzdWx0cyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRUVFXCIpO1xuICAgICAgICAgICAgICAgICAgICBqc29uUmVzdWx0cyA9IGpzb25SZXN1bHRzLnJlcGxhY2UoL1xccy9nLCBcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAganNvblJlc3VsdHMgPSBqc29uUmVzdWx0cy5zdWJzdHJpbmcoMCwganNvblJlc3VsdHMubGVuZ3RoIC0gMikgKyBcIl1cIlxuICAgICAgICAgICAgICAgICAgICBsZXQgdGVzdFJlc3VsdHM6IFRlc3RSZXN1bHRbXSAgPSBKU09OLnBhcnNlKGpzb25SZXN1bHRzLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdGVzdENhc2VzUGFzc2VkOiBUZXN0Q2FzZXNQYXNzZWQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXN0Q2FzZXNQYXNzZWQ6IHRlc3RSZXN1bHRzLm1hcCgodHI6IFRlc3RSZXN1bHQpID0+IHRyLnBhc3NlZCksXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFuZGFyZE91dHB1dDogc3RhbmRhcmRPdXRwdXRSZXN1bHRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0OiBvdXRwdXRSZXN1bHRzLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRlc3RDYXNlc1Bhc3NlZC50ZXN0Q2FzZXNQYXNzZWQuc29tZShlbGVtZW50ID0+ICFlbGVtZW50KSAmJiArK3NpZHNQcm9ncmVzc1tzaWRdID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgb3Bwb25lbnRTaWQgPSBtYXRjaGVzW3NpZF07XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgbWF0Y2hlc1tzaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG1hdGNoZXNbb3Bwb25lbnRTaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHNpZHNQcm9ncmVzc1tzaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHNpZHNQcm9ncmVzc1tvcHBvbmVudFNpZF07XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgc2lkc1F1ZXN0aW9uc1tzaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHNpZHNRdWVzdGlvbnNbb3Bwb25lbnRTaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG51bVdpbnM6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1HYW1lczogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsb1JhdGluZzogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhczI0MDBSYXRpbmdIaXN0b3J5OiBib29sZWFuID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3Bwb25lbnROdW1Mb3NzZXM6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHBvbmVudE51bUdhbWVzOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3Bwb25lbnRFbG9SYXRpbmc6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHBvbmVudEhhczI0MDBSYXRpbmdIaXN0b3J5OiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdXNlcm5hbWUgPSBzaWRzW3NpZCBhcyBzdHJpbmddO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVzZXJuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgY2xpZW50LmNvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1c2VybmFtZVJlc3VsdCA9IGF3YWl0IGNsaWVudC5xdWVyeUFycmF5KFwic2VsZWN0IG51bV93aW5zLCBudW1fbG9zc2VzLCBlbG9fcmF0aW5nLCBoYXNfMjQwMF9yYXRpbmdfaGlzdG9yeSBmcm9tIHVzZXJzIHdoZXJlIHVzZXJuYW1lPSdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIHVzZXJuYW1lICsgXCInXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bVdpbnMgPSB1c2VybmFtZVJlc3VsdC5yb3dzWzBdWzBdIGFzIG51bWJlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1HYW1lcyA9IG51bVdpbnMgKyAodXNlcm5hbWVSZXN1bHQucm93c1swXVsxXSBhcyBudW1iZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsb1JhdGluZyA9IHVzZXJuYW1lUmVzdWx0LnJvd3NbMF1bMl0gYXMgbnVtYmVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhczI0MDBSYXRpbmdIaXN0b3J5ID0gdXNlcm5hbWVSZXN1bHQucm93c1swXVszXSBhcyBib29sZWFuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGNsaWVudC5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgb3Bwb25lbnRVc2VybmFtZSA9IHNpZHNbb3Bwb25lbnRTaWQgYXMgc3RyaW5nXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3Bwb25lbnRVc2VybmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBjbGllbnQuY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1c2VybmFtZVJlc3VsdCA9IGF3YWl0IGNsaWVudC5xdWVyeUFycmF5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3QgbnVtX3dpbnMsIG51bV9sb3NzZXMsIGVsb19yYXRpbmcsIGhhc18yNDAwX3JhdGluZ19oaXN0b3J5IGZyb20gdXNlcnMgd2hlcmUgdXNlcm5hbWU9J1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIG9wcG9uZW50VXNlcm5hbWUgKyBcIidcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wcG9uZW50TnVtTG9zc2VzID0gdXNlcm5hbWVSZXN1bHQucm93c1swXVsxXSBhcyBudW1iZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wcG9uZW50TnVtR2FtZXMgPSAodXNlcm5hbWVSZXN1bHQucm93c1swXVswXSBhcyBudW1iZXIpICsgb3Bwb25lbnROdW1Mb3NzZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wcG9uZW50RWxvUmF0aW5nID0gdXNlcm5hbWVSZXN1bHQucm93c1swXVsyXSBhcyBudW1iZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wcG9uZW50SGFzMjQwMFJhdGluZ0hpc3RvcnkgPSB1c2VybmFtZVJlc3VsdC5yb3dzWzBdWzNdIGFzIGJvb2xlYW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGNsaWVudC5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKytudW1XaW5zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZWxvUmF0aW5nVmFyaWF0aW9uOiBudW1iZXIgPSAxIC0gMS4wIC8gKDEgKyBNYXRoLnBvdygxMCwgKG9wcG9uZW50RWxvUmF0aW5nIC0gZWxvUmF0aW5nKSAvIDQwMC4wKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsb1JhdGluZyArPSBNYXRoLmZsb29yKChudW1HYW1lcyA8IDMwID8gKGVsb1JhdGluZyA8IDIzMDAgPyA0MCA6IDIwKSA6IChoYXMyNDAwUmF0aW5nSGlzdG9yeSA/IDEwIDogMjApKSAqIGVsb1JhdGluZ1ZhcmlhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsrb3Bwb25lbnROdW1Mb3NzZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wcG9uZW50RWxvUmF0aW5nIC09IE1hdGguY2VpbCgob3Bwb25lbnROdW1HYW1lcyA8IDMwID8gKG9wcG9uZW50RWxvUmF0aW5nIDwgMjMwMCA/IDQwIDogMjApIDogKG9wcG9uZW50SGFzMjQwMFJhdGluZ0hpc3RvcnkgPyAxMCA6IDIwKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogZWxvUmF0aW5nVmFyaWF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVzZXJuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBjbGllbnQuY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgY2xpZW50LnF1ZXJ5QXJyYXkoXCJ1cGRhdGUgdXNlcnMgc2V0IG51bV93aW5zID0gXCIgKyBudW1XaW5zLnRvU3RyaW5nKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIFwiLCBlbG9fcmF0aW5nID0gXCIgKyBlbG9SYXRpbmcudG9TdHJpbmcoKSArIFwiLCBoYXNfMjQwMF9yYXRpbmdfaGlzdG9yeSA9IFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAoaGFzMjQwMFJhdGluZ0hpc3RvcnkgfHwgZWxvUmF0aW5nID49IDI0MDApLnRvU3RyaW5nKCkgKyBcIiB3aGVyZSB1c2VybmFtZT0nXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIHVzZXJuYW1lICsgXCInXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgY2xpZW50LmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHBvbmVudFVzZXJuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBjbGllbnQuY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgY2xpZW50LnF1ZXJ5QXJyYXkoXCJ1cGRhdGUgdXNlcnMgc2V0IG51bV9sb3NzZXMgPSBcIiArIG9wcG9uZW50TnVtTG9zc2VzLnRvU3RyaW5nKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIFwiLCBlbG9fcmF0aW5nID0gXCIgKyBvcHBvbmVudEVsb1JhdGluZy50b1N0cmluZygpICsgXCIsIGhhc18yNDAwX3JhdGluZ19oaXN0b3J5ID0gXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIChvcHBvbmVudEhhczI0MDBSYXRpbmdIaXN0b3J5IHx8IG9wcG9uZW50RWxvUmF0aW5nID49IDI0MDApLnRvU3RyaW5nKCkgKyBcIiB3aGVyZSB1c2VybmFtZT0nXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIG9wcG9uZW50VXNlcm5hbWUgKyBcIidcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBjbGllbnQuZW5kKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5yZXNwb25zZS5ib2R5ID0gdGVzdENhc2VzUGFzc2VkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICB9XG4gICAgfSk7XG5hcHAudXNlKHJvdXRlci5yb3V0ZXMoKSk7XG5hcHAudXNlKHJvdXRlci5hbGxvd2VkTWV0aG9kcygpKTtcbmFwcC51c2UoYXN5bmMgKGNvbnRleHQpID0+IHtcbiAgICBpZiAoIWNvbnRleHQucmVxdWVzdC51cmwucGF0aG5hbWUuZW5kc1dpdGgoJy5qcycpXG4gICAgICAgICYmICFjb250ZXh0LnJlcXVlc3QudXJsLnBhdGhuYW1lLmVuZHNXaXRoKCcucG5nJylcbiAgICAgICAgJiYgIWNvbnRleHQucmVxdWVzdC51cmwucGF0aG5hbWUuZW5kc1dpdGgoJy5pY28nKVxuICAgICAgICAmJiAhY29udGV4dC5yZXF1ZXN0LnVybC5wYXRobmFtZS5lbmRzV2l0aCgnLnR4dCcpKVx0e1xuICAgICAgICBjb250ZXh0LnJlcXVlc3QudXJsLnBhdGhuYW1lID0gJy8nO1xuICAgIH1cbiAgICBhd2FpdCBjb250ZXh0LnNlbmQoe1xuICAgICAgICByb290OiBgJHtEZW5vLmN3ZCgpfS9yZWFjdC1hcHAvYnVpbGRgLFxuICAgICAgICBpbmRleDogXCJpbmRleC5odG1sXCIsXG4gICAgfSk7XG59KTtcbmNvbnNvbGUubG9nKFwiUnVubmluZyBvbiBwb3J0XCIsIHBvcnQpO1xuYXdhaXQgYXBwLmxpc3Rlbih7IHBvcnQgfSk7XG4iXX0=