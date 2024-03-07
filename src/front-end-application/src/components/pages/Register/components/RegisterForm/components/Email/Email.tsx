import { TextField, Grid, Tooltip } from '@mui/material';
import EmailProps from "./EmailProps";

const Email = (props: EmailProps) => {
    return (
        <Grid item xs={12}>
            <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={props.emailData.field}
                autoComplete="email"
                onBlur={props.emailData.onFieldBlur}
            />
        </Grid>
    );
};

export default Email;
