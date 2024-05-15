import React from "react";
import { Tooltip, IconButton, Avatar, Menu, MenuItem, Typography, Button } from "@mui/material";
import { accessToken, image, role } from "@/utils/auth";
import LoginIcon from "@mui/icons-material/Login";
import { useRouter } from "next/router";
import AuthAPI from "@/api/AuthAPI";
import Cookies from "js-cookie";
function InfoUser() {
  const router = useRouter();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleSubmit = async () => {
    try {
      const respose = await AuthAPI.Logout(accessToken);
      const cookieNames = Object.keys(Cookies.get());
      // Remove each cookie
      cookieNames.forEach((cookieName) => {
        Cookies.remove(cookieName);
      });
      if (["/admin", "/collaborator", "/journalist"].some((path) => router.pathname.startsWith(path))) {
        window.location.href = "/manageinfohub";
      } else {
        router.reload();
      }
    } catch (error: any) {}
  };

  return (
    <React.Fragment>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ ml: 2 }}>
          <Avatar src={image} alt="Remy Sharp" />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem onClick={handleCloseUserMenu}>
          <Button
            style={{ textTransform: "none", color: "black" }}
            onClick={() => {
              if (role === "ROLE_USER") {
                window.location.href = "/profile";
              } else if (role === "ROLE_ADMIN") {
                window.location.href = "/admin/profile";
              } else if (role === "ROLE_COLLABORATOR") {
                window.location.href = "/collaborator/profile";
              } else {
                window.location.href = "/journalist/profile";
              }
            }}
          >
            Thông tin chung
          </Button>
        </MenuItem>
        <MenuItem>
          <Button
            style={{ textTransform: "none", color: "black" }}
            onClick={() => {
              handleSubmit();
            }}
            endIcon={<LoginIcon />}
          >
            <Typography>Đăng xuất</Typography>
          </Button>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}

export default InfoUser;
