import { Grid } from '@mui/material';
import ColorButton from "./colorButton/ColorButton";

export interface RunButtonProps {
    handleRun: React.MouseEventHandler<HTMLButtonElement>,
    ringClass: string
}

function RunButton(props: RunButtonProps) {
    return (
        <Grid container item mt={1.5}>
            <Grid item xs={0.5} />
            <Grid item xs={1.5}>
                <ColorButton variant="contained" sx={{ minWidth: 125, fontSize: 24 }} onClick={props.handleRun}>
                    Run
                </ColorButton>
                <div className={props.ringClass}></div>
            </Grid>
            <Grid item xs={10} />
        </Grid>
    );
}

export default RunButton;