import { RouterContext, Status } from "https://deno.land/x/oak/mod.ts";
import CodeSubmission from "../../../interfaces/CodeSubmission.ts";
import QuestionInformation from "../../../interfaces/QuestionInformation.ts";
import TestCasesPassed from "../../../interfaces/TestCasesPassed.ts";
import TestResult from "../../../interfaces/TestResult.ts";
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
                context.assert(typeof code?.value === "string", Status.BadRequest);
                context.assert(typeof code?.input === "string", Status.BadRequest);
                context.response.status = Status.OK;
                await Deno.writeTextFile("./sandbox/answer.py", code.value);
                await Deno.writeTextFile("./sandbox/answerCustomInput.py", code.value);
                let inputLines: string[] = code.input.split('\n');
                let customInputContent: string = '';
                let questionInformation: QuestionInformation = sidsQuestions[sid][sidsProgress[sid]];
                for (let i = 0; i < questionInformation.inputFormat.length; ++i) {
                    if (questionInformation.inputFormat[i] == 'n') {
                        customInputContent += parseInt(inputLines[i]).toString() + '\n';
                    } else if (questionInformation.inputFormat[i] == 'a') {
                        let inputCommaSeparatedValues: string[] = inputLines[i].split('[')[1].split(']')[0].split(',');
                        customInputContent += inputCommaSeparatedValues.length.toString() + '\n';
                        for (let i = 0; i < inputCommaSeparatedValues.length; ++i) {
                            customInputContent += parseInt(inputCommaSeparatedValues[i]).toString() + '\n';
                        }
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
                await Deno.writeTextFile("./sandbox/customInput.in", customInputContent);
                const reportProcess = await Deno.run({
                    cmd: ["./makeReport.sh"],
                    cwd: "./sandbox/" + questionInformation.questionId.toString(),
                    stdout: "piped"
                });
                await reportProcess.output();
                let jsonResults: String = await Deno.readTextFile("./sandbox/reportFromPySandbox.txt");
                let standardOutputResults: string = await Deno.readTextFile("./sandbox/standardOutputFromPySandbox.txt");
                let standardErrorResults: string = await Deno.readTextFile("./sandbox/standardErrorFromPySandbox.txt");
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
            }
        }
    } catch (err) {
        console.log(err);
    }
};

export default run;
