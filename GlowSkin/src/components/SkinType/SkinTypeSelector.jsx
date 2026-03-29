import { useState } from "react";
import { Droplets } from "lucide-react";
import "./SkinTypeSelector.css";

const SKIN_TYPES = [
  { value: "normal", label: "Normal" },
  { value: "dry", label: "Dry" },
  { value: "combination", label: "Combination" },
  { value: "oily", label: "Oily" },
  { value: "sensitive", label: "Sensitive", wide: true },
];

export default function SkinTypeSelector({ onChange }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (value) => {
    setSelected(value);
    onChange?.(value);
  };

  return (
    <div className="skin-type-section">
      <label>
        <Droplets size={16} />
        Select Your Skin Type{" "}
        <span className="skin-type-optional">(Optional)</span>
      </label>

      <div className="skin-type-grid">
        {SKIN_TYPES.map((type) => (
          <button
            key={type.value}
            className={`skin-type-btn ${selected === type.value ? "selected" : ""} ${type.wide ? "col-span-2" : ""}`}
            onClick={() => handleSelect(type.value)}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
}