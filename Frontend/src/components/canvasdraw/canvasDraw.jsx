import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Paper,
  IconButton,
  Divider,
} from "@mui/material";
import { Undo, FileUpload } from "@mui/icons-material";

const CanvasDraw = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineCoordinates, setLineCoordinates] = useState([[], [], [], []]);
  const [polygonVertices, setPolygonVertices] = useState([]);
  const [drawMode, setDrawMode] = useState("line");
  const [image, setImage] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({
    width: 700,
    height: 400,
  });
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(null);
  const [okEnabled, setOkEnabled] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const lineColors = ["red", "green", "blue", "purple"];

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
        lineColors[linesToDraw.length],
      );
      drawPoint(
        currentLine.endX,
        currentLine.endY,
        lineColors[linesToDraw.length],
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
            [currentLine.startX, currentLine.startY],
            [currentLine.endX, currentLine.endY],
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

      // Highlight all vertices
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
    const canvas = canvasRef.current;

    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const canvasWidth = 800;
      const canvasHeight = canvasWidth / aspectRatio;

      setImageDimensions({ width: canvasWidth, height: canvasHeight });
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      setUploadedImage(img);
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
      console.log("Line Coordinates:", {
        line1: lineCoordinates[0],
        line2: lineCoordinates[1],
        line3: lineCoordinates[2],
        line4: lineCoordinates[3],
      });
    } else if (drawMode === "polygon") {
      console.log(
        "Polygon Coordinates:",
        polygonVertices.map((vertex) => [vertex.x, vertex.y]),
      );
    }
  }, [lineCoordinates, polygonVertices, drawMode]);

  return (
    <Box sx={{ p: 1 }}>
      <Paper elevation={3} sx={{ p: 1, mb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <RadioGroup
            row
            value={drawMode}
            onChange={handleModeChange}
            sx={{ mr: 2 }}
          >
            <FormControlLabel value="line" control={<Radio />} label="Line" />
            <FormControlLabel
              value="polygon"
              control={<Radio />}
              label="Polygon"
            />
          </RadioGroup>
          <Button
            variant="contained"
            component="label"
            startIcon={<FileUpload />}
            sx={{ mr: 2 }}
          >
            Upload Image
            <input type="file" hidden onChange={handleImageUpload} />
          </Button>
          <IconButton onClick={handleUndo} title="Undo">
            <Undo />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ position: "relative" }}>
          <canvas
            ref={canvasRef}
            width={imageDimensions.width}
            height={imageDimensions.height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={handleCanvasClick}
            style={{
              cursor: uploadedImage ? "pointer" : "default",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          {uploadedImage && (
            <Typography
              variant="body2"
              color="error"
              sx={{ position: "absolute", top: 8, left: 8 }}
            >
              Image uploaded. Click on the canvas to display.
            </Typography>
          )}
        </Box>
      </Paper>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button
          variant="contained"
          onClick={handleOkClick}
          disabled={!okEnabled || lines.length >= 4}
        >
          OK
        </Button>
        <Typography variant="body1">
          {drawMode === "line" &&
            `Lines drawn: ${lines.length}${currentLine ? " (1 pending)" : ""}`}
        </Typography>
      </Box>
      <Paper elevation={3} sx={{ p: 1 }}>
        {drawMode === "line" && (
          <Box>
            {lines.map((line, index) => (
              <Typography key={index} variant="body2">
                Line {index + 1}: ({line.startX.toFixed(2)},{" "}
                {line.startY.toFixed(2)}) - ({line.endX.toFixed(2)},{" "}
                {line.endY.toFixed(2)})
              </Typography>
            ))}
            {currentLine && (
              <Typography variant="body2">
                Current Line: ({currentLine.startX.toFixed(2)},{" "}
                {currentLine.startY.toFixed(2)}) - (
                {currentLine.endX.toFixed(2)}, {currentLine.endY.toFixed(2)})
              </Typography>
            )}
          </Box>
        )}
        {drawMode === "polygon" && (
          <Typography variant="body2">
            Polygon Vertices:{" "}
            {polygonVertices
              .map(
                (vertex) => `(${vertex.x.toFixed(2)}, ${vertex.y.toFixed(2)})`,
              )
              .join(", ")}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default CanvasDraw;
