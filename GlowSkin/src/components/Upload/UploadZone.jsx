import { useRef, useState, useCallback } from "react";
import { UploadCloud, Image, X, Camera } from "lucide-react";
import "./UploadZone.css";

export default function UploadZone({ onImageChange, onCameraOpen }) {
  const fileInputRef = useRef(null);
  const [hasImage, setHasImage] = useState(false);
  const [previewSrc, setPreviewSrc] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file) => {
      if (!file || !file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewSrc(e.target.result);
        setHasImage(true);
        onImageChange(e.target.result);
      };
      reader.readAsDataURL(file);
    },
    [onImageChange]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreviewSrc("");
    setHasImage(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onImageChange(null);
  };

  return (
    <div>
      <label className="upload-label">
        <Image className="upload-label-icon" size={16} />
        Upload Your Skin Photo
      </label>

      <div
        className={`upload-zone ${hasImage ? "has-image" : ""} ${isDragging ? "drag-over" : ""}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {!hasImage ? (
          <div className="upload-placeholder">
            <div className="upload-icon-wrapper">
              <UploadCloud className="upload-icon" />
            </div>
            <div>
              <p className="upload-title">Drag &amp; drop your photo here</p>
              <p className="upload-subtitle">or click to browse files</p>
            </div>
            <p className="upload-meta">Supports: JPG, PNG, WebP • Max 10MB</p>
          </div>
        ) : (
          <div>
            <img src={previewSrc} alt="Uploaded skin photo" className="preview-img" />
            <button className="remove-btn" onClick={handleRemove}>
              <X size={16} />
              Remove photo
            </button>
          </div>
        )}
      </div>

      <button className="camera-btn" onClick={(e) => { e.stopPropagation(); onCameraOpen(); }}>
        <div className="camera-btn-icon-wrap">
          <Camera className="camera-btn-icon" />
        </div>
        <span className="camera-btn-text">Take a Photo with Camera</span>
      </button>
    </div>
  );
}