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

export const defaultState: CodingEditorState = {
    username: '',
            eloRating: 5000,
            opponentUsername: '',
            opponentEloRating: 5000,
            loaded: false,
            testCasesPassed: [false, false, false, false, false, false, false, false, false, false, false],
            rightEditorCode: '',
            socket: null,
            sid: '',
            typingSlow: false,
            canTypeAt: null,
            sendingCodeUpdates: false,
            firstMsg: true,
            peeking: false,
            lost: false,
            skipping: false,
            code: '',
            input: '',
            standardOutput: '',
            standardError: '',
            output: '',
            rightInput: '',
            rightStandardOutput: '',
            rightStandardError: '',
            rightOutput: '',
            rightTestCasesPassed: [false, false, false, false, false, false, false, false, false, false, false],
            questionNum: 1,
            opponentQuestionNum: 1,
            questionLines: ['', '', ''],
            ringClass: 'ds-dual-ring hide-ring',
};