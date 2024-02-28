import MatchmakingData from "../../../../../../common/interfaces/matchmaking/MatchmakingData";
import QuestionData from "../../../../../../common/interfaces/matchmaking/QuestionData";
import ReconnectingWebSocket from 'reconnecting-websocket';
import CodingEditor from "../../../../CodingEditor";

const setState = async (that: CodingEditor) => {
    console.log("Attempting Connection...");
    const data: MatchmakingData = await fetch('/api/opponent').then(response => response.json());
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
    const wsEndpoint : string = await fetch("/api/wildcardEndpoint").then(response => response.json()).then(jsn => jsn.endpoint);
    that.setState({
        username: data.you.username,
        eloRating: data.you.eloRating,
        opponentUsername: data.opponent.username,
        opponentEloRating: data.opponent.eloRating,
        sid: data.you.sid,
        socket: new ReconnectingWebSocket(wsEndpoint),
        loaded: true,
        questionLines: initialQuestionLines,
        code: questionData.function_signature + '\n    ',
        input: initialInput,
    });
}

export default setState;