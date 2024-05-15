import { Box, Button, Grid, InputLabel, Link, MenuItem, Select, TextField, Typography } from "@mui/material";
import React from "react";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { useRouter } from "next/router";
import CategoryAPI from "@/api/CategoryAPI";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { accessToken, baseUrl } from "@/utils/auth";
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
  // Fetch data from external API
  try {
    const res = await fetch(`${baseUrl}/categories?limit=100`); //192.168.20.19
    const repo: Category[] = await res.json();
    // Pass data to the page via props
    return { props: { repo } };
  } catch {
    return { props: { repo: null } };
  }
};

const Categoryupdate: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ repo }) => {
  const router = useRouter();
  const fetchDataAndUpdateState = async () => {
    try {
      if (router.query.id) {
        const { data } = await CategoryAPI.getByID(router.query.id);
        setFormData({ id: data.id, name: data.name, code: data.code, parentId: String(data.parentId) });
      }
    } catch (error) {
      router.push("/404");
    }
  };
  React.useEffect(() => {
    fetchDataAndUpdateState();
  }, [router.query.id]);

  const [formData, setFormData] = React.useState<any>({
    id: "",
    name: "",
    code: "",
    parentId: "null",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitUpdate = async (e: any) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.parentId) {
      Swal.fire({
        title: "Warning",
        text: "Watch back your filed",
        icon: "warning",
      });
      return;
    }
    try {
      const { data } = await CategoryAPI.update(
        router.query.id,
        { name: formData.name, code: formData.code, parentId: formData.parentId },
        accessToken
      );
      Swal.fire({
        title: "Updating",
        text: "Update Sucessfully",
        icon: "success",
      });
    } catch (e: any) {

    }
  };
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/admin">
      admin
    </Link>,
    <Link underline="hover" key="2" color="inherit" href="/admin/categories">
      categories
    </Link>,
  ];
  return (
    <React.Fragment>
      <Breadcrumb breadcrumbs={breadcrumbs} />
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={submitUpdate}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h5" align="center">
                Update Category
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
              <InputLabel>Select an option</InputLabel>
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
                  Update
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

export default Categoryupdate;
