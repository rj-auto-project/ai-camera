import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSurveyFetch } from "../api/hooks/useFetchSurvey";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Select,
  MenuItem,
  Button,
  OutlinedInput,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ImageModel from "../components/model/imageModel";
import LazyImage from "../components/image/LazyloadImage";
import { LocationCell } from "../components/Locationcell";


const SurveyDetails = () => {
  const location = useLocation();
  const { surveyId } = location.state || {};
  const { mutate: fetchSurveys } = useSurveyFetch();
  const { loading, data, error } = useSelector((state) => state.survey);

  // State management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isOpen, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filters, setFilters] = useState({
    className: "",
  });
  const [sort, setSort] = useState("asc");

  useEffect(() => {
    if (surveyId) {
      fetchSurveys({ surveyId });
    }
  }, [fetchSurveys, surveyId]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpen = (item) => {
    if (!item) {
      console.error('No item provided to handleOpen');
      return;
    }
  
    const { thumbnail = '' } = item;
    if (!thumbnail) {
      console.error('Missing thumbnail');
      return;
    }
  
    const imageUrl = `http://localhost:6543/surveys/${thumbnail}`;
    setSelectedItem(item);
    
    const img = new Image();
    img.onload = () => setOpen(true);
    img.onerror = () => {
      setSelectedItem(null);
      toast.error('Failed to load image');
    };
    img.src = imageUrl;
  };

  const handleRefresh = () => {
    fetchSurveys({ surveyId });
  };


  const filteredData = data?.data?.filter(item => {
    if (filters.className && item.className !== filters.className) return false;
    return true;
  }) || [];

  const sortedData = [...filteredData].sort((a, b) => {
    const distA = parseFloat(a.distance);
    const distB = parseFloat(b.distance);
    return sort === "asc" ? distA - distB : distB - distA;
  });

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const FilterAndSort = () => {
    const uniqueClasses = Array.from(
      new Set(data?.data?.map(item => item.className))
    );

    return (
      <Box display="flex" gap={1} alignItems="center" padding={1}>
        <Select
          value={filters.className || ""}
          onChange={(e) => setFilters(prev => ({ ...prev, className: e.target.value }))}
          displayEmpty
          input={<OutlinedInput />}
          style={{ width: 150, height: 40 }}
        >
          <MenuItem value="">
            <em>All Types</em>
          </MenuItem>
          {uniqueClasses.map((type) => (
            <MenuItem key={type} value={type}>
              {type.replace("-", " ").toUpperCase()}
            </MenuItem>
          ))}
        </Select>

        <Button 
          onClick={() => setSort(prev => prev === "asc" ? "desc" : "asc")}
          style={{ height: 40 }}
        >
          Sort by Distance ({sort === "asc" ? "↑" : "↓"})
        </Button>

        <Button 
          onClick={handleRefresh} 
          disabled={loading}
          style={{ height: 40 }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Refresh"
          )}
        </Button>
      </Box>
    );
  };

  if (loading && !data?.data?.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="96vh">
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography
        sx={{
          height: "96vh",
          display: "flex",
          width: "100%",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 2,
          fontWeight: "bold",
        }}
      >
        Error loading survey data...
      </Typography>
    );
  }

  return (
    <Paper
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <TableContainer
        style={{ flex: 1, overflow: "auto" }}
        sx={{
          "&::-webkit-scrollbar": {
            width: "6px",
            height: "6px",
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#333",
            borderRadius: "10px",
            border: "1px solid #f9f9f9",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#222",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
            borderRadius: "10px",
          },
        }}
      >
        <Table>
          <StickyTableHead>
            <TableRow>
              <BoldTableCell>S.No.</BoldTableCell>
              <BoldTableCell>Thumbnail</BoldTableCell>
              <BoldTableCell>Class Name</BoldTableCell>
              <BoldTableCell>Location</BoldTableCell>
              <BoldTableCell>Distance (m)</BoldTableCell>
            </TableRow>
          </StickyTableHead>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell 
                  onClick={() => handleOpen(item)}
                  style={{ cursor: "pointer" }}
                >
                  <LazyImage
                    src={`http://localhost:6543/surveys/${item.thumbnail}`}
                    alt={item.className}
                    width={100}
                    height={60}
                  />
                </TableCell>
                <TableCell>
                  {item.className.replace("-", " ").toUpperCase()}
                </TableCell>
                <TableCell>
                <LocationCell coordinates={item.location}/>
                </TableCell>
                <TableCell>{item.distance}m</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {!paginatedData.length && !error && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Typography fontWeight="bold">No Survey Data Found!</Typography>
          </Box>
        )}
      </TableContainer>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding={0.5}
        bgcolor="#121212"
      >
        <FilterAndSort />
        <TablePagination
          component="div"
          count={sortedData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Box>

      {isOpen && (
        <ImageModel
          isOpen={isOpen}
          setOpen={setOpen}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />
      )}
    </Paper>
  );
};

export default SurveyDetails;

const StickyTableHead = styled(TableHead)({
  position: "sticky",
  top: 0,
  zIndex: 1,
  backgroundColor: "#121212",
  width: "100%",
});

const BoldTableCell = styled(TableCell)({
  fontWeight: "bold",
});