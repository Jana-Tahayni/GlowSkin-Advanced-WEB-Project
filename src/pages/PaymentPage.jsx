
import React, { useState } from "react";
import { PLANS } from "../data/consts";
import CheckoutModal from "../components/home/CheckoutModal"; 

function PaymentPage({ addNotification , setPage } ) {
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(false);

  const handleSuccess = () => {
    setShowModal(false); setToast(true);
    addNotification({ id: Date.now(), type:"payment", icon:"◈", title:"Payment Successful", message:"Your doctor review is confirmed. You'll receive your routine within 24 hours.", time:"Just now", read:false });
    setTimeout(() => setToast(false), 4500);
  };

  return (
    <>
      <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"4.5rem 2rem 6rem" }}>
        <div style={{ textAlign:"center", maxWidth:"580px", margin:"0 auto 3.5rem" }}>
          <div className="section-eyebrow">Plans & Pricing</div>
          <h2 className="section-title">Invest in your skin’s future.</h2>
          <p className="section-sub" style={{ margin:"0 auto" }}>
            Start with our free AI tools or upgrade to a premium plan for professional dermatologist guidance and a personalized care routine.
            </p>
        </div>

        <div className="plans-grid">
          {PLANS.map(plan => (
            <div key={plan.id} className={`plan-card ${plan.accent ? "featured" : ""}`}>
              {plan.badge && <div className="plan-badge">{plan.badge}</div>}
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price"><sub>$</sub>{plan.price}</div>
              <div className="plan-period">{plan.period}</div>
              <div className="plan-divider" />
              <ul className="plan-features">
                {plan.features.map(f => (
                  <li key={f} className="plan-feat"><span className="check">✓</span>{f}</li>
                ))}
                {plan.missing.map(f => (
                  <li key={f} className="plan-feat missing"><span className="cross">✗</span>{f}</li>
                ))}
              </ul>
              <button
                className={`plan-btn ${plan.accent ? "plan-btn-gold" : "plan-btn-outline"}`}
                onClick={() => {
    if (plan.accent) {
      setShowModal(true);
    } else {
      setPage('home');
    }
  }}
  >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* What's included detail */}
        <div style={{ marginTop:"4rem", background:"var(--ivory)", borderRadius:"22px", padding:"2.5rem", border:"1px solid var(--border)" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"3rem", alignItems:"center" }}>
            <div>
              <div className="section-eyebrow">What you get</div>
              <h3 className="section-title" style={{ fontSize:"1.75rem" }}>Elevate your skincare with Premium.</h3>
              <p className="section-sub">Unlock full access to expert guidance. Our Premium Plan is designed to provide a continuous, science-backed journey to your healthiest skin yet.</p>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.875rem" }}>
              {[
                { icon:"◉", label:"Licensed Doctor Review",     desc:"Expert verification of your results." },
                { icon:"✦", label:"AM + PM Routine",          desc:"Personalized daily steps." },
                { icon:"◈", label:"Tailored Recommendations",        desc:"Products specifically chosen for your unique skin profile" },
                { icon:"⬡", label:"Follow-up Appointment",   desc:"Scheduled check-ins to monitor your progress" },
                { icon:"◎", label:"Priority Expert Support",             desc:"Direct access to our specialists" },
              ].map(i => (
                <div key={i.label} style={{ display:"flex", gap:"0.875rem", alignItems:"flex-start" }}>
                  <div style={{ width:"34px", height:"34px", borderRadius:"9px", background:"rgba(180,124,60,0.1)", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--honey)", fontSize:"0.85rem", flexShrink:0 }}>{i.icon}</div>
                  <div>
                    <div style={{ fontSize:"0.875rem", fontWeight:500, color:"var(--coffee)" }}>{i.label}</div>
                    <div style={{ fontSize:"0.78rem", color:"var(--muted)" }}>{i.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

       
      </div>

      {showModal && <CheckoutModal onClose={() => setShowModal(false)} onSuccess={handleSuccess} />}
      {toast && (
        <div className="toast">
          <div className="toast-icon">✓</div>
          Payment confirmed — doctor assigned!
        </div>
      )}
    </>
  );
}

export default PaymentPage;