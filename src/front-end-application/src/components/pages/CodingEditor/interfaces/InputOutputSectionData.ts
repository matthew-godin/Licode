import { ChangeEventHandler } from 'react';

export default interface InputOutputSectionData {
    content: string;
    errorContent?: string;
    handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}
