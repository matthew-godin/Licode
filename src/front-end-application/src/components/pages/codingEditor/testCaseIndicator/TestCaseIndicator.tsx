import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export interface TestCaseIndicatorProps {
    passed: boolean,
}

function TestCaseIndicator(props: TestCaseIndicatorProps) {
    const passed: boolean = props.passed;
    if (passed) {
        return <CheckIcon sx={{ fontSize: 60, color: 'primary.checkmark' }} />;
    } else {
        return <CloseIcon sx={{ fontSize: 60, color: 'primary.cross' }} />;
    }
}

export default TestCaseIndicator;
