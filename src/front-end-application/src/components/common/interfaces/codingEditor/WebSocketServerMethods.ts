import { MouseEventHandler } from 'react';

export default interface WebSocketServerMethods {
    skipTestCase: MouseEventHandler<HTMLButtonElement>;
    slowOpponent: MouseEventHandler<HTMLButtonElement>;
    peekOpponent: MouseEventHandler<HTMLButtonElement>;
}
