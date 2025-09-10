import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={`w-full h-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const FadeTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`w-full h-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const SlideTransition: React.FC<PageTransitionProps & {
  direction?: 'left' | 'right' | 'up' | 'down';
}> = ({ 
  children, 
  className = '',
  direction = 'right'
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'left':
        return { x: -100, opacity: 0 };
      case 'right':
        return { x: 100, opacity: 0 };
      case 'up':
        return { y: -100, opacity: 0 };
      case 'down':
        return { y: 100, opacity: 0 };
      default:
        return { x: 100, opacity: 0 };
    }
  };

  const getExitPosition = () => {
    switch (direction) {
      case 'left':
        return { x: 100, opacity: 0 };
      case 'right':
        return { x: -100, opacity: 0 };
      case 'up':
        return { y: 100, opacity: 0 };
      case 'down':
        return { y: -100, opacity: 0 };
      default:
        return { x: -100, opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      animate={{ x: 0, y: 0, opacity: 1 }}
      exit={getExitPosition()}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      className={`w-full h-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const ScaleTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.1, opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
      className={`w-full h-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const RotateTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ rotate: -5, scale: 0.9, opacity: 0 }}
      animate={{ rotate: 0, scale: 1, opacity: 1 }}
      exit={{ rotate: 5, scale: 0.9, opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
      className={`w-full h-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const BlurTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ filter: 'blur(10px)', opacity: 0 }}
      animate={{ filter: 'blur(0px)', opacity: 1 }}
      exit={{ filter: 'blur(10px)', opacity: 0 }}
      transition={{ duration: 0.4 }}
      className={`w-full h-full ${className}`}
    >
      {children}
    </motion.div>
  );
};