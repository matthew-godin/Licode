import { Button } from '@mui/material';
import { ButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText('#268acd'),
    backgroundColor: '#268acd',
    '&:hover': {
      backgroundColor: '#1468ab',
    },
}));

export default ColorButton;
