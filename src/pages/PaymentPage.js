import React, { useState } from "react";
import PaymentForm from "../components/payment/PaymentForm";

function PaymentPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div
      style={{
        backgroundColor: "var(--cream)",
        minHeight: "100vh",
        padding: "4rem 2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "2rem",
      }}
    >
      {/* Left Column — Subscription Info */}
      <div
        style={{
          flex: 1,
          maxWidth: "500px",
          backgroundColor: "white",
          padding: "3rem",
          borderRadius: "var(--radius)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <h1 style={{ color: "var(--darkest)", fontSize: "2rem", marginBottom: "1rem" }}>
          Go Premium 💎
        </h1>
        <p style={{ color: "var(--dark)", fontSize: "1.1rem", marginBottom: "2rem" }}>
          Unlock advanced features, unlimited product analysis, and consultations with a certified dermatologist.
        </p>

        <ul style={{ color: "var(--dark)", fontSize: "1rem", marginBottom: "2rem", lineHeight: "1.8" }}>
          <li>✔ Unlimited product analysis</li>
          <li>✔ AI-powered recommendations</li>
          <li>✔ Save and manage history</li>
          <li>✔ Consult with a certified dermatologist 👩‍⚕️</li>
        </ul>

        <button
          onClick={() => setShowForm(true)}
          style={{
            backgroundColor: "var(--pop)",
            color: "white",
            border: "none",
            borderRadius: "14px",
            padding: "0.8rem 2rem",
            fontSize: "1.1rem",
            fontWeight: "700",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--pop-light)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--pop)")}
        >
          Subscribe Now
        </button>
      </div>

      {/* Right Column — Payment Form */}
      {showForm && (
        <div
          style={{
            flex: 1,
            maxWidth: "450px",
            backgroundColor: "var(--light)",
            padding: "3rem",
            borderRadius: "var(--radius)",
            boxShadow: "var(--shadow-lg)",
            position: "relative",
            transition: "all 0.4s ease",
          }}
        >
          {/* زر X لإغلاق الفورم */}
          <button
            onClick={() => setShowForm(false)}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "transparent",
              border: "none",
              fontSize: "1.5rem",
              fontWeight: "bold",
              cursor: "pointer",
              color: "var(--darkest)",
            }}
          >
            ×
          </button>

          <PaymentForm large />
        </div>
      )}
    </div>
  );
}

export default PaymentPage;