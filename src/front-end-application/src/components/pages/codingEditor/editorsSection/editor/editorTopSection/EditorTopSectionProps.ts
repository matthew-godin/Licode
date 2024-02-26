import { MouseEventHandler } from 'react';
import { ChangeEventHandler } from 'react';

export default interface EditorTopSectionProps {
    username: string,
    eloRating: number,
    loaded: boolean,
    skipTestCase: MouseEventHandler<HTMLButtonElement>,
    slowOpponent: MouseEventHandler<HTMLButtonElement>,
    peekOpponent: MouseEventHandler<HTMLButtonElement>,
    questionNum: number,
    isPlayer: boolean
}
