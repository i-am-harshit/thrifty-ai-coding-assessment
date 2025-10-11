import React from "react";
import "./avatar.scss";

function initialsFrom(name, fallback) {
  if (!name) return fallback || "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function colorFromString(str) {
  if (!str) return null;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360; // hue
  return `hsl(${h}, 70%, 45%)`;
}

export default function Avatar({ name, fallback = "U", className, bg }) {
  const text = initialsFrom(name, fallback).slice(0, 2);
  const computedBg = bg || colorFromString(name || fallback) || undefined;
  return (
    <div
      className={`avatar-circle ${className || ""}`}
      title={name}
      style={computedBg ? { background: computedBg } : {}}
    >
      {text}
    </div>
  );
}
