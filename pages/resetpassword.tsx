import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";

import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/router";
import AuthAPI from "@/api/AuthAPI";

export default function resetpassword() {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [repeatPassword, setRepeatPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");
  const token = router.query.token as string;
  const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await AuthAPI.resetPassword({ password: password }, token);
      setMessage(response.data.message);
    } catch (error: any) {
      setError(error.response.data.message);
    }
  };

  if (token) {
    return (
      <Box
        sx={{
          my: 4,
          mx: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h6">
          Reset Password
        </Typography>
        <Typography component="h1" variant="h6" color={"success"}>
          {message}
        </Typography>
        <Box component="form" noValidate onSubmit={handleResetPassword} sx={{ width: 400 }}>
          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="New Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="repeatPassword"
              label="Repeat Password"
              name="repeatPassword"
              type="password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
            />
          </Grid>
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 5, background: "black" }}>
            Reset Password
          </Button>
          <Grid container>
            <Grid item xs>
              {/* Add any additional links or information */}
            </Grid>
            <Grid item sx={{ mr: 2 }}>
              <Button
                onClick={() => {
                  router.push("/");
                }}
              >
                Home
              </Button>
            </Grid>
            <Grid item>{"Already have an account? Sign In"}</Grid>
          </Grid>
        </Box>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        my: 4,
        mx: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h6">
        Reset Password
      </Typography>
      <Box component="form" noValidate onSubmit={handleResetPassword} sx={{ width: 400 }}>
        <Grid item xs={12}>
          <TextField margin="normal" required fullWidth id="password" label="New Password" name="password" type="password" disabled />
        </Grid>
        <Grid item xs={12}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="repeatPassword"
            label="Repeat Password"
            name="repeatPassword"
            type="password"
            disabled
          />
        </Grid>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 5, background: "black" }}>
          Token is expired
        </Button>
        <Grid container>
          <Grid item sx={{ mr: 2 }}>
            <Button
              onClick={() => {
                router.push("/");
              }}
            >
              Home
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
