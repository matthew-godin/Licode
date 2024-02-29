import { NUM_TEST_CASES } from "../../constants/NumQuestions.ts";
import generateTestCaseString from "./methods/GenerateTestCaseString.ts";
import generateStubString from "./methods/GenerateStubString.ts";
import generateCleanString from "./methods/GenerateCleanString.ts";
import generateMakeReportString from "./methods/GenerateMakeReportString.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { ensureDir } from 'https://deno.land/std@0.136.0/fs/mod.ts';

const loadTestCases = async (client: Client) => {
    await client.connect();
    const questionsResult = await client.queryArray("select count(*) from questions");
    let numQuestions = Number(questionsResult.rows[0][0] as number);
    await client.end();
    for (let i: number = 1; i <= numQuestions; ++i) {
        await client.connect();
        const selectedResult = await client.queryArray("select function_signature, input_output_format, test_cases from questions where id = " + i.toString());
        let functionSignature: string = selectedResult.rows[0][0] as string;
        let inputOutputFormat = selectedResult.rows[0][1] as string;
        let testCases = selectedResult.rows[0][2] as string;
        await client.end();
        let inputOutputFormats = inputOutputFormat.split('|');
        let inputFormat: string[] = inputOutputFormats[0].split(';');
        inputFormat.shift();
        let outputFormat: string[] = inputOutputFormats[1].split(';');
        outputFormat.shift();
        let allTestCases: string[] = testCases.split('|');
        for (let j: number = 0; j < NUM_TEST_CASES; ++j) {
            await ensureDir("./sandbox/" + i.toString() + "/TestInputs/");
            await ensureDir("./sandbox/" + i.toString() + "/TestOutputs/");
            await Deno.writeTextFile("./sandbox/" + i.toString() + "/TestInputs/test" + (j + 1).toString() + ".in",
                generateTestCaseString(allTestCases, inputFormat, j));
        }
        let secondHalfThreshold = 2 * NUM_TEST_CASES;
        for (let j = 11; j < secondHalfThreshold; ++j) {
            await Deno.writeTextFile("./sandbox/" + i.toString() + "/TestOutputs/test" + (j - 10).toString() + ".out",
                generateTestCaseString(allTestCases, outputFormat, j));
        }
        await Deno.writeTextFile("./sandbox/" + i.toString() + "/stub.py", generateStubString(inputFormat, outputFormat,
            functionSignature, true));
        await Deno.writeTextFile("./sandbox/" + i.toString() + "/stubCustomInput.py", generateStubString(inputFormat, outputFormat,
            functionSignature, false));
        await Deno.writeTextFile("./sandbox/" + i.toString() + "/clean.py", generateCleanString(outputFormat, true));
        await Deno.writeTextFile("./sandbox/" + i.toString() + "/cleanOutput.py", generateCleanString(outputFormat, false));
        await Deno.writeTextFile("./sandbox/" + i.toString() + "/makeReport.sh", generateMakeReportString(i));
        await Deno.run({
            cmd: ["chmod", "u+x", "makeReport.sh"],
            cwd: "./sandbox/" + i.toString()
        });
    }
};

export default loadTestCases;
