import { ChangeEventHandler } from 'react';

export default interface EditorSectionProps {
    code: string,
    handleCodeChange: (value: string, event?: any) => void,
    peeking: boolean,
    isPlayer: boolean
}
