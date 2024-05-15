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
import ResetPasswordDialog from "./ResetPasswordDialog";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FilledInput from "@mui/material/FilledInput";
import AuthAPI from "@/api/AuthAPI";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import LoginIcon from "@mui/icons-material/Login";
import SignUpDialog from "./SignUpDialog";
import logo from "../image/2.jpg";
interface SignInDialogProps {
  open: boolean;
  handleClose: () => void;
}
export default function SignInDialog({ open, handleClose }: SignInDialogProps) {
  const router = useRouter();

  const [message, setMessage] = React.useState<String>("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const validateEmail = (email: string) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = event.currentTarget.email.value;

    if (!validateEmail(email)) {
      setMessage("Please enter a valid email adress (ex: abc@gmail.com)");
      return;
    } else if (password.length < 8) {
      setMessage("Password must be greater than 8 characters.");
      return;
    }
    try {
      const { data } = await AuthAPI.signin({
        email: email,
        password: password,
      });
      if (data.role === "ROLE_USER") {
        const userName = data?.email.split("@");
        Cookies.set("accessToken", data.accessToken);
        Cookies.set("userName", userName[0]);
        Cookies.set("role", data.role);
        Cookies.set("refreshToken", data.refreshToken);
        Cookies.set("image", data.image);
        Cookies.set("id", data.id);
        setTimeout(() => {
          router.reload();
        }, 1000);
      } else {
        handleClose();
        Swal.fire({
          title: "Oops!",
          text: `Oops maybe Your role is not User `,
          icon: "warning",
        });
      }
    } catch (error: any) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx

      setMessage(error.response.data.message);
    }
  };

  const [resetOpen, setResetOpen] = React.useState(false);
  const handleResetOpen = () => {
    setResetOpen(true);
    handleClose();
  };
  const handleResetClose = () => {
    setResetOpen(false);
  };

  const [signUpOpen, setSignUpOpen] = React.useState(false);

  const handleSignUpOpen = () => {
    setSignUpOpen(true);
    handleClose();
  };
  const handleSignUpClose = () => {
    setSignUpOpen(false);
  };

  return (
    <Dialog open={open} keepMounted onClose={handleClose} aria-describedby="sign-in-dialog-description">
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
        <DialogContentText id="sign-in-dialog-description">
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main", width: 80, height: 80 }} src={logo.src} />
            <Typography component="h1" variant="h6">
              Đăng nhập
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: 400 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField margin="normal" required fullWidth id="email" label="email" name="email" autoFocus />
                </Grid>
                <Grid item xs={12}>
                  <FormControl sx={{ width: "400px" }} variant="filled">
                    <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
                    <FilledInput
                      id="filled-adornment-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Typography sx={{ color: "red" }}>{message}</Typography>
                  <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 5, background: "black" }}>
                    Đăng nhập
                  </Button>
                </Grid>
                <Grid container justifyContent={"space-between"}>
                  <Grid item>
                    <Button onClick={handleResetOpen} style={{ textTransform: "none" }}>
                      Đổi mật khẩu
                    </Button>
                    <ResetPasswordDialog open={resetOpen} handleClose={handleResetClose} />
                  </Grid>
                  <Grid item>
                    Bạn chưa có tài khoản?
                    <Button onClick={handleSignUpOpen} style={{ textTransform: "none" }}>
                      Đăng ký ngay
                    </Button>
                    <SignUpDialog open={signUpOpen} handleClose={handleSignUpClose} />
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
