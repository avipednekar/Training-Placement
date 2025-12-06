import { useState, useEffect } from "react";

const useCountUp = (end, duration = 2000, start = 0) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      // Easing function for smooth animation (easeOutExpo)
      const ease = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

      const currentCount = Math.floor(ease(percentage) * (end - start) + start);
      setCount(currentCount);

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start]);

  return count;
};

export default useCountUp;
