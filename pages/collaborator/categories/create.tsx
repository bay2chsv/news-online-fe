import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { accessToken, baseUrl } from "@/utils/auth";
import { Box, Button, Grid, TextField, Typography, Select, MenuItem, InputLabel, Autocomplete } from "@mui/material";
import React, { useState } from "react";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import CategoryAPI from "@/api/CategoryAPI";
import { useRouter } from "next/router";
import Link from "@mui/material/Link";
import Breadcrumb from "@/components/Breadcrumb";
import Swal from "sweetalert2";
interface Category {
  limit: Number;
  page: Number;
  totalItems: Number;
  totalPage: Number;
  data: Array<any>;
}

export const getServerSideProps: GetServerSideProps<{ repo: any }> = async () => {
  try {
    const res = await fetch(`${baseUrl}/categories?limit=100`);
    const repo: Category[] = await res.json();

    return { props: { repo } };
  } catch {
    return { props: { repo: null } };
  }
};

const CategoryCRUD: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ repo }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    parentId: "null",
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
    const body = { name: name, code: code, parentId: formData.parentId };
    if (!name || !code) {
      Swal.fire({
        title: "warning",
        text: "OOps watch back your input",
        icon: "warning",
      });
      return;
    }
    try {
      const { data } = await CategoryAPI.save(body, accessToken);
      setFormData({
        name: "",
        code: "",
        parentId: "null",
      });
    } catch (e: any) {}
  };
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/collaborator">
      collaborator
    </Link>,
    <Link underline="hover" key="2" color="inherit" href="/collaborator/categories">
      categories
    </Link>,
    <Link underline="hover" key="2" color="inherit" href="/collaborator/categories/create">
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
                Add Category
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
              <InputLabel>categories</InputLabel>
              <Select fullWidth value={formData.parentId} onChange={handleChange} name="parentId">
                <MenuItem value={"null"}>Parent</MenuItem>
                {repo
                  ? repo.data
                      .filter((sub: any) => sub.parentId === null)
                      .map((option: any) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))
                  : null}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "15px" }}>
                <Button type="submit" fullWidth variant="contained" color="success">
                  Add
                </Button>
                <Button
                  onClick={() => {
                    router.push("/admin/categories");
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

export default CategoryCRUD;
