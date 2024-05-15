import React from "react";
import { Box, Grid, Link, Paper, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";
import { BaseConfig } from "@/utils/config";
export const getServerSideProps: GetServerSideProps<{ articleStatus: any; commentStatus: any }> = async (context: any) => {
  // Fetch data from external API
  const cookies = parseCookies(context);

  // Retrieve accessToken from cookies
  const accessToken = cookies.accessToken;
  const res1 = await fetch(`http://${BaseConfig.BACKEND_HOST_IP}:${BaseConfig.BACKEND_HOST_PORT}/dashboard/total-comments `, {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const commentStatus: any = await res1.json();

  const res = await fetch(`http://${BaseConfig.BACKEND_HOST_IP}:${BaseConfig.BACKEND_HOST_PORT}/dashboard/total-articles`, {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const articleStatus: any = await res.json();
  return { props: { articleStatus, commentStatus } };
};

function Collaborator({ articleStatus, commentStatus }: any) {
  return (
    <Grid container spacing={3}>
      <Grid container spacing={1} sx={{ p: 2, borderRadius: 5, borderColor: grey[400], backgroundColor: "white", mt: 3 }}>
        <Grid item xs={12} sx={{ mt: 1, borderBottom: 1, borderColor: grey[400] }}>
          <Typography variant="h5" color={grey[600]}>
            <Link underline="hover" key="2" color="inherit" href="/collaborator/articles">
              Articles
            </Link>
          </Typography>
        </Grid>
        {/* Chart */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 200,
              alignItems: "center", // Center items horizontally
              justifyContent: "center", // Center items vertically
            }}
          >
            <Box
              sx={{
                backgroundColor: "#FFB803",

                borderRadius: 7,
                p: 1,
                color: "white",
                textAlign: "center",
              }}
            >
              PENDING
            </Box>
            <Typography variant="h6" sx={{ flex: 1, mt: 5 }}>
              {articleStatus.pending_totals} posts
            </Typography>

            <Link href={`/collaborator/articles?status=PENDING`} underline="none">
              Click here
            </Link>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 200,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                backgroundColor: "#00AF9B",

                borderRadius: 7,
                p: 1,
                color: "white",
                textAlign: "center",
              }}
            >
              APPROVED
            </Box>

            <Typography component="p" variant="h6" sx={{ flex: 1, mt: 5 }}>
              {articleStatus.approved_totals} posts
            </Typography>
            <Link href={`/collaborator/articles?status=APPROVED`} underline="none">
              Click here
            </Link>
          </Paper>
        </Grid>
        {/* Recent Deposits */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 200,
              alignItems: "center", // Center items horizontally
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                backgroundColor: "#FF2E55",
                borderRadius: 7,
                p: 1,
                color: "white",
                textAlign: "center",
              }}
            >
              REJECTED
            </Box>

            <Typography component="p" variant="h6" sx={{ flex: 1, mt: 5 }}>
              {articleStatus.rejected_totals} posts
            </Typography>
            <Link href={`/collaborator/articles?status=REJECTED`} underline="none">
              Click here
            </Link>
          </Paper>
        </Grid>
        {/* Recent Orders */}
      </Grid>
      <Grid container spacing={1} sx={{ p: 2, borderRadius: 5, borderColor: grey[400], backgroundColor: "white", mt: 3 }}>
        <Grid item xs={12} sx={{ mt: 1, borderBottom: 1, borderColor: grey[400] }}>
          <Typography variant="h5" color={grey[600]}>
            <Link underline="hover" key="2" color="inherit" href="/collaborator/comments">
              Comments
            </Link>
          </Typography>
        </Grid>
        {/* Chart */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 200,
              alignItems: "center", // Center items horizontally
              justifyContent: "center", // Center items vertically
            }}
          >
            <Box
              sx={{
                backgroundColor: "#FFB803",

                borderRadius: 7,
                p: 1,
                color: "white",
                textAlign: "center",
              }}
            >
              PENDING
            </Box>
            <Typography variant="h6" sx={{ flex: 1, mt: 5 }}>
              {commentStatus.pending_totals} comments
            </Typography>

            <Link href={`/collaborator/comments?status=PENDING`} underline="none">
              Click here
            </Link>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 200,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                backgroundColor: "#00AF9B",

                borderRadius: 7,
                p: 1,
                color: "white",
                textAlign: "center",
              }}
            >
              APPROVED
            </Box>

            <Typography component="p" variant="h6" sx={{ flex: 1, mt: 5 }}>
              {commentStatus.approved_totals} comments
            </Typography>
            <Link href={`/collaborator/comments?status=APPROVED`} underline="none">
              Click here
            </Link>
          </Paper>
        </Grid>
        {/* Recent Deposits */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 200,
              alignItems: "center", // Center items horizontally
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                backgroundColor: "#FF2E55",
                borderRadius: 7,
                p: 1,
                color: "white",
                textAlign: "center",
              }}
            >
              REJECTED
            </Box>

            <Typography component="p" variant="h6" sx={{ flex: 1, mt: 5 }}>
              {commentStatus.rejected_totals} comments
            </Typography>
            <Link href={`/collaborator/comments?status=REJECTED`} underline="none">
              Click here
            </Link>
          </Paper>
        </Grid>
        {/* Recent Orders */}
      </Grid>
    </Grid>
  );
}

export default Collaborator;
