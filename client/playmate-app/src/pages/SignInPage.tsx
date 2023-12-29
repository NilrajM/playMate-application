import { ReactElement, useEffect, useState } from "react"
import { Avatar, Box, Grid, Typography, TextField, Button, Link, Checkbox, FormControlLabel, Paper, CssBaseline, Slide, InputAdornment, IconButton, AlertColor, Snackbar} from "@mui/material"
import LoginIcon from '@mui/icons-material/Login';
import backgoundImg from '../../src/assets/background.jpg';
import signInAnimation from '../../src/assets/SignInPage.json';
import { useLottie } from "lottie-react";
import MuiAlert from '@mui/material/Alert';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import * as userAuthService from '../services/userAuth-service';

const SignIn: React.FC = (): ReactElement => {
  const[open, setOpen] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [isSignInButtonDisbaled, setIsSignInButtonDisbaled] = useState<boolean>(true); 
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');

  const lottieOptions = {
      loop: false,
      autoplay: true,
      animationData: signInAnimation,
      rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
      },
      style:{
        width: '50%',
        height: '50%'
      }
  }

  const {View} = useLottie(lottieOptions);

  const showSnackbar = (message: string, severity: AlertColor) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const validateField = (field: string, value: string): void => {
    if(!value){
      if(field === 'email'){
        setEmailError('Email is required');
      }
      else if(field === 'password'){
        setPasswordError('Password is required')
      }
    }
    else if(field === 'email' && !validateEmail(value)){
      setEmailError('Email is invalid')
    }
    else{
      setEmailError('');
      setPasswordError('');
    }
  }

  useEffect(() => {
    setPasswordError('');
    setEmailError('');
    const isFormComplete = email && password;
    setIsSignInButtonDisbaled(!isFormComplete);
  },[email, password])

  const handleSignIn = async() => {
    try{
      validateField('email', email);
      validateField('password', password);

      if(!emailError && !passwordError){
        const userData = {email, password};
        const response = await userAuthService.loginUser(userData);
        const {user, tokens} = response;

        if(response.success && user){
          showSnackbar('User logged in successfully', 'success');
        }
        else{
          showSnackbar(`Error signing in: ${response.message}`,'error')
        }
      }
    }
    catch(err){
      showSnackbar('Unexpected error during sign-in', 'error');
    }
  }

    return(
      
        <Grid container component="main" sx={{ height: '100vh', overflow: 'hidden' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${backgoundImg})`,
            backgroundRepeat: 'no-repeat',
            // backgroundColor: (t) =>
            //   t.palette.mode === 'dark' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding:10
          }}
          {...View}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Slide direction="left" in={open} mountOnEnter unmountOnExit>
          <Box
            sx={{
              my: 18,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1),rgba(255,255,255,0))',
              backdropFilter: 'blur(10px)',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.18)',
              boxShadow: '0px 8px 32px 0 rgba(0,0,0,0.37)',
              padding: '70px 50px 100px 50px',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'rgba(1, 181, 98, 0.8)' }}>
              <LoginIcon/>
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoFocus={!open}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => validateField('email', email)}
                error={!!emailError}
                helperText={emailError}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoFocus={!open}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => validateField('password', password)}
                error={!!passwordError}
                helperText={passwordError}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <Visibility/>: <VisibilityOff/>}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, 
                  mb: 2,
                  bgcolor: 'rgba(1, 181, 98, 0.8)',
                  '&:hover': {
                      backgroundColor: 'rgba(29, 211, 126, 0.8)', 
                  },
                  transition: 'background-color 0.3s', 
                 }}
                 disabled={isSignInButtonDisbaled}
                 onClick={handleSignIn}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="/forgotpassword" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          </Slide>
          <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{vertical:'top', horizontal:'center'}}>
            <MuiAlert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{width: '100%', maxWidth: '600px'}}>
              {snackbarMessage}
            </MuiAlert>
          </Snackbar>
        </Grid>
      </Grid>
      
    )
}

export default SignIn;