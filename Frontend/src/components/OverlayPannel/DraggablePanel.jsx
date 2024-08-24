import React, { useState } from "react";
import PropTypes from "prop-types";
import "./DraggablePanel.css";

const DraggablePanel = ({
  children,
  top = "5%",
  left,
  right = "2%",
  bottom = "5%",
  width = "300px",
  minWidth = "300px",
  maxWidth = "90%",
  initialMaximized = true,
  headerTitle = "Panel Title",
  zIndex = 1000,
  footerButtonLabel = "Continue",
  onFooterButtonClick,
  setCameraList,
  isVisible,
}) => {
  const [isMaximized, setIsMaximized] = useState(initialMaximized);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const closePanel = () => {
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

  if (!isVisible) return null;

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
            ×
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
