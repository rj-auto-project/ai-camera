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
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;

    setIsDrawing(true);

    if (drawMode === "line") {
      setLineCoordinates({ startX, startY, endX: startX, endY: startY });
    } else if (drawMode === "polygon") {
      setPolygonVertices([...polygonVertices, { x: startX, y: startY }]);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || drawMode !== "line") return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    setLineCoordinates((prevCoords) => ({
      ...prevCoords,
      endX,
      endY,
    }));

    drawLine(lineCoordinates.startX, lineCoordinates.startY, endX, endY);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);

    if (drawMode === "line") {
      drawLine(
        lineCoordinates.startX,
        lineCoordinates.startY,
        lineCoordinates.endX,
        lineCoordinates.endY
      );
    } else if (drawMode === "polygon") {
      if (polygonVertices.length > 0) {
        drawPolygon(polygonVertices);
      }
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
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    clearCanvas();
    context.beginPath();
    context.moveTo(vertices[0].x, vertices[0].y);

    vertices.forEach((vertex, index) => {
      if (index > 0) {
        context.lineTo(vertex.x, vertex.y);
      }
    });

    context.closePath();
    context.stroke();

    // Highlight all vertices
    vertices.forEach((vertex, index) => {
      drawPoint(vertex.x, vertex.y, "blue");
    });
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
    } else if (newMode === "polygon") {
      setLineCoordinates({ startX: 0, startY: 0, endX: 0, endY: 0 });
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

      // Draw the image onto the canvas immediately after loading
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      setImage(img);
    };

    img.src = URL.createObjectURL(file);
  };

  const handleUndo = () => {
    clearCanvas();
    if (drawMode === "line") {
      setLineCoordinates({ startX: 0, startY: 0, endX: 0, endY: 0 });
    } else if (drawMode === "polygon") {
      setPolygonVertices((prevVertices) => {
        const updatedVertices = prevVertices.slice(0, -1);

        if (updatedVertices.length > 0) {
          drawPolygon(updatedVertices);
        }
        return updatedVertices;
      });
    }
    if (image) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
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
      />
      <p>
        {drawMode === "line" &&
          `Line Coordinates: Start(${lineCoordinates.startX}, ${lineCoordinates.startY}) - End(${lineCoordinates.endX}, ${lineCoordinates.endY})`}
        {drawMode === "polygon" &&
          `Polygon Vertices: ${polygonVertices
            .map((vertex, index) => `(${vertex.x}, ${vertex.y})`)
            .join(", ")}`}
      </p>
    </div>
  );
};

export default CanvasDraw;
