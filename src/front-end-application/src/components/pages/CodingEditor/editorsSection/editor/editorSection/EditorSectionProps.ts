import { ChangeEventHandler } from 'react';
import EditorSectionData from '../../../../../common/interfaces/codingEditor/EditorSectionData';

export default interface EditorSectionProps {
    editorSectionData: EditorSectionData,
    peeking: boolean,
    isPlayer: boolean
}
