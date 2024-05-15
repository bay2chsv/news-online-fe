import React from "react";
import { Box, Divider, List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import Link from "next/link";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { grey } from "@mui/material/colors";
export default function Hotnew({ news }: any) {
  return (
    <Box sx={{ position: "sticky", top: 100, backgroundColor: "white", color: "black", border: 1, borderColor: grey[300], ml: 5 }}>
      <List
        sx={{
          bgcolor: "background.paper",
        }}
      >
        <ListItemText>
          <Typography variant="h6" textAlign={"center"}>
            🔥Tin nóng hôm nay🔥
          </Typography>
        </ListItemText>
        {Array.isArray(news) &&
          news.map((newItem: any) => (
            <React.Fragment key={newItem.id}>
              <Divider sx={{ mt: 1 }} />
              <ListItem>
                <Link
                  style={{ textDecoration: "none", color: "black" }}
                  href={`${newItem.cate_parent_code ?? ""}/${newItem.categoryCode ?? ""}`}
                >
                  🔥{newItem.title}
                </Link>
              </ListItem>
            </React.Fragment>
          ))}
      </List>
    </Box>
  );
}
