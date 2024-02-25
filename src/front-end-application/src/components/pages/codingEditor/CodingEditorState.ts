import ReconnectingWebSocket from 'reconnecting-websocket';

export default interface CodingEditorState {
    username: string,
    eloRating: number,
    opponentUsername: string,
    opponentEloRating: number,
    loaded: boolean,
    testCasesPassed: boolean[],
    code: string,
    rightEditorCode: string,
    socket:  ReconnectingWebSocket | null,
    sid: string,
    typingSlow: boolean,
    canTypeAt: Date | null, //used to type slow
    sendingCodeUpdates: boolean,
    firstMsg: boolean,
    peeking: boolean,
    skipping: boolean,
    lost: boolean,
    input: string,
    standardOutput: string,
    standardError: string,
    output: string,
    questionNum: number,
    rightInput: string,
    rightOutput: string,
    rightStandardOutput: string,
    rightStandardError: string,
    rightTestCasesPassed: boolean[],
    opponentQuestionNum: number,
    questionLines: string[],
    ringClass: string
}