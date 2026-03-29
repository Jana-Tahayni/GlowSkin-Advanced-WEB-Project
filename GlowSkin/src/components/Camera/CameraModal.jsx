import { useRef, useEffect, useState } from "react";
import { X, Camera } from "lucide-react";
import "./CameraModal.css";

export default function CameraModal({ isOpen, onClose, onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/jpeg");
    onCapture(imageData);
    onClose();
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="camera-overlay" onClick={handleClose}>
      <div className="camera-modal" onClick={(e) => e.stopPropagation()}>
        <div className="camera-modal-header">
          <h3 className="camera-modal-title">Take a Photo</h3>
          <button className="camera-close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="camera-feed-wrapper">
          <video ref={videoRef} autoPlay playsInline className="camera-video" />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>

        <button className="camera-capture-btn" onClick={handleCapture}>
          <Camera size={20} />
          Capture Photo
        </button>
      </div>
    </div>
  );
}