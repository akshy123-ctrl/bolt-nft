"use client";

import { useState, useEffect } from "react";

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  shouldStart?: boolean;
}

export default function CountUp({
  end,
  duration = 2,
  prefix = "",
  suffix = "",
  decimals = 0,
  shouldStart = true,
}: CountUpProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;

    const start = 0;
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      
      // Power4 ease-out
      const easeOut = 1 - Math.pow(1 - progress, 4);
      
      const currentCount = easeOut * end;
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, shouldStart]);

  return (
    <span>
      {prefix}
      {count.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
