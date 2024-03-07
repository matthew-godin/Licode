import InputOutputSectionData from '../../../../../../interfaces/InputOutputSectionData';

export default interface EditorInputOutputSectionProps {
    name: string,
    inputOutputSectionData: InputOutputSectionData,
    peeking: boolean,
    isPlayer: boolean,
    readOnly: boolean
}
