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
import CategoryAPI from "@/api/CategoryAPI";
import { accessToken } from "@/utils/auth";
import Swal from "sweetalert2";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Link,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import Breadcrumb from "@/components/Breadcrumb";
interface Column {
  id: "id" | "name" | "code" | "parentName" | "actions";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "id", label: "Id", minWidth: 75 },
  { id: "name", label: "Name", minWidth: 170 },
  { id: "code", label: "Alias(code)", minWidth: 100 },
  { id: "parentName", label: "Parent", minWidth: 170 },
  { id: "actions", label: "Actions", minWidth: 170 },
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

export default function StickyHeadTable() {
  const [dataAPI, setDataAPI] = useState<any>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();
  const fetchDataAndUpdateState = async (rowsPerPage: any, Page: any) => {
    try {
      const { data } = await CategoryAPI.getAll(rowsPerPage, Page + 1);
      setDataAPI(data.data);
      setTotalItems(data.totalItems);
      setPage(data.page - 1);
      setRowsPerPage(data.limit);
    } catch (error) {

    }
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

  const handleDelete = async (id: any) => {

    setDeleteItemId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeleteItemId(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await CategoryAPI.deleteByID(deleteItemId, accessToken);
      fetchDataAndUpdateState(rowsPerPage, page);
      Swal.fire({
        title: "Deleting",
        text: "Delete successfully",
        icon: "success",
      });
    } catch (error) {

    } finally {
      setOpenDialog(false);
      setDeleteItemId(null);
    }
  };

  const handleSeacrh = async () => {
    try {
      const { data } = await CategoryAPI.getSearch(rowsPerPage, searchValue);
  
      setDataAPI(data.data);
      setTotalItems(data.totalItems);
      setPage(data.page - 1);
      setRowsPerPage(data.limit);
      // Refresh data after delete
    } catch (error) {

    }
  };
  const handleChange = (event: any) => {
    setSearchValue(event.target.value);
  };
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/collaborator">
      collaborator
    </Link>,
    <Link underline="hover" key="2" color="inherit" href="/collaborator/categories">
      categories
    </Link>,
  ];

  return (
    <>
      <Breadcrumb breadcrumbs={breadcrumbs} />
      <Typography variant="h5" sx={{ m: 1, p: 1 }}>
        Categories Management
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          {" "}
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Search by keyword"
            name="name"
            value={searchValue}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={1}>
          {" "}
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              handleSeacrh();
            }}
          >
            <SearchIcon />
          </Button>
        </Grid>
        <Grid item xs={12} md={1}>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => {
              router.push("categories/create");
            }}
          >
            New
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
                        const value = row[column.id];
                        return (
                          <StyledTableCell key={column.id} align={column.align}>
                            {column.id === "actions" ? (
                              <div>
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  size="small"
                                  sx={{ mr: 2 }}
                                  onClick={() => {
                                    router.push(`categories/${row.id}`);
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="contained"
                                  color="error"
                                  size="small"
                                  onClick={() => {
                                    handleDelete(row.id);
                                  }}
                                >
                                  Delete
                                </Button>
                              </div>
                            ) : column.id === "parentName" && value === null ? (
                              "-"
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
          <DialogTitle>Delete Item</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this item?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
}
