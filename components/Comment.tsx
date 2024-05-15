import React, { useEffect, useState } from "react";
import { Box, FormControl, Grid, InputLabel, ListItem, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import { Button } from "@mui/material";
import ArticleAPI from "@/api/ArticleAPI";
import { useRouter } from "next/router";
import { accessToken, role } from "@/utils/auth";

import SignInDialog from "./Dialog/SignInDialog";
import { grey } from "@mui/material/colors";
import Swal from "sweetalert2";
import CommentAPI from "@/api/CommentAPI";
import { formatDate } from "@/utils/formateData";
const Comment = () => {
  const router = useRouter();
  const [dataAPI, setDataAPI] = useState<any>([]);

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [sort, setSort] = useState("asc"); //asc and desc

  const fetchDataAndUpdateState = async (rowsPerPage: any, sort: any) => {
    try {
      const { data } = await CommentAPI.getArticlesIdForUser(router.query.id, rowsPerPage, sort);
      setDataAPI(data.data);
      setTotalItems(data.totalItems);
      setRowsPerPage(data.limit);
    } catch (error) {}
  };

  const handleLoadMore = () => {
    setRowsPerPage(rowsPerPage + 5); // Increment the page to fetch the next set of comments
  };
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchDataAndUpdateState(rowsPerPage, sort);
  }, [rowsPerPage, sort]);

  const handleChange = (event: SelectChangeEvent) => {
    setSort(event.target.value as string);
  };

  const [signInOpen, setSignInOpen] = useState(false);
  const handleSignInOpen = () => {
    setSignInOpen(true);
  };
  const handleSignInClose = () => {
    setSignInOpen(false);
  };

  const handleComment = async () => {
    if (!comment) {
      Swal.fire({
        title: "Good job!",
        text: `You have not entered comment content yet`,
        icon: "warning",
      });
      return;
    }
    if (!accessToken) {
      handleSignInOpen();
      return;
    }
    if (role !== "ROLE_USER") {
      return;
    }
    try {
      const { data } = await CommentAPI.comment(router.query.id, { text: comment }, accessToken);

      let timerInterval: string | number | NodeJS.Timeout | undefined;

      Swal.fire({
        title: "Comment's pending approval ...",
        html: "I will close in <b></b> milliseconds.",
        timer: 3000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          const timer = Swal.getPopup().querySelector("b");
          timerInterval = setInterval(() => {
            timer.textContent = `${Swal.getTimerLeft()}`;
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          console.log("I was closed by the timer");
          setComment("");
        }
      });
    } catch (e: any) {}
  };

  return (
    <Box sx={{ mt: 5 }}>
      <Grid container alignItems={"center"} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <TextField
            size="small"
            onChange={(e: any) => {
              setComment(e.target.value);
            }}
            value={comment}
            sx={{ backgroundColor: grey[200] }}
            fullWidth
            multiline
            rows={3}
            label="Chia sẽ ý kiến của bạn với tin này"
            variant="outlined"
          />
        </Grid>

        <Grid item xs={1} sx={{ ml: 3 }}>
          <Button variant="contained" color="error" sx={{ textTransform: "none" }} onClick={handleComment}>
            Sent
          </Button>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={5}></Grid>
        <Grid item xs={5} sx={{ mt: 3 }}>
          {" "}
          <FormControl size="small">
            <InputLabel id="demo-simple-select-label">Chọn</InputLabel>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" value={sort} label="Chọn" onChange={handleChange}>
              <MenuItem value={"asc"}>Mới nhất</MenuItem>
              <MenuItem value={"desc"}>Cũ nhất</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {dataAPI.length > 0 ? (
        <List sx={{ maxWidth: 650, p: 1, bgcolor: "background.paper" }}>
          <Grid container alignItems={"center"}>
            <Grid item>
              <Typography component="span" variant="h6" color="text.primary">
                Bình luận:
              </Typography>
            </Grid>
          </Grid>
          {dataAPI.map((dataAPI: any, index: any) => (
            <ListItem key={index} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src={dataAPI.userImageUrl} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography sx={{ fontWeight: "bold" }} component="span" variant="body1" color="text.primary">
                    {dataAPI.userFullName}
                  </Typography>
                }
                secondary={
                  <Grid container>
                    <Grid item xs={8}>
                      {" "}
                      <Typography sx={{ display: "inline" }} component="span" variant="body2" color="text.primary">
                        {dataAPI.text}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography sx={{ display: "inline", color: grey[600] }} component="span" variant="body2" color="text.primary">
                        {formatDate(dataAPI.createdDate)}
                      </Typography>
                    </Grid>
                  </Grid>
                }
              />
            </ListItem>
          ))}
          {totalItems > rowsPerPage && (
            <Button sx={{ textTransform: "none" }} onClick={handleLoadMore}>
              xem thêm
            </Button>
          )}
        </List>
      ) : null}
      <SignInDialog open={signInOpen} handleClose={handleSignInClose} />
    </Box>
  );
};

export default Comment;
