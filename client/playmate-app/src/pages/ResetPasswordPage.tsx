import { ReactElement, useEffect, useState } from "react"
import { Avatar, Box, Grid, Typography, TextField, Button, Link, Checkbox, FormControlLabel, Paper, CssBaseline, Slide, InputAdornment, IconButton, AlertColor, Snackbar} from "@mui/material"
import LoginIcon from '@mui/icons-material/Login';
import backgoundImg from '../../src/assets/background.jpg';
import resetPageAnimation from '../../src/assets/ResetPasswordPage.json';
import { useLottie } from "lottie-react";
import MuiAlert from '@mui/material/Alert';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import * as userAuthService from '../services/userAuth-service';

const ResetPassword: React.FC = (): ReactElement => {
  const[open, setOpen] = useState<boolean>(true);
  const {resetToken} = useParams<{resetToken: string}>();
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [newPasswordError, setNewPasswordError] = useState<string>('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
  const [isResetButtonDisabled, setIsResetButtonDisabled] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showCPassword, setShowCPassword] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');
  const lottieOptions = {
      loop: false,
      autoplay: true,
      animationData: resetPageAnimation,
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
    setSnackbarOpen(false)
  }

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[@!#*`~]).{8,}$/;
    return passwordRegex.test(password);
}

// Function to validate form fields for new password and confirm password
const validateField = (field: string, value: string): void => {
    if (!value) {
      if (field === 'newPassword') {
        setNewPasswordError('New password is required');
      } else if (field === 'confirmPassword') {
        setConfirmPasswordError('Confirm password is required');
      }
    } 
    else if(field === 'newPassword' && !validatePassword(value)){
        if(!(/[!@#$%^&*(),.?":{}|<>]/.test(value))){
            setNewPasswordError('Password should have a special character')
        }
        else if(!(/\d/.test(value))){
            setNewPasswordError("Password should have a number")
        }
        else if(!(/[A-Z]/.test(value))){
            setNewPasswordError('Password should have a upper case character')
        }
        else if(!(/[a-z]/.test(value))){
            setNewPasswordError('Password should have a lower case character')
        }
    }
    else if(field === 'confirmPassword' && newPassword !== confirmPassword){
        setConfirmPasswordError('Passwords do not match');
    }
    else {
      setNewPasswordError('');
      setConfirmPasswordError('');
    }
  }

  useEffect(() => {
    setNewPasswordError('');
    setConfirmPasswordError('');
    const isFormComplete = newPassword && confirmPassword;
    setIsResetButtonDisabled(!isFormComplete);
  },[newPassword,confirmPassword])

  const handleResetPassword = async () => {
    try{
      validateField('newPassword', newPassword);
      validateField('confirmPassword', confirmPassword);

      if(!newPasswordError && !confirmPasswordError){
        const resetData = {resetToken, newPassword};
        const response = await userAuthService.resetPassword(resetData);
        if(response.success){
          showSnackbar('Password reset successfully','success')
        }
        else{
          showSnackbar(`Error resetting password: ${response.message}`, 'error')
        }
      }
    }
    catch(err){
      showSnackbar('Unexpected error duting password reset', 'error');
    }
  }

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
            display: 'flex',
            height: '100%',
            width: '100%',
            padding:20
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
              Reset Password
            </Typography>
            <Box sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
                autoFocus={!open}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onBlur={() => validateField('newPassword', newPassword)}
                error={!!newPasswordError}
                helperText={newPasswordError}
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
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showCPassword ? 'text' : 'password'}
                id="confirmPassword"
                autoFocus={!open}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => validateField('confirmPassword', confirmPassword)}
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowCPassword(!showCPassword)} edge="end">
                        {showCPassword ? <Visibility/> : <VisibilityOff/>}
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
                 onClick={handleResetPassword}
                 disabled={isResetButtonDisabled}
              >
                Reset Password
              </Button>
            </Box>
          </Box>
          </Slide>
        </Grid>
      </Grid>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{vertical:'top', horizontal: 'center'}}>
        <MuiAlert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{width: '100%', maxWidth: '600px'}}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
      </>
    )
}

export default ResetPassword;