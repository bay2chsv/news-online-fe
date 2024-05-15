import ArticleAPI from "@/api/ArticleAPI";
import { accessToken } from "@/utils/auth";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import React, { useEffect, useState } from "react";
import { TextField, Button, Box, Grid, Typography, Stack, Autocomplete, List, ListItem, ListItemButton } from "@mui/material";
import { useRouter } from "next/router";
import Tags from "../Tags";
import Swal from "sweetalert2";
// Custom upload adapter
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
      // This URL should be returned in a specific format expected by CKEditor
      return {
        default: response.data.url, // The 'default' key is used by CKEditor for the image source
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
  bigData: any;
  repo?: any;
  id: any;
}

const CustomEditorUpdate = ({ bigData, repo }: DataProp) => {
  const [formData, setFormData] = useState({
    title: bigData.title,
    description: bigData.description,
  });
  const router = useRouter();
  const [tags, setTags] = useState(bigData.tags);
  const onHandleChild = (tags: any) => {
    setTags(tags);
  };
  const [thumbnailPreview, setThumbnailPreview] = useState({ id: bigData.thumbnailId, url: bigData.thumbnailUrl }); // For storing the image URL
  const [ckeditor, setCkeditor] = useState(bigData.content);
  const [categories, setCategories] = useState<any>(bigData.category);
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
          console.log(response);
        }
      } catch (error) {}

      // Create a URL for the file for preview
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleUpdate = async (e: any) => {
    e.preventDefault();
    const jsonData = {
      title: formData.title,
      description: formData.description,
      categoryId: categories.id,
      content: ckeditor,
      thumbnailId: thumbnailPreview.id,
      tagIds: tags.map((item: any) => item.id),
    };
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
      const { data } = await ArticleAPI.updateArticleById(router.query.id, jsonData, accessToken);
      Swal.fire({
        title: "Good job!",
        text: `${data.message}`,
        icon: "success",
      }).then(() => {
        router.push("/journalist/articles");
      });
    } catch (e: any) {}
  };
  const [status, setStatus] = useState(bigData.status);
  const [message, setMessage] = useState(bigData.message);
  const [disabled, setDisabled] = useState(true);

  const handleOpenDisabled = () => {
    setDisabled(false);
  };
  const handleCloseDisabled = () => {
    setDisabled(true);
  };
  const FormArticle = (
    <Box
      component="form"
      onSubmit={handleUpdate}
      noValidate
      autoComplete="off"
      sx={{
        flexDirection: "column",
        gap: 2,
        maxWidth: "1000px",
        margin: "auto",
        padding: "20px",
        borderRadius: "5px",
        backgroundColor: "white",
        boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .3)",
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={2}>
          <Typography variant="subtitle1" component="label" htmlFor="title">
            Title:
          </Typography>
        </Grid>
        <Grid item xs={12} md={10}>
          <TextField
            id="title"
            name="title"
            disabled={disabled}
            variant="outlined"
            fullWidth
            value={formData.title}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Typography variant="subtitle1" component="label" htmlFor="description">
            Description:
          </Typography>
        </Grid>
        <Grid item xs={12} md={10}>
          <TextField
            id="description"
            name="description"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            disabled={disabled}
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
              options={repo.data}
              value={categories}
              getOptionLabel={(option: any) => option.name ?? ""}
              sx={{ width: 275 }}
              disabled={disabled}
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
          <label>Tags: </label>
        </Grid>
        <Grid item xs={12} md={10}>
          <Tags disabled={disabled} tags={tags} onSelectedTagsChange={onHandleChild} />
        </Grid>
        <Grid item xs={12} md={2}>
          Thumbnail:
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
              disabled={disabled}
            >
              select...
            </Button>
          </label>
        </Grid>
        <Grid item xs={12} md={8}>
          {thumbnailPreview && (
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
            disabled={disabled}
            onChange={(event, editor) => {
              const data: string = editor.getData();
              setCkeditor(data);
            }}
          />
        </Grid>
      </Grid>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        {disabled ? null : (
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
        )}
        <Button
          onClick={() => {
            router.push("/journalist/articles");
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
  );

  if (status === "PENDING") {
    return (
      <React.Fragment>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "20px", marginBottom: "15px" }}>
          {disabled ? (
            <Button
              sx={{
                mt: 2,
                mr: 5,
                transform: "none",
              }}
              variant="contained"
              color="success"
              onClick={handleOpenDisabled}
            >
              Edit
            </Button>
          ) : (
            <Button
              sx={{
                mt: 2,
                mr: 5,
                transform: "none",
              }}
              variant="contained"
              color="success"
              onClick={handleCloseDisabled}
            >
              Cancel
            </Button>
          )}
        </div>
        {FormArticle}
      </React.Fragment>
    );
  }
  if (status === "APPROVED") {
    return (
      <React.Fragment>
        <Typography variant="h5" align="center" sx={{ m: 2 }}>
          {message ? `Reason :${message}` : ""}
        </Typography>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "15px" }}>
          <Button
            onClick={() => {
              router.push("/journalist/articles");
            }}
            sx={{
              mt: 2,
            }}
            variant="outlined"
          >
            Back
          </Button>
        </div>
        {FormArticle}
      </React.Fragment>
    );
  }
  if (message) {
    Swal.fire({
      title: "Your Content has been Reject!",
      text: `${message}`,
      icon: "error",
    });
  }
  return (
    <React.Fragment>
      <Typography variant="h5" align="center" color={"error"} sx={{ m: 2 }}>
        {message ? `Reason: ${message}` : ""}
      </Typography>
      {FormArticle}
    </React.Fragment>
  );
};

export default CustomEditorUpdate;
