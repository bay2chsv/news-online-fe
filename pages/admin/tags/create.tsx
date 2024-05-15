import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { accessToken, baseUrl } from "@/utils/auth";
import { Box, Button, Grid, TextField, Typography, Select, MenuItem, InputLabel, Autocomplete, Link } from "@mui/material";
import React, { useState } from "react";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { useRouter } from "next/router";
import TagAPI from "@/api/TagAPI";
import Breadcrumb from "@/components/Breadcrumb";
import Swal from "sweetalert2";

const TagCreate = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    code: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitCreate = async (e: any) => {
    e.preventDefault();
    const name = formData.name.trim().replace(/\s+/g, " ");
    const code = formData.code.trim();
    const body = { name: name, code: code };
    if (!name || !code) {
      Swal.fire({
        title: "Warning",
        text: "Watch back your filed",
        icon: "warning",
      });
      return;
    }
    try {
      const response = await TagAPI.save(body, accessToken);
      setFormData({ name: "", code: "" });
    } catch (e: any) {}
  };
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/admin">
      admin
    </Link>,
    <Link underline="hover" key="2" color="inherit" href="/admin/tags">
      tags
    </Link>,
    <Link underline="hover" key="2" color="inherit" href="/admin/tags/create">
      create
    </Link>,
  ];

  return (
    <React.Fragment>
      <Breadcrumb breadcrumbs={breadcrumbs} />
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={submitCreate}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h5" align="center">
                Add Tag
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="code"
                name="code"
                label="Code"
                autoComplete="code"
                value={formData.code}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "15px" }}>
                <Button type="submit" fullWidth variant="contained" color="success" sx={{ textTransform: "none" }}>
                  Add
                </Button>
                <Button
                  sx={{ textTransform: "none" }}
                  onClick={() => {
                    router.push("/admin/tags");
                  }}
                  fullWidth
                  variant="contained"
                  color="error"
                >
                  Back
                </Button>
              </div>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default TagCreate;
