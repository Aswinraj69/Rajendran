import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface CascadingTextProps {
  text: string;
  className?: string;
  fontFamily?: "manrope" | "roneva" | "dandy";
  mode?: "words" | "chars" | "lines";
  staggerDelay?: number;
  initialDelay?: number;
  direction?: "up" | "down";
}

export function CascadingText({
  text,
  className = "",
  fontFamily = "manrope",
  mode = "words",
  staggerDelay = 0.045,
  initialDelay = 0.1,
  direction = "up",
}: CascadingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "0px", amount: 0.05 });

  const fontClass =
    fontFamily === "roneva"
      ? "font-roneva"
      : fontFamily === "dandy"
      ? "font-dandy"
      : "font-manrope";

  if (mode === "chars") {
    const chars = Array.from(text);
    return (
      <span ref={containerRef} className={`inline-block ${fontClass} ${className}`}>
        {chars.map((char, index) => (
          <span key={index} className="inline-block overflow-hidden align-top">
            <motion.span
              className="inline-block"
              initial={{
                opacity: 0,
                y: direction === "up" ? "100%" : "-100%",
                filter: "blur(6px)",
                rotateX: direction === "up" ? 40 : -40,
              }}
              animate={
                isInView
                  ? {
                      opacity: 1,
                      y: "0%",
                      filter: "blur(0px)",
                      rotateX: 0,
                    }
                  : {}
              }
              transition={{
                duration: 0.6,
                delay: initialDelay + index * staggerDelay,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          </span>
        ))}
      </span>
    );
  }

  // mode === "words" or "lines"
  const words = text.split(" ");

  return (
    <span ref={containerRef} className={`inline-flex flex-wrap gap-x-[0.28em] gap-y-[0.1em] ${fontClass} ${className}`}>
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden py-[2px] leading-tight">
          <motion.span
            className="inline-block"
            initial={{
              opacity: 0,
              y: direction === "up" ? "120%" : "-120%",
              filter: "blur(8px)",
              rotateX: direction === "up" ? 35 : -35,
            }}
            animate={
              isInView
                ? {
                    opacity: 1,
                    y: "0%",
                    filter: "blur(0px)",
                    rotateX: 0,
                  }
                : {}
            }
            transition={{
              duration: 0.7,
              delay: initialDelay + index * staggerDelay,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export default CascadingText;
