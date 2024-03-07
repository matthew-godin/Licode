import { useState } from "react";
import { Button, TextField, Link, Grid, Box } from '@mui/material';
import FormErrorMessage from "../../../../common/FormErrorMessage";
import RegisterFormProps from './RegisterFormProps';
import Username from "./components/Username/Username";
import Email from "./components/Email/Email";
import Password from "./components/Password/Password";
import ConfirmPassword from "./components/ConfirmPassword/ConfirmPassword";

const RegisterForm = (props: RegisterFormProps) => {
    const [showPasswords, setShowPasswords] = useState<boolean>(false);
    const toggleShowPassword = () => {
        setShowPasswords(!showPasswords);
    };
    const passwordInputType = showPasswords ? "text" : "password";
    return (
        <Box component="form" noValidate onSubmit={props.registerData.handlers.handleSubmit}
            onChange={props.registerData.handlers.handleUserInput} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
            <Username
                usernameData={props.registerData.userData.usernameData}
            />
            <Email
                emailData={props.registerData.userData.emailData}
            />
            <Password
                passwordData={props.registerData.userData.passwordData}
                passwordInputType={passwordInputType}
                showPasswords={showPasswords}
                toggleShowPassword={toggleShowPassword}
            />
            <ConfirmPassword
                confirmPasswordData={props.registerData.userData.confirmPasswordData}
                passwordInputType={passwordInputType}
            />
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
