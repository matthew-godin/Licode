import { NUM_QUESTIONS_PER_MATCH } from "../../../../../../constants/NumQuestions.ts";
import MatchmakingUser from "../../../../../../interfaces/MatchmakingUser.ts";
import QuestionInformation from "../../../../../../interfaces/QuestionInformation.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const selectQuestions = async (client: Client, sidsQuestions: { [name: string]: QuestionInformation[] },
    matches: { [name: string]: string }, matchmakingUser: MatchmakingUser) => {
    await client.connect();
    const questionsResult = await client.queryArray("select count(*) from questions");
    let numQuestions = Number(questionsResult.rows[0][0] as number);
    await client.end();
    let questionsSelected: number[] = [];
    let randomPermutation: number[] = [];
    for (let i = 0; i < numQuestions; ++i) {
        randomPermutation[i] = i;
    }
    // Partial Fisher-Yates Algorithm for random selection of questions
    for (let i = 0; i < NUM_QUESTIONS_PER_MATCH; ++i) {
        let j = Math.floor(Math.random() * numQuestions);
        [randomPermutation[i], randomPermutation[j]] = [randomPermutation[j], randomPermutation[i]];
    }
    for (let i = 0; i < NUM_QUESTIONS_PER_MATCH; ++i) {
        questionsSelected.push(randomPermutation[i] + 1);
    }
    let questionsInformation: QuestionInformation[] = [];
    for (let i = 0; i < questionsSelected.length; ++i) {
        let inputOutputFormat = '';
        for (;;) {
            try {
                await client.connect();
                const selectedResult = await client.queryArray("select input_output_format from questions where id = "
                    + questionsSelected[i].toString());
                inputOutputFormat = selectedResult.rows[0][0] as string;
                await client.end();
                break;
            } catch (error) {
                console.log(error);
            }
        }
        let inputOutputFormats = inputOutputFormat.split('|');
        let inputFormat: string[] = inputOutputFormats[0].split(';');
        inputFormat.shift();
        let outputFormat: string[] = inputOutputFormats[1].split(';');
        outputFormat.shift();
        let questionInformation: QuestionInformation = { questionId: questionsSelected[i], inputFormat: inputFormat, outputFormat: outputFormat };
        questionsInformation.push(questionInformation);
    }
    sidsQuestions[matchmakingUser.sid] = questionsInformation;
    sidsQuestions[matches[matchmakingUser.sid]] = questionsInformation;
}

export default selectQuestions;
