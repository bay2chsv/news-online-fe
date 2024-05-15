import * as React from "react";
import { Box, Button, Tooltip } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SignInDialog from "./SignInDialog";
import SignUpDialog from "./SignUpDialog";
import InfoUser from "../InfoUser";
import { accessToken, refreshToken, userName } from "@/utils/auth";
import { useRouter } from "next/router";
import Typography from "@mui/material/Typography";

function MainAuth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = React.useState(false);
  const [signInOpen, setSignInOpen] = React.useState(false);

  const [signUpOpen, setSignUpOpen] = React.useState(false);

  const handleSignInOpen = () => {
    setSignInOpen(true);
  };
  const handleSignInClose = () => {
    setSignInOpen(false);
  };

  const handleSignUpOpen = () => {
    setSignUpOpen(true);
  };
  const handleSignUpClose = () => {
    setSignUpOpen(false);
  };

  React.useEffect(() => {
    if (accessToken) {
      setIsLogin(true);
    }
  }, [accessToken]);
  if (isLogin) {
    return (
      <Box>
        <InfoUser />
      </Box>
    );
  }
  return (
    <Box>
      <Tooltip title="Đăng nhập" sx={{ color: "black" }}>
        <Button onClick={handleSignInOpen} style={{ textTransform: "none" }}>
          <Typography>Đăng nhập</Typography>
        </Button>
      </Tooltip>
      <SignInDialog open={signInOpen} handleClose={handleSignInClose} />
    </Box>
  );
}

export default MainAuth;
