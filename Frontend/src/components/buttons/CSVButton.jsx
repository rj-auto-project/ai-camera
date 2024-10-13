import { CSVLink } from "react-csv";
import { Button, Icon, Tooltip } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

const CSVButton = ({ csvData, headers, filename }) => {
  if (!csvData || !Array.isArray(csvData)) {
    return null; 
  }
  return (
    <Tooltip title={"Download CSV"} placement="top">
      <Button
        variant="contained"
        color="primary"
        style={{
          margin: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <CSVLink
          data={csvData}
          headers={headers}
          filename={filename}
          style={{
            textDecoration: "none",
            color: "inherit",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Icon
            style={{
              marginRight: "5px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <CloudDownloadIcon />
          </Icon>
        </CSVLink>
      </Button>
    </Tooltip>
  );
};

export default CSVButton;
