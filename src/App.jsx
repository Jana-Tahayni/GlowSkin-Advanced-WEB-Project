import React, { useState, useEffect } from "react";
import "./styles/global.css";
import { NAV_LINKS } from "./data/data";
import Navbar from "./components/home/Navbar";

import Home from "./pages/HomePage";
import Payment from "./pages/PaymentPage.jsx";

export default function App() {
  const [page, setPage] = useState("home");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);
  const [notifications, setNotifications] = useState(NAV_LINKS);

  return (
    <div className="app-container">
      <Navbar 
        active={page} 
        setPage={setPage} 
        notifications={notifications} 
        setNotifications={setNotifications} 
      />
      
      <main>
        {page === "home" && <Home setPage={setPage} />}

        {page === "payment" && <Payment setPage={setPage} />}
        
        {page !== "home" && page !== "payment" && (
          <div className="coming-soon" style={{padding: '100px', textAlign: 'center'}}>
            <div className="coming-soon-icon">✨</div>
            <h2>{page.toUpperCase()} Page</h2>
            <p>This section is under development.</p>
            <button className="btn btn-primary" onClick={() => setPage('home')} style={{marginTop: '20px'}}>
              Back to Home
            </button>
          </div>
        )}
      </main>
    </div>
  );
}