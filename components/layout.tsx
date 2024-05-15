import { Box, Button, createTheme, CssBaseline, ThemeProvider, Typography } from "@mui/material";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import Dashboard from "./dashboard/Dashboard";
import Footer from "./Footer";
import Header from "./Header";
import { useRouter } from "next/router";
import Sidebar from "./Sidebar";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Navbar from "./Navbar";
import ProtectedRoute from "./auth/ProtectRoute";
import CategoryAPI from "@/api/CategoryAPI";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { AdminListItems, CollaboratorListItems, JournalistListItems } from "./dashboard/Listitems";
import { grey, red } from "@mui/material/colors";
import logo from "./image/2.jpg";
interface LayoutProps {
  children: ReactNode;
}

const sidebar = {
  archives: [
    { title: "Quảng cáo", url: "#" },
    { title: "Hợp tác bản quyền", url: "#" },
    { title: "Toàn soạn", url: "#" },
  ],
  social: [
    { sdt: "035.624.2157", name: "Chansouvanh Keopaseuth" },
    { sdt: "093.569.3144", name: "Ngô Hoàng Nam" },
  ],
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const isAdminDashboardPath = router.pathname.startsWith("/admin");
  const iscollaboratorDashboardPath = router.pathname.startsWith("/collaborator");
  const isjournalistDashboardPath = router.pathname.startsWith("/journalist");
  const currentDate = new Date();
  const pathsToCheck = ["/manageinfohub", "/404", "/unauthorized"];

  const isMatchingPath = pathsToCheck.some((path) => {
    return router.pathname.startsWith(path) || router.pathname.includes(path);
  });
  const formattedDate = currentDate.toDateString();
  if (iscollaboratorDashboardPath) {
    return (
      <ProtectedRoute requiredRole={["ROLE_ADMIN", "ROLE_COLLABORATOR"]}>
        <Dashboard name="Collaborator Dashboard" list={<CollaboratorListItems />}>
          {children}
        </Dashboard>
      </ProtectedRoute>
    );
  }
  if (isjournalistDashboardPath) {
    return (
      <ProtectedRoute requiredRole={["ROLE_ADMIN", "ROLE_JOURNALIST"]}>
        <Dashboard name="Journalist Dashboard" list={<JournalistListItems />}>
          {children}
        </Dashboard>
      </ProtectedRoute>
    );
  }
  if (isAdminDashboardPath) {
    return (
      <ProtectedRoute requiredRole={["ROLE_ADMIN"]}>
        <Dashboard name="Admin Dashboard" list={<AdminListItems />}>
          {children}
        </Dashboard>
      </ProtectedRoute>
    );
  }
  if (isMatchingPath) {
    return <main>{children}</main>;
  }

  const defaultTheme = createTheme({
    palette: {
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#dc004e",
      },
      background: {
        default: "#FCFAF6",
      },
      text: {
        primary: "#333333",
        secondary: "#666666",
      },
    },
    typography: {
      fontFamily: ["Roboto", "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Arial", "sans-serif"].join(","),
      h1: {
        fontSize: "2.5rem",
        fontWeight: "bold",
        lineHeight: 1.2,
      },
      h2: {
        fontSize: "2rem",
        fontWeight: "bold",
        lineHeight: 1.3,
      },
    },
    spacing: 8,
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
  });
  const [categories, setCategories] = useState([]);

  const fetchgetCategories = async (rowsPerPage: number) => {
    try {
      const { data } = await CategoryAPI.getAll(rowsPerPage);
      setCategories(data.data);
    } catch (error) {}
  };
  useEffect(() => {
    fetchgetCategories(50);
  }, []);
  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Header currentDate={formattedDate} />
      <Navbar category={categories} />
      <Grid container sx={{ position: "sticky", top: "30%" }}>
        <Grid xs={11} />
        <Grid xs={1}>
          <Button
            id="comment-section"
            onClick={scrollToTop}
            sx={{
              display: scrollPosition > 650 ? "block" : "none", // You can adjust this value as needed
            }}
          >
            <ArrowUpwardIcon color="error" fontSize="large" />
          </Button>
        </Grid>
      </Grid>

      <main>{children}</main>

      <Container maxWidth="lg">
        <Grid container sx={{ borderTop: 5, pt: 2, borderBottom: 2, p: 2, borderColor: grey[400] }}>
          <Grid container sx={{ pb: 2, borderBottom: 3, p: 2, borderColor: grey[400] }}>
            <Grid item xs={8}>
              <Footer category={categories.filter((category: any) => category.parentId === null)} />
            </Grid>
            <Grid item xs={4}>
              <Sidebar archives={sidebar.archives} social={sidebar.social} />
            </Grid>
          </Grid>
          <Grid></Grid>
          <Grid item xs={12} sx={{ display: "flex" }}>
            <Grid md={4} sx={{ mr: 1 }}>
              <Typography>
                Báo tiếng Việt nhiều người xem nhất Thuộc Bộ Khoa học và Công nghệ Số giấy phép: 548/GP-BTTTT ngày 24/08/2021
              </Typography>
            </Grid>
            <Grid md={4}>
              Tổng biên tập: Phạm Hiếu Địa chỉ: Tầng 10, Tòa A FPT Tower, số 10 Phạm Văn Bạch, Dịch Vọng, Cầu Giấy, Hà Nội Điện thoại: 024
              7300 8899 - máy lẻ 4500
            </Grid>
            <Grid md={4}> 1997-2024. Toàn bộ bản quyền thuộc Phạm Văn Đồng tin điền tử</Grid>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default Layout;
