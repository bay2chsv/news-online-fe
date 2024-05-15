import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { accessToken, baseUrl } from "@/utils/auth";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import SearchIcon from "@mui/icons-material/Search";

import {
  Autocomplete,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import router, { useRouter } from "next/router";
import TagAPI from "@/api/TagAPI";
import Breadcrumb from "@/components/Breadcrumb";
import Swal from "sweetalert2";
import CommentAPI from "@/api/CommentAPI";
import { formatDate } from "@/utils/formateData";
import { red } from "@mui/material/colors";
import ResponsiveDatePickers from "@/components/dashboard/ResponsiveDatePickers";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Tags from "@/components/dashboard/Tags";
import ArticleAPI from "@/api/ArticleAPI";
import { useSearchParams } from "next/navigation";
interface Column {
  id: "commentId" | "userEmail" | "reviewerFullName" | "text" | "createdDate" | "status" | "actions";
  label: string;
  minWidth?: number;
  align?: "right" | "center";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "commentId", label: "Id", minWidth: 75 },
  { id: "userEmail", label: "Email", minWidth: 170 },
  { id: "text", label: "Text", minWidth: 170 },

  { id: "createdDate", label: "Date", minWidth: 100 },
  { id: "reviewerFullName", label: "Reviewer", minWidth: 100 },
  { id: "status", label: "Status", minWidth: 50, align: "center" },
  { id: "actions", label: "", minWidth: 170, align: "center" },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

// Initialize your rows here with actual data

export const getServerSideProps: GetServerSideProps<{ reviewersAPI: any }> = async () => {
  // Fetch data from external API
  try {
    const res2 = await fetch(`${baseUrl}/articles/list-reviewers`);
    const reviewersAPI: any = await res2.json();

    return { props: { reviewersAPI } };
  } catch {
    return { props: { reviewersAPI: null } };
  }
};

const BigComment: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ reviewersAPI }) => {
  const [reviewers, setReviewers] = useState<any>({ id: "", fullnName: "" });
  const [dataAPI, setDataAPI] = useState<any>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  const [formState, setFormState] = useState({
    email: "",
    text: "",
    status: status || "",
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const fetchDataAndUpdateState = async (rowsPerPage: any, Page: any) => {
    try {
      const { data } = await CommentAPI.getallComment(rowsPerPage, Page + 1, accessToken);
      console.log(data);
      setDataAPI(data.data);
      setTotalItems(data.totalItems);
      setPage(data.page - 1);
      setRowsPerPage(data.limit);
    } catch (error) {}
  };

  useEffect(() => {
    if (status) {
      handleSeacrh();
    } else {
      fetchDataAndUpdateState(rowsPerPage, page);
    }
  }, [rowsPerPage, page]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const [detail, setDetail] = useState<any>({ commentId: "", userEmail: "", text: "", status: "", articleTitle: "" });
  const handleDeatail = async (id: any) => {
    setOpenDialog(true);
    const { data }: any = await CommentAPI.getCommentId(id, accessToken);
    console.log(data);
    setDetail({
      commentId: data.commentId,
      userEmail: data.userEmail,
      text: data.text,
      status: data.status,
      articleTitle: data.articleTitle,
    });
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirm = async (e: any) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      const { data } = await CommentAPI.reviewComment(detail.commentId, { status: detail.status }, accessToken);

      fetchDataAndUpdateState(rowsPerPage, page);
      Swal.fire({
        title: "Update",
        text: "Update successfully",
        icon: "success",
      });
    } catch (error) {
    } finally {
      setOpenDialog(false);
    }
  };

  const handleSeacrh = async () => {
    try {
      const filters = {
        email: formState.email,
        text: formState.text,
        status: formState.status,
        f_date_from: timeFrom,
        f_date_to: timeTo,
        f_reviewer_id: reviewers.id,
        limit: rowsPerPage,
      };
      const { data } = await CommentAPI.findByCondition(filters, accessToken);
      setDataAPI(data.data);
      setTotalItems(data.totalItems);
      setPage(data.page - 1);
      setRowsPerPage(data.limit);
    } catch (error) {}
  };
  // State to hold the value of the TextField

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/collaborator">
      Collaborator
    </Link>,
    <Link underline="hover" key="2" color="inherit" href="/collaborator/comments">
      comments
    </Link>,
  ];

  const [timeTo, setTimeTo] = useState("");
  const [timeFrom, setTimeFrom] = useState("");

  const handletimeTo = (time: any) => {
    setTimeTo(time);
  };
  const handletimeFrom = (time: any) => {
    setTimeFrom(time);
  };

  return (
    <>
      <Breadcrumb breadcrumbs={breadcrumbs} />
      <Typography variant="h5" sx={{ m: 1, p: 1 }}>
        Comments Management
      </Typography>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3, backgroundColor: "white", p: 2, m: 1 }}>
        <Grid item xs={12} md={3}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="email"
            name="email"
            value={formState.email} // Set the value of the TextField to the state variable
            onChange={handleChange}
            focused
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              name="status"
              value={formState.status}
              label="Status"
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"REJECTED"}>Rejected</MenuItem>
              <MenuItem value={"PENDING"}>Pending</MenuItem>
              <MenuItem value={"APPROVED"}>Approved</MenuItem>
            </Select>
          </FormControl>
        </Grid>{" "}
        <Grid item xs={12} md={3}></Grid>
        <Grid item xs={12} md={3}></Grid>
        <Grid item xs={12} md={3}>
          <Stack spacing={2} sx={{ width: 275 }}>
            <Autocomplete
              id="free-solo-demo"
              options={reviewersAPI}
              defaultValue={[]}
              getOptionLabel={(option: any) => (option.fullName ? option.fullName : "")}
              sx={{ width: 275 }}
              onChange={(event: any, newValue: any) => {
                setReviewers(newValue ?? "");
              }}
              renderInput={(params) => <TextField {...params} label="Reviewer " />}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="text"
            label="text"
            name="text"
            value={formState.text} // Set the value of the TextField to the state variable
            onChange={handleChange}
            focused
          />
        </Grid>{" "}
        <Grid item xs={12} md={3}></Grid>
        <Grid item xs={12} md={3}></Grid>
        <Grid item xs={12} md={3}>
          <ResponsiveDatePickers onhandleTime={handletimeFrom} label={"Time from"} />
        </Grid>
        <Grid item xs={12} md={3}>
          <ResponsiveDatePickers onhandleTime={handletimeTo} label={"Time to"} />
        </Grid>
        <Grid item xs={12} md={1}>
          <Button color="primary" size="small" variant="contained" onClick={handleSeacrh}>
            <SearchIcon />
          </Button>
        </Grid>
      </Grid>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <StyledTableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                    <Typography component="div">
                      <Box sx={{ fontWeight: "bold" }}> {column.label}</Box>
                    </Typography>
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dataAPI && dataAPI.length > 0 ? (
                dataAPI.map((row: any) => {
                  return (
                    <StyledTableRow hover role="checkbox" key={row.id}>
                      {columns.map((column) => {
                        let value = column.id === "createdDate" ? formatDate(row[column.id]) : row[column.id];
                        return (
                          <StyledTableCell key={column.id} align={column.align}>
                            {column.id === "actions" ? (
                              <Button
                                size="small"
                                sx={{ mr: 2, textTransform: "none", "&:hover": { backgroundColor: "transparent", color: red[500] } }}
                                onClick={() => handleDeatail(row.commentId)}
                              >
                                detail...
                              </Button>
                            ) : column.id === "status" ? (
                              <Box
                                sx={{
                                  backgroundColor:
                                    value === "APPROVED"
                                      ? "#00AF9B"
                                      : value === "PENDING"
                                      ? "#FFB803"
                                      : value === "REJECTED"
                                      ? "#FF2E55"
                                      : "black",
                                  borderRadius: "5px",
                                  p: 0.5,
                                  color: "white",
                                  textAlign: "center",
                                }}
                              >
                                {value.charAt(0) + value.slice(1).toLowerCase()}
                                {/* convert APPROVED to Aproved */}
                              </Box>
                            ) : column.format && typeof value === "number" ? (
                              column.format(value)
                            ) : (
                              value
                            )}
                          </StyledTableCell>
                        );
                      })}
                    </StyledTableRow>
                  );
                })
              ) : (
                <StyledTableRow>
                  <StyledTableCell colSpan={columns.length}>
                    <Typography align="center">Not found</Typography>
                  </StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
              right: 4,
              top: 4,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>

          <DialogContent>
            <Box sx={{ mt: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Typography component="h1" sx={{ m: 1 }} variant="h5">
                Detail
              </Typography>
              <Box component="form" noValidate sx={{ width: 470 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={2}>
                    <Typography variant="subtitle1" component="label" htmlFor="title">
                      Text:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={10}>
                    <TextField
                      required
                      fullWidth
                      id="text"
                      disabled
                      onChange={(e) => setDetail({ ...detail, text: e.target.value })}
                      value={detail.text}
                      name="text"
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Typography variant="subtitle1" component="label" htmlFor="title">
                      Article Title:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={10}>
                    <TextField
                      required
                      fullWidth
                      id="articleTitle"
                      onChange={(e) => setDetail({ ...detail, articleTitle: e.target.value })}
                      value={detail.articleTitle}
                      name="articleTitle"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Typography variant="subtitle1" component="label" htmlFor="title">
                      Email:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={10}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      value={detail.userEmail}
                      onChange={(e) => setDetail({ ...detail, userEmail: e.target.value })}
                      name="email"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    {" "}
                    <Typography variant="subtitle1" component="label" htmlFor="title">
                      Action:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-simple-select-label">Status</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={detail.status}
                        onChange={(e) => setDetail({ ...detail, status: e.target.value })}
                        label="Status"
                      >
                        {/* <MenuItem value={"PENDING"}>PENDING</MenuItem> */}
                        <MenuItem value={"APPROVED"}>APPROVED</MenuItem>
                        <MenuItem value={"REJECTED"}>REJECTED</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </DialogContent>
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "15px" }}>
            <Button onClick={handleConfirm} variant="contained" color="primary">
              Submit
            </Button>
            <Button onClick={handleCloseDialog} variant="outlined" color="error" autoFocus>
              Cancel
            </Button>
          </div>
        </Dialog>
      </Paper>
    </>
  );
};

export default BigComment;
