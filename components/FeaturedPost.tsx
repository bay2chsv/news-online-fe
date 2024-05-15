import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import { Box, Divider, Link } from "@mui/material";
import { grey, red } from "@mui/material/colors";

export default function FeaturedPost({ post }: any) {
  return (
    <React.Fragment>
      <Grid container sx={{ backgroundColor: "#EEE6E6", borderRadius: 5 }}>
        {Array.isArray(post) &&
          post.slice(0, 1).map((article: any) => (
            <>
              {/* image */}
              <Grid xs={7} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }} src={article.thumbnailUrl} alt={article.title} />
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
                    <Typography variant="h6">
                      <Box sx={{ fontWeight: "bold" }}>{article.title}</Box>
                    </Typography>
                  </Link>
                </Box>
                {/* description */}
                <Typography>
                  {article.description.length > 100 ? `${article.description.slice(0, 170)}...` : article.description}
                </Typography>
              </Grid>
            </>
          ))}
      </Grid>
      <Grid container xs={12} sx={{ mt: 4 }}>
        {Array.isArray(post) &&
          post.slice(1, 4).map((article: any, index: number) => (
            <Grid
              item
              xs={12}
              md={4}
              justifyContent="center"
              alignItems="center"
              sx={{
                pl: 2,
                pr: 2,
                borderRight: index !== post.slice(1, 4).length - 1 ? 1 : 0,
                borderColor: grey[400],
              }}
            >
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
                <Typography sx={{ fontWeight: "bold" }}>{article.title}</Typography>
              </Link>
              {article.description.length > 100 ? `${article.description.slice(0, 100)}...` : article.description}
            </Grid>
          ))}
      </Grid>
      <Divider sx={{ mt: 3 }} />
    </React.Fragment>
  );
}
