"use client";

import { motion } from "framer-motion";
import React from "react";

interface InsightCardProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  delay?: number;
  className?: string;
}

export const InsightCard = ({ label, value, icon, delay = 0, className = "" }: InsightCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        delay, 
        duration: 0.8, 
        ease: "easeOut",
        repeat: Infinity,
        repeatType: "reverse",
        repeatDelay: Math.random() * 2 + 1
      }}
      className={`absolute z-20 pointer-events-none ${className}`}
    >
      <div className="bg-[#030207]/80 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-[0_0_20px_rgba(168,85,247,0.2)] flex items-center gap-3">
        {icon && <div className="text-primary">{icon}</div>}
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-tighter font-semibold">{label}</p>
          <p className="text-xs text-white font-bold">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};
