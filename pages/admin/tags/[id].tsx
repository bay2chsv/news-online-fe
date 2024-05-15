import { Box, Button, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import React from "react";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { useRouter } from "next/router";
import TagAPI from "@/api/TagAPI";
import { accessToken } from "@/utils/auth";
import Swal from "sweetalert2";
const Categoryupdate = () => {
  const router = useRouter();
  React.useEffect(() => {
    const fetchDataAndUpdateState = async () => {
      try {
        if (router.query.id) {
          const { data } = await TagAPI.getByID(router.query.id);
  
          setFormData({ id: data.id, name: data.name, code: data.code, parentId: String(data.parentId) });
        }
      } catch (error) {
        router.push("/404");
      }
    };
    fetchDataAndUpdateState();
  }, [router.query.id]);

  const [formData, setFormData] = React.useState<any>({
    id: "",
    name: "",
    code: "",
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
    if (!formData.name || !formData.code) {
      Swal.fire({
        title: "Warning",
        text: "Watch back your filed",
        icon: "warning",
      });
      return;
    }
    try {
      const { data } = await TagAPI.update(router.query.id, { name: formData.name, code: formData.code }, accessToken);
      Swal.fire({
        title: "Updating",
        text: "Update Sucessfully",
        icon: "success",
      });
    } catch (e: any) {

    }
  };
  return (
    <React.Fragment>
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
              <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "15px" }}>
                <Button type="submit" fullWidth variant="contained" color="success">
                  Update
                </Button>
                <Button
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

export default Categoryupdate;
