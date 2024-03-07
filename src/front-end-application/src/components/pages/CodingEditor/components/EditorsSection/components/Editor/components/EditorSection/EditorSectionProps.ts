import { ChangeEventHandler } from 'react';
import EditorSectionData from '../../../../../../interfaces/EditorSectionData';

export default interface EditorSectionProps {
    editorSectionData: EditorSectionData,
    peeking: boolean,
    isPlayer: boolean
}
