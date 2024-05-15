import AuthAPI from "@/api/AuthAPI";
import ResetPasswordDialog from "@/components/Dialog/ResetPasswordDialog";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import FilledInput from "@mui/material/FilledInput";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import * as React from "react";
import { accessToken, role } from "@/utils/auth";
import logo from "../components/image/2.jpg";
function ManageInfoHub() {
  const router = useRouter();
  const validateEmail = (email: string) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };
  const [message, setMessage] = React.useState<String>("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [ResetOpen, setResetOpen] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = event.currentTarget.email.value;

    if (!validateEmail(email)) {
      Swal.fire({
        title: "warning",
        text: "Please enter a valid email adress (ex: abc@gmail.com)",
        icon: "warning",
      });
      return;
    } else if (password.length < 8) {
      Swal.fire({
        title: "warning",
        text: "Password must be greater than 8 characters.",
        icon: "warning",
      });
      return;
    }
    try {
      const { data } = await AuthAPI.signin({
        email: email,
        password: password,
      });
      if (data.role !== "ROLE_USER") {
        const userName = data?.email.split("@");
        Cookies.set("accessToken", data.accessToken);
        Cookies.set("userName", userName[0]);
        Cookies.set("role", data.role);
        Cookies.set("refreshToken", data.refreshToken);
        Cookies.set("image", data.image);
        Cookies.set("id", data.id);
        Swal.fire({
          title: "Success",
          text: "Login successfully",
          icon: "success",
        });

        if (data.role === "ROLE_ADMIN") {
          window.location.href = "/admin";
        } else if (data.role === "ROLE_JOURNALIST") {
          window.location.href = "/journalist";
        } else if (data.role === "ROLE_COLLABORATOR") {
          window.location.href = "/collaborator";
        }
      } else {
        Swal.fire({
          title: "warning",
          text: "Unauthorized",
          icon: "warning",
        });
      }
    } catch (error: any) {
      Swal.fire({
        title: "warning",
        text: `${error.response.data.message}`,
        icon: "warning",
      });
    }
  };

  const handleResetOpen = () => {
    setResetOpen(true);
  };
  const handleResetClose = () => {
    setResetOpen(false);
  };

  React.useEffect(() => {
    if (role && accessToken) {
      if (role === "ROLE_ADMIN") {
        router.push("/admin");
      } else if (role === "ROLE_JOURNALIST") {
        router.push("/journalist");
      } else if (role === "ROLE_COLLABORATOR") {
        router.push("/collaborator");
      }
    }
  }, [role]);

  return (
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
        Sign In ManageInfoHub
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
              Sign In
            </Button>
          </Grid>
          <Grid container>
            <Grid item xs>
              <Button onClick={handleResetOpen} style={{ textTransform: "none" }}>
                Quên mật khẩu
              </Button>
              <ResetPasswordDialog open={ResetOpen} handleClose={handleResetClose} />
            </Grid>
            <Grid item sx={{ mr: 2 }}>
              <Button
                style={{ textTransform: "none" }}
                onClick={() => {
                  router.push("/");
                }}
              >
                Home
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default ManageInfoHub;
