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
interface SignUpDialogProps {
  open: boolean;
  handleClose: () => void;
}
const SignUpDialog: React.FC<SignUpDialogProps> = ({ open, handleClose }) => {
  const [message, setMessage] = React.useState<String>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Add your logic to check if password and confirm password match
    const password = event.currentTarget.password.value;
    const confirmPassword = event.currentTarget.confirm_password.value;
    const fullName = event.currentTarget.fullName.value;
    const email = event.currentTarget.email.value;
    const validateEmail = (email: any) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    if (email.length >= 55 || fullName >= 55) {
      setMessage("email and fullName Maximum input is 55 only.");
      return;
    }

    if (!validateEmail(email)) {
      setMessage("Invalid email address.");
      return;
    }
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters!");
      return;
    }
    if (password !== confirmPassword) {
      // Passwords do not match, display error message
      setMessage("Passwords do not match!");
      return;
    } else {
      // Passwords match and are at least 8 characters, you can proceed with the signup logic
      try {
        const objectJson = { fullName: fullName, email: email, password: password };
        const { data } = await AuthAPI.signup(objectJson);
        setTimeout(() => {
          handleClose();
        }, 500);
      } catch (error: any) {
        setMessage(error.response.data.message);
      }
    }
  };
  return (
    <Dialog open={open} keepMounted onClose={handleClose} aria-describedby="sign-up-dialog-description">
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ width: 600, height: 700 }}>
        <DialogContentText id="sign-up-dialog-description">
          {/* Add your sign-up content here */}
          <Box sx={{ mt: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Avatar sx={{ m: 1, bgcolor: "secondary.main", width: 80, height: 80 }} src={logo.src} />
            <Typography sx={{ m: 1, mb: 2 }} component="h1" variant="h5">
              Đăng ký
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: 470 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <TextField required fullWidth id="fullName" label="tên hiện thị" name="fullName" />
                </Grid>
                <Grid item xs={12}>
                  <TextField required fullWidth id="email" label="Email" name="email" />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    required
                    fullWidth
                    name="confirm_password"
                    label="mật khẩu"
                    type="password"
                    id="confirm_password"
                    autoComplete="new-password"
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="xác nhận mật khẩu"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="error">
                    {message}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>khi bấm đăng ký tài khoản của bạn đã đồng ý với quy định của tòa soạn</Typography>
                </Grid>
              </Grid>
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 1, background: "black" }}>
                Đăng ký
              </Button>
            </Box>
          </Box>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;
