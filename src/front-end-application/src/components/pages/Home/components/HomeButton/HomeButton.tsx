import { Button } from "@mui/material";
import { lighten } from "@mui/material";

export interface HomeButtonProps {
    label: string,
    background: string,
    color: string
}

function HomeButton(props: HomeButtonProps) {
    let style = {
        fontSize: "1.8rem",
        fontWeight: "600",
        padding: "2rem 3rem",
        border: "0",
        borderRadius: "60px",
        background: props.background,
        color: props.color,
        cursor: "pointer",
        whiteSpace: "nowrap",
        "&:hover": {
            background: lighten(props.background, 0.1),
        }
    }

    return (
        <Button sx={style}>{props.label}</Button>
    );
}

export default HomeButton;