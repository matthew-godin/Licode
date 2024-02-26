import { ChangeEventHandler } from 'react';

export default interface EditorInputOutputSectionProps {
    name: string,
    handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
    content: string,
    errorContent?: string,
    peeking: boolean,
    isPlayer: boolean,
    readOnly: boolean
}
