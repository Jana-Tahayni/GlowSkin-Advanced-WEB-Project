import React from 'react';
import axios from "axios";
  
export default function NotifPanel({ notifications, onMarkAll,onMarkAsRead, onViewAll }) {
  const unread = notifications.filter(n => !n.read).length;
  return (
    <div className="notif-panel">
      <div className="notif-head">
        <h3>
          Notifications
          {unread > 0 && <span className="notif-count-pill">{unread}</span>}
        </h3>
        {unread > 0 && <button className="notif-mark-btn" onClick={onMarkAll}>Mark all read</button>}
      </div>
      <div className="notif-list">
        {notifications.map(n => (
          <div key={n.id} className={`notif-item ${!n.read ? "unread" : ""}`}
          onClick={() => onMarkAsRead(n.id, n.read)} 
            style={{ cursor: "pointer" }}>
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
      <div className="notif-footer">
        <button onClick={onViewAll}>View all notifications →</button>
      </div>
    </div>
  );
}