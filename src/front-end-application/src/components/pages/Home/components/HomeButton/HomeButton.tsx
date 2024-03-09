import { Typography, Button } from "@mui/material";
import { darken, styled } from '@mui/material/styles';

export interface HomeButtonProps {
    label: string,
    background: string,
    color: string
}

function HomeButton(props: HomeButtonProps) {
    const buttonStyle = {
        padding: "1rem 4rem",
        border: "0",
        borderRadius: "60px",
        background: props.background,
        color: props.color,
        cursor: "pointer",
        whiteSpace: "nowrap",
        "&:hover": {
            background: darken(props.background, 0.1),
        }
    };
    const StyledDiv = styled('div')(({ theme }) => ({
        fontSize: "0.5rem",
        fontWeight: "600",
        [theme.breakpoints.up('md')]: {
            fontSize: "1rem"
        }
    }));

    return (
        <Button sx={buttonStyle} href="/licode/register"><StyledDiv><Typography variant="expandable">{props.label}</Typography></StyledDiv></Button>
    );
}

export default HomeButton;