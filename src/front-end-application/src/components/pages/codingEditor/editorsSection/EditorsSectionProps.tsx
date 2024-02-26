import { MouseEventHandler } from 'react';
import { ChangeEventHandler } from 'react';

export default interface EditorsSectionProps {
    eloRating: number,
    opponentUsername: string,
    opponentEloRating: number,
    loaded: boolean,
    skipTestCase: MouseEventHandler<HTMLButtonElement>,
    slowOpponent: MouseEventHandler<HTMLButtonElement>,
    peekOpponent: MouseEventHandler<HTMLButtonElement>,
    questionNum: number,
    code: string,
    handleCodeChange: (value: string, event?: any) => void,
    input: string,
    handleInputChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
    standardOutput: string,
    standardError: string,
    output: string,
    testCasesPassed: boolean[],
    opponentQuestionNum: number,
    peeking: boolean,
    rightEditorCode: string,
    rightInput: string,
    rightOutput: string,
    rightStandardOutput: string,
    rightStandardError: string,
    rightTestCasesPassed: boolean[],
}
