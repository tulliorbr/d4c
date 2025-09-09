import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

interface IconButtonProps {
  icon: LucideIcon;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  tooltip?: string;
}

interface FloatingActionButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  className?: string;
  size?: 'md' | 'lg';
  disabled?: boolean;
}

const buttonVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25
    }
  },
  tap: { scale: 0.98 },
  disabled: { scale: 1, opacity: 0.6 }
};

const getVariantClasses = (variant: string) => {
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md',
    success: 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
  };
  return variants[variant as keyof typeof variants] || variants.primary;
};

const getSizeClasses = (size: string) => {
  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2 text-sm',
    lg: 'h-11 px-8 text-base',
    xl: 'h-12 px-10 text-lg'
  };
  return sizes[size as keyof typeof sizes] || sizes.md;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  onClick,
  type = 'button'
}) => {
  const baseClasses = `
    inline-flex items-center justify-center rounded-md font-medium ring-offset-background 
    transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 
    focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none 
    disabled:opacity-50 select-none
    ${getVariantClasses(variant)}
    ${getSizeClasses(size)}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  const isDisabled = disabled || loading;

  return (
    <motion.button
      className={baseClasses}
      variants={buttonVariants}
      initial="initial"
      whileHover={!isDisabled ? "hover" : "disabled"}
      whileTap={!isDisabled ? "tap" : "disabled"}
      disabled={isDisabled}
      onClick={onClick}
      type={type}
    >
      {loading && (
        <LoadingSpinner size="sm" className="mr-2" />
      )}
      
      {!loading && Icon && iconPosition === 'left' && (
        <Icon className="mr-2 h-4 w-4" />
      )}
      
      <span className={loading ? 'opacity-70' : ''}>
        {children}
      </span>
      
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className="ml-2 h-4 w-4" />
      )}
    </motion.button>
  );
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
  tooltip
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const baseClasses = `
    inline-flex items-center justify-center rounded-md font-medium ring-offset-background 
    transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 
    focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none 
    disabled:opacity-50 select-none
    ${getVariantClasses(variant)}
    ${sizeClasses[size]}
    ${className}
  `;

  const isDisabled = disabled || loading;

  return (
    <motion.button
      className={baseClasses}
      variants={buttonVariants}
      initial="initial"
      whileHover={!isDisabled ? "hover" : "disabled"}
      whileTap={!isDisabled ? "tap" : "disabled"}
      disabled={isDisabled}
      onClick={onClick}
      type={type}
      title={tooltip}
    >
      {loading ? (
        <LoadingSpinner size="sm" />
      ) : (
        <Icon className={iconSizes[size]} />
      )}
    </motion.button>
  );
};

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon: Icon,
  onClick,
  className = '',
  size = 'lg',
  disabled = false
}) => {
  const sizeClasses = {
    md: 'h-12 w-12',
    lg: 'h-14 w-14'
  };

  const iconSizes = {
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <motion.button
      className={`
        fixed bottom-6 right-6 z-50 inline-flex items-center justify-center rounded-full 
        bg-primary text-primary-foreground shadow-lg hover:shadow-xl 
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
        focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
        ${sizeClasses[size]} ${className}
      `}
      variants={{
        initial: { scale: 1, rotate: 0 },
        hover: { 
          scale: 1.1, 
          rotate: 5,
          transition: {
            type: 'spring',
            stiffness: 400,
            damping: 25
          }
        },
        tap: { scale: 0.95, rotate: -5 }
      }}
      initial="initial"
      whileHover={!disabled ? "hover" : undefined}
      whileTap={!disabled ? "tap" : undefined}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon className={iconSizes[size]} />
    </motion.button>
  );
};

// Button com gradiente animado
export const GradientButton: React.FC<ButtonProps> = ({
  children,
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  onClick,
  type = 'button'
}) => {
  const baseClasses = `
    relative inline-flex items-center justify-center rounded-md font-medium 
    text-white overflow-hidden transition-all duration-300
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
    focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
    ${getSizeClasses(size)}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  const isDisabled = disabled || loading;

  return (
    <motion.button
      className={baseClasses}
      variants={buttonVariants}
      initial="initial"
      whileHover={!isDisabled ? "hover" : "disabled"}
      whileTap={!isDisabled ? "tap" : "disabled"}
      disabled={isDisabled}
      onClick={onClick}
      type={type}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-200 animate-gradient" />
      
      {/* Content */}
      <div className="relative flex items-center justify-center">
        {loading && (
          <LoadingSpinner size="sm" className="mr-2" />
        )}
        
        {!loading && Icon && iconPosition === 'left' && (
          <Icon className="mr-2 h-4 w-4" />
        )}
        
        <span className={loading ? 'opacity-70' : ''}>
          {children}
        </span>
        
        {!loading && Icon && iconPosition === 'right' && (
          <Icon className="ml-2 h-4 w-4" />
        )}
      </div>
    </motion.button>
  );
};

// Button group
interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className = '',
  orientation = 'horizontal'
}) => {
  const orientationClasses = {
    horizontal: 'flex-row [&>*:not(:first-child)]:ml-0 [&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none',
    vertical: 'flex-col [&>*:not(:first-child)]:mt-0 [&>*:not(:first-child)]:-mt-px [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none'
  };

  return (
    <div className={`inline-flex ${orientationClasses[orientation]} ${className}`}>
      {children}
    </div>
  );
};