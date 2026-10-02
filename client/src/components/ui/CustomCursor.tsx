import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Position motion values
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs for outer ring
  const springConfig = { damping: 25, stiffness: 300, mass: 0.4 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Only run on non-touch devices
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const hoverable = target.closest(
        'a, button, [role="button"], input, textarea, select, [data-cursor], .group'
      );
      if (hoverable) {
        setIsHovered(true);
        const customLabel = hoverable.getAttribute("data-cursor");
        setCursorText(customLabel || "");
      } else {
        setIsHovered(false);
        setCursorText("");
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Following Ring / Pill */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          pointerEvents: "none",
          zIndex: 9999,
        }}
        animate={{
          scale: isClicking ? 0.85 : isHovered ? (cursorText ? 1.25 : 1.5) : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 450, damping: 28 }}
        className={`flex items-center justify-center transition-colors duration-150 ${
          cursorText
            ? "h-8 px-3.5 rounded-full bg-moss text-white shadow-lg text-[10px] font-bold tracking-widest uppercase"
            : isHovered
            ? "h-9 w-9 rounded-full border-2 border-moss bg-moss/15 shadow-sm"
            : "h-8 w-8 rounded-full border border-moss/50 bg-moss/5"
        }`}
      >
        {cursorText ? (
          <span className="whitespace-nowrap select-none">{cursorText}</span>
        ) : null}
      </motion.div>

      {/* Center Precision Dot */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          pointerEvents: "none",
          zIndex: 10000,
        }}
        animate={{
          scale: isHovered ? 0 : 1,
          opacity: cursorText ? 0 : 1,
        }}
        className="h-2 w-2 rounded-full bg-moss shadow-xs"
      />
    </>
  );
}
