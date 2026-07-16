/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";

export default function TiltCard({ children, className = "" }) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for tracking cursor percentages
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Springs for smooth movement
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  
  // Spring tracking numerical values smoothly
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // Convert smooth springs to rotation degrees
  const rotateX = useTransform(springY, [0, 1], [15, -15]);
  const rotateY = useTransform(springX, [0, 1], [-15, 15]);

  // Transform smooth springs to percentage positions for glare gradient
  const glareX = useTransform(springX, [0, 1], [0, 100]);
  const glareY = useTransform(springY, [0, 1], [0, 100]);
  const glareOpacity = useSpring(0, springConfig);

  // Construct glare background template safely using framer-motion native template
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 65%)`;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert mouse position to values between 0 and 1
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    glareOpacity.set(0.15);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    glareOpacity.set(0);
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: rotateX,
        rotateY: rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative rounded-2xl transition-shadow duration-300 ${
        isHovered ? "shadow-2xl shadow-blue-500/10 border-blue-500/40" : "shadow-md"
      } ${className}`}
    >
      {/* Glare overlay using motion template */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background: glareBg,
          opacity: glareOpacity,
          pointerEvents: "none",
          borderRadius: "inherit",
          zIndex: 2,
        }}
      />
      
      {/* Container to enforce 3D styling for children */}
      <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }} className="h-full w-full">
        {children}
      </div>
    </motion.div>
  );
}
