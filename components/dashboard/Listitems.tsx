import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import CoffeeMakerIcon from "@mui/icons-material/CoffeeMaker";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import { useRouter } from "next/router";
import ArticleIcon from "@mui/icons-material/Article";
import ChatIcon from "@mui/icons-material/Chat";
import TagOutlinedIcon from "@mui/icons-material/TagOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
export const AdminListItems = () => {
  const router = useRouter();
  const isActive = (path: any) => router.pathname === path;
  return (
    <React.Fragment>
      <ListItemButton selected={isActive("/admin")} href="/admin" sx={{ "&.Mui-selected": { backgroundColor: "#6881FF", color: "white" } }}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton
        selected={isActive("/admin/users")}
        href="/admin/users"
        sx={{ "&.Mui-selected": { backgroundColor: "#6881FF", color: "white" } }}
      >
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Users" />
      </ListItemButton>{" "}
      <ListItemButton
        selected={isActive("/admin/articles")}
        href="/admin/articles"
        sx={{ "&.Mui-selected": { backgroundColor: "#6881FF", color: "white" } }}
      >
        <ListItemIcon>
          <ArticleIcon />
        </ListItemIcon>
        <ListItemText primary="Articles" />
      </ListItemButton>
      <ListItemButton
        selected={isActive("/admin/tags")}
        href="/admin/tags"
        sx={{ "&.Mui-selected": { backgroundColor: "#6881FF", color: "white" } }}
      >
        <ListItemIcon>
          <SellOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Tags" />
      </ListItemButton>
      <ListItemButton
        selected={isActive("/admin/categories")}
        href="/admin/categories"
        sx={{ "&.Mui-selected": { backgroundColor: "#6881FF", color: "white" } }}
      >
        <ListItemIcon>
          <CategoryOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Categories" />
      </ListItemButton>
      <ListItemButton
        href="/admin/comments"
        selected={isActive("/admin/comments")}
        sx={{ "&.Mui-selected": { backgroundColor: "#6881FF", color: "white" } }}
      >
        <ListItemIcon>
          <ChatIcon />
        </ListItemIcon>
        <ListItemText primary="Comments" />
      </ListItemButton>
    </React.Fragment>
  );
};

export const CollaboratorListItems = () => {
  const router = useRouter();

  // Function to check if the path matches the current URL
  const isActive = (path: any) => router.pathname === path;

  return (
    <React.Fragment>
      <ListItemButton
        href="/collaborator"
        selected={isActive("/dashboard")}
        sx={{ "&.Mui-selected": { backgroundColor: "primary.main", color: "white" } }}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton
        href="/collaborator/articles"
        selected={isActive("/articles")}
        sx={{ "&.Mui-selected": { backgroundColor: "primary.main", color: "white" } }}
      >
        <ListItemIcon>
          <ArticleIcon />
        </ListItemIcon>
        <ListItemText primary="Articles" />
      </ListItemButton>
      <ListItemButton
        href="/collaborator/categories"
        selected={isActive("/categories")}
        sx={{ "&.Mui-selected": { backgroundColor: "primary.main", color: "white" } }}
      >
        <ListItemIcon>
          <CategoryOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Categories" />
      </ListItemButton>
      <ListItemButton
        href="/collaborator/tags"
        selected={isActive("/tags")}
        sx={{ "&.Mui-selected": { backgroundColor: "primary.main", color: "white" } }}
      >
        <ListItemIcon>
          <SellOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Tags" />
      </ListItemButton>

      <ListItemButton
        href="/collaborator/comments"
        selected={isActive("/comments")}
        sx={{ "&.Mui-selected": { backgroundColor: "primary.main", color: "white" } }}
      >
        <ListItemIcon>
          <ChatIcon />
        </ListItemIcon>
        <ListItemText primary="Comments" />
      </ListItemButton>
    </React.Fragment>
  );
};
export const JournalistListItems = () => {
  const router = useRouter();

  // Function to check if the path matches the current URL
  const isActive = (path: any) => router.pathname === path;

  return (
    <React.Fragment>
      <ListItemButton
        selected={isActive("/dashboard")}
        href="/journalist"
        sx={{ "&.Mui-selected": { backgroundColor: "primary.main", color: "white" } }}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton
        href="/journalist/articles"
        selected={isActive("/articles")}
        sx={{ "&.Mui-selected": { backgroundColor: "primary.main", color: "white" } }}
      >
        <ListItemIcon>
          <ArticleIcon />
        </ListItemIcon>
        <ListItemText primary="Articles" />
      </ListItemButton>
    </React.Fragment>
  );
};
