// import { useState } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import './CheckoutModal.css';
// const stripePromise = loadStripe("pk_test_51TNxqNJWsILRKYoL52STxCkMGsLWboNqspPIKVrVBxKpcLdIimwC3wcAJQi1LzeU50Z1aPO1lSUUkNKoMVyA6dmD00D2ERn6Bl");



// function CheckoutModal({ onClose, onSuccess }) {
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState({ name:"", email:"", card:"", expiry:"", cvv:"" });

 
// const handlePay = async () => {
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

//   const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

//   return (
//     <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
//       <div className="modal">
//         <button className="modal-close" onClick={onClose}>✕</button>
//         <h2>Confirm & Pay</h2>
//         <p className="modal-sub">Invest in Your Glow</p>

//         <div className="order-summary">
//           <div className="order-row">
//           <span>Upgrade to Full Access</span>
//           <span style={{ color: "var(--honey)", fontWeight: "600" }}>$29.00</span>
//           </div>
//         </div>

//         <div className="form-group">
//           <label className="form-label">Full name</label>
//           <input className="form-input" placeholder="Nour Al-Rashid" value={form.name} onChange={set("name")} />
//         </div>
//         <div className="form-group">
//           <label className="form-label">Email address</label>
//           <input className="form-input" type="email" placeholder="nour@example.com" value={form.email} onChange={set("email")} />
//         </div>
//         <div className="form-group">
//           <label className="form-label">Card number</label>
//           <input className="form-input" placeholder="4242 4242 4242 4242" value={form.card} onChange={set("card")} />
//         </div>
//         <div className="form-group">
//           <div className="input-row">
//             <div>
//               <label className="form-label">Expiry</label>
//               <input className="form-input" placeholder="MM / YY" value={form.expiry} onChange={set("expiry")} />
//             </div>
//             <div>
//               <label className="form-label">CVV</label>
//               <input className="form-input" placeholder="123" value={form.cvv} onChange={set("cvv")} />
//             </div>
//           </div>
//         </div>

//         <button className="plan-btn plan-btn-gold" onClick={handlePay}
//           disabled={loading} style={{ opacity: loading ? 0.75 : 1 }}>
//           {loading ? "Processing payment…" : "Confirm and Pay $29.00"}
//         </button>
//         <div className="pay-secure">🔒 Secured by Stripe · 256-bit SSL encryption</div>
//       </div>
//     </div>
//   );
// }
// export default CheckoutModal;


import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './CheckoutModal.css'; // تأكدي من إنشاء هذا الملف

const CheckoutModal = ({ onClose, amount = 29 }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const cardStyle = {
    style: {
      base: {
        color: "#4b3832", // Coffee Color
        fontFamily: '"Outfit", sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };

  const handlePay = async (event) => {
  event.preventDefault();
  setLoading(true);

  if (!stripe || !elements) return;

  const cardElement = elements.getElement(CardElement);

  const { error, paymentMethod } = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
  });

  if (error) {
    setError(error.message);
    setLoading(false);
  } else {
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          payment_method_id: paymentMethod.id,
          email: form.email, 
          name: form.name   
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Payment Successful! ✨");
        onClose();
      } else {
        setError(result.error || "Payment failed on server");
      }
    } catch (err) {
      setError("Server connection error. Check if Laravel is running!");
    }
    setLoading(false);
  }
};

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        
        <div className="modal-header">
          <h2>Confirm & Pay</h2>
          <p className="modal-sub">Invest in Your Glow</p>
        </div>

        <div className="order-box">
          <div className="order-row">
            <span>Expert Doctor Review & Routine</span>
            <span className="order-price">${amount}.00</span>
          </div>
        </div>

        <form onSubmit={handlePay}>
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input 
              className="form-input" 
              name="name"
              placeholder="Lujain Rashid" 
              value={form.name} 
              onChange={handleInputChange} 
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email address</label>
            <input 
              className="form-input" 
              name="email"
              type="email" 
              placeholder="lujain@example.com" 
              value={form.email} 
              onChange={handleInputChange} 
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Card Details</label>
            <div className="stripe-input-wrapper">
              <CardElement options={cardStyle} />
            </div>
          </div>

          {error && <div className="payment-error">{error}</div>}

          <button 
            type="submit"
            className="pay-submit-btn" 
            disabled={!stripe || loading}
          >
            {loading ? "Processing..." : `Confirm and Pay $${amount}.00`}
          </button>
        </form>

        <div className="pay-footer">
          🔒 Secured by Stripe · Encrypted & PCI-Compliant
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;