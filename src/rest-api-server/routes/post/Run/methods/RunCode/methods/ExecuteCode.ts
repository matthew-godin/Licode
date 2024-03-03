import CodeSubmission from "../../../../../../interfaces/CodeSubmission.ts";
import QuestionInformation from "../../../../../../interfaces/QuestionInformation.ts";

const executeCode = async (code: Partial<CodeSubmission> | undefined, questionInformation: QuestionInformation) => {
    await Deno.writeTextFile("./sandbox/answer.py", code.value);
    await Deno.writeTextFile("./sandbox/answerCustomInput.py", code.value);
    let inputLines: string[] = code.input.split('\n');
    let customInputContent: string = '';
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
};

export default executeCode;
