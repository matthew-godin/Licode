import { Grid } from '@mui/material';
import ColorButton from "./ColorButton/ColorButton";

export interface RunButtonProps {
    handleRun: React.MouseEventHandler<HTMLButtonElement>,
    ringClass: string
}

function RunButton(props: RunButtonProps) {
    return (
        <Grid container item mt={1.5}>
            <Grid item xs={0.5} />
            <Grid item xs={1.5} sx={{ minWidth: 250, marginBottom: "2%" }}>
                <ColorButton variant="contained" sx={{ minWidth: 125, fontSize: 24, display: "inline" }} onClick={props.handleRun}>
                    Run
                </ColorButton>
                <div className={props.ringClass} />
            </Grid>
            <Grid item xs={10} />
        </Grid>
    );
}

export default RunButton;