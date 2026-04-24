import React from "react";

export default function AllNotificationsModal({ notifications, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        
        <div className="modal-header">
          <h2>All Notifications</h2>
          <button onClick={onClose}>✖</button>
        </div>

        <div className="modal-list">
          {notifications.map(n => (
            <div key={n.id} className={`notif-item ${!n.read ? "unread" : ""}`}>
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