import * as React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";

import Stack from "@mui/material/Stack";

export default function Breadcrumb({ breadcrumbs }: any) {
  return (
    <Stack sx={{ mt: 2, mb: 2 }} spacing={2}>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        {breadcrumbs}
      </Breadcrumbs>
    </Stack>
  );
}
