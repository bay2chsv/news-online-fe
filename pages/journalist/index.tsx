import { Grid, Paper } from "@mui/material";
import { useRouter } from "next/router";

import React, { useEffect } from "react";

function Journalist() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to "/collaborator/articles" when the component mounts
    router.replace("/journalist/articles");
  }, []);
  return (
    <Grid container spacing={3}>
      {/* Chart */}
      <Grid item xs={12} md={8} lg={9}>
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            height: 260,
            width: "auto",
          }}
        >
          ""
        </Paper>
      </Grid>
      {/* Recent Deposits */}
      <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 240,
          }}
        >
          ""
        </Paper>
      </Grid>
      {/* Recent Orders */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>""</Paper>
      </Grid>
    </Grid>
  );
}

export default Journalist;
