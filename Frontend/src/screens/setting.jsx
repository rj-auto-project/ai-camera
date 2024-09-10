import React, { useRef, useState } from "react";

const Setting = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineCoordinates, setLineCoordinates] = useState({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  });

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;

    setIsDrawing(true);
    setLineCoordinates({ ...lineCoordinates, startX, startY });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

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
  };

  const drawLine = (startX, startY, endX, endY) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        style={{ border: "1px solid black" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <p>
        Line Coordinates: Start({lineCoordinates.startX}, {lineCoordinates.startY}) - 
        End({lineCoordinates.endX}, {lineCoordinates.endY})
      </p>
    </div>
  );
};

export default Setting;
