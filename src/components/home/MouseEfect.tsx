// src/components/global/MouseEffect.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const MouseEffect: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 bg-blue-500 blur-2xl opacity-25 w-[300px] h-[300px] rounded-full pointer-events-none z-0"
      animate={{
        left: mousePosition.x - 150,
        top: mousePosition.y - 150,
      }}
      transition={{
        type: "tween",
        duration: 0.2,
        ease: "easeOut",
      }}
    />
  );
};

export default MouseEffect;
