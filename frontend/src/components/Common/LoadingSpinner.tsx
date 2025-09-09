import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'green' | 'purple' | 'gray' | 'white';
  text?: string;
  fullScreen?: boolean;
  overlay?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

const colorClasses = {
  blue: 'text-blue-500',
  green: 'text-green-500',
  purple: 'text-purple-500',
  gray: 'text-gray-500',
  white: 'text-white'
};

const textSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'blue',
  text,
  fullScreen = false,
  overlay = false
}) => {
  const spinnerContent = (
    <div className={`flex flex-col items-center justify-center space-y-3 ${
      fullScreen ? 'min-h-screen' : 'p-8'
    }`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
        className={`${sizeClasses[size]} ${colorClasses[color]}`}
      >
        <Loader2 className="w-full h-full" />
      </motion.div>
      
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`${textSizeClasses[size]} ${colorClasses[color]} font-medium text-center`}
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-lg p-8 shadow-xl"
        >
          {spinnerContent}
        </motion.div>
      </motion.div>
    );
  }

  return spinnerContent;
};

// Componente específico para loading de cards
export const CardLoadingSpinner: React.FC<{ text?: string }> = ({ text }) => (
  <div className="flex items-center justify-center p-12">
    <div className="flex flex-col items-center space-y-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
        className="w-8 h-8 text-gray-400"
      >
        <Loader2 className="w-full h-full" />
      </motion.div>
      {text && (
        <p className="text-sm text-gray-500 font-medium">{text}</p>
      )}
    </div>
  </div>
);

// Componente para loading inline
export const InlineLoadingSpinner: React.FC<{ 
  text?: string;
  size?: 'sm' | 'md';
}> = ({ text, size = 'sm' }) => (
  <div className="flex items-center space-x-2">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
      className={`${sizeClasses[size]} text-gray-500`}
    >
      <Loader2 className="w-full h-full" />
    </motion.div>
    {text && (
      <span className={`${textSizeClasses[size]} text-gray-600 font-medium`}>
        {text}
      </span>
    )}
  </div>
);

// Componente para skeleton loading
export const SkeletonLoader: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: index * 0.1
        }}
        className={`h-4 bg-gray-200 rounded ${
          index === lines - 1 ? 'w-3/4' : 'w-full'
        }`}
      />
    ))}
  </div>
);

// Componente para loading de tabela
export const TableLoadingSpinner: React.FC<{
  rows?: number;
  columns?: number;
}> = ({ rows = 5, columns = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <motion.div
            key={colIndex}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: (rowIndex * columns + colIndex) * 0.05
            }}
            className="h-8 bg-gray-200 rounded flex-1"
          />
        ))}
      </div>
    ))}
  </div>
);