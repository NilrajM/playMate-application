import { ReactElement, useState } from "react"
import { Avatar, Box, Grid, Typography, TextField, Button, Link, Paper, CssBaseline, Slide} from "@mui/material"
import { HowToRegOutlined} from "@mui/icons-material";
import backgoundImg from '../../src/assets/background.jpg';
import sideImg from '../../src/assets/sideImg.jpg';

const SignUp: React.FC = (): ReactElement => {
const [open, setOpen] = useState<boolean>(true);
    return(
        <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${backgoundImg})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{backgroundImage: `url(})`}}>
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
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <HowToRegOutlined/>
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box component="form" noValidate  sx={{ mt: 1 }}>
                <TextField
                margin="normal"
                required
                fullWidth
                id="userName"
                label="User name"
                name="userName"
                autoComplete="userName"
                autoFocus
              />
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
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
    )
}

export default SignUp;