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
import { baseUrl } from "@/utils/auth";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import SearchIcon from "@mui/icons-material/Search";
import { Autocomplete, Box, FormControl, Grid, InputLabel, Link, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Breadcrumb from "@/components/Breadcrumb";
import ArticleAPI from "@/api/ArticleAPI";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Tags from "@/components/dashboard/Tags";
import ResponsiveDatePickers from "@/components/dashboard/ResponsiveDatePickers";
import { red } from "@mui/material/colors";
import { formatDate } from "@/utils/formateData";

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
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

interface Column {
  id: "id" | "title" | "categoryName" | "createdDate" | "authorFullname" | "reviewerFullname" | "status" | "actions";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "id", label: "Id", minWidth: 75 },
  { id: "title", label: "Title", minWidth: 170 },
  { id: "categoryName", label: "Category", minWidth: 150 },
  { id: "createdDate", label: "Date", minWidth: 130 },
  { id: "authorFullname", label: "Author", minWidth: 130 },
  { id: "reviewerFullname", label: "Reviewer", minWidth: 130 },
  { id: "status", label: "Status", minWidth: 130 },
  { id: "actions", label: "", minWidth: 130 },
];

interface DataformateProp {
  limit: Number;
  page: Number;
  totalItems: Number;
  totalPage: Number;
  data: Array<any>;
}

export const getServerSideProps: GetServerSideProps<{ categoriesAPI: any; reviewersAPI: any; authorsAPI: any }> = async () => {
  try {
    const res1 = await fetch(`${baseUrl}/categories?limit=100`);
    const categoriesAPI: DataformateProp = await res1.json();
    const res2 = await fetch(`${baseUrl}/articles/list-reviewers`);
    const reviewersAPI: any = await res2.json();
    const res3 = await fetch(`${baseUrl}/articles/list-authors`);
    const authorsAPI: any = await res3.json();

    return { props: { categoriesAPI, reviewersAPI, authorsAPI } };
  } catch {
    return { props: { categoriesAPI: null, reviewersAPI: null, authorsAPI: null } };
  }
};

const StickyHeadTable: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ categoriesAPI, reviewersAPI, authorsAPI }) => {
  const [categories, setCategories] = useState<any>({ id: "", name: "", code: "", parentId: "" });
  const [reviewers, setReviewers] = useState<any>({ id: "", fullnName: "" });
  const [authors, setAuthors] = useState<any>({ id: "", fullnName: "" });
  const [tags, setTags] = useState([{ id: "", name: "", code: "" }]);
  const [dataAPI, setDataAPI] = useState<any>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const router = useRouter();
  const [timeTo, setTimeTo] = useState("");
  const [timeFrom, setTimeFrom] = useState("");

  const handletimeTo = (time: any) => {
    setTimeTo(time);
  };
  const handletimeFrom = (time: any) => {
    setTimeFrom(time);
  };

  const fetchDataAndUpdateState = async (rowsPerPage: any, Page: any) => {
    try {
      const { data } = await ArticleAPI.getAll(rowsPerPage, Page + 1);
      setDataAPI(data.data);
      setTotalItems(data.totalItems);
      setPage(data.page - 1);
      setRowsPerPage(data.limit);
    } catch (error) {}
  };
  useEffect(() => {
    fetchDataAndUpdateState(rowsPerPage, page);
  }, [rowsPerPage, page]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleSeacrh = async () => {
    try {
      const filters = {
        limit: rowsPerPage,
        f_category_id: categories.id,
        f_date_from: timeFrom,
        f_date_to: timeTo,
        f_tag_ids: tags.map((item) => item.id),
        f_title: formState.title,
        f_created_by: authors.id,
        s_status: formState.status,
        f_reviewer_id: reviewers.id,
      };

      const { data } = await ArticleAPI.findByCondition(filters);
      setDataAPI(data.data);
      setTotalItems(data.totalItems);
      setPage(data.page - 1);
      setRowsPerPage(data.limit);
    } catch (error) {}
  };

  const [formState, setFormState] = useState({
    title: "",
    status: "",
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/journalist">
      journalist
    </Link>,
    <Link underline="hover" key="2" color="inherit" href="/journalist/articles">
      articles
    </Link>,
  ];

  const onHandleChild = (tags: any) => {
    setTags(tags);
  };

  return (
    <React.Fragment>
      <Breadcrumb breadcrumbs={breadcrumbs} />
      <Typography variant="h5" sx={{ m: 1, p: 1 }}>
        Aritcles Management
      </Typography>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Stack spacing={2} sx={{ width: 275 }}>
            <Autocomplete
              id="free-solo-demo"
              options={categoriesAPI.data}
              defaultValue={[]}
              getOptionLabel={(option: any) => (option.name ? option.name : "")}
              sx={{ width: 275 }}
              onChange={(event: any, newValue: any) => {
                setCategories(newValue ?? "");
              }}
              renderInput={(params) => <TextField {...params} label="Categories" />}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} md={3}>
          <Tags onSelectedTagsChange={onHandleChild} tags={tags} />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="status"
              name="status"
              value={formState.status}
              label="Status"
              displayEmpty
              onChange={handleChange}
            >
              <MenuItem value={"REJECTED"}>Rejected</MenuItem>
              <MenuItem value={"PENDING"}>Pending</MenuItem>
              <MenuItem value={"APPROVED"}>Approved</MenuItem>
            </Select>
          </FormControl>
        </Grid>
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
        {/* <Grid item xs={12} md={3}>
          <Stack spacing={2} sx={{ width: 275 }}>
            <Autocomplete
              id="free-solo-demo"
              options={authorsAPI}
              defaultValue={[]}
              getOptionLabel={(option: any) => (option.fullName ? option.fullName : "")}
              sx={{ width: 275 }}
              onChange={(event: any, newValue: any) => {
                setAuthors(newValue ?? "");
              }}
              renderInput={(params) => <TextField {...params} label="Author" />}
            />
          </Stack>
        </Grid> */}

        <Grid item xs={12} md={3}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="title"
            name="title"
            value={formState.title} // Set the value of the TextField to the state variable
            onChange={handleChange}
            focused
          />
        </Grid>
        <Grid item xs={12} md={6}></Grid>
        <Grid item xs={12} md={3}>
          <ResponsiveDatePickers onhandleTime={handletimeFrom} label={"Time from"} />
        </Grid>

        <Grid item xs={12} md={3}>
          <ResponsiveDatePickers onhandleTime={handletimeTo} label={"Time to"} />
        </Grid>
        <Grid item xs={12} md={1}>
          <Button
            color="primary"
            size="small"
            variant="contained"
            onClick={() => {
              handleSeacrh();
            }}
          >
            <SearchIcon />
          </Button>
        </Grid>
        <Grid item xs={12} md={1}>
          <Button
            color="success"
            size="small"
            variant="contained"
            onClick={() => {
              router.push("articles/create");
            }}
          >
            <Typography>New</Typography>
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
                              <div>
                                <Button
                                  sx={{
                                    mr: 2,
                                    textTransform: "none",
                                    "&:hover": { backgroundColor: "transparent", color: red[500] }, // Add this line
                                  }}
                                  onClick={() => {
                                    router.push(`articles/${row.id}`);
                                  }}
                                >
                                  Detail...
                                </Button>
                              </div>
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
      </Paper>
    </React.Fragment>
  );
};
export default StickyHeadTable;
