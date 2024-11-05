import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  IconButton,
  Divider,
  Typography,
} from "@mui/material";
import { Undo, FileUpload } from "@mui/icons-material";

const CanvasDraw = ({
  modelType,
  closeModal,
  setImageCordinates,
  setIllegalParkingCords,
  setWrongWayCords,
  setRedlightCrossingCords,
}) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState(
    modelType === "illegalParking" ? "polygon" : "line",
  );
  const [image, setImage] = useState(null);
  const [linePairs, setLinePairs] = useState([]);
  const [currentLine, setCurrentLine] = useState(null);
  const [currentPair, setCurrentPair] = useState({ red: [], green: [] });
  const [canSavePair, setCanSavePair] = useState(false);
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const [currentPolygon, setCurrentPolygon] = useState([]);
  const [polygonSaveEnabled, setPolygonSaveEnabled] = useState(false);

  const canvasWidth = 640;
  const canvasHeight = 480;
  const maxgreenlines = modelType === "wrongWay" ? 1 : 10;

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (image) {
      const imgAspectRatio = image.width / image.height;
      let drawWidth = canvasWidth;
      let drawHeight = canvasHeight;

      if (imgAspectRatio > 1) {
        drawHeight = canvasWidth / imgAspectRatio;
      } else {
        drawWidth = canvasHeight * imgAspectRatio;
      }

      context.drawImage(
        image,
        (canvasWidth - drawWidth) / 2,
        (canvasHeight - drawHeight) / 2,
        drawWidth,
        drawHeight,
      );
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
      } else if (currentPair.green.length < maxgreenlines) {
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
      redrawCanvas();
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing && drawMode !== "line") return;

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
    if (drawMode === "line" && isDrawing) {
      if (currentPair.red.length === 0 && currentLine.color === "red") {
        setCurrentPair((prev) => ({
          ...prev,
          red: [...prev.red, currentLine],
        }));
      } else if (
        currentPair.green.length < maxgreenlines &&
        currentLine.color === "green"
      ) {
        setCurrentPair((prev) => ({
          ...prev,
          green: [...prev.green, currentLine],
        }));
      }
      setCurrentLine(null);
    }
    setIsDrawing(false);
    redrawCanvas();
  };

  const handlePolygonSave = () => {
    if (currentPolygon.length > 2) {
      setPolygonCoordinates((prevCoords) => [
        ...prevCoords,
        currentPolygon.map((vertex) => [vertex.x, vertex.y]),
      ]);
      setCurrentPolygon([]);
      setPolygonSaveEnabled(false);
    }
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
    if (drawMode === "line") {
      if (currentPair.red.length > 0) {
        setCurrentPair({ red: [], green: [] });
        return;
      }
      if (linePairs.length > 0) {
        const updatedLinePairs = linePairs.slice(0, -1);
        setLinePairs(updatedLinePairs);
        redrawCanvas();
      }
    } else if (drawMode === "polygon") {
      setCurrentPolygon((prevVertices) => {
        const newVertices = prevVertices.slice(0, -1);
        redrawCanvas();
        return newVertices;
      });
      setPolygonSaveEnabled(currentPolygon.length > 3);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();

    img.onload = () => {
      setImage(img);
      setLinePairs([]);
      setPolygonCoordinates([]);
      setCurrentLine(null);
      setCurrentPolygon([]);
      setCanSavePair(false);
      setPolygonSaveEnabled(false);
      redrawCanvas();
    };

    img.src = URL.createObjectURL(file);
  };

  const redrawCanvas = () => {
    clearCanvas();

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (drawMode === "line") {
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
    } else if (drawMode === "polygon") {
      polygonCoordinates.forEach((polygon) => {
        drawPolygon(
          context,
          polygon.map(([x, y]) => ({ x, y })),
        );
      });
      drawPolygon(context, currentPolygon);
    }
  };

  const drawLine = (context, line, color) => {
    context.beginPath();
    context.moveTo(line.startX, line.startY);
    context.lineTo(line.endX, line.endY);
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.stroke();

    // Draw points at start and end
    drawPoint(context, line.startX, line.startY, color);
    drawPoint(context, line.endX, line.endY, color);
  };

  const drawPolygon = (context, vertices) => {
    if (vertices.length > 0) {
      context.beginPath();
      context.moveTo(vertices[0].x, vertices[0].y);

      vertices.forEach((vertex) => {
        context.lineTo(vertex.x, vertex.y);
      });

      if (vertices.length > 2) {
        context.closePath();
      }
      context.strokeStyle = "blue";
      context.lineWidth = 2;
      context.stroke();

      vertices.forEach((vertex) => {
        drawPoint(context, vertex.x, vertex.y, "blue");
      });
    }
  };

  const drawPoint = (context, x, y, color) => {
    context.beginPath();
    context.arc(x, y, 4, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();
  };

  useEffect(() => {
    redrawCanvas();
    if (currentPair.green.length > 0) setCanSavePair(true);
    else setCanSavePair(false);

    console.log("line cordinates", linePairs, currentPair.green.length);

    console.log("polygon cordinates", polygonCoordinates);
  }, [linePairs, currentPair, image, polygonCoordinates, currentPolygon]);

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
            disabled={
              drawMode === "line"
                ? currentPair.red.length === 0 && linePairs.length === 0
                : currentPolygon.length === 0
            }
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
        </Box>
        <Divider />
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{
            border: "1px solid black",
            cursor: drawMode === "line" ? "crosshair" : "default",
            marginBottom: "8px",
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          {drawMode === "line" && (
            <Button
              onClick={handleOkClick}
              variant="contained"
              disabled={!canSavePair}
              sx={{
                backgroundColor: "green",
                "&:hover": {
                  backgroundColor: "darkgreen",
                },
                color: "white",
              }}
            >
              Save Pair
            </Button>
          )}

          {drawMode === "polygon" && (
            <Button
              variant="contained"
              color="primary"
              onClick={handlePolygonSave}
              disabled={!polygonSaveEnabled}
              sx={{
                backgroundColor: "green",
                "&:hover": {
                  backgroundColor: "darkgreen",
                },
                color: "white",
              }}
            >
              Save Polygon
            </Button>
          )}
          <Button
            onClick={() => {
              if (modelType === "illegalParking") {
                setIllegalParkingCords(
                  drawMode === "line" ? linePairs : polygonCoordinates,
                );
              } else if (modelType === "redLightCrossing") {
                setRedlightCrossingCords(
                  drawMode === "line" ? linePairs : polygonCoordinates,
                );
              } else {
                setWrongWayCords(
                  drawMode === "line" ? linePairs : polygonCoordinates,
                );
              }
              closeModal();
            }}
            variant="contained"
            sx={{
              backgroundColor: "red",
              "&:hover": {
                backgroundColor: "darkred",
              },
              color: "white",
            }}
          >
            SUBMIT
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CanvasDraw;
