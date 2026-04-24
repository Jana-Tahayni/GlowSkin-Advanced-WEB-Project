import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe("pk_test_51TNxqNJWsILRKYoL52STxCkMGsLWboNqspPIKVrVBxKpcLdIimwC3wcAJQi1LzeU50Z1aPO1lSUUkNKoMVyA6dmD00D2ERn6Bl");


function CheckoutModal({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", card:"", expiry:"", cvv:"" });

 
const handlePay = async () => {
  setLoading(true);
  try {
    const res = await fetch("http://localhost:8000/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json", 
      },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Backend Error:", data.error);
      alert("Error: " + data.error);
      return;
    }

    window.location.href = data.url;
  } catch (err) {
    console.error("Network or CORS Error:", err);
  } finally {
    setLoading(false);
  }
};

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Confirm & Pay</h2>
        <p className="modal-sub">Invest in Your Glow</p>

        <div className="order-summary">
          <div className="order-row">
          <span>Upgrade to Full Access</span>
          <span style={{ color: "var(--honey)", fontWeight: "600" }}>$29.00</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Full name</label>
          <input className="form-input" placeholder="Nour Al-Rashid" value={form.name} onChange={set("name")} />
        </div>
        <div className="form-group">
          <label className="form-label">Email address</label>
          <input className="form-input" type="email" placeholder="nour@example.com" value={form.email} onChange={set("email")} />
        </div>
        <div className="form-group">
          <label className="form-label">Card number</label>
          <input className="form-input" placeholder="4242 4242 4242 4242" value={form.card} onChange={set("card")} />
        </div>
        <div className="form-group">
          <div className="input-row">
            <div>
              <label className="form-label">Expiry</label>
              <input className="form-input" placeholder="MM / YY" value={form.expiry} onChange={set("expiry")} />
            </div>
            <div>
              <label className="form-label">CVV</label>
              <input className="form-input" placeholder="123" value={form.cvv} onChange={set("cvv")} />
            </div>
          </div>
        </div>

        <button className="plan-btn plan-btn-gold" onClick={handlePay}
          disabled={loading} style={{ opacity: loading ? 0.75 : 1 }}>
          {loading ? "Processing payment…" : "Confirm and Pay $29.00"}
        </button>
        <div className="pay-secure">🔒 Secured by Stripe · 256-bit SSL encryption</div>
      </div>
    </div>
  );
}
export default CheckoutModal;