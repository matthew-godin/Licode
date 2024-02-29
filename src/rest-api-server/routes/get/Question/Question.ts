import QuestionData from "../../../interfaces/QuestionData.ts";
import QuestionInformation from "../../../interfaces/QuestionInformation.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const question = async (context, client: Client, sidsQuestions: { [name: string]: QuestionInformation[] },
    sidsProgress: { [name: string]: number }) => {
    try {
        let sid = await context.cookies.get('sid');
        if (sid && typeof sid === 'string') {
            await client.connect();
            const questionResult = await client.queryArray("select question, function_signature, default_custom_input from questions where id = "
                + sidsQuestions[sid][sidsProgress[sid]].questionId.toString());
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
};

export default question;
