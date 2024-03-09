import { Button, Typography } from "@mui/material";
import { darken } from "@mui/material";

export interface HomeButtonProps {
    label: string,
    background: string,
    color: string
}

function HomeButton(props: HomeButtonProps) {
    let style = {
        fontSize: "1rem",
        fontWeight: "600",
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
    }

    return (
        <Button href="/licode/register" sx={style}><Typography variant="expandable">{props.label}</Typography></Button>
    );
}

export default HomeButton;