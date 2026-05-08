import React, { useState } from "react";
import CheckoutModal from "../components/payment/CheckoutModal"; 
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from '@stripe/react-stripe-js';
const stripePromise = loadStripe("pk_test_51TNxqNJWsILRKYoL52STxCkMGsLWboNqspPIKVrVBxKpcLdIimwC3wcAJQi1LzeU50Z1aPO1lSUUkNKoMVyA6dmD00D2ERn6Bl");


function PaymentPage({ addNotification, setPage }) {
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(false);

    const [loading, setLoading] = useState(false);
//   const handlePay = async () => {
//   setLoading(true);
//   try {
//     const res = await fetch("http://localhost:8000/api/checkout", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Accept": "application/json", 
//       },
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       console.error("Backend Error:", data.error);
//       alert("Error: " + data.error);
//       return;
//     }

//     window.location.href = data.url;
//   } catch (err) {
//     console.error("Network or CORS Error:", err);
//   } finally {
//     setLoading(false);
//   }
// };


  const handleSuccess = () => {
    setShowModal(false); 
    setToast(true);
    addNotification({ 
      id: Date.now(), 
      type: "payment", 
      icon: "🩺", 
      title: "Request Sent to Specialist", 
      message: "Your analysis is now being reviewed. Your personalized routine will be ready within 24 hours.", 
      time: "Just now", 
      read: false 
    });
    setTimeout(() => setToast(false), 4500);
  };

  return (
    <Elements stripe={stripePromise}>
    <>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "4.5rem 2rem 6rem" }}>
        <div style={{ textAlign: "center", maxWidth: "650px", margin: "0 auto 3.5rem" }}>
          <div className="section-eyebrow">Professional Review</div>
          <h2 className="section-title">Get Your Expert-Verified Routine.</h2>
          <p className="section-sub" style={{ margin: "0 auto" }}>
            Take your AI results to the next level. Our specialized doctors will review your analysis and build a precision skincare routine tailored just for you.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="plan-card featured" style={{ maxWidth: "450px", width: "100%", textAlign: "center" }}>
            <div className="plan-badge">Most Trusted</div>
            <div className="plan-name">Specialist Doctor Review</div>
            <div className="plan-price"><sub>$</sub>29</div>
            <div className="plan-period">Per Analysis Review</div>
            <div className="plan-divider" />
            
            <ul className="plan-features" style={{ textAlign: "left" }}>
              <li className="plan-feat"><span className="check">✓</span> 1-on-1 Doctor Verification </li>
              <li className="plan-feat"><span className="check">✓</span> Personalized AM/PM Routine </li>
              <li className="plan-feat"><span className="check">✓</span> Specific Product Recommendations </li>
              <li className="plan-feat"><span className="check">✓</span> Safety Warnings & Ingredient Analysis </li>
              <li className="plan-feat"><span className="check">✓</span> 24h Guaranteed Response Time</li>
            </ul>

            <button
              className="plan-btn plan-btn-gold"
              onClick={() => setShowModal(true)}
            >
              Get My Routine Now
            </button>
            {/* <button className="plan-btn plan-btn-gold" onClick={handlePay}
          disabled={loading} style={{ opacity: loading ? 0.75 : 1 }}>
          {loading ? "Processing payment…" : "Confirm and Pay $29.00"}
        </button> */}
            
            <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "1rem" }}>
              🔒 Secured by Stripe ·
            </p>
          </div>
        </div>

      </div>

      {showModal && <CheckoutModal onClose={() => setShowModal(false)} onSuccess={handleSuccess} />}
      
      {toast && (
        <div className="toast">
          <div className="toast-icon">✓</div>
          Payment confirmed — analysis sent to doctor!
        </div>
      )}
    </>
    </Elements>
  );
}

export default PaymentPage;