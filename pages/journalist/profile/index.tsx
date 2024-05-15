// InfoUser.tsx
import React, { useEffect, useState } from "react";
import { Button, Typography, TextField, Grid, Avatar, Paper, Container, Link, Divider } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { accessToken, refreshToken } from "@/utils/auth";
import AuthAPI from "@/api/AuthAPI";
import Cookies from "js-cookie";
import router from "next/router";
import UserAPI from "@/api/UserAPI";
import MuiPhoneNumber from "mui-phone-number";
import Swal from "sweetalert2";
const InfoUser = () => {
  const [user, setUser] = useState({ id: null, fullName: null, email: null, imageUrl: null });
  const [userName, setUserName] = useState("");
  const fetchDataProfile = async () => {
    try {
      const { data } = await UserAPI.profile(accessToken);
      setUser({ id: data.id, fullName: data.fullName, email: data.email, imageUrl: data.imageUrl });
      setUserName(data.fullName);
    } catch (error) {}
  };

  useEffect(() => {
    fetchDataProfile();
  }, []);
  const handleSubmit = async () => {
    try {
      const respose = await AuthAPI.Logout(accessToken);
      const cookieNames = Object.keys(Cookies.get());
      // Remove each cookie
      cookieNames.forEach((cookieName) => {
        Cookies.remove(cookieName);
      });

      router.reload();
    } catch (error: any) {}
  };
  const handleImageChange = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const { data } = await UserAPI.upload(file, accessToken);
      Cookies.set("image", data.imageUrl);
      router.reload();
    }
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const [phone, setPhone] = useState();
  function handleOnChange(value: any) {
    setPhone(value);
  }
  const updateProfile = async () => {
    let fullName = user.fullName || "";
    if (fullName.length <= 3) {
      Swal.fire({
        title: "failed",
        text: `tên hiện thị phải có độ dài hơn 3 ký tự`,
        icon: "warning",
      });
      return;
    }
    try {
      const respose = await UserAPI.updateProfile(accessToken, { fullName: user.fullName });
      if (respose) router.reload();
    } catch (error: any) {}
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={5} sx={{ mt: 1 }}>
        <Grid item xs={4}>
          <Paper sx={{ p: 2 }}>
            <Grid container direction="column" spacing={2}>
              <Grid item sx={{ display: "flex", alignItems: "center" }}>
                <label htmlFor="upload-avatar">
                  <Avatar alt="Remy Sharp" src={user.imageUrl || ""} sx={{ width: 80, height: 80, cursor: "pointer" }} />
                  <input id="upload-avatar" type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />
                </label>
                <Typography sx={{ ml: 1 }} variant="h6">
                  {userName}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">User Information</Typography>
              </Grid>
              <Grid item>
                <Button
                  style={{ textTransform: "none", color: "black" }}
                  onClick={() => {
                    handleSubmit();
                  }}
                  endIcon={<LoginIcon />}
                >
                  <Typography>Log out</Typography>
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={8} sx={{ p: 2 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Account Information
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Grid xs={12}>
              <Typography sx={{ fontWeight: "bold" }}>Display name</Typography>
            </Grid>
            <Grid xs={8}>
              <TextField value={user.fullName} onChange={handleChange} size="small" name="fullName" id="fullName" fullWidth />
            </Grid>
            <Divider sx={{ my: 1 }} />
            <Grid>
              <Typography sx={{ fontWeight: "bold" }}>Email</Typography>
            </Grid>
            <Grid xs={8}>
              <TextField value={user.email} disabled size="small" id="email" fullWidth />
            </Grid>
            <Divider sx={{ my: 1 }} />
            <Grid xs={8}>
              <Typography sx={{ fontWeight: "bold" }}>PhoneNumber</Typography>
            </Grid>
            <Grid xs={8}>
              <MuiPhoneNumber defaultCountry={"vn"} onChange={handleOnChange} />
            </Grid>
            <Divider sx={{ my: 1 }} />
            <Grid xs={8}>
              <Typography sx={{ fontWeight: "bold" }}>Address</Typography>
            </Grid>
            <Grid xs={8}>
              <TextField size="small" id="Address" fullWidth />
            </Grid>
            {/* <Grid xs={8}>
              <Typography sx={{ fontWeight: "bold" }}>Password</Typography>
            </Grid>
            <Grid xs={8}>
              <TextField size="small" id="password" type={"password"} fullWidth />
            </Grid> */}
            <Divider sx={{ my: 1 }} />
            <Grid sx={{ textAlign: "right" }}>
              <Button sx={{ textTransform: "none" }} onClick={updateProfile}>
                Save changes
              </Button>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default InfoUser;
