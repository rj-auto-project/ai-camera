import React, { useRef, useState } from "react";

const CanvasDraw = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineCoordinates, setLineCoordinates] = useState({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  });
  const [polygonVertices, setPolygonVertices] = useState([]);
  const [drawMode, setDrawMode] = useState("line");
  const [image, setImage] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({
    width: 800,
    height: 500,
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
      setPolygonVertices(prevVertices => {
        const newVertices = [...prevVertices, { x, y }];
        drawPolygon(newVertices);
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
      drawPoint(currentLine.endX, currentLine.endY, lineColors[linesToDraw.length]);
    }
  };

  const handleOkClick = () => {
    if (currentLine) {
      setLines([...lines, currentLine]);
      setCurrentLine(null);
      setOkEnabled(false);
    }
  };

  const handleUndo = () => {
    if (drawMode === "line") {
      setLines(prevLines => {
        const newLines = prevLines.slice(0, -1);
        drawLines(newLines);
        return newLines;
      });
      setCurrentLine(null);
      setOkEnabled(false);
    } else if (drawMode === "polygon") {
      setPolygonVertices(prevVertices => {
        const newVertices = prevVertices.slice(0, -1);
        drawPolygon(newVertices);
        return newVertices;
      });
    }
  };

  const redrawCanvas = () => {
    clearCanvas();
    if (image) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
    if (drawMode === "line") {
      drawLines();
    } else if (drawMode === "polygon") {
      drawPolygon(polygonVertices);
    }
  };

  const drawLine = (startX, startY, endX, endY) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    clearCanvas();
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();

    // Highlight the start point
    drawPoint(startX, startY, "blue");
    drawPoint(endX, endY, "blue");
  };

  const drawPolygon = (vertices) => {
    clearCanvas();
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (vertices.length > 0) {
      context.beginPath();
      context.moveTo(vertices[0].x, vertices[0].y);

      vertices.forEach((vertex, index) => {
        if (index > 0) {
          context.lineTo(vertex.x, vertex.y);
        }
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
    const context = canvas.getContext("2d");

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

  return (
    <div>
      <div>
        <label>
          <input
            type="radio"
            value="line"
            checked={drawMode === "line"}
            onChange={handleModeChange}
          />
          Line
        </label>
        <label>
          <input
            type="radio"
            value="polygon"
            checked={drawMode === "polygon"}
            onChange={handleModeChange}
          />
          Polygon
        </label>
        <input type="file" onChange={handleImageUpload} />
        <button
          title="undo"
          style={{
            border: "1px solid white",
            paddingLeft: 10,
            paddingRight: 10,
          }}
          onClick={handleUndo}
        >
          <i class="fas fa-undo"></i> Undo
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={imageDimensions.width}
        height={imageDimensions.height}
        style={{ border: "1px solid black" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleCanvasClick}
        style={{ cursor: uploadedImage ? "pointer" : "default" }}
      />
      {uploadedImage && (
        <p style={{ color: "red" }}>
          Image uploaded. Click on the canvas to display.
        </p>
      )}
      <button
        onClick={handleOkClick}
        disabled={!okEnabled || lines.length >= 4}
        style={{
          marginLeft: "10px",
          padding: "5px 10px",
          backgroundColor: okEnabled && lines.length < 4 ? "#4CAF50" : "#ddd",
          color: okEnabled && lines.length < 4 ? "white" : "gray",
          border: "none",
          borderRadius: "4px",
          cursor: okEnabled && lines.length < 4 ? "pointer" : "not-allowed",
        }}
      >
        OK
      </button>
      <div>
        <p>
          {drawMode === "line" &&
            `Lines drawn: ${lines.length}${currentLine ? " (1 pending)" : ""}`}
        </p>
        {drawMode === "line" && (
          <div>
            {lines.map((line, index) => (
              <p key={index}>
                Line {index + 1}: ({line.startX.toFixed(2)},{" "}
                {line.startY.toFixed(2)}) - ({line.endX.toFixed(2)},{" "}
                {line.endY.toFixed(2)})
              </p>
            ))}
            {currentLine && (
              <p>
                Current Line: ({currentLine.startX.toFixed(2)},{" "}
                {currentLine.startY.toFixed(2)}) - (
                {currentLine.endX.toFixed(2)}, {currentLine.endY.toFixed(2)})
              </p>
            )}
          </div>
        )}
        {drawMode === "polygon" && (
          <p>
            Polygon Vertices:{" "}
            {polygonVertices
              .map(
                (vertex, index) =>
                  `(${vertex.x.toFixed(2)}, ${vertex.y.toFixed(2)})`
              )
              .join(", ")}
          </p>
        )}
      </div>
    </div>
  );
};

export default CanvasDraw;
