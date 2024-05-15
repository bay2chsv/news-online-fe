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
import { accessToken } from "@/utils/auth";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import Breadcrumb from "@/components/Breadcrumb";
import Swal from "sweetalert2";
import UserAPI from "@/api/UserAPI";
import { red, green } from "@mui/material/colors";

interface Column {
  id: "id" | "email" | "fullName" | "roleName" | "enable" | "actions";
  label: string;
  minWidth?: number;
  align?: "right" | "center";
  format?: (value: number) => string;
}
const columns: readonly Column[] = [
  { id: "id", label: "Id", minWidth: 75 },
  { id: "email", label: "Email", minWidth: 120 },
  { id: "fullName", label: "Full name", minWidth: 100 },
  { id: "roleName", label: "Role name", minWidth: 100 },
  { id: "enable", label: "Enable", minWidth: 100, align: "center" },
  { id: "actions", label: "Actions", minWidth: 150 },
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
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
function index() {
  const [dataAPI, setDataAPI] = useState<any>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [userDetail, setUserDetail] = useState({ id: "", email: "", fullName: "", roleId: "", enabled: false });
  const [user, setUser] = useState({ id: "", email: "", fullName: "", roleId: "", enabled: false, enable_query: "" });
  const fetchDataAndUpdateState = async (rowsPerPage: any, Page: any) => {
    try {
      const { data } = await UserAPI.getAll(rowsPerPage, Page + 1, accessToken);
      setDataAPI(data.data);
      setTotalItems(data.totalItems);
      setPage(data.page - 1);
      setRowsPerPage(data.limit);
    } catch (error) {}
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [openDialog, setOpenDialog] = useState(false);
  const handleDeatail = async (id: any) => {
    setOpenDialog(true);
    const { data } = await UserAPI.getByID(id, accessToken);
    setUserDetail({
      id: data.id,
      email: data.email,
      fullName: data.fullName,
      roleId: data.roleId,
      enabled: data.enabled,
    });
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    fetchDataAndUpdateState(rowsPerPage, page);
  }, [rowsPerPage, page]);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleConfirm = async (e: any) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const { data } = await UserAPI.update(userDetail.id, userDetail, accessToken);
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

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/admin">
      admin
    </Link>,
    <Link underline="hover" key="2" color="inherit" href="/admin/users">
      users
    </Link>,
  ];

  const handleSeacrh = async () => {
    try {
      const { data } = await UserAPI.getSearchUserList(rowsPerPage, user.email, user.enable_query, user.fullName, user.roleId, accessToken);

      setDataAPI(data.data);
      setTotalItems(data.totalItems);
      setPage(data.page - 1);
      setRowsPerPage(data.limit);
    } catch (error) {}
  };
  return (
    <>
      <Breadcrumb breadcrumbs={breadcrumbs} />
      <Typography variant="h5" sx={{ m: 1, p: 1 }}>
        users Management
      </Typography>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">roleName</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={user.roleId}
              onChange={(e) => setUser({ ...user, roleId: e.target.value })}
              label="roleName"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={1}>Người dùng</MenuItem>
              <MenuItem value={3}>Cộng tác viên</MenuItem>
              <MenuItem value={4}>Nhà báo</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            required
            fullWidth
            id="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            label="Email"
            name="email"
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Enable</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={user.enable_query}
              onChange={(e) => setUser({ ...user, enable_query: e.target.value })}
              label="Enable"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"true"}>Yes</MenuItem>
              <MenuItem value={"false"}>No</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            required
            fullWidth
            id="fullName"
            onChange={(e) => setUser({ ...user, fullName: e.target.value })}
            value={user.fullName}
            label="Full Name"
            name="fullName"
          />
        </Grid>
        <Grid item xs={12} md={1}>
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
                                  onClick={() => {
                                    handleDeatail(row.id);
                                  }}
                                  sx={{
                                    textTransform: "none",
                                    "&:hover": { backgroundColor: "transparent", color: red[500] }, // Add this line
                                  }}
                                >
                                  Details..
                                </Button>
                              </div>
                            ) : column.format && typeof value === "number" ? (
                              column.format(value)
                            ) : column.id === "enable" ? (
                              <>
                                {value ? (
                                  // <Box sx={{ color: "#00AF9B", fontWeight: "bold" }}>Yes</Box>
                                  <CircleIcon fontSize="small" style={{ color: green[500] }} />
                                ) : (
                                  <CircleIcon fontSize="small" style={{ color: red[500] }} />
                                )}
                              </>
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
          <DialogTitle> Details</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" sx={{ m: 1 }} variant="h5">
                User
              </Typography>
              <Box component="form" noValidate sx={{ width: 470 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={10}>
                    <TextField
                      required
                      fullWidth
                      id="fullName"
                      onChange={(e) => setUserDetail({ ...userDetail, fullName: e.target.value })}
                      value={userDetail.fullName}
                      label="Tên hiện thị"
                      name="fullName"
                    />
                  </Grid>
                  <Grid item xs={12} sm={10}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      value={userDetail.email}
                      onChange={(e) => setUserDetail({ ...userDetail, email: e.target.value })}
                      label="Email"
                      name="email"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">roleName</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={userDetail.roleId}
                        onChange={(e) => setUserDetail({ ...userDetail, roleId: e.target.value })}
                        label="roleName"
                      >
                        <MenuItem value={1}>Người dùng</MenuItem>
                        <MenuItem value={3}>Cộng tác viên</MenuItem>
                        <MenuItem value={4}>Nhà báo</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={userDetail.enabled}
                          onChange={(e) => setUserDetail({ ...userDetail, enabled: e.target.checked })}
                        />
                      }
                      label="Enable"
                      labelPlacement="start"
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "15px" }}>
              <Button onClick={handleConfirm} color="primary">
                Save
              </Button>
              <Button onClick={handleCloseDialog} color="error" autoFocus>
                Cancel
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
}

export default index;
