import React, { useState } from "react";

export default function PaymentForm({ large }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Payment submitted! (Mock implementation)");
    // هنا لاحقاً توصل للـ API أو Stripe
  };

  const inputStyle = {
    width: "100%",
    padding: "0.7rem 1rem",
    marginBottom: "1rem",
    borderRadius: "12px",
    border: "1px solid var(--mid)",
    fontSize: "1rem",
    boxSizing: "border-box",
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ color: "var(--darkest)", marginBottom: "1.5rem" }}>
        Payment Info
      </h2>

      <label>Full Name</label>
      <input
        type="text"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        placeholder="John Doe"
        style={inputStyle}
        required
      />

      <label>Email</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="john@example.com"
        style={inputStyle}
        required
      />

      <label>Card Number</label>
      <input
        type="text"
        name="cardNumber"
        value={formData.cardNumber}
        onChange={handleChange}
        placeholder="1234 5678 9012 3456"
        maxLength="19"
        style={inputStyle}
        required
      />

      <div style={{ display: "flex", gap: "1rem" }}>
        <div style={{ flex: 1 }}>
          <label>Expiry</label>
          <input
            type="text"
            name="expiry"
            value={formData.expiry}
            onChange={handleChange}
            placeholder="MM/YY"
            maxLength="5"
            style={inputStyle}
            required
          />
        </div>

        <div style={{ flex: 1 }}>
          <label>CVV</label>
          <input
            type="text"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            placeholder="123"
            maxLength="4"
            style={inputStyle}
            required
          />
        </div>
      </div>

      <button
        type="submit"
        style={{
          marginTop: "1.5rem",
          width: "100%",
          padding: "0.8rem",
          borderRadius: "14px",
          border: "none",
          backgroundColor: "var(--pop)",
          color: "white",
          fontWeight: "700",
          fontSize: "1.1rem",
          cursor: "pointer",
          transition: "0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--pop-light)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--pop)")}
      >
        Pay Now
      </button>
    </form>
  );
}