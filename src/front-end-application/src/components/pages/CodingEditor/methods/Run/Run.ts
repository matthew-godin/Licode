import QuestionData from "../../../../common/interfaces/Matchmaking/QuestionData";
import TestCasesPassed from "../../../../common/interfaces/Matchmaking/TestCasesPassed";
import CodeSubmission from "../../../../common/interfaces/CodeSubmission/CodeSubmission";
import { FIELDUPDATE } from "../../../../../enums/WebSocketServerEnums";
import { sendFieldUpdate } from "../InitialUpdates/InitialUpdates";
import CodingEditor from "../../CodingEditor";

const run = async (that: CodingEditor) => {
    that.setState({
        ringClass: "lds-dual-ring show-ring"
    });
    let codeSubmission: CodeSubmission = {
        value: '',
        input: '',
    }
    codeSubmission.value = that.state.code;
    codeSubmission.input = that.state.input;
    let res: TestCasesPassed = await fetch('/api/run', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(codeSubmission),
    }).then(response => response.json());

    if (res.testCasesPassed) {
        if (that.state.skipping) {
            for (let i = 0; i < res.testCasesPassed.length; ++i) {
                if (!res.testCasesPassed[i]) {
                    res.testCasesPassed[i] = true;
                    break;
                }
            }
        }
        sendFieldUpdate(that, FIELDUPDATE.TestCases, that.stringifyBoolArray(res.testCasesPassed));
        that.setState({ testCasesPassed: res.testCasesPassed });
    }
    if (res.standardOutput || res.standardOutput === '') {
        sendFieldUpdate(that, FIELDUPDATE.StandardOutput, res.standardOutput);
        that.setState({ standardOutput: res.standardOutput });
    }
    if (res.standardError || res.standardError === '') {
        sendFieldUpdate(that, FIELDUPDATE.StandardError, res.standardError);
        that.setState({ standardError: res.standardError });
    }
    if (res.output || res.output === '') {
        sendFieldUpdate(that, FIELDUPDATE.Output, res.output);
        that.setState({ output: res.output });
    }
    let hasWon = true;
    for (let i = 0; i < res.testCasesPassed.length; ++i) {
        if (!res.testCasesPassed[i]) {
            hasWon = false;
            break;
        }
    }
    if (hasWon && that.state.questionNum < 4) {
        const questionData: QuestionData = await fetch('/api/question').then(response => response.json());
        let initialQuestionLines = questionData.question.split(';');
        for (let i = 0; i < 3 - initialQuestionLines.length; ++i) {
            initialQuestionLines.push('');
        }
        let inputLines = questionData.default_custom_input.split(';');
        let initialInput = '';
        if (inputLines.length > 0) {
            initialInput += inputLines[0];
        }
        for (let i = 1; i < inputLines.length; ++i) {
            initialInput += '\n' + inputLines[i];
        }
        that.setState({ questionLines: initialQuestionLines, code: questionData.function_signature + '\n    ', input: initialInput,
            standardOutput: '', standardError: '', output: '', skipping: false });
        sendFieldUpdate(that, FIELDUPDATE.Code, that.state.code);
        sendFieldUpdate(that, FIELDUPDATE.Input, that.state.input);
        sendFieldUpdate(that, FIELDUPDATE.StandardOutput, that.state.standardOutput);
        sendFieldUpdate(that, FIELDUPDATE.StandardError, that.state.standardError);
        sendFieldUpdate(that, FIELDUPDATE.Output, that.state.output);
    }
    that.setState({
        ringClass: "lds-dual-ring hide-ring"
    });
};

export default run;
