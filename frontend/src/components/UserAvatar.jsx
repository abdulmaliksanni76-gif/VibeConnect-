import React from "react";
import "./UserAvatar.css";

const BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const gradients = [
  ["#7A5AF8", "#5B42F3"],
  ["#3B82F6", "#2563EB"],
  ["#10B981", "#059669"],
  ["#F59E0B", "#D97706"],
  ["#EF4444", "#DC2626"],
  ["#EC4899", "#DB2777"],
  ["#14B8A6", "#0F766E"],
  ["#8B5CF6", "#6D28D9"],
  ["#6366F1", "#4338CA"],
  ["#06B6D4", "#0891B2"],
];

const getInitials = (name = "") => {
  return name
    .trim()
    .split(" ")
    .map(word => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

const getGradient = (name = "") => {
  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash += name.charCodeAt(i);
  }

  return gradients[hash % gradients.length];
};

const getImageUrl = (photoUrl) => {
  if (!photoUrl) return null;

  // Already a full URL
  if (/^https?:\/\//i.test(photoUrl)) {
    return photoUrl;
  }

  // Starts with /
  if (photoUrl.startsWith("/")) {
    return `${BASE_URL}${photoUrl}`;
  }

  // uploads/profile/abc.jpg
  return `${BASE_URL}/${photoUrl}`;
};

const UserAvatar = ({
  user,
  size = 48,
  className = "",
}) => {
  const imageUrl = getImageUrl(user?.photoUrl);

  const [start, end] = getGradient(user?.username || "");

  const commonStyle = {
    width: size,
    height: size,
  };

  return imageUrl ? (
    <img
      src={imageUrl}
      alt={user?.username || "User"}
      className={`user-avatar ${className}`}
      style={commonStyle}
      onError={(e) => {
        // If image fails, show initials instead
        e.currentTarget.style.display = "none";

        const placeholder = e.currentTarget.nextSibling;
        if (placeholder) {
          placeholder.style.display = "flex";
        }
      }}
    />
  ) : (
    <div
      className={`user-avatar-placeholder ${className}`}
      style={{
        ...commonStyle,
        background: `linear-gradient(135deg, ${start}, ${end})`,
      }}
    >
      {getInitials(user?.username || "U")}
    </div>
  );
};

export default UserAvatar;