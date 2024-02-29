import { TextField, Grid, Tooltip, IconButton } from '@mui/material';
import ConfirmPasswordProps from "./ConfirmPasswordProps";

const ConfirmPassword = (props: ConfirmPasswordProps) => {
    return (
        <Grid item xs={12}>
            <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={props.passwordInputType}
                id="confirmPassword"
                value={props.confirmPasswordData.field}
                onBlur={props.confirmPasswordData.onFieldBlur}
            />
        </Grid>
    );
};

export default ConfirmPassword;
