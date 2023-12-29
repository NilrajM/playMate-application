import { ReactElement, useEffect, useState } from "react"
import { Avatar, Box, Grid, Typography, TextField, Button, Link, Checkbox, FormControlLabel, Paper, CssBaseline, Slide, Snackbar} from "@mui/material"
import { QuestionMarkOutlined } from "@mui/icons-material";
import backgoundImg from '../../src/assets/background.jpg';
import forgotPageAnimation from '../../src/assets/ForgotPasswordPage.json';
import { useLottie } from "lottie-react";
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import * as userAuthService from '../services/userAuth-service';

const ForgotPassword: React.FC = (): ReactElement => {
  const[open, setOpen] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(30);

  const lottieOptions = {
      loop: true,
      autoplay: true,
      animationData: forgotPageAnimation,
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

  const handleForgotPassword = async () => {
    try{
      setIsButtonDisabled(true);
      const response = await userAuthService.forgotPassword(email);

      if(response.success){
        showSnackbar('Reset password link sent successfully', 'success')
      }
      else{
        showSnackbar('Error sending the reset password link', 'error')
      }

    }
    catch(err){
      showSnackbar('Unexpected error occurred while sending the link', 'error');
    }
    finally{
      setTimeout(() => {
        setIsButtonDisabled(false);
        setCountdown(30);
      },30000)
    }
  }

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if(isButtonDisabled){
      intervalId = setInterval(() => {
        setCountdown((prevCountdown) => (prevCountdown > 0 ? prevCountdown - 1 : 0));
      }, 1000)
    }

    return () => {
      clearInterval(intervalId);
    }
  },[isButtonDisabled])

    return(
      <>
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
              <QuestionMarkOutlined/>
            </Avatar>
            <Typography component="h1" variant="h5">
              Play Mate
            </Typography>
            <Typography variant="body2" sx={{mt:1, textAlign:'center'}}>
            Enter the email address associated with your account, and we'll send you a link to reset your password.
            </Typography>
            <Box  sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus={!open}
                sx={{width: '30vw'}}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, 
                  mb: 2,
                  bgcolor: 'rgba(1, 181, 98, 0.8)',
                  width:'30vw',
                  '&:hover': {
                      backgroundColor: 'rgba(29, 211, 126, 0.8)', 
                  },
                  transition: 'background-color 0.3s', 
                  pointerEvents: isButtonDisabled ? 'none' : 'auto',
                 }}
                 onClick={handleForgotPassword}
              >
                {isButtonDisabled ? `Send Link in (${countdown}s)` : 'Send Link'}
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="/signin" variant="body2">
                    {"Remembered password? Sign In"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          </Slide>
        </Grid>
      </Grid>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{vertical:'top', horizontal:'center'}}>
        <MuiAlert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{width:'100%', maxWidth: '600px'}}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
      </>
    )
}

export default ForgotPassword;