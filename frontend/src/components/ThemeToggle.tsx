import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-ring"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={false}
      animate={{
        rotate: theme === 'dark' ? 180 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 10,
      }}
    >
      <motion.div
        initial={false}
        animate={{
          scale: theme === 'dark' ? 0 : 1,
          opacity: theme === 'dark' ? 0 : 1,
        }}
        transition={{
          duration: 0.2,
        }}
        className="absolute"
      >
        <Sun className="h-4 w-4" />
      </motion.div>
      
      <motion.div
        initial={false}
        animate={{
          scale: theme === 'dark' ? 1 : 0,
          opacity: theme === 'dark' ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className="absolute"
      >
        <Moon className="h-4 w-4" />
      </motion.div>
      
      <span className="sr-only">
        {theme === 'light' ? 'Alternar para modo escuro' : 'Alternar para modo claro'}
      </span>
    </motion.button>
  );
}