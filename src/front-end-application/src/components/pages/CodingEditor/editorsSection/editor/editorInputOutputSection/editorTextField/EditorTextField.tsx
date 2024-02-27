import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

const EditorTextField = styled(TextField)({
    '& .MuiInputBase-input': {
        fontSize: 16,
        padding: '2px',
    }
});

export default EditorTextField;
