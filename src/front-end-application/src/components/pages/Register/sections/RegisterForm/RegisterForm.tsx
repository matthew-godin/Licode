import { useState } from "react";
import { Button, TextField, Link, Grid, Box, Tooltip, IconButton } from '@mui/material';
import { Info, RemoveRedEye, VisibilityOff } from '@mui/icons-material';
import FormErrorMessage from "../../../../common/FormErrorMessage";
import { MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH, MAX_PASSWORD_LENGTH, MAX_USERNAME_LENGTH } from "../../../../../constants/Lengths";
import { NUM_PASSWORD_SOFT_REQS } from "../../../../../constants/NumReqs";
import { InputAdornment } from '@mui/material';
import RegisterFormProps from './RegisterFormProps';

const RegisterForm = (props: RegisterFormProps) => {
    const [showPasswords, setShowPasswords] = useState<boolean>(false);
    const toggleShowPassword = () => {
        setShowPasswords(!showPasswords);
    };
    const toggleShowIconButton = showPasswords ? 
        (<IconButton aria-label="Hide Passwords" onClick={toggleShowPassword}>
            <VisibilityOff/>
        </IconButton>)
        :
        (<IconButton aria-label="Show Passwords" onClick={toggleShowPassword}>
            <RemoveRedEye/>
        </IconButton>);
    const passwordInputType = showPasswords ? "text" : "password";
    return (
        <Box component="form" noValidate onSubmit={props.registerData.handlers.handleSubmit}
            onChange={props.registerData.handlers.handleUserInput} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    value={props.registerData.userData.username}
                    autoComplete="username"
                    onBlur={props.registerData.userData.onUsernameBlur}
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
            <Grid item xs={12}>
                <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={props.registerData.userData.email}
                autoComplete="email"
                onBlur={props.registerData.userData.onEmailBlur}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={passwordInputType}
                    id="password"
                    value={props.registerData.userData.password}
                    autoComplete="new-password"
                    onBlur={props.registerData.userData.onPasswordBlur}
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
            <Grid item xs={12}>
                <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={passwordInputType}
                id="confirmPassword"
                onBlur={props.registerData.userData.onConfirmPasswordBlur}
                value={props.registerData.userData.confirmPassword}
                />
            </Grid>
            <Grid item xs={12} style={{padding: 0}}>
                <FormErrorMessage message={props.registerData.validationMessages.username} />
            </Grid>
            <Grid item xs={12} style={{padding: 0}}>
                <FormErrorMessage message={props.registerData.validationMessages.email} />
            </Grid>
            <Grid item xs={12} style={{padding: 0}}>
                <FormErrorMessage message={props.registerData.validationMessages.password} keepFormatting={true} />
            </Grid>
            <Grid item xs={12} style={{padding: 0}}>
                <FormErrorMessage message={props.registerData.validationMessages.confirmPassword} />
            </Grid>
            <Grid item xs={12} style={{padding: 0}}>
                <FormErrorMessage message={props.registerData.errorMessage} />
            </Grid>
            </Grid>
            <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            >
            Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
                <Grid item>
                    <Link href="/licode/signin" variant="body2">
                    Already have an account? Sign in
                    </Link>
                </Grid>
            </Grid>
        </Box>
    );
};

export default RegisterForm;
