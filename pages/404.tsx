import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";

const containerStyle = {
  height: "100vh",
  backgroundColor: "black",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const textStyle: any = {
  color: "white",
  fontWeight: "bold",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  fontSize: "3rem",
  textAlign: "center",
};

const Custom404 = () => {
  const router = useRouter();
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/");
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);
  return (
    <Grid container style={containerStyle}>
      <Grid item>
        <Typography variant="h3" style={textStyle}>
          404 - Page Not Found
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Custom404;
