import React from "react";
import axios from "axios";

export default function AllNotificationsModal({ notifications, setNotifications, onClose }) { 

  const markAsRead = async (id, isRead) => {
    if (isRead) return; 

    try {
        const token = localStorage.getItem('token');
        await axios.post(`http://localhost:8000/api/notifications/${id}/read`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
        console.error("Couldn't mark as read", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h2>All Notifications</h2>
          <button onClick={onClose}>✖</button>
        </div>

        <div className="modal-list">
          {notifications.map(n => (
            <div 
              key={n.id} 
              className={`notif-item ${!n.read ? "unread" : ""}`}
              onClick={() => markAsRead(n.id, n.read)} 
              style={{ cursor: n.read ? "default" : "pointer" }}
            >
              <div className={`notif-icon ni-${n.type}`}>{n.icon}</div>

              <div className="notif-content">
                <div className="notif-title">{n.title}</div>
                <div className="notif-msg">{n.message}</div>
                <div className="notif-time">{n.time}</div>
              </div>

              {!n.read && <div className="notif-dot" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}