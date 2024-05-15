import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";

import CottageIcon from "@mui/icons-material/Cottage";
import { Box, Container, Divider, InputBase, Link, Paper, Tooltip } from "@mui/material";

import { Dropdown } from "@mui/base/Dropdown";
import { Menu } from "@mui/base/Menu";
import { MenuButton as BaseMenuButton } from "@mui/base/MenuButton";
import { MenuItem as BaseMenuItem, menuItemClasses } from "@mui/base/MenuItem";
import { styled } from "@mui/system";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import { pink, blue, red } from "@mui/material/colors";

import { useRouter } from "next/router";

export default function Navbar({ category }: any) {
  const categories = category || [];
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [currentHoveredMenu, setCurrentHoveredMenu] = useState<number | null>(null);

  const handleMouseEnter = (menuId: number) => {
    setDropdownOpen(true);
    setCurrentHoveredMenu(menuId);
  };
  const handleMouseLeave = () => {
    setDropdownOpen(false);
    setCurrentHoveredMenu(null);
  };
  


  return (
    <Box sx={{ mb: 2, position: "sticky", top: 0, zIndex: 1000, backgroundColor: "white" }}>
      <Container maxWidth="lg">
        <Toolbar component="nav" variant="dense" sx={{ overflowX: "auto", position: "relative" }}>
          {/* justifyContent: "space-evenly", */}
          <Box>
            <Link href={"/"}>
              <Tooltip title="home">
                <IconButton>
                  <CottageIcon sx={{ color: red[400] }} fontSize="small" />
                </IconButton>
              </Tooltip>
            </Link>
          </Box>
          <>
            <Box sx={{ display: "flex" }}>
              {categories
                .sort((a: any, b: any) => {
                  const subCategoryCountA = categories.filter((category: any) => category.parentId === a.id).length;
                  const subCategoryCountB = categories.filter((category: any) => category.parentId === b.id).length;
                  return subCategoryCountB - subCategoryCountA;
                })
                .filter((parent: any) => parent.parentId === null)
                .map((parent: any) => (
                  <Box onMouseEnter={() => handleMouseEnter(parent.id)} key={parent.id} sx={{ ml: 3 }}>
                    <Dropdown open={isDropdownOpen && currentHoveredMenu === parent.id}>
                      <MenuButton>
                        <Link color="inherit" style={{ textDecoration: "none", color: "inherit" }} key={parent.id} href={`/${parent.code}`}>
                          {parent.name}
                        </Link>
                        <Menu slots={{ listbox: Listbox }} onMouseEnter={() => handleMouseEnter(parent.id)} onMouseLeave={handleMouseLeave}>
                          {categories
                            .filter((sub: any) => sub.parentId === parent.id)
                            .map((sub: any) => (
                              <Link
                                color="inherit"
                                style={{ textDecoration: "none", color: "inherit" }}
                                key={sub.id}
                                href={`/${parent.code}/${sub.code}`}
                              >
                                <MenuItem key={sub.id}>{sub.name}</MenuItem>
                              </Link>
                            ))}
                        </Menu>
                      </MenuButton>
                    </Dropdown>
                  </Box>
                ))}
            </Box>
       
          </>
        </Toolbar>
      </Container>
      <Divider />
    </Box>
  );
}

const grey = {
  0: "#FFFFFF",
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};
const MenuItem = styled(BaseMenuItem)(
  ({ theme }) => `
    list-style: none;
    padding: 8px;
    font-size: 0.875rem;
    border-radius: 8px;
    cursor: default;
    user-select: none;
  
    &:last-of-type {
      border-bottom: none;
    }
    &.${menuItemClasses.focusVisible} {
      outline: 3px solid ${theme.palette.mode === "dark" ? grey[0] : grey[0]};
      background-color: ${theme.palette.mode === "dark" ? grey[0] : grey[0]};
      color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    }
    &.${menuItemClasses.disabled} {
      color: ${theme.palette.mode === "dark" ? grey[700] : grey[400]};
    }
    &:hover:not(.${menuItemClasses.disabled}) {
      background-color: ${theme.palette.mode === "dark" ? red[500] : red[100]};
      color: ${theme.palette.mode === "dark" ? red[100] : red[900]};
      transition: background-color 0.3s, color 0.3s;
    }
    `
);

const MenuButton = styled(BaseMenuButton)(
  ({ theme }) => `
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    padding: 8px 16px;
    border-radius: 8px;
    color: white;
    transition: all 150ms ease;
    cursor: pointer;
    background: ${theme.palette.mode === "dark" ? grey[900] : "#FFFFFF"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[0] : grey[0]};
    color: ${theme.palette.mode === "dark" ? grey[0] : grey[900]};
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    position: relative;
    &:hover {
      background: ${theme.palette.mode === "dark" ? red[800] : red[100]};
      color: ${theme.palette.mode === "dark" ? red[300] : red[900]}
    }   
    `
);

const Listbox = styled("ul")(
  ({ theme }) => `
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    box-sizing: border-box;
    padding: 6px;
    min-width: 200px;
    border-radius: 12px;
    overflow: auto;
    outline: 0px;
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    box-shadow: 0px 4px 6px ${theme.palette.mode === "dark" ? "rgba(0,0,0, 0.50)" : "rgba(0,0,0, 0.05)"};
    z-index: 1;
    `
);
