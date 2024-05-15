import { formatDate } from "@/utils/formateData";
import { Avatar, Button, Divider, Drawer, Grid, Link, Toolbar } from "@mui/material";
import { grey, red } from "@mui/material/colors";
import Typography from "@mui/material/Typography";

import React from "react";

function Content({ data, tags }: any) {
  return (
    <React.Fragment>
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        {data.title}
      </Typography>
      <Grid container alignItems={"center"} justifyContent="space-between" sx={{ p: 2, borderBottom: 1, borderColor: grey[400] }}>
        <Grid item display={"flex"} alignItems={"center"}>
          <Avatar src={data.authorImageUrl} alt="Remy Sharp" />
          <Typography sx={{ ml: 2, fontWeight: "bold" }}>{data.authorFullName}</Typography> - {data.authorEmail}
        </Grid>
        <Grid item>
          <>{formatDate(data.createdDate)}</>
        </Grid>
      </Grid>
      <Typography sx={{ fontSize: "125%", mt: 2 }}> {data.description}</Typography>
      <div style={{ fontSize: "125%" }} dangerouslySetInnerHTML={{ __html: data.content }} />
      <Divider />
      <Toolbar>
        Tags:
        {tags.map((tag: any) => (
          <Link
            key={tag.id}
            href={`/search?code=${tag.code}&name=${tag.name}`}
            underline="hover"
            style={{
              marginLeft: 10,
              marginRight: 10,
              color: red[400],
              padding: "2px",
              textTransform: "none",
            }}
          >
            <Typography variant="subtitle2" color="inherit">
              {tag.name}
            </Typography>
          </Link>
        ))}
      </Toolbar>
      <Divider />
    </React.Fragment>
  );
}

export default Content;
