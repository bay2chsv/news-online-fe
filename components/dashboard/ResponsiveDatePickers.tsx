import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function ResponsivePickers({ label, onhandleTime }: any) {
  const handleDateChange = (date: any) => {
    if (date) {
      let selectedTime = date.format("YYYY/MM/DD");
      // onhandleTime(selectedTime);
      onhandleTime(String(selectedTime));
    } else {
      onhandleTime("");
    }
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker sx={{ width: 275 }} onChange={handleDateChange} label={label} format="DD/MM/YYYY" />
    </LocalizationProvider>
  );
}
