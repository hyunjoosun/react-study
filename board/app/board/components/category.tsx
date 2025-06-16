import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  IconButton,
  SelectChangeEvent,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useCategory } from "../../hook/boardList";

interface CategoryProps {
  category: string;
  search: string;
  onCategoryChange: (value: string) => void;
  onSearch: (value: string) => void;
}

export default function Category({
  category,
  search,
  onCategoryChange,
  onSearch,
}: CategoryProps) {
  const {
    categories,
    selectedCategory,
    inputValue,
    setSelectedCategory,
    setInputValue,
  } = useCategory(category, search);

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSearch = () => {
    onCategoryChange(selectedCategory);
    onSearch(inputValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleSearch();
  };

  return (
    <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>카테고리</InputLabel>
        <Select
          label="카테고리"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <MenuItem value="all">전체</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        placeholder="검색어를 입력하세요"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        InputProps={{
          endAdornment: (
            <IconButton onClick={handleSearch} edge="end">
              <SearchIcon />
            </IconButton>
          ),
        }}
      />
    </Box>
  );
}
