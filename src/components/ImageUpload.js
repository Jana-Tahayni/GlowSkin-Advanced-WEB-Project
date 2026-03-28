// src/components/ImageUpload.js
import { useState, useRef } from "react";
 
const ImageUpload = ({ preview, onFile }) => {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef();
 
  const handleFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    onFile(url);
  };
 
  return (
    <div
      className={`upload-zone ${drag ? "drag-over" : ""}`}
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        handleFile(e.dataTransfer.files[0]);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFile(e.target.files[0])}
      />
 
      {preview ? (
        <img src={preview} alt="Ingredient label" className="upload-preview" />
      ) : (
        <>
          <div className="upload-icon">🌿</div>
          <div className="upload-text">
            <strong style={{ color: "var(--dark)" }}>Upload ingredient label</strong>
            <br />
            Drag & drop or click to browse
            <br />
            <span style={{ fontSize: ".75rem" }}>JPG, PNG up to 10MB</span>
          </div>
        </>
      )}
    </div>
  );
};
 
export default ImageUpload;