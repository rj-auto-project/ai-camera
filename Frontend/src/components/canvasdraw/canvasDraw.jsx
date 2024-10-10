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

const CanvasDraw = ({ modelType, closeModal, setImageCordinates }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineCoordinates, setLineCoordinates] = useState([[], [], [], []]);
  const [polygonVertices, setPolygonVertices] = useState([]);
  const [drawMode, setDrawMode] = useState(
    modelType === "illegalParking" ? "line" : "polygon"
  );
  const [image, setImage] = useState(null);
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(null);
  const [okEnabled, setOkEnabled] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const lineColors = ["red", "green", "blue", "purple"];

  const canvasWidth = 640;
  const canvasHeight = 480;

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
        drawHeight
      );
    }
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (drawMode === "line" && lines.length < 4) {
      setIsDrawing(true);
      setCurrentLine({ startX: x, startY: y, endX: x, endY: y });
    } else if (drawMode === "polygon") {
      setPolygonVertices((prevVertices) => {
        const newVertices = [...prevVertices, { x, y }];
        redrawCanvas(newVertices);
        return newVertices;
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || drawMode !== "line") return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    setCurrentLine((prevLine) => ({
      ...prevLine,
      endX,
      endY,
    }));

    drawLines();
  };

  const handleMouseUp = () => {
    if (drawMode === "line" && isDrawing) {
      setOkEnabled(true);
    }
    setIsDrawing(false);
  };

  const drawLines = (linesToDraw = lines) => {
    clearCanvas();
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    linesToDraw.forEach((line, index) => {
      context.beginPath();
      context.moveTo(line.startX, line.startY);
      context.lineTo(line.endX, line.endY);
      context.strokeStyle = lineColors[index];
      context.stroke();
      drawPoint(line.startX, line.startY, lineColors[index]);
      drawPoint(line.endX, line.endY, lineColors[index]);
    });

    if (currentLine) {
      context.beginPath();
      context.moveTo(currentLine.startX, currentLine.startY);
      context.lineTo(currentLine.endX, currentLine.endY);
      context.strokeStyle = lineColors[linesToDraw.length];
      context.stroke();
      drawPoint(
        currentLine.startX,
        currentLine.startY,
        lineColors[linesToDraw.length]
      );
      drawPoint(
        currentLine.endX,
        currentLine.endY,
        lineColors[linesToDraw.length]
      );
    }
  };

  const handleOkClick = () => {
    if (currentLine) {
      setLines((prevLines) => {
        const newLines = [...prevLines, currentLine];

        setLineCoordinates((prevCoords) => {
          const newCoords = [...prevCoords];
          newCoords[newLines.length - 1] = [
            { x: currentLine.startX, y: currentLine.startY },
            { x: currentLine.endX, y: currentLine.endY },
          ];
          return newCoords;
        });

        return newLines;
      });

      setCurrentLine(null);
      setOkEnabled(false);
    }
  };

  const handleUndo = () => {
    if (drawMode === "line") {
      setLines((prevLines) => {
        const newLines = prevLines.slice(0, -1);
        drawLines(newLines);
        return newLines;
      });
      setCurrentLine(null);
      setOkEnabled(false);
    } else if (drawMode === "polygon") {
      setPolygonVertices((prevVertices) => {
        const newVertices = prevVertices.slice(0, -1);
        redrawCanvas(newVertices);
        return newVertices;
      });
    }
  };

  const redrawCanvas = (vertices = polygonVertices) => {
    clearCanvas();
    if (image) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
    if (drawMode === "line") {
      drawLines();
    } else if (drawMode === "polygon") {
      drawPolygon(vertices);
    }
  };

  const drawPolygon = (vertices) => {
    clearCanvas();
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

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
      context.stroke();

      vertices.forEach((vertex) => {
        drawPoint(vertex.x, vertex.y, "blue");
      });
    }
  };

  const drawPoint = (x, y, color) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.beginPath();
    context.arc(x, y, 5, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();
  };

  const handleModeChange = (e) => {
    const newMode = e.target.value;
    setDrawMode(newMode);
    clearCanvas();
    if (newMode === "line") {
      setPolygonVertices([]);
      setLines([]);
      setCurrentLine(null);
      setOkEnabled(false);
    } else if (newMode === "polygon") {
      setLines([]);
      setCurrentLine(null);
      setPolygonVertices([]);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();

    img.onload = () => {
      setImage(img);
      setLines([]);
      setPolygonVertices([]);
      setCurrentLine(null);
      setOkEnabled(false);
      clearCanvas();
    };

    img.src = URL.createObjectURL(file);
  };

  const handleCanvasClick = () => {
    if (uploadedImage) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);
      setImage(uploadedImage);
      setUploadedImage(null);
    }
  };

  useEffect(() => {
    if (drawMode === "line") {
      console.log("Line Coordinates:", lineCoordinates);
    } else if (drawMode === "polygon") {
      console.log(
        "Polygon Coordinates:",
        polygonVertices.map((vertex) => [vertex.x, vertex.y])
      );
    }
  }, [lineCoordinates, polygonVertices, drawMode]);

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
                ? lines.length === 0
                : polygonVertices.length === 0
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
          onClick={handleCanvasClick}
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
              disabled={!okEnabled}
              sx={{
                backgroundColor: "green",
                "&:hover": {
                  backgroundColor: "darkgreen",
                },
                color: "white",
              }}
            >
              SAVE
            </Button>
          )}
          <Button
            onClick={() => {
              setImageCordinates(
                drawMode === "line" ? lineCoordinates : polygonVertices
              );
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
