import { ReactElement, useState } from "react"
import { Avatar, Box, Grid, Typography, TextField, Button, Link, Checkbox, FormControlLabel, Paper, CssBaseline, Slide} from "@mui/material"
import LoginIcon from '@mui/icons-material/Login';
import backgoundImg from '../../src/assets/background.jpg';
import signInAnimation from '../../src/assets/SignInPage.json';
import { useLottie } from "lottie-react";

const SignIn: React.FC = (): ReactElement => {
  const[open, setOpen] = useState<boolean>(true);
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
            <Box component="form" noValidate  sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
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
        </Grid>
      </Grid>
      
    )
}

export default SignIn;