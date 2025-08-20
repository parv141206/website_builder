"use client";
import React from "react";

// --- 1. Define the Animated Floating Dots Component ---
const FloatingDots = () => (
  <>
    <style>{`
      @keyframes float {
        0% { transform: translateY(0px) translateX(0px); }
        50% { transform: translateY(-20px) translateX(10px); }
        100% { transform: translateY(0px) translateX(0px); }
      }
      .dot {
        position: absolute;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 50%;
        animation: float 6s ease-in-out infinite;
      }
    `}</style>
    {/* Create a set of dots with random sizes, positions, and animation delays */}
    {Array.from({ length: 20 }).map((_, i) => {
      const size = Math.random() * 50 + 20; // 20px to 70px
      return (
        <div
          key={i}
          className="dot"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${Math.random() * 4 + 4}s`, // 4s to 8s
          }}
        />
      );
    })}
  </>
);

// --- 2. Create the Central Registry for all Fancy Backgrounds ---
export const FANCY_BACKGROUNDS: Record<
  string,
  { name: string; style: React.CSSProperties; component?: React.FC }
> = {
  vercelGrid: {
    name: "Vercel Grid",
    style: {
      backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.2) 2%, transparent 0%),
                      radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.2) 2%, transparent 0%)`,
      backgroundSize: "100px 100px",
      backgroundColor: "#1A202C", // A default dark color
    },
  },
  floatingDots: {
    name: "Floating Dots",
    style: {
      backgroundColor: "#0D1117", // A default dark color
      overflow: "hidden", // Important for containing the dots
    },
    component: FloatingDots, // Assign the animated component
  },
  // Add your next fancy background here! e.g., 'doodlePattern': { ... }
};
