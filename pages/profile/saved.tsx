// InfoUser.tsx
import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  TextField,
  Grid,
  Avatar,
  Paper,
  Container,
  Link,
  Divider,
  Box,
  Stack,
  Pagination,
  Tooltip,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { accessToken, refreshToken } from "@/utils/auth";
import AuthAPI from "@/api/AuthAPI";
import Cookies from "js-cookie";
import router from "next/router";
import UserAPI from "@/api/UserAPI";
import MuiPhoneNumber from "mui-phone-number";
import Swal from "sweetalert2";
import { grey, red } from "@mui/material/colors";
import ArticleAPI from "@/api/ArticleAPI";
import { formatDate } from "@/utils/formateData";
import TurnedInIcon from "@mui/icons-material/TurnedIn";
function saved() {
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
  const handleImageChange = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const { data } = await UserAPI.upload(file, accessToken);
      Cookies.set("image", data.imageUrl);
      router.reload();
    }
  };
  const handleSubmit = async () => {
    try {
      const respose = await AuthAPI.Logout(accessToken);
      const cookieNames = Object.keys(Cookies.get());
      // Remove each cookie
      cookieNames.forEach((cookieName) => {
        Cookies.remove(cookieName);
      });

      router.reload();
    } catch (error: any) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
    }
  };
  const [isSave, setIsSave] = useState(true);
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(5);
  const fetchDataArticlesBySub = async (limit: number, page: number) => {
    try {
      const { data } = await ArticleAPI.articleSave(limit, page, accessToken);
      console.log(data);
      setArticles(data.data);
      setPage(data.page);
      setTotalPage(data.totalPage);
    } catch (error) {}
  };
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    fetchDataArticlesBySub(3, page);
  }, [page, isSave]);
  const saveArticle = async (articleId: any) => {
    const { data } = await ArticleAPI.saveAricle(articleId, accessToken);
    setIsSave(data.is_saved);
  };
  return (
    <Container maxWidth="lg">
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
                <Typography variant="h6">Thông tin chung</Typography>
              </Grid>
              <Grid item>
                <Link
                  href="/profile/saved"
                  underline="none"
                  style={{ color: "black" }}
                  onMouseEnter={(e: any) => {
                    e.target.style.textDecoration = "underline";
                    e.target.style.color = "red";
                  }}
                  onMouseLeave={(e: any) => {
                    e.target.style.textDecoration = "none";
                    e.target.style.color = "black";
                  }}
                >
                  Tin đã lưu
                </Link>
              </Grid>
              <Grid item>
                <Link
                  href="/profile/commented"
                  underline="none"
                  style={{ color: "black" }}
                  onMouseEnter={(e: any) => {
                    e.target.style.textDecoration = "underline";
                    e.target.style.color = "red";
                  }}
                  onMouseLeave={(e: any) => {
                    e.target.style.textDecoration = "none";
                    e.target.style.color = "black";
                  }}
                >
                  Ý kiến của bạn
                </Link>
              </Grid>
              <Grid item>
                <Button
                  style={{ textTransform: "none", color: "black" }}
                  onClick={() => {
                    handleSubmit();
                  }}
                  endIcon={<LoginIcon />}
                >
                  <Typography>Đăng xuất</Typography>
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={8} sx={{ p: 2 }}>
          {" "}
          <Paper sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: "bold" }} variant="h5">
              Tin đã lưu
            </Typography>
            {articles.length > 0 ? (
              articles.map((article: any) => (
                <Grid sx={{ display: "flex", m: 3, borderBottom: 1, borderColor: grey[400] }}>
                  {/* image */}
                  <Grid xs={5} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img
                      style={{ maxWidth: "100%", maxHeight: "90%", objectFit: "cover", borderRadius: 5 }}
                      src={article.thumbnailUrl}
                      alt={article.title}
                    />
                  </Grid>
                  {/* content */}
                  <Grid xs={7} sx={{ p: 1 }}>
                    {/* title */}
                    <Box sx={{ mb: 2 }}>
                      <Link
                        href={`/${article.cate_parent_code}/${article.categoryCode + `/${article.id}` ?? ""}`}
                        sx={{
                          color: "black",
                          textDecoration: "none",
                          "&:hover": {
                            color: red[300],
                            textDecoration: "none",
                          },
                        }}
                        underline="none"
                      >
                        <Typography variant="inherit">
                          <Box>{article.title}</Box>
                        </Typography>
                      </Link>
                    </Box>
                    <Typography variant="inherit" color={grey[400]}>
                      <Box>
                        {article.categoryName} {formatDate(article.createdDate)}
                        <Tooltip title="Lưu" color="error" placement="left-end">
                          <Button onClick={() => saveArticle(article.id)}>
                            <TurnedInIcon />
                          </Button>
                        </Tooltip>
                      </Box>
                    </Typography>
                  </Grid>
                </Grid>
              ))
            ) : (
              <Grid container justifyContent={"center"}>
                <Typography variant="h5">Không có tin đã lưu</Typography>
              </Grid>
            )}
            {page < 0 ? null : (
              <Stack spacing={2}>
                <Pagination count={totalPage} page={page} onChange={handleChange} />
              </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default saved;
