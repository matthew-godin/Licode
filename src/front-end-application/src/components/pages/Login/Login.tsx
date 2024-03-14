import * as React from 'react';
import { Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Container, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FormErrorMessage from "../../common/FormErrorMessage";
import Copyright from '../../common/Copyright';
import LoginProps from './LoginProps';
import LoginState from './LoginState';
import submit from './methods/Submit';

const theme = createTheme();

class Login extends React.Component<LoginProps, LoginState> {
    constructor(props: LoginProps) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = { errorMessage: '' };
    }

    async handleSubmit (e: React.SyntheticEvent<HTMLFormElement>) { submit(e, this); }

    render() {
        const errorMessage  = this.state.errorMessage;
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
                    Sign In
                </Typography>
                <Box component="form" onSubmit={this.handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Username or Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    />
                    <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    />
                    <Box width="100%">
                        <FormErrorMessage message={errorMessage} />
                    </Box>
                    <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    >
                    Sign In
                    </Button>
                    <Grid container>
                    <Grid item>
                        <Link href="/licode/register" variant="body2">
                        {"Don't have an account? Sign Up"}
                        </Link>
                    </Grid>
                    </Grid>
                </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
            </ThemeProvider>
        );
    }
}

export default Login;
