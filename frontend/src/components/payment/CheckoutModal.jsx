
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './CheckoutModal.css'; 

const CheckoutModal = ({ onClose, amount = 29, analysisId }) => {
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
  setError(null);

  const analysis_id = analysisId;
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
          // TODO: Replace with user.email after linking Auth Context
          email: form.email, 
          // email: user.email,
          name: form.name,
          analysis_id: analysis_id,  
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Payment Successful! ✨");
        onClose();
      } else {
        // setError(result.error || "Payment failed on server");
        setError(result.message || result.error || "Payment failed");
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
              //TODO
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
              //TODO
              placeholder="example@gmail.com" 
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