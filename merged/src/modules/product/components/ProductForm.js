// src/components/ProductForm.js
import { useState } from "react";
import ImageUpload from "./ImageUpload";
import "../Product.css"

const ProductForm = ({ onAnalyze, loading }) => {
  const [productName, setProductName] = useState("");
  const [skinType,    setSkinType]    = useState("");
  const [imgPreview,  setImgPreview]  = useState(null);
  const [imgFile,     setImgFile]     = useState(null); 

  const canSubmit = (productName.trim() || imgFile)  && !loading;

  const handleRemoveImage = () => {
    setImgPreview(null);
    setImgFile(null);  
  };

  return (
    <div className="card fade-up">
      <p className="section-label">Step 1</p>
      <h2 className="section-title" style={{ fontSize: "1.5rem", marginBottom: "1.4rem" }}>
        Tell us about your product
      </h2>

      {/* Product name */}
      <div style={{ marginBottom: "1rem" }}>
        <label
          style={{
            fontSize: ".82rem", fontWeight: 500, color: "var(--dark)",
            display: "block", marginBottom: ".4rem", letterSpacing: ".04em",
          }}
        >
          Product Name
        </label>
        <input
          className="input-field"
          type="text"
          placeholder="e.g. CeraVe Moisturizing Cream"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </div>

      <div className="or-divider">or upload ingredient label</div>

      <div style={{ marginBottom: "1.4rem" }}>
        <ImageUpload
          preview={imgPreview}
          onFile={(url, file) => {    
            setImgPreview(url);
            setImgFile(file);
          }}
        />
        {imgPreview && (
          <button
            className="btn-secondary"
            style={{ marginTop: ".6rem" }}
            onClick={handleRemoveImage}
          >
            Remove image
          </button>
        )}
      </div>

      <div style={{ marginBottom: "1.6rem" }}>
        <label
          style={{
            fontSize: ".82rem", fontWeight: 500, color: "var(--dark)",
            display: "block", marginBottom: ".4rem", letterSpacing: ".04em",
          }}
        >
          Your Skin Type
        </label>
        <select
          className="input-field"
          value={skinType}
          onChange={(e) => setSkinType(e.target.value)}
        >
          <option value="">Select skin type…</option>
          <option value="dry">Dry</option>
          <option value="oily">Oily</option>
          <option value="combination">Combination</option>
          <option value="sensitive">Sensitive</option>
          <option value="normal">Normal</option>
        </select>
      </div>

      <button
        className="btn-primary"
        disabled={!canSubmit}
        onClick={() => onAnalyze({ productName, skinType, imgPreview, imgFile })}  
      >
        {loading ? (
          <><span className="spinner" /> Analyzing with AI…</>
        ) : (
          "✦ Analyze Product"
        )}
      </button>
    </div>
  );
};

export default ProductForm;