/**
 * Animation utilities inspired by React Bits
 * Provides smooth, professional animations for text, components, and interactive elements
 */

// Container variants for staggered animations
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Text fade-in with upward movement
export const fadeInUpVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

// Text fade-in with blur effect
export const blurInVariants = {
  hidden: {
    opacity: 0,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
  },
};

// Slide in from left
export const slideInLeftVariants = {
  hidden: {
    opacity: 0,
    x: -40,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};

// Slide in from right
export const slideInRightVariants = {
  hidden: {
    opacity: 0,
    x: 40,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};

// Scale and fade in
export const scaleInVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
};

// Staggered letter animation for text
export const letterVariants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

// Staggered word animation
export const wordVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
};

// Hover animation for cards
export const cardHoverVariants = {
  rest: {
    y: 0,
    boxShadow: "0 0 0px rgba(247, 39, 152, 0)",
  },
  hover: {
    y: -5,
    boxShadow: "0 20px 40px rgba(247, 39, 152, 0.15)",
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

// Glow effect for elements
export const glowVariants = {
  hidden: {
    boxShadow: "0 0 0px rgba(247, 39, 152, 0)",
  },
  visible: {
    boxShadow: "0 0 20px rgba(247, 39, 152, 0.4)",
    transition: {
      duration: 0.4,
    },
  },
};

// Rotate animation
export const rotateVariants = {
  hidden: {
    rotate: -10,
    opacity: 0,
  },
  visible: {
    rotate: 0,
    opacity: 1,
  },
};

// Pulse animation
export const pulseVariants = {
  hidden: { opacity: 0.5 },
  visible: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Character by character animation
export const splitTextVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
        delayChildren: 0,
      },
    },
  },
  item: {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  },
};

// Gradient animation
export const gradientVariants = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// Bounce animation
export const bounceVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
      duration: 0.6,
    },
  },
  bounce: {
    y: [-5, 5, -5],
    transition: {
      duration: 0.5,
    },
  },
};

// Exit animations
export const exitVariants = {
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.3,
    },
  },
};

