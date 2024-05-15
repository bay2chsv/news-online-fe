import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import { Box, Container, Link } from "@mui/material";
import { red } from "@mui/material/colors";
import ArticleAPI from "@/api/ArticleAPI";
import { useSearchParams } from "next/navigation";
function index() {
  const searchParams = useSearchParams();
  const tin = searchParams.get("tin");
  const tag = searchParams.get("name");
  const code = searchParams.get("code");
  const [articles, setArticles] = React.useState([]);
  React.useEffect(() => {
    if (tin) {
      fetchDataArticlesBySearch(25, tin);
    }
    if (code) {
      fetchDataArticleByTag(code);
    }
  }, [tin, code, tag]);
  const fetchDataArticlesBySearch = async (limit: any, tin?: any) => {
    try {
      const { data } = await ArticleAPI.displayArticlesUser(limit, tin);
      setArticles(data.data);
    } catch (error) {}
  };
  const fetchDataArticleByTag = async (code: any) => {
    try {
      const { data } = await ArticleAPI.findByTag(code);
      setArticles(data.data);
    } catch (error) {}
  };
  return (
    <Box>
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        <Typography variant="h4" sx={{ ml: 10, fontWeight: "bold" }}>
          {tin ? `TÌM KIẾM: "${tin}"` : code ? `TAG:"${tag}"` : <></>}
        </Typography>
        <Grid container xs={6} sx={{ ml: 3 }}>
          {articles.length > 0 ? (
            articles.map((article: any) => (
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
            ))
          ) : (
            <Grid container justifyContent={"center"}>
              <Typography variant="h5">Không tìm thấy kết quả chứa từ khóa của bạn</Typography>
            </Grid>
          )}
        </Grid>
      </Container>
      <Grid item xs={3} />
    </Box>
  );
}

export default index;
