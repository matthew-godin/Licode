import InputOutputSectionData from '../../../../../common/interfaces/codingEditor/InputOutputSectionData';

export default interface EditorInputOutputSectionProps {
    name: string,
    inputOutputSectionData: InputOutputSectionData,
    peeking: boolean,
    isPlayer: boolean,
    readOnly: boolean
}
