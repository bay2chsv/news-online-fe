import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Grid, Paper } from "@mui/material";
import Link from "next/link";
import { grey } from "@mui/material/colors";

export default function Footer({ category }: any) {
  const categories = category || [];
  const groupSections = (sections: any[], groupSize: number) => {
    const groupedSections = [];
    for (let i = 0; i < sections.length; i += groupSize) {
      groupedSections.push(sections.slice(i, i + groupSize));
    }
    return groupedSections;
  };
  const groupedSections = groupSections(categories, 3);

  return (
    <React.Fragment>
      <Grid container >
        {groupedSections.map((group, index) => (
          <Grid item key={index}>
            <List component="nav" sx={{ width: "100%", maxWidth: 360, marginRight: 2 }}>
              {group.map((category) => (
                <ListItem key={category.name}>
                  <Link color="inherit" style={{ textDecoration: "none", color: "inherit" }} href={`/${category.code}`}>
                    {category.name}
                  </Link>
                </ListItem>
              ))}
            </List>
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );
}
