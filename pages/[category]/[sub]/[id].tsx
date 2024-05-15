import Hotnew from "@/components/Hotnew";
import Content from "@/components/Content";
import { Box, Button, Container, Grid, Link, TextField, Tooltip, Typography } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import React, { useEffect, useState } from "react";
import CommentIcon from "@mui/icons-material/Comment";
import TurnedInIcon from "@mui/icons-material/TurnedIn";
import Comment from "@/components/Comment";
import { useRouter } from "next/router";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { accessToken, baseUrl } from "@/utils/auth";
import Breadcrumb from "@/components/Breadcrumb";
import ArticleAPI from "@/api/ArticleAPI";
import { red } from "@mui/material/colors";
import SignInDialog from "@/components/Dialog/SignInDialog";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
export const getServerSideProps: GetServerSideProps<{ repo: any }> = async (context) => {
  // Fetch data from external API

  const res = await fetch(`${baseUrl}/home/article/${context.query.id}`); //192.168.20.19
  if (res.status === 400) {
    // Redirect to a 404 page
    return {
      redirect: {
        destination: "/404", // The path to your 404 page
        permanent: false,
      },
    };
  }
  //192.168.20.19

  const repo: any = await res.json();
  return { props: { repo } };
};
const Sub: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ repo }) => {
  const { articleId, subCatName, subCatCode, pCatName, pCatCode } = repo;
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href={`/${pCatCode}`}>
      {pCatName}
    </Link>,
    <Link underline="hover" key="2" color="inherit" href={`/${pCatCode}/${subCatCode}`}>
      {subCatName}
    </Link>,
  ];
  const [isSave, setIsSave] = useState(false);
  const [articles, setArticles] = React.useState([]);

  const checkSave = async () => {
    const { data } = await ArticleAPI.checkSave(articleId, accessToken);
    console.log(data.is_saved);
    setIsSave(data.is_saved);
  };
  React.useEffect(() => {
    fetchDataArticles(8);
    if (accessToken) {
      checkSave();
    }
  }, [isSave]);
  const fetchDataArticles = async (limit: any, tin?: any) => {
    try {
      const { data } = await ArticleAPI.displayArticlesUser(limit, tin);
      setArticles(data.data);
    } catch (error) {}
  };

  const saveArticle = async () => {
    if (!accessToken) {
      handleSignInOpen();
      return;
    }
    const { data } = await ArticleAPI.saveAricle(articleId, accessToken);
    setIsSave(data.is_saved);
  };

  const [signInOpen, setSignInOpen] = useState(false);
  const handleSignInOpen = () => {
    setSignInOpen(true);
  };
  const handleSignInClose = () => {
    setSignInOpen(false);
  };

  const scrollToComment = () => {
    // Get the position of the comment section relative to the viewport
    window.scrollTo({ top: 4000, behavior: "smooth" });
  };
  return (
    <Container maxWidth="lg">
      <Grid container>
        <Grid item xs={12} md={1}>
          <Grid sx={{ position: "sticky", top: 100, color: "black" }}>
            <Tooltip title="Ý kiến" placement="left" color="secondary">
              <Button onClick={scrollToComment}>
                <CommentIcon />
              </Button>
            </Tooltip>
            {isSave ? (
              <Tooltip title="Lưu" color="error" placement="left-end">
                <Button onClick={saveArticle}>
                  <TurnedInIcon />
                </Button>
              </Tooltip>
            ) : (
              <Tooltip title="Lưu" color="error" placement="left-end">
                <Button onClick={saveArticle}>
                  <BookmarkBorderIcon />
                </Button>
              </Tooltip>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} md={7}>
          <Grid container alignItems={"center"}>
            <Grid item>
              <Breadcrumb breadcrumbs={breadcrumbs} />
            </Grid>
          </Grid>
          <Content data={repo} tags={repo.tags} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h4" sx={{ ml: 5, fontWeight: "bold" }}>
            TIN MỚI🔥
          </Typography>
          {articles.map((article: any) => (
            <Grid sx={{ display: "flex", m: 3 }}>
              {/* image */}
              <Grid xs={7} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img
                  style={{ maxWidth: "100%", maxHeight: "90%", objectFit: "cover", borderRadius: 5 }}
                  src={article.thumbnailUrl}
                  alt={article.title}
                />
              </Grid>
              {/* content */}
              <Grid xs={5} sx={{ p: 1 }}>
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
                      <Box sx={{ fontWeight: "bold" }}>{article.title}</Box>
                    </Typography>
                  </Link>
                </Box>
                {/* description */}
              </Grid>
            </Grid>
          ))}
        </Grid>
        <Grid item xs={12} md={1}></Grid>
        <Grid item xs={12} md={11} id="comment-section">
          <Comment />
        </Grid>
      </Grid>
      <SignInDialog open={signInOpen} handleClose={handleSignInClose} />
    </Container>
  );
};
export default Sub;
