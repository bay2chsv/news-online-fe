import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Autocomplete, Box, Container, Grid, IconButton, InputBase, Stack, TextField } from "@mui/material";

import MainAuth from "./Dialog/MainAuth";
import logo from "./image/1.png";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import { grey } from "@mui/material/colors";
import { useRouter } from "next/router";
import SearchIcon from "@mui/icons-material/Search";
interface HeaderProps {
  currentDate: string;
}
const province = [
  {
    province_id: "92",
    province_name: "Cần Thơ",
    province_type: "Tỉnh",
    province_code: "Can Tho",
  },
  {
    province_id: "48",
    province_name: "Đà Nẵng",
    province_type: "Tỉnh",
    province_code: "Da Nang",
  },
  {
    province_id: "01",
    province_name: "Hà Nội",
    province_type: "Tỉnh",
    province_code: "Ha Noi",
  },
  {
    province_id: "79",
    province_name: "Hồ Chí Minh",
    province_type: "Tỉnh",
    province_code: "Ho Chi Minh",
  },
  {
    province_id: "51",
    province_name: "Quảng Ngãi",
    province_type: "Tỉnh",
    province_code: "quang ngai",
  },
  // Add the rest of the modified objects here...
];

export default function Header(props: HeaderProps) {
  const [address, setAddress] = useState({
    province_id: "51",
    province_name: "Quảng Ngãi",
    province_type: "Tỉnh",
    province_code: "quang ngai",
  });
  const [temp, setTemp] = useState<number>(0);

  const convertToCelsius = (kelvinTemp: number) => {
    return parseFloat((kelvinTemp - 273.15).toFixed(2));
  };

  const getTempWeather = async (province: any) => {
    if (!province) {
      province = {
        province_id: "51",
        province_name: "Quảng Ngãi",
        province_type: "Tỉnh",
        province_code: "quang ngai",
      };
    }
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${province.province_code}&appid=f1315b1ea4a5eec613b6642ea6a3ebaf`
    );
    const temp: number = data.main.temp;
    setTemp(convertToCelsius(temp));
  };

  React.useEffect(() => {
    getTempWeather(address);
  }, [temp, address]);

  const { currentDate } = props;
  const formatDate = (date: any) => {
    // Parse the date string to a Date object
    const parsedDate = new Date(date);
    // Get the day, month, and year
    const day = parsedDate.getDate();
    const month = parsedDate.getMonth() + 1; // Month is zero-based
    const year = parsedDate.getFullYear();
    // Return the formatted date string
    return `${day}/${month}/${year}`;
  };
  const [searchValue, setSearchValue] = useState("");
  const handleSearchChange = (event: any) => {
    setSearchValue(event.target.value);
  };
  const router = useRouter();

  const handleSearch = () => {
    if (!searchValue) {
      return;
    }
    router.push(`/search?tin=${searchValue}`);
  };
  return (
    <Box sx={{ background: "white" }}>
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        <Grid container alignItems="center">
          <Grid item xs={2}>
            <Link href={"/"}>
              {/* Change the path to the desired one */}
              <img src={logo.src} style={{ height: 50, width: "auto" }} />
            </Link>
          </Grid>
          <Grid item xs={2}>
            {formatDate(currentDate)}
          </Grid>
          <Grid sx={{ display: "flex" }} item xs={2}>
            <Stack spacing={2} sx={{ width: 180 }}>
              <Autocomplete
                size="small"
                id="free-solo-demo"
                options={province}
                onChange={(e, newValue: any) => {
                  setAddress(newValue);
                }}
                value={address}
                getOptionLabel={(option: any) => option.province_name ?? ""}
                sx={{ width: 180 }}
                renderInput={(params) => <TextField {...params} label="Đia chỉ " />}
              />
            </Stack>
          </Grid>
          <Grid item xs={1}>
            <Box>
              <DeviceThermostatIcon fontSize="medium" /> {temp} °C
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box
              sx={{
                ml: 5,
                display: "flex",
                alignItems: "center",
                width: 250,
                background: grey[100],
                borderRadius: 5,
              }}
            >
              <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Tìm kiếm tin" value={searchValue} onChange={handleSearchChange} />
              <IconButton type="button" sx={{ p: "10px" }} aria-label="search" onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item>
            <MainAuth />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
