import React, { useState, useRef } from "react";
import CanvasDraw from "react-canvas-draw";
import { saveAs } from "file-saver";

const AnnotationTool = () => {
  const [image, setImage] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [annotationType, setAnnotationType] = useState("bounding_box");
  const canvasRef = useRef(null);
  const [startPoint, setStartPoint] = useState(null); // To track line/box start point

  // Function to handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Handle mouse down to start drawing
  const handleMouseDown = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartPoint({ x, y });
  };

  // Handle mouse up to complete drawing
  const handleMouseUp = (e) => {
    if (!startPoint) return;
    const rect = e.target.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    const ctx = canvasRef.current.ctx.drawing;

    if (annotationType === "bounding_box") {
      const width = endX - startPoint.x;
      const height = endY - startPoint.y;
      ctx.beginPath();
      ctx.rect(startPoint.x, startPoint.y, width, height);
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.stroke();

      setAnnotations((prev) => [
        ...prev,
        {
          type: "bounding_box",
          x: startPoint.x,
          y: startPoint.y,
          width: width,
          height: height,
        },
      ]);
    } else if (annotationType === "line") {
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2;
      ctx.stroke();

      setAnnotations((prev) => [
        ...prev,
        {
          type: "line",
          startX: startPoint.x,
          startY: startPoint.y,
          endX,
          endY,
        },
      ]);
    }

    setStartPoint(null); // Reset start point
  };

  // Function to export annotations
  const handleExportAnnotations = () => {
    const annotationData = annotations
      .map((ann) => {
        if (ann.type === "bounding_box") {
          return `Bounding Box: x=${ann.x}, y=${ann.y}, width=${ann.width}, height=${ann.height}`;
        } else if (ann.type === "line") {
          return `Line: startX=${ann.startX}, startY=${ann.startY}, endX=${ann.endX}, endY=${ann.endY}`;
        }
        return "";
      })
      .join("\n");

    const blob = new Blob([annotationData], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, "annotations.txt");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Image Annotation Tool</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      <div>
        <label>
          <input
            type="radio"
            value="bounding_box"
            checked={annotationType === "bounding_box"}
            onChange={() => setAnnotationType("bounding_box")}
          />
          Bounding Box
        </label>
        <label>
          <input
            type="radio"
            value="line"
            checked={annotationType === "line"}
            onChange={() => setAnnotationType("line")}
          />
          Line
        </label>
      </div>

      {image && (
        <div style={{ position: "relative", margin: "20px auto" }}>
          <img
            src={image}
            alt="Uploaded"
            style={{ width: "500px" }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          />
          <CanvasDraw
            ref={canvasRef}
            canvasWidth={500}
            canvasHeight={400}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              border: "1px solid black",
            }}
          />
        </div>
      )}

      <button onClick={handleExportAnnotations}>Export Annotations</button>

      <div>
        <h3>Annotations</h3>
        <pre>{JSON.stringify(annotations, null, 2)}</pre>
      </div>
    </div>
  );
};

export default AnnotationTool;
