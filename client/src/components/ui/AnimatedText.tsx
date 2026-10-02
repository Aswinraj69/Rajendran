import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  fontFamily?: "manrope" | "roneva" | "dandy";
  type?: "words" | "chars" | "heading" | "fade";
  delay?: number;
}

export function AnimatedText({
  text,
  className = "",
  fontFamily = "manrope",
  type = "words",
  delay = 0,
}: AnimatedTextProps) {
  const fontClass =
    fontFamily === "roneva"
      ? "font-roneva"
      : fontFamily === "dandy"
      ? "font-dandy"
      : "font-manrope";

  if (type === "chars") {
    const letters = Array.from(text);
    const container = {
      hidden: { opacity: 0 },
      visible: (i = 1) => ({
        opacity: 1,
        transition: { staggerChildren: 0.03, delayChildren: delay * i },
      }),
    };
    const child = {
      visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", damping: 12, stiffness: 100 },
      },
      hidden: {
        opacity: 0,
        y: 20,
        transition: { type: "spring", damping: 12, stiffness: 100 },
      },
    };

    return (
      <motion.span
        className={`inline-block ${fontClass} ${className}`}
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {letters.map((letter, idx) => (
          <motion.span variants={child} key={idx} className="inline-block">
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  if (type === "words") {
    const words = text.split(" ");
    const container = {
      hidden: { opacity: 0 },
      visible: (i = 1) => ({
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: delay * i },
      }),
    };
    const child = {
      visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      },
      hidden: {
        opacity: 0,
        y: 24,
        filter: "blur(6px)",
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      },
    };

    return (
      <motion.div
        className={`flex flex-wrap gap-x-[0.25em] ${fontClass} ${className}`}
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {words.map((word, idx) => (
          <motion.span variants={child} key={idx} className="inline-block">
            {word}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`${fontClass} ${className}`}
    >
      {text}
    </motion.div>
  );
}
