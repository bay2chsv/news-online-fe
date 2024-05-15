import * as React from "react";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { Box, Button, Card, CardActionArea, CardContent, CardMedia, Divider, Link, Paper, Typography } from "@mui/material";
import { useRouter } from "next/router";
import CategoryAPI from "@/api/CategoryAPI";
import ArticleAPI from "@/api/ArticleAPI";
import { pink, blue, red, grey } from "@mui/material/colors";
import FeaturedPost from "@/components/FeaturedPost";
import Hotnew from "@/components/Hotnew";
// Sample category data with short content

export default function Blog() {
  const router = useRouter();
  const [categories, setCategories] = React.useState([]);
  const [articles, setArticles] = React.useState([]);
  const fetchDataCategories = async (limit: number) => {
    try {
      const { data } = await CategoryAPI.getAll(limit);
      setCategories(data.data);
    } catch (error) {}
  };
  const fetchDataArticles = async (limit: any) => {
    try {
      const { data } = await ArticleAPI.displayArticlesUser(limit);
      setArticles(data.data);
    } catch (error) {}
  };
  React.useEffect(() => {
    fetchDataCategories(50);
    fetchDataArticles(150);
  }, []);

  return (
    <Box sx={{ m: 1, padding: 1 }}>
      <Container maxWidth="lg">
        <Grid container sx={{ mb: 2 }}>
          <Grid item xs={8}>
            <FeaturedPost post={articles.slice(0, 5)} />
          </Grid>
          <Grid item xs={4}>
            <Hotnew news={articles.slice(0, 5)} />
          </Grid>
        </Grid>
        <Grid container>
          <Grid container>
            <Grid xs={7}>
              {categories
                .sort((a: any, b: any) => {
                  const subCategoryCountA = categories.filter((category: any) => category.parentId === a.id).length;
                  const subCategoryCountB = categories.filter((category: any) => category.parentId === b.id).length;
                  return subCategoryCountB - subCategoryCountA;
                })
                .filter((parentCategory: any) => parentCategory.parentId === null)
                .map((parentCategory: any) => (
                  <Grid item xs={12} key={parentCategory.id} sx={{ mt: 2 }}>
                    <Paper sx={{ p: 2 }}>
                      <Grid container>
                        <Grid display={"flex"}>
                          <Button
                            onClick={() => {
                              router.push(`/${parentCategory.code}`);
                            }}
                            sx={{
                              textTransform: "none",
                              color: "black",

                              "&:hover": { backgroundColor: "transparent", color: red[500] },
                            }}
                          >
                            <Typography variant="h5">{parentCategory.name}</Typography>
                          </Button>
                          {categories
                            .filter((category: any) => category.parentId === parentCategory.id)
                            .map((subCategory: any) => (
                              <Grid item key={subCategory.id} sx={{ m: 1 / 2 }}>
                                <Box sx={{ borderRadius: 2, mt: 1 }}>
                                  <Button
                                    sx={{
                                      textTransform: "none",
                                      color: "black",

                                      "&:hover": { backgroundColor: "transparent", color: red[500] },
                                    }}
                                    onClick={() => {
                                      router.push(`/${parentCategory.code}/${subCategory.code}`);
                                    }}
                                  >
                                    <Typography variant="subtitle2">{subCategory.name}</Typography>
                                  </Button>
                                </Box>
                              </Grid>
                            ))}
                        </Grid>
                        <Box>
                          <Grid container spacing={1} sx={{ p: 1 }}>
                            {articles
                              .filter((article: any) => parentCategory.id === article.cate_parent_id)
                              .slice(0, 1)
                              .map((article: any) => (
                                <>
                                  <Grid item xs={12} md={5}>
                                    <img
                                      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }}
                                      src={article.thumbnailUrl}
                                      alt={article.title}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={7}>
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
                                      <Typography sx={{ fontWeight: "bold" }} variant="h6">
                                        {article.title}
                                      </Typography>
                                    </Link>
                                    <>
                                      {article.description.length > 150 ? `${article.description.slice(0, 150)}...` : article.description}
                                    </>
                                  </Grid>
                                </>
                              ))}
                          </Grid>
                          <Grid container sx={{ mt: 2, borderTop: 1, pt: 2, pb: 2, borderColor: grey[400] }}>
                            {articles
                              .filter((article: any) => parentCategory.id === article.cate_parent_id)
                              .slice(1, 4)
                              .map((article: any) => (
                                <Grid item xs={12} md={4} justifyContent="center" alignItems="center" sx={{ p: 1 }}>
                                  <Link
                                    sx={{
                                      color: "black",
                                      textDecoration: "none",
                                      "&:hover": {
                                        color: red[300],
                                        textDecoration: "none",
                                      },
                                    }}
                                    underline="none"
                                    href={`/${article.cate_parent_code}/${article.categoryCode + `/${article.id}` ?? ""}`}
                                  >
                                    <Typography sx={{ fontWeight: "bold" }} variant="inherit">
                                      ● {article.title.length > 100 ? ` ${article.title.slice(0, 50)}...` : article.title}
                                    </Typography>
                                  </Link>
                                </Grid>
                              ))}
                          </Grid>
                        </Box>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}
            </Grid>
            <Grid xs={5} sx={{ pl: 2 }}>
              {articles.slice(0, 7).map((article: any) => (
                <Box sx={{ mt: 2 }}>
                  <Card sx={{ display: "flex" }}>
                    <CardContent sx={{ flex: 1 }}>
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
                        <Typography component="h4" variant="h6">
                          {article.title}
                        </Typography>
                        <Typography variant="subtitle1" paragraph>
                          {article.description.length > 100 ? `${article.description.slice(0, 100)}...` : article.description}
                        </Typography>
                        <Typography variant="subtitle1" color="primary">
                          Xem thêm
                        </Typography>
                      </Link>
                    </CardContent>
                    <CardMedia component="img" sx={{ width: 200, display: { xs: "none", sm: "block" } }} image={article.thumbnailUrl} />
                  </Card>
                </Box>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
