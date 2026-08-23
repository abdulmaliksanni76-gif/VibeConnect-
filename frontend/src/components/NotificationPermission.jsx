import React, { useState } from "react";
import {
  Bell,
  BellRing,
  X,
  Check,
  MessageCircle,
  Wifi
} from "lucide-react";

import "./NotificationPermission.css";
import { enableNotifications } from "../utils/notifications";

const NotificationPermission = () => {
  const [isVisible, setIsVisible] = useState(
    () =>
      "Notification" in window &&
      Notification.permission === "default"
  );

  const [loading, setLoading] = useState(false);

  if (!isVisible) {
    return null;
  }

  const handleEnable = async () => {
    try {
      setLoading(true);

      const success = await enableNotifications();

      if (success) {
        setIsVisible(false);
      }
    } catch (error) {
      console.error(
        "Notification permission error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLater = () => {
    setIsVisible(false);
  };

  return (
    <div className="notification-permission-overlay">
      <div className="notification-permission-modal">

        <button
          className="notification-close-btn"
          onClick={handleLater}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="notification-icon-wrapper">
          <div className="notification-icon-glow" />

          <div className="notification-main-icon">
            <BellRing size={30} />
          </div>
        </div>

        <h2>Stay connected</h2>

        <p className="notification-description">
          Turn on notifications so you never miss messages
          from your friends on VibeConnect.
        </p>

        <div className="notification-benefits">

          <div className="notification-benefit">
            <div className="benefit-icon">
              <MessageCircle size={18} />
            </div>

            <span>Get notified about new messages</span>
          </div>

          <div className="notification-benefit">
            <div className="benefit-icon">
              <Wifi size={18} />
            </div>

            <span>Receive updates when you're online</span>
          </div>

          <div className="notification-benefit">
            <div className="benefit-icon">
              <Check size={18} />
            </div>

            <span>Stay connected even when away</span>
          </div>

        </div>

        <button
          className="enable-notifications-btn"
          onClick={handleEnable}
          disabled={loading}
        >
          <Bell size={19} />

          {loading
            ? "Enabling..."
            : "Enable Notifications"
          }
        </button>

        <button
          className="notification-later-btn"
          onClick={handleLater}
          disabled={loading}
        >
          Maybe later
        </button>

      </div>
    </div>
  );
};

export default NotificationPermission;