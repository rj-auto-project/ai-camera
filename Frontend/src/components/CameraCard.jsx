import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const CameraCard = ({ camera, onRemove }) => {
  return (
    <div style={cardStyle}>
      <div style={cardHeaderStyle}>
        <div>
          <strong>{camera.cameraName}</strong>
          <br />
          <b>Camera Id:</b> {camera.cameraId}
        </div>
        <button onClick={onRemove} style={removeButtonStyle}>
          <CloseIcon style={iconStyle} />
        </button>
      </div>
      <div style={cardBodyStyle}>
        <b>Location:</b> {camera.location}
        <br />
        <b>Status:</b> {camera.status}
        <br />
        <b>Type:</b> {camera.cameraType}
      </div>
    </div>
  );
};

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  marginBottom: "10px",
  backgroundColor: "#fff",
  overflow: "hidden",
};

const cardHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "gray",
  color: "white",
  padding: "10px",
  borderBottom: "1px solid #ddd",
};

const removeButtonStyle = {
  border: "none",
  background: "none",
  cursor: "pointer",
};

const iconStyle = {
  backgroundColor:"red",
  borderRadius: "50%",
  fontSize: "24px",
};

const cardBodyStyle = {
  padding: "10px",
};

export default CameraCard;
