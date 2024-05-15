import { Box, Grid, Link, Paper, Typography } from "@mui/material";
import { blue, green, grey, purple, red, yellow } from "@mui/material/colors";

import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import PersonTwoToneIcon from "@mui/icons-material/PersonTwoTone";
import { formatDate } from "@/utils/formateData";
function AdminPageCSR({ userStatus, articleStatus, commentStatus, activity }: any) {
  return (
    <Box>
      <Grid>
        <Typography variant="h5"> Analytics</Typography>
      </Grid>
      <Box sx={{ pl: 2, mt: 5 }}>
        <Grid container spacing={1} sx={{ p: 2, borderRadius: 5, borderColor: grey[400], backgroundColor: "white" }}>
          <Grid item xs={12} sx={{ mt: 1, borderBottom: 1, borderColor: grey[400] }}>
            <Typography variant="h5" color={grey[600]}>
              <Link underline="hover" key="2" color="inherit" href="/admin/articles">
                Users
              </Link>
            </Typography>
          </Grid>
          {/* Chart */}
          <Grid item xs={12} md={8} spacing={1} sx={{ border: 1, borderRadius: 5, mt: 1 }}>
            <Box sx={{ borderBottom: 1, borderColor: grey[400] }}>
              <Typography> Activity log </Typography>
            </Box>
            {activity.data.map((article: any) => {
              if (article.article_status === "PENDING") {
                return (
                  <Box sx={{ m: 2, display: "flex" }}>
                    {article.author_role === "ROLE_COLLABORATOR" ? (
                      <Typography sx={{ fontWeight: "bold", mr: 1, color: blue[400] }}>{article.author_name} </Typography>
                    ) : article.author_role === "ROLE_JOURNALIST" ? (
                      <Typography sx={{ fontWeight: "bold", mr: 1, color: purple[400] }}>{article.author_name} </Typography>
                    ) : article.author_role === "ROLE_USER" ? (
                      <Typography sx={{ fontWeight: "bold", mr: 1, color: green[400] }}>{article.author_name} </Typography>
                    ) : (
                      <Typography sx={{ fontWeight: "bold", mr: 1 }}>{article.author_name}</Typography>
                    )}
                    <Typography sx={{ mr: 1 }}> posted an</Typography>
                    <Link underline="hover" href={`/admin/articles/${article.article_id}`} sx={{ mr: 1, color: yellow[600] }}>
                      article
                    </Link>
                    <Typography color={grey[600]}> at {formatDate(article.created_date)}</Typography>
                  </Box>
                );
              } else if (article.article_status === "REJECTED") {
                return (
                  <Box sx={{ m: 2, display: "flex" }}>
                    {article.author_role === "ROLE_COLLABORATOR" ? (
                      <Typography sx={{ fontWeight: "bold", mr: 1, color: blue[400] }}>{article.author_name} </Typography>
                    ) : article.author_role === "ROLE_JOURNALIST" ? (
                      <Typography sx={{ fontWeight: "bold", mr: 1, color: purple[400] }}>{article.author_name} </Typography>
                    ) : article.author_role === "ROLE_USER" ? (
                      <Typography sx={{ fontWeight: "bold", mr: 1, color: green[400] }}>{article.author_name} </Typography>
                    ) : (
                      <Typography sx={{ fontWeight: "bold", mr: 1 }}>{article.author_name}</Typography>
                    )}
                    <Typography sx={{ mr: 1, color: red[600] }}> rejected </Typography>
                    <Link underline="hover" href={`/admin/articles/${article.article_id}`} sx={{ mr: 1 }}>
                      aricle
                    </Link>
                    <Typography color={grey[600]}> at {formatDate(article.created_date)}</Typography>
                  </Box>
                );
              } else if (article.article_status === "APPROVED") {
                return (
                  <Box sx={{ m: 2, display: "flex" }}>
                    {article.author_role === "ROLE_COLLABORATOR" ? (
                      <Typography sx={{ fontWeight: "bold", mr: 1, color: blue[400] }}>{article.author_name} </Typography>
                    ) : article.author_role === "ROLE_JOURNALIST" ? (
                      <Typography sx={{ fontWeight: "bold", mr: 1, color: purple[400] }}>{article.author_name} </Typography>
                    ) : article.author_role === "ROLE_USER" ? (
                      <Typography sx={{ fontWeight: "bold", mr: 1, color: green[400] }}>{article.author_name} </Typography>
                    ) : (
                      <Typography sx={{ fontWeight: "bold", mr: 1 }}>{article.author_name}</Typography>
                    )}
                    <Typography sx={{ mr: 1 }}> approved an</Typography>
                    <Link underline="hover" href={`/admin/articles/${article.article_id}`} sx={{ mr: 1, color: green[600] }}>
                      article
                    </Link>
                    <Typography color={grey[600]}> at {formatDate(article.created_date)}</Typography>
                  </Box>
                );
              } else {
              }
            })}
          </Grid>
          <Grid item xs={12} md={4}>
            <Grid>
              <Grid container>
                <PieChart
                  series={[
                    {
                      data: [
                        { id: 0, value: userStatus.user_totals, label: "User" },
                        { id: 1, value: userStatus.collaborator_totals, label: "Collaborator" },
                        { id: 2, value: userStatus.journalist_totals, label: "Journalist" },
                      ],
                    },
                  ]}
                  width={400}
                  height={200}
                />
              </Grid>
              <Grid container sx={{ textAlign: "center", justifyContent: "center", justifyItems: "center" }}>
                <Grid item xs={4}>
                  <PersonTwoToneIcon />
                  <Box> User</Box>
                  <Typography> {userStatus.user_totals}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <SupervisorAccountOutlinedIcon />
                  <Box> Collaborator</Box>
                  {userStatus.collaborator_totals}
                </Grid>
                <Grid item xs={4}>
                  <PeopleAltOutlinedIcon />
                  <Box>Journalist</Box>
                  {userStatus.journalist_totals}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={1} sx={{ p: 2, borderRadius: 5, borderColor: grey[400], backgroundColor: "white", mt: 3 }}>
          <Grid item xs={12} sx={{ mt: 1, borderBottom: 1, borderColor: grey[400] }}>
            <Typography variant="h5" color={grey[600]}>
              <Link underline="hover" key="2" color="inherit" href="/admin/articles">
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

              <Link href={`/admin/articles?status=PENDING`} underline="none">
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
              <Link href={`/admin/articles?status=APPROVED`} underline="none">
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
              <Link href={`/admin/articles?status=REJECTED`} underline="none">
                Click here
              </Link>
            </Paper>
          </Grid>
          {/* Recent Orders */}
        </Grid>
        <Grid container spacing={1} sx={{ p: 2, borderRadius: 5, borderColor: grey[400], backgroundColor: "white", mt: 3 }}>
          <Grid item xs={12} sx={{ mt: 1, borderBottom: 1, borderColor: grey[400] }}>
            <Typography variant="h5" color={grey[600]}>
              <Link underline="hover" key="2" color="inherit" href="/admin/comments">
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

              <Link href={`/admin/comments?status=PENDING`} underline="none">
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
              <Link href={`/admin/comments?status=APPROVED`} underline="none">
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
              <Link href={`/admin/comments?status=REJECTED`} underline="none">
                Click here
              </Link>
            </Paper>
          </Grid>
          {/* Recent Orders */}
        </Grid>
      </Box>
    </Box>
  );
}

export default AdminPageCSR;
