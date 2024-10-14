import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  IconButton,
  Typography,
} from "@mui/material";
import { Undo, FileUpload } from "@mui/icons-material";

const CanvasDraw = ({ modelType, closeModal, setImageCordinates }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState(
    modelType === "illegalParking" ? "polygon" : "line"
  );
  const [image, setImage] = useState(null);
  const [linePairs, setLinePairs] = useState([]);
  const [currentLine, setCurrentLine] = useState(null);
  const [currentPair, setCurrentPair] = useState({ red: [], green: [] });
  const [canSavePair, setCanSavePair] = useState(false);
//   const [polygonCoordinates, setPolygonCoordinates] = useState([]);
//   const [currentPolygon, setCurrentPolygon] = useState([]);
//   const [polygonSaveEnabled, setPolygonSaveEnabled] = useState(false);
  const canvasWidth = 640;
  const canvasHeight = 480;

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (image) {
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (drawMode === "line") {
      if (currentPair.red.length === 0) {
        setIsDrawing(true);
        setCurrentLine({
          color: "red",
          startX: x,
          startY: y,
          endX: x,
          endY: y,
        });
      } else if (currentPair.green.length < 3) {
        setIsDrawing(true);
        setCurrentLine({
          color: "green",
          startX: x,
          startY: y,
          endX: x,
          endY: y,
        });
      }
    } else if (drawMode === "polygon") {
      const newVertices = [...currentPolygon, { x, y }];
      setCurrentPolygon(newVertices);
      setPolygonSaveEnabled(newVertices.length > 2);
      redrawCanvas(newVertices);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    setCurrentLine((prevLine) => ({
      ...prevLine,
      endX,
      endY,
    }));

    redrawCanvas();
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      if (currentPair.red.length === 0 && currentLine.color === "red") {
        setCurrentPair((prev) => ({
          ...prev,
          red: [...prev.red, currentLine],
        }));
      } else if (currentPair.green.length < 3 && currentLine.color === "green") {
        setCurrentPair((prev) => ({
          ...prev,
          green: [...prev.green, currentLine],
        }));
      }
      setCurrentLine(null);
      setCanSavePair(true);
    }
    setIsDrawing(false);
    redrawCanvas();
  };

  const handleOkClick = () => {
    if (canSavePair) {
      const newLinePair = {
        red: currentPair.red,
        green: currentPair.green,
      };

      setLinePairs((prevPairs) => [...prevPairs, newLinePair]);
      setCurrentPair({ red: [], green: [] });
      setCanSavePair(false);
      redrawCanvas();
    }
  };

  const handleUndo = () => {
    if (linePairs.length > 0) {
      const updatedLinePairs = linePairs.slice(0, -1);
      setLinePairs(updatedLinePairs);
      redrawCanvas();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();

    img.onload = () => {
      setImage(img);
      redrawCanvas();
    };

    img.src = URL.createObjectURL(file);
  };

  const redrawCanvas = () => {
    clearCanvas();
    
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
  
    // Draw stored line pairs
    linePairs.forEach((pair) => {
      pair.red.forEach((line) => drawLine(context, line, "red"));
      pair.green.forEach((line) => drawLine(context, line, "green"));
    });
  
    // Draw current pair
    currentPair.red.forEach((line) => drawLine(context, line, "red"));
    currentPair.green.forEach((line) => drawLine(context, line, "green"));
  
    // Draw current line
    if (currentLine) {
      drawLine(context, currentLine, currentLine.color);
    }
  };

  const drawLine = (context, line, color) => {
    context.beginPath();
    context.moveTo(line.startX, line.startY);
    context.lineTo(line.endX, line.endY);
    context.strokeStyle = color;
    context.stroke();
  };

  useEffect(() => {
    redrawCanvas();
  }, [linePairs, currentPair, currentLine, image]);

  return (
    <Box sx={{ p: 1 }}>
      <Paper elevation={3} sx={{ p: 1, mb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography sx={{ ml: 2 }} variant="body1">
            {drawMode === "line" ? "Draw Line" : "Draw Polygon"}
          </Typography>
          <IconButton
            onClick={handleUndo}
            sx={{ ml: "auto", mr: 2 }}
            disabled={linePairs.length === 0}
          >
            <Undo />
          </IconButton>
          <Button
            variant="contained"
            component="label"
            startIcon={<FileUpload />}
            sx={{
              backgroundColor: "green",
              "&:hover": {
                backgroundColor: "darkgreen",
              },
              color: "white",
            }}
          >
            Upload Image
            <input type="file" hidden onChange={handleImageUpload} />
          </Button>
          <Button
            variant="contained"
            onClick={handleOkClick}
            disabled={!canSavePair}
            sx={{ ml: 1 }}
          >
            Save Pair
          </Button>
        </Box>
        <Box>
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            style={{ border: "1px solid black", marginTop: "10px" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default CanvasDraw;