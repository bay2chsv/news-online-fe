import * as React from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { grey } from "@mui/material/colors";
import Box from "@mui/material/Box";

export default function Sidebar({ archives, social }: any) {
  return (
    <Grid container sx={{ borderLeft: 2, pl: 2, borderColor: grey[400] }}>
      <Grid item sx={{ mr: 2 }}>
        <Typography variant="h6" gutterBottom>
          Liên hệ
        </Typography>
        {archives.map((archive: any) => (
          <Link display="block" variant="body1" href={archive.url} key={archive.title}>
            {archive.title}
          </Link>
        ))}
      </Grid>
      <Grid item>
        <Typography variant="h6" gutterBottom>
          Đường dây nóng
        </Typography>
        {social.map((network: any) => (
          <>
            <Typography variant="h6">{network.sdt}</Typography>
            <Typography variant="subtitle1" color={grey[500]}>
              ({network.name})
            </Typography>
          </>
        ))}
      </Grid>
    </Grid>
  );
}
