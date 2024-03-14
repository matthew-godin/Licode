import * as React from 'react';
import { Avatar, CssBaseline, Box, Typography, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from '../../common/Copyright';
import RegisterProps from './RegisterProps';
import RegisterState from './RegisterState';
import submit from './methods/Submit';
import userInput from './methods/UserInput';
import validate, { validateField } from './methods/Validate';
import RegisterForm from './components/RegisterForm/RegisterForm';
import createRegisterData from './methods/CreateRegisterData';

const theme = createTheme();

class Register extends React.Component<RegisterProps, RegisterState> {
    constructor(props: RegisterProps) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUserInput = this.handleUserInput.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onUsernameBlur = this.onUsernameBlur.bind(this);
        this.onEmailBlur = this.onEmailBlur.bind(this);
        this.onPasswordBlur = this.onPasswordBlur.bind(this);
        this.onConfirmPasswordBlur = this.onConfirmPasswordBlur.bind(this);
        this.state = { email: '', username: '', password: '', confirmPassword: '', errorMessage: '', 
            validationMessages: { username: '', email: '', password: '', confirmPassword: '' }
        };
    }
    
    async handleSubmit (e: React.SyntheticEvent<HTMLFormElement>) { submit(e, this); }

    handleUserInput(e : React.FormEvent<HTMLFormElement>) { userInput(e, this); }

    onBlur (e: React.FocusEvent<HTMLInputElement>, field: string) { validateField(field, e.target.value, this); }

    onUsernameBlur (e: React.FocusEvent<HTMLInputElement>) { this.onBlur(e, "username"); }

    onEmailBlur (e: React.FocusEvent<HTMLInputElement>) { this.onBlur(e, "email"); }

    onPasswordBlur (e: React.FocusEvent<HTMLInputElement>) { this.onBlur(e, "password"); }

    onConfirmPasswordBlur (e: React.FocusEvent<HTMLInputElement>) { this.onBlur(e, "confirmPassword"); }
    
    validateForm (): boolean { return validate(this); }

    render() {
        const registerData = createRegisterData(this);
        return (
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ width: 24, height: 24, bgcolor: 'secondary.main', marginBottom: '4%' }} src="./favicon.ico" variant="rounded" />
                        <Typography component="h1" variant="h5">
                            Sign Up
                        </Typography>
                        <RegisterForm registerData={registerData} />
                    </Box>
                    <Copyright sx={{ mt: 5 }} />
                </Container>
            </ThemeProvider>
        );
    }
}

export default Register;
