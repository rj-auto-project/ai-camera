import React, { useState } from "react";
import PropTypes from "prop-types";
import "./DraggablePanel.css";
import Close from "@mui/icons-material/Close";

const DraggablePanel = ({
  children,
  top = "7%",
  left,
  right = "4%",
  bottom = "5%",
  width = "280px",
  minWidth = "300px",
  maxWidth = "90%",
  initialMaximized = true,
  headerTitle = "Panel Title",
  zIndex = 1000,
  footerButtonLabel = "Continue",
  onFooterButtonClick,
  setCameraList,
}) => {
  const [isMaximized, setIsMaximized] = useState(initialMaximized);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const closePanel = () => {
    sessionStorage.removeItem("selectedCameraList");
    setCameraList([]);
  };

  const panelStyles = isMaximized
    ? {
        top,
        left,
        right,
        bottom,
        width,
        height: "100%",
        maxHeight: "90%",
      }
    : {
        top,
        left,
        right,
        bottom,
        width,
        height: "60px",
        maxWidth,
        minWidth,
      };

  return (
    <div className="resizable-panel" style={{ ...panelStyles, zIndex }}>
      <div className="panel-header">
        <span className="panel-title">{headerTitle}</span>
        <div className="panel-controls">
          <button
            className="panel-button"
            onClick={toggleMaximize}
            aria-label={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? "🗗" : "🗖"}
          </button>
          <button
            className="panel-button"
            onClick={closePanel}
            aria-label="Close"
          >
            <Close />
          </button>
        </div>
      </div>
      {isMaximized && (
        <div className="panel-content">
          {children}
          <div className="panel-footer">
            <button className="footer-button" onClick={onFooterButtonClick}>
              {footerButtonLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

DraggablePanel.propTypes = {
  children: PropTypes.node.isRequired,
  top: PropTypes.string,
  left: PropTypes.string,
  right: PropTypes.string,
  bottom: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  minWidth: PropTypes.string,
  minHeight: PropTypes.string,
  maxWidth: PropTypes.string,
  maxHeight: PropTypes.string,
  initialMaximized: PropTypes.bool,
  headerTitle: PropTypes.string,
  zIndex: PropTypes.number,
  footerButtonLabel: PropTypes.string,
  onFooterButtonClick: PropTypes.func,
};

export default DraggablePanel;
