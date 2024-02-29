import { TextField, Grid, Tooltip, IconButton } from '@mui/material';
import { Info, RemoveRedEye, VisibilityOff } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';
import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from "../../../../../../../constants/Lengths";
import { NUM_PASSWORD_SOFT_REQS } from "../../../../../../../constants/NumReqs";
import PasswordProps from "./PasswordProps";

const Password = (props: PasswordProps) => {
    const toggleShowIconButton = props.showPasswords ? 
        (<IconButton aria-label="Hide Passwords" onClick={props.toggleShowPassword}>
            <VisibilityOff/>
        </IconButton>)
        :
        (<IconButton aria-label="Show Passwords" onClick={props.toggleShowPassword}>
            <RemoveRedEye/>
        </IconButton>);
    return (
        <Grid item xs={12}>
            <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={props.passwordInputType}
                id="password"
                value={props.passwordData.field}
                autoComplete="new-password"
                onBlur={props.passwordData.onFieldBlur}
                InputProps={{
                    endAdornment:
                    <InputAdornment position="end">
                        {toggleShowIconButton}
                        <Tooltip title={
                            <div>
                                    {`Password must be at least ${MIN_PASSWORD_LENGTH} characters,`}<br/>
                                    {`be at most ${MAX_PASSWORD_LENGTH} characters`}<br/>
                                    {`and have at least ${NUM_PASSWORD_SOFT_REQS} of the following:`}<br/>
                                    <ul>
                                        <li>at least 1 lower case letter</li>
                                        <li>at least 1 upper case letter</li>
                                        <li>at least 1 number</li>
                                        <li>at least 1 special character.</li>
                                    </ul>
                            </div>
                        } placement="right">
                            <Info />
                        </Tooltip>
                    </InputAdornment>
                }}
            />
        </Grid>
    );
};

export default Password;
