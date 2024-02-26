import { MouseEventHandler } from 'react';
import { ChangeEventHandler } from 'react';

export default interface EditorProps {
    username: string,
    eloRating: number,
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
    peeking: boolean,
    isPlayer: boolean
}
