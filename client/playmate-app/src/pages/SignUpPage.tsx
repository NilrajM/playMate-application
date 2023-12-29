import { ReactElement, useEffect, useState } from "react"
import { Avatar, Box, Grid, Typography, TextField, Button, Link, Paper, CssBaseline, Slide, InputAdornment, IconButton,AlertColor, Snackbar} from "@mui/material"
import { HowToRegOutlined, Visibility, VisibilityOff} from "@mui/icons-material";
import backgoundImg from '../../src/assets/background.jpg';
import { useLottie } from "lottie-react";
import signUpAnimation from '../../src/assets/SignUpPage.json';
import MuiAlert from '@mui/material/Alert';
import * as userAuthService from '../services/userAuth-service';

const SignUp: React.FC = (): ReactElement => {
    const [open, setOpen] = useState<boolean>(true);
    const [userName, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [isSignUpButtonDisbaled, setIsSignUpButtonDisbaled] = useState<boolean>(true); 
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');

    const lottieOptions = {
      loop: true,
      autoplay: true,
      animationData: signUpAnimation,
      rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
      },
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

    const validatePassword = (password: string): boolean => {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[@!#*`~]).{8,}$/;
      return passwordRegex.test(password);
    }

    const validateField = (field: string, value: string): void => {
      if(!value){
        if(field === 'email'){
          setEmailError('Email is required')
        }
        else if(field === 'password'){
          setPasswordError('Password is required')
        }
      }
      else if(field === 'email' && !validateEmail(value)){
        setEmailError('Email is invalid')
      }
      else if(field === 'password' && !validatePassword(value)){
        if(!(/[!@#$%^&*(),.?":{}|<>]/.test(value))){
          setPasswordError('Password should have atleast 1 special character')
        }
        else if(!(/\d/.test(value))){
            setPasswordError('Password should have a number')
        }
        else if(!(/[A-Z]/.test(value))){
            setPasswordError('Password should contain a uppercase character')
        }
        else if(!(/[a-z]/.test(value))){
            setPasswordError('Password should contain a lower case character')
        }
      }
      else{
        setEmailError('');
        setPasswordError('');
      }
    }

    useEffect(() => {
      setEmailError('');
      setPasswordError('');
      const isFormComplete = userName && email && password;
      setIsSignUpButtonDisbaled(!isFormComplete);
    },[userName, email, password]);

    const handleSignUp = async () => {
      try{
        validateField('email', email);
        validateField('password', password);

        if(!emailError && !passwordError){
          const userData = {userName, email, password};
          const response = await userAuthService.registerUSer(userData);
          if(response.success){
            showSnackbar('User registered successfully', 'success');
          }
          else{
            showSnackbar(`Error registering the user ${response.message}`, 'error')
          }
        }

      }
      catch(err){
        showSnackbar(`Unexpected error during registration:`,'error')
      }
    }

    return(
      <>
        <Grid container component="main" sx={{ height: '100vh', overflow:'hidden' }}>
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
            //   t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
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
              <HowToRegOutlined/>
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box  sx={{ mt: 1 }}>
                <TextField
                margin="normal"
                required
                fullWidth
                id="userName"
                label="User name"
                name="userName"
                autoFocus={!open}
                value={userName}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => validateField('email', email)}
                error={!!emailError}
                helperText={emailError}
                autoFocus={!open}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => validateField('password', password)}
                error={!!passwordError}
                helperText={passwordError}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <Visibility/> : <VisibilityOff/>}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
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
                onClick={handleSignUp}
                disabled={isSignUpButtonDisbaled}
              >
                Sign Up
              </Button>
              <Grid container>
                <Grid item >
                  <Link href="/signin" variant="body2">
                    {"Go to Sign In"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          </Slide>
        </Grid>
      </Grid>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{vertical:'top', horizontal:'center'}}>
            <MuiAlert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{width: '100%', maxWidth: '600px'}}>
              {snackbarMessage}
            </MuiAlert>
      </Snackbar>
      </>
    )
}

export default SignUp;