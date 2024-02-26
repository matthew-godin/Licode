import { ChangeEventHandler } from 'react';
import TopSectionData from './TopSectionData';
import EditorSectionData from './EditorSectionData';

export default interface InputOutputSectionData {
    content: string;
    errorContent?: string;
    handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}
