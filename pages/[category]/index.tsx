import ArticleAPI from "@/api/ArticleAPI";
import Breadcrumb from "@/components/Breadcrumb";
import Hotnew from "@/components/Hotnew";

import { Box, Container, Divider, Grid, Link, Pagination, Stack, Typography } from "@mui/material";
import { grey, red } from "@mui/material/colors";
import { useRouter } from "next/router";

import React, { useEffect, useState } from "react";

export default function index() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(5);

  const [data, setData] = useState([]);
  const fetchDataArticlesBySub = async (limit: number, page: number) => {
    try {
      const { data } = await ArticleAPI.displayArticleUserParentAndSub(limit, page, router.query.category);
      console.log(data);
      setArticles(data.data);
      setPage(data.page);
      setTotalPage(data.totalPage);
    } catch (error) {}
  };
  const fetchDataArticles = async (limit: any) => {
    try {
      const { data } = await ArticleAPI.displayArticlesUser(limit);
      setData(data.data);
    } catch (error) {}
  };
  useEffect(() => {
    if (router.query.category) {
      fetchDataArticlesBySub(5, page);
    }
    fetchDataArticles(5);
  }, [page, router.query.category]);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href={`/`}>
      Home
    </Link>,
    <Link underline="hover" key="1" color="inherit" href={`/${router.query.category}`}>
      {router.query.category}
    </Link>,
    <Link underline="hover" key="2" color="inherit" href={`${router.query.sub}`}>
      {router.query.sub}
    </Link>,
  ];

  return (
    <Box sx={{ background: "white", m: 1, padding: 1 }}>
      <Container maxWidth="lg">
        <Breadcrumb breadcrumbs={breadcrumbs} />
        <Grid container>
          <Grid item xs={8}>
            {articles.length > 0 ? (
              <>
                {articles.slice(0, 1).map((article: any) => (
                  <Grid sx={{ display: "flex", m: 3, borderBottom: 1, borderColor: grey[400] }}>
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
                      <>{article.description.length > 150 ? `${article.description.slice(0, 150)}...` : article.description}</>
                    </Grid>
                    <Divider />
                  </Grid>
                ))}
                {articles.slice(1, 5).map((article: any) => (
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
                      <>{article.description.length > 150 ? `${article.description.slice(0, 150)}...` : article.description}</>
                    </Grid>{" "}
                  </Grid>
                ))}
              </>
            ) : (
              <Grid container justifyContent={"center"}>
                <Typography variant="h5">Không có tin trong {router.query.sub}</Typography>
              </Grid>
            )}
            <Stack spacing={2}>
              <Typography>Page: {page}</Typography>
              <Pagination count={totalPage} page={page} onChange={handleChange} />
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Hotnew news={data} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
