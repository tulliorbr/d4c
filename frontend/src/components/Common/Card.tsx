import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  icon?: LucideIcon;
  iconColor?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo';
  loading?: boolean;
  onClick?: () => void;
}

const cardVariants = {
  initial: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -4,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  },
  tap: { scale: 0.98 }
};

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  glass = false,
  gradient = false,
  onClick 
}) => {
  const baseClasses = `
    rounded-xl border border-border bg-card text-card-foreground shadow-sm
    ${glass ? 'glass' : ''}
    ${gradient ? 'bg-gradient-to-br from-card to-card/80' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  if (hover || onClick) {
    return (
      <motion.div
        className={baseClasses}
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        whileTap={onClick ? "tap" : undefined}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({ 
  children, 
  className = '',
  icon: Icon,
  iconColor = 'text-primary'
}) => {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
      {Icon && (
        <div className="flex items-center space-x-2">
          <Icon className={`h-5 w-5 ${iconColor}`} />
          <div className="flex-1">{children}</div>
        </div>
      )}
      {!Icon && children}
    </div>
  );
};

export const CardContent: React.FC<CardContentProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`p-6 pt-0 ${className}`}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<CardFooterProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center p-6 pt-0 ${className}`}>
      {children}
    </div>
  );
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'blue',
  loading = false,
  onClick
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
    indigo: 'from-indigo-500 to-indigo-600',
  };

  const iconColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
    indigo: 'text-indigo-600',
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-8 w-8 bg-muted rounded-lg"></div>
          </div>
          <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-muted rounded w-1/4"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card hover={!!onClick} onClick={onClick} className="p-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${colorClasses[color]} opacity-10 rounded-full -mr-10 -mt-10`} />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {Icon && (
            <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClasses[color]} bg-opacity-10`}>
              <Icon className={`h-5 w-5 ${iconColorClasses[color]}`} />
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <motion.div 
            className="text-2xl font-bold text-foreground"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {value}
          </motion.div>
          
          <div className="flex items-center justify-between">
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            
            {trend && (
              <motion.div 
                className={`flex items-center text-xs font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className={`mr-1 ${
                  trend.isPositive ? '↗' : '↘'
                }`}>
                  {trend.isPositive ? '↗' : '↘'}
                </span>
                {Math.abs(trend.value)}%
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

// Card com loading skeleton
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <Card className={`p-6 ${className}`}>
      <div className="animate-pulse space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="h-8 w-8 bg-muted rounded-lg"></div>
        </div>
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded w-1/2"></div>
          <div className="h-3 bg-muted rounded w-1/4"></div>
        </div>
      </div>
    </Card>
  );
};

// Card com efeito de hover especial
export const InteractiveCard: React.FC<CardProps & {
  title?: string;
  description?: string;
  icon?: LucideIcon;
}> = ({ 
  children, 
  title, 
  description, 
  icon: Icon, 
  className = '', 
  onClick 
}) => {
  return (
    <motion.div
      className={`group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg ${onClick ? 'cursor-pointer' : ''} ${className}`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative">
        {(title || Icon) && (
          <div className="flex items-center space-x-3 mb-4">
            {Icon && (
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            )}
            {title && (
              <div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}
              </div>
            )}
          </div>
        )}
        {children}
      </div>
    </motion.div>
  );
};