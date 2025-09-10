import React from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  RefreshCw,
  X,
  Info,
  AlertCircle,
  XCircle,
} from "lucide-react";

interface ErrorDisplayProps {
  error: string | Error | null;
  title?: string;
  message?: string;
  type?: "error" | "warning" | "info";
  showRetry?: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const typeConfig = {
  error: {
    icon: XCircle,
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    iconColor: "text-red-500",
    titleColor: "text-red-800",
    textColor: "text-red-700",
    buttonColor: "bg-red-600 hover:bg-red-700",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    iconColor: "text-yellow-500",
    titleColor: "text-yellow-800",
    textColor: "text-yellow-700",
    buttonColor: "bg-yellow-600 hover:bg-yellow-700",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    iconColor: "text-blue-500",
    titleColor: "text-blue-800",
    textColor: "text-blue-700",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
  },
};

const sizeConfig = {
  sm: {
    padding: "p-3",
    iconSize: "w-4 h-4",
    titleSize: "text-sm",
    textSize: "text-xs",
    buttonSize: "px-2 py-1 text-xs",
  },
  md: {
    padding: "p-4",
    iconSize: "w-5 h-5",
    titleSize: "text-base",
    textSize: "text-sm",
    buttonSize: "px-3 py-2 text-sm",
  },
  lg: {
    padding: "p-6",
    iconSize: "w-6 h-6",
    titleSize: "text-lg",
    textSize: "text-base",
    buttonSize: "px-4 py-2 text-base",
  },
};

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  title,
  type = "error",
  showRetry = false,
  onRetry,
  onDismiss,
  className = "",
  size = "md",
  fullWidth = true,
}) => {
  if (!error) return null;

  const config = typeConfig[type];
  const sizeConf = sizeConfig[size];
  const Icon = config.icon;

  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`
        ${config.bgColor} ${config.borderColor} border rounded-lg ${
        sizeConf.padding
      }
        ${fullWidth ? "w-full" : "inline-block"}
        ${className}
      `}
    >
      <div className="flex items-start space-x-3">
        <Icon
          className={`${sizeConf.iconSize} ${config.iconColor} flex-shrink-0 mt-0.5`}
        />

        <div className="flex-1 min-w-0">
          {title && (
            <h3
              className={`${sizeConf.titleSize} font-semibold ${config.titleColor} mb-1`}
            >
              {title}
            </h3>
          )}

          <p className={`${sizeConf.textSize} ${config.textColor} break-words`}>
            {errorMessage}
          </p>

          {showRetry && onRetry && (
            <div className="mt-3">
              <button
                onClick={onRetry}
                className={`
                  inline-flex items-center space-x-2 ${sizeConf.buttonSize}
                  ${config.buttonColor} text-white font-medium rounded-md
                  transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                `}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Tentar novamente</span>
              </button>
            </div>
          )}
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`
              ${config.iconColor} hover:${config.titleColor} transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md p-1
            `}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export const ApiErrorDisplay: React.FC<{
  error: string | Error | null;
  onRetry?: () => void;
  className?: string;
}> = ({ error, onRetry, className }) => (
  <ErrorDisplay
    error={error}
    title="Erro de Comunicação"
    type="error"
    showRetry={!!onRetry}
    onRetry={onRetry}
    className={className}
  />
);

export const CardErrorDisplay: React.FC<{
  error: string | Error | null;
  onRetry?: () => void;
}> = ({ error, onRetry }) => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center max-w-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-4"
      >
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
      </motion.div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Ops! Algo deu errado
      </h3>

      <p className="text-sm text-gray-600 mb-4">
        {error instanceof Error ? error.message : error}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Tentar novamente</span>
        </button>
      )}
    </div>
  </div>
);

export const InlineErrorDisplay: React.FC<{
  error: string | Error | null;
  size?: "sm" | "md";
}> = ({ error, size = "sm" }) => {
  if (!error) return null;

  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center space-x-2 text-red-600"
    >
      <AlertCircle className={size === "sm" ? "w-4 h-4" : "w-5 h-5"} />
      <span className={size === "sm" ? "text-xs" : "text-sm"}>
        {errorMessage}
      </span>
    </motion.div>
  );
};

export const PageErrorDisplay: React.FC<{
  error: string | Error | null;
  title?: string;
  description?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
}> = ({
  error,
  title = "Erro inesperado",
  description = "Ocorreu um erro inesperado. Tente novamente ou volte à página inicial.",
  onRetry,
  onGoHome,
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="max-w-md w-full text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AlertTriangle className="w-20 h-20 text-red-500 mx-auto mb-6" />

        <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>

        <p className="text-gray-600 mb-2">{description}</p>

        {error && (
          <p className="text-sm text-red-600 mb-6 bg-red-50 p-3 rounded-lg border border-red-200">
            {error instanceof Error ? error.message : error}
          </p>
        )}

        <div className="space-y-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Tentar novamente</span>
            </button>
          )}

          {onGoHome && (
            <button
              onClick={onGoHome}
              className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors duration-200"
            >
              Voltar ao início
            </button>
          )}
        </div>
      </motion.div>
    </div>
  </div>
);
