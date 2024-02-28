import { ChangeEventHandler } from 'react';
import TopSectionData from './TopSectionData';
import EditorSectionData from './EditorSectionData';
import InputOutputSectionData from './InputOutputSectionData';

export default interface EditorData {
    topSectionData: TopSectionData;
    editorSectionData: EditorSectionData;
    inputData: InputOutputSectionData;
    standardOutputData: InputOutputSectionData;
    outputData: InputOutputSectionData;
    testCasesPassed: boolean[];
}
