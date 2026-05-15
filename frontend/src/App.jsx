import React, { useState, useEffect } from "react";
import "./styles/global.css";
import { NAV_LINKS } from "./data/data";
import Navbar from "./components/home/Navbar";
import axios from "axios";
import { formatDistanceToNow } from 'date-fns';

import Home from "./pages/HomePage";
import Payment from "./pages/PaymentPage.jsx";
// import { INITIAL_NOTIFICATIONS } from "./data/data";

export default function App() {

  const [page, setPage] = useState("home");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);
  const [notifications, setNotifications] = useState([]);

  const addNotification = (newNotif) => {
    setNotifications(prev => [newNotif, ...prev]);
  };

const fetchNotifications = async () => {
    try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/api/notifications', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const formatted = res.data.map(n => ({
            id: n.id,
            type: n.data.type, // 'payment_success' أو 'routine_ready'
            icon: n.data.type === 'payment_success' ? '◈' : '✦',
            title: n.data.type === 'payment_success' ? 'Payment Confirmed' : 'Routine Ready!',
            message: n.data.message,
            time: formatDistanceToNow(new Date(n.created_at), { addSuffix: true }),
            read: n.read_at !== null
        }));
        setNotifications(formatted);
    } catch (err) {
        console.error("Failed to load notifications", err);
    }
};
const markAllAsRead = async () => {
    try {
        await axios.post('http://localhost:8000/api/notifications/read-all');
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
        console.error(err);
    }
};
const markAsRead = async (id, isRead) => {
  if (isRead) return;
  try {
    await axios.post(`http://localhost:8000/api/notifications/${id}/read`);
    
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  } catch (err) {
    console.error("Error marking notification as read:", err);
  }
};

// useEffect(() => {
//     fetchNotifications();
//   }, []);

  useEffect(() => {
    fetchNotifications(); 

    const interval = setInterval(() => {
        fetchNotifications();
    }, 30000); 

    return () => clearInterval(interval); 
  }, []);

  const [currentAnalysisId, setCurrentAnalysisId] = useState(null);

  //TODO
  const handleAnalysisComplete = (id) => {
    setCurrentAnalysisId(id);
    setPage('payment'); 
  };
  
  return (
    <div className="app-container">
      <Navbar 
        active={page} 
        setPage={setPage} 
        notifications={notifications} 
        setNotifications={setNotifications} 
        onMarkAsRead={markAsRead}
        onMarkAllRead={markAllAsRead}
      />
      
      <main>
        {page === "home" && <Home setPage={setPage} />}

        {/* {page === "payment" && <Payment setPage={setPage} />} */}

          {page === "payment" && (
          <Payment 
            analysisId={currentAnalysisId}
            setPage={setPage} 
            refreshNotifs={fetchNotifications} 
            addNotification={addNotification} 
          />
        )}
        
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