import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import TagAPI from "@/api/TagAPI";

interface DataProp {
  id: string;
  name: string;
  code: string;
}

interface TagsProps {
  onSelectedTagsChange: (tags: DataProp[]) => void;
  disabled?: any;
  tags?: any;
}

export default function Tags({ disabled, onSelectedTagsChange, tags }: TagsProps) {
  const [data, setData] = useState<DataProp[]>(tags);
  // const [selectedData, setSelectedData] = useState<DataProp[]>([]);
  const DataState = async () => {
    try {
      const { data } = await TagAPI.getAll(50);
      setData(data.data);
    } catch (error) {}
  };
  useEffect(() => {
    DataState();
  }, []);

  const handleSelectedDataChange = (event: React.ChangeEvent<{}>, value: DataProp[]) => {
    onSelectedTagsChange(value);
  };
  return (
    <Stack spacing={3} sx={{ width: 275 }}>
      <Autocomplete
        multiple
        id="tags-outlined"
        options={data}
        disabled={disabled}
        getOptionLabel={(option: DataProp) => option.name}
        defaultValue={...data}
        onChange={handleSelectedDataChange}
        filterSelectedOptions
        renderInput={(params) => <TextField {...params} placeholder="Tags" />}
      />
    </Stack>
  );
}
