import { TextField, Grid, Tooltip } from '@mui/material';
import { Info } from '@mui/icons-material';
import { MIN_USERNAME_LENGTH, MAX_USERNAME_LENGTH } from "../../../../../../../constants/Lengths";
import { InputAdornment } from '@mui/material';
import UsernameProps from "./UsernameProps";

const Username = (props: UsernameProps) => {
    return (
        <Grid item xs={12}>
            <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                value={props.usernameData.field}
                autoComplete="username"
                onBlur={props.usernameData.onFieldBlur}
                InputProps={{
                    endAdornment:
                    <InputAdornment position="end">
                        <Tooltip title={
                            <div>
                                    {`Username must be at least ${MIN_USERNAME_LENGTH} characters,`}<br/>
                                    {`be at most ${MAX_USERNAME_LENGTH} characters,`}<br/>
                                    {`and may contain letters, numbers, and non-consecutive`}<br/>
                                    {`dashes, periods, and underscores`}<br/>
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

export default Username;
