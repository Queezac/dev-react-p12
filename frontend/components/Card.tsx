import React from "react";

interface CardProps {
  title: string;
  description: string;
  icon: string;
  footerText?: string;
  onClick?: () => void;
}

export default function Card({ title, description, icon, footerText, onClick }: CardProps) {
  return (
    <div 
      className="glass-card" 
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div style={{
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid var(--border-color)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.5rem",
        marginBottom: "20px"
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: "1.3rem", marginBottom: "12px" }}>{title}</h3>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "16px" }}>
        {description}
      </p>
      {footerText && (
        <div style={{ fontSize: "0.85rem", color: "var(--accent-primary)", fontWeight: 500 }}>
          {footerText}
        </div>
      )}
    </div>
  );
}
