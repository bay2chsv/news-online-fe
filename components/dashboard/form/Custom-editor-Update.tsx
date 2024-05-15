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
  url?: any;
}

const CustomEditorUpdate = ({ bigData, repo, url }: DataProp) => {
  const [formData, setFormData] = useState({
    title: bigData.title,
    description: bigData.description,
  });

  const [tags, setTags] = useState(bigData.tags);
  const onHandleChild = (tags: any) => {
    setTags(tags);
  };
  const [thumbnailPreview, setThumbnailPreview] = useState({ id: bigData.thumbnailId, url: bigData.thumbnailUrl }); // For storing the image URL
  const [ckeditor, setCkeditor] = useState(bigData.content);
  const [categories, setCategories] = useState<any>(bigData.category);

  const router = useRouter();

  const [status, setStatus] = useState(bigData.status);

  const [message, setMessage] = useState(bigData.message);

  const handleApprove = async () => {
    try {
      const { data } = await ArticleAPI.handleAprrove(router.query.id, { status: "APPROVED" }, accessToken);
      Swal.fire({
        title: "Good job!",
        text: `${data.message}`,
        icon: "success",
      });
      setTimeout(() => {
        router.push(`/${url}/articles`);
      }, 1500);
    } catch (e: any) {}
  };
  const handleReject = async () => {
    try {
      const { value: rejectionReason } = await Swal.fire({
        title: "Are you sure?",
        text: "You are about to reject this article.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, reject it!",
        input: "text",
        inputPlaceholder: "Enter rejection reason (optional)",
      });

      if (rejectionReason) {
        const { data } = await ArticleAPI.handleAprrove(
          router.query.id,
          {
            status: "REJECTED",
            message: rejectionReason,
          },
          accessToken
        );

        Swal.fire({
          title: "Good job!",
          text: `${data.message}`,
          icon: "success",
        });

        setTimeout(() => {
          router.push(`${url}/articles`);
        }, 1500);
      } else {
      }
    } catch (e: any) {}
  };

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
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "15px" }}>
        {status === "PENDING" ? (
          <>
            <Button
              type="submit"
              sx={{
                mt: 2,
              }}
              variant="contained"
              color="success"
              onClick={handleApprove}
            >
              Approve
            </Button>
            <Button
              sx={{
                mt: 2,
              }}
              variant="contained"
              color="error"
              onClick={handleReject}
            >
              Reject
            </Button>
            <Button
              onClick={() => {
                router.push(`/${url}/articles`);
              }}
              sx={{
                mt: 2,
              }}
              variant="outlined"
            >
              Back
            </Button>
          </>
        ) : status === "APPROVED" ? (
          <>
            <Button
              type="submit"
              sx={{
                mt: 2,
              }}
              variant="contained"
              color="error"
              onClick={handleReject}
            >
              Reject
            </Button>
            <Button
              onClick={() => {
                router.push(`/${url}/articles`);
              }}
              sx={{
                mt: 2,
              }}
              variant="outlined"
            >
              Back
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => {
                router.push(`/${url}/articles`);
              }}
              sx={{
                mt: 2,
              }}
              variant="contained"
            >
              Back
            </Button>
          </>
        )}
      </div>
      <Box
        component="form"
        // onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
        sx={{
          flexDirection: "column",
          gap: 2,
          maxWidth: "1000px",
          margin: "auto",
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "5px",
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
            <TextField id="title" name="title" variant="outlined" disabled fullWidth value={formData.title} />
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
              disabled
              multiline
              rows={3}
              value={formData.description}
              // onChange={handleChange}
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
                disabled
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
            <Tags tags={tags} disabled={true} onSelectedTagsChange={onHandleChild} />
          </Grid>
          <Grid item xs={12} md={2}>
            Thumbnail
          </Grid>
          <Grid item xs={12} md={2}>
            {/* onChange={handleChange}  */}
            <input accept="image/*" style={{ display: "none" }} id="thumbnail" name="thumbnail" type="file" />
            <label htmlFor="thumbnail">
              <Button
                variant="contained"
                component="span"
                disabled
                sx={{
                  m: 1,
                  // Adjust width as needed
                }}
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
              onChange={(event, editor) => {
                const data: string = editor.getData();
                setCkeditor(data);
              }}
              disabled
            />
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );
};

export default CustomEditorUpdate;
