import * as React from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Typography,
  Link as MLink,
  Grid,
  CssBaseline,
  Paper,
  Box,
  Avatar,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import { CoreUserInfoMinimalField } from "../fragments/fragments";
import { gql, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/auth";
import { useUserStore } from "../store/user";
import { AuthOutput } from "../types/type";
import Link from "next/link";
function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <MLink color="inherit" href="https://material-ui.com/">
        Your Website
      </MLink>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const LOGIN = gql`
  ${CoreUserInfoMinimalField}
  mutation Login($password: String!, $email: String!) {
    login(input: { password: $password, email: $email }) {
      message
      token
      user {
        ...CoreUserInfoMinimalField
        is_admin
        province {
          id
          name
        }
        city {
          id
          name
        }
        district {
          id
          name
        }
        thumbnail {
          id
          path
        }
        cover {
          id
          path
        }
        url_facebook
        url_twitter
        url_instagram
        url_linkedin
        basicnotificationsCount
      }
    }
  }
`;

export default function SignInSide() {
  const { setToken } = useAuthStore();

  const { setUser } = useUserStore();

  const [handleLogin, { loading }] = useMutation<{
    login: AuthOutput;
  }>(LOGIN, {});

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console

    handleLogin({
      variables: {
        email: data.get("email"),
        password: data.get("password"),
      },
    }).then(({ data: e }) => {
      if (e?.login.token) {
        setToken(e.login.token);
        setUser(e.login.user);
        window.location.replace(`/${e.login.user?.roles?.toLowerCase() + "s"}`);
      } else {
        toast.error(e?.login?.message);
      }
    });
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: "url(https://source.unsplash.com/random)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
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
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs sx={{ cursor: "pointer" }}>
                <Link href="/forgot">
                  <MLink variant="body2">Forgot password?</MLink>
                </Link>
              </Grid>
              <Grid item sx={{ cursor: "pointer" }}>
                <Link href="/register">
                  <MLink variant="body2">
                    {"Don't have an account? Sign Up"}
                  </MLink>
                </Link>
              </Grid>
            </Grid>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
