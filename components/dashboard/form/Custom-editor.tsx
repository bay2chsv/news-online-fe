import ArticleAPI from "@/api/ArticleAPI";
import { accessToken } from "@/utils/auth";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import React, { useState } from "react";
import { TextField, Button, Box, Grid, Typography, Stack, Autocomplete, List, ListItem, ListItemButton } from "@mui/material";
import { useRouter } from "next/router";
import Tags from "../Tags";
import Swal from "sweetalert2";
class MyUploadAdapter {
  loader: any;
  constructor(loader: any) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then((file: any) => {
      return this._sendRequest(file);
    });
  }

  async _sendRequest(file: any) {
    const response: any = await ArticleAPI.upload(file, accessToken);
    if (response.data.url) {
      return {
        default: response.data.url,
      };
    } else {
      throw new Error("Upload failed");
    }
  }
}

function CustomUploadAdapterPlugin(editor: any) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
    return new MyUploadAdapter(loader);
  };
}

interface DataProp {
  url?: string;
  repo?: any;
}

const CustomEditor = ({ url, repo }: DataProp) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: null,
  });

  const [tags, setTags] = useState([]);
  const onHandleChild = (tags: any) => {
    setTags(tags);
  };

  const [thumbnailPreview, setThumbnailPreview] = useState({ id: "", url: null }); // For storing the image URL
  const [ckeditor, setCkeditor] = useState("");
  const [categories, setCategories] = useState<any>({ id: "", name: "", code: "", parentId: "" });
  const handleChange = async (event: any) => {
    const { name, value, files } = event.target;
    // Update for thumbnail preview
    if (files && files[0]) {
      const file = files[0];
      setFormData((prev: any) => ({
        ...prev,
        [name]: file,
      }));
      try {
        const response = await ArticleAPI.upload(file, accessToken);
        if (response.data.url) {
          setThumbnailPreview({ id: response.data.id, url: response.data.url });
        }
      } catch (error) {}
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const jsonData = {
      title: formData.title,
      description: formData.description,
      categoryId: categories.id,
      content: ckeditor,
      thumbnailId: thumbnailPreview.id,
      tagIds: tags.map((item: any) => item.id),
    };

    if (ckeditor.length < 200) {
      Swal.fire({
        title: "warning",
        text: "OOps Content must be more than 200 character.",
        icon: "warning",
      });
      return;
    }
    if (!formData.title) {
      Swal.fire({
        title: "Warning",
        text: "Please enter a title.",
        icon: "warning",
      });
      return;
    }

    if (!formData.description) {
      Swal.fire({
        title: "Warning",
        text: "Please enter a description.",
        icon: "warning",
      });
      return;
    }

    if (!categories.id) {
      Swal.fire({
        title: "Warning",
        text: "Please select a category.",
        icon: "warning",
      });
      return;
    }

    if (!ckeditor) {
      Swal.fire({
        title: "Warning",
        text: "Please enter content in CKEditor.",
        icon: "warning",
      });
      return;
    }

    if (!thumbnailPreview.id) {
      Swal.fire({
        title: "Warning",
        text: "Please upload a thumbnail.",
        icon: "warning",
      });
      return;
    }

    if (!tags) {
      Swal.fire({
        title: "Warning",
        text: "Please enter at least one tag.",
        icon: "warning",
      });
      return;
    }

    try {
      const { data } = await ArticleAPI.save(jsonData, accessToken);
      Swal.fire({
        title: "Good job!",
        text: `${data.message}`,
        icon: "success",
      });

      setTimeout(() => {
        router.push(`/${url}/articles`);
      }, 1500);
    } catch (e: any) {
      Swal.fire({
        title: "failed",
        text: `${e.response.data.message}`,
        icon: "error",
      });
    }
  };
  const router = useRouter();

  return (
    <React.Fragment>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
        sx={{
          flexDirection: "column",
          gap: 2,
          maxWidth: "1000px",
          margin: "auto",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "5px",
          boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .3)",
        }}
      >
        <Typography variant="h5" align="center" sx={{ m: 2 }}>
          Create article
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={2}>
            <label style={{ fontWeight: "bold" }}>Title:</label>
          </Grid>
          <Grid item xs={12} md={10}>
            <TextField id="title" name="title" variant="outlined" fullWidth value={formData.title} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} md={2}>
            <label>Description:</label>
          </Grid>
          <Grid item xs={12} md={10}>
            <TextField
              id="description"
              name="description"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <label>Category:</label>
          </Grid>
          <Grid item xs={12} md={10}>
            <Stack spacing={2} sx={{ width: 275 }}>
              <Autocomplete
                id="free-solo-demo"
                options={repo.data.filter((item: any) => item.parentId === null)}
                value={categories}
                getOptionLabel={(option: any) => option.name ?? ""}
                sx={{ width: 275 }}
                renderInput={(params) => <TextField {...params} label="Categories" />}
                renderOption={(props, option: any) => (
                  <React.Fragment>
                    <Typography variant="body1">+{option.name}</Typography>
                    <List>
                      {repo.data
                        .filter((item: any) => item.parentId === option.id)
                        .map((subItem: any) => (
                          <ListItem key={subItem.id}>
                            <ListItemButton
                              onClick={() => {
                                setCategories(subItem);
                              }}
                            >
                              {subItem.name}
                            </ListItemButton>
                          </ListItem>
                        ))}
                    </List>
                  </React.Fragment>
                )}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={2}>
            <label>Tags:</label>
          </Grid>
          <Grid item xs={12} md={10}>
            <Tags tags={tags} onSelectedTagsChange={onHandleChild} />
          </Grid>
          <Grid item xs={12} md={2}>
            <label>Thumbnail:</label>
          </Grid>
          <Grid item xs={12} md={2}>
            <input accept="image/*" style={{ display: "none" }} id="thumbnail" name="thumbnail" type="file" onChange={handleChange} />
            <label htmlFor="thumbnail">
              <Button
                variant="contained"
                component="span"
                sx={{
                  m: 1,
                }}
              >
                Select...
              </Button>
            </label>
          </Grid>
          <Grid item xs={12} md={8}>
            {thumbnailPreview.url && (
              <Box sx={{ m: 1 }}>
                <img src={thumbnailPreview.url} alt="Thumbnail preview" style={{ width: 500 }} />
              </Box>
            )}
          </Grid>
          <Grid item xs={12} md={2}>
            <label>Content:</label>
          </Grid>
          <Grid item xs={12} md={10}>
            <CKEditor
              editor={ClassicEditor}
              data={ckeditor}
              config={{
                extraPlugins: [CustomUploadAdapterPlugin],
              }}
              onChange={(event, editor) => {
                const data: string = editor.getData();
                setCkeditor(data);
              }}
            />
          </Grid>
        </Grid>

        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <Button
            type="submit"
            sx={{
              mt: 2,
            }}
            variant="contained"
            color="success"
          >
            Save
          </Button>
          <Button
            onClick={() => {
              router.push(`/${url}/articles`);
            }}
            sx={{
              mt: 2,
            }}
            variant="contained"
            color="error"
          >
            Back
          </Button>
        </div>
      </Box>
    </React.Fragment>
  );
};

export default CustomEditor;
