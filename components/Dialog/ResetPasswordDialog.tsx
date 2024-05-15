import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AuthAPI from "@/api/AuthAPI";
import logo from "../image/2.jpg";
interface ResetPasswordDialogProps {
  open: boolean;
  handleClose: () => void;
}

export default function ResetPasswordDialog({ open, handleClose }: ResetPasswordDialogProps) {
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const validateEmail = (email: string) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const [email, setEmail] = React.useState<string>("");
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const handleResetPassword = async (event: any) => {
    event.preventDefault();
    if (!validateEmail(email)) {
      setError("invalid email");
      return;
    }
    try {
      // Add logic to handle password reset
      const response = await AuthAPI.forgotPassword({ email });
      // setMessage(response.data.message);
    } catch (error: any) {
      setError(error.response.data.message);
    }
  };

  return (
    <Dialog open={open} keepMounted onClose={handleClose} aria-describedby="reset-password-dialog-description">
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 4,
          top: 4,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <DialogContentText id="reset-password-dialog-description">
          <Box
            sx={{
              my: 4,
              mx: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main", width: 80, height: 80 }} src={logo.src} />
            <Typography component="h1" variant="h6">
              Đổi mật khẩu
            </Typography>
            <Typography sx={{ color: "green" }}> {message}</Typography>
            <Typography sx={{ color: "red" }}> {error}</Typography>
            <Box component="form" noValidate sx={{ width: 400 }}>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={handleEmailChange}
                />
              </Grid>
              <Button type="submit" onClick={handleResetPassword} fullWidth variant="contained" sx={{ mt: 2, mb: 5, background: "black" }}>
                Submit
              </Button>
            </Box>
          </Box>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
