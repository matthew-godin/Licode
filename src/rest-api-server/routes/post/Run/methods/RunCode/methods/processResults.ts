import QuestionInformation from "../../../../../../interfaces/QuestionInformation.ts";
import TestCasesPassed from "../../../../../../interfaces/TestCasesPassed.ts";
import TestResult from "../../../../../../interfaces/TestResult.ts";

const processResults = async (questionInformation: QuestionInformation): Promise<TestCasesPassed> => {
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
    return testCasesPassed;
};

export default processResults;
