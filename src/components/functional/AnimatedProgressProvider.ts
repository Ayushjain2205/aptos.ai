import React, { useEffect, useState } from "react";

interface AnimatedProgressProviderProps {
  valueStart: number;
  valueEnd: number;
  duration: number;
  easingFunction: (normalizedTime: number) => number;
  children: (value: number) => React.ReactNode;
}

const AnimatedProgressProvider: React.FC<AnimatedProgressProviderProps> = ({
  valueStart,
  valueEnd,
  duration,
  easingFunction,
  children,
}) => {
  const [value, setValue] = useState(valueStart);

  useEffect(() => {
    let animationFrame: number;
    const startTime = Date.now();

    const updateValue = () => {
      const now = Date.now();
      const timePassed = now - startTime;
      const progress = Math.min(1, timePassed / (duration * 1000));
      const nextValue =
        valueStart + easingFunction(progress) * (valueEnd - valueStart);

      setValue(nextValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateValue);
      }
    };

    updateValue();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [valueStart, valueEnd, duration, easingFunction]);

  return children(value);
};

export default AnimatedProgressProvider;
