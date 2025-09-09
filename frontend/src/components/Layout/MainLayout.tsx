import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import { Database, BarChart3, Activity, Menu, X, Bell } from "lucide-react";
import { useStoreStatus } from "../../hooks/useStoreStatus";
import { ThemeToggle } from "../ThemeToggle";

interface MainLayoutProps {
  children: React.ReactNode;
}

const modules = [
  {
    id: "etl" as const,
    name: "ETL",
    description: "Extração, Transformação e Carga",
    icon: Database,
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-600",
    activeColor: "bg-blue-600",
    path: "/",
  },
  {
    id: "reports" as const,
    name: "Relatórios",
    description: "KPIs, Gráficos e Análises",
    icon: BarChart3,
    color: "bg-green-500",
    hoverColor: "hover:bg-green-600",
    activeColor: "bg-green-600",
    path: "/relatorios",
  },
  {
    id: "observability" as const,
    name: "Observabilidade",
    description: "Monitoramento e Métricas",
    icon: Activity,
    color: "bg-purple-500",
    hoverColor: "hover:bg-purple-600",
    activeColor: "bg-purple-600",
    path: "/observabilidade",
  },
];

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoading, hasErrors, stores } = useStoreStatus();
  const location = useLocation();

  // Determine current module based on route
  const getCurrentModule = () => {
    if (location.pathname === "/" || location.pathname === "/etl") return "etl";
    if (location.pathname === "/relatorios") return "reports";
    if (location.pathname === "/observabilidade") return "observability";
    return "etl";
  };

  const currentModule = getCurrentModule();
  const currentModuleData = modules.find((m) => m.id === currentModule);

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const overlayVariants = {
    open: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
    closed: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-background border-r border-border pt-5 pb-4 overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold text-foreground">
                  D4C Analytics
                </h1>
              </div>
            </div>

            {/* Navigation */}
            <nav className="mt-8 flex-1 px-2 space-y-2">
              {modules.map((module) => {
                const Icon = module.icon;

                const hasModuleError = stores[module.id]?.hasErrors;
                const isModuleLoading = stores[module.id]?.loading;

                return (
                  <NavLink
                    key={module.id}
                    to={module.path}
                    className={({ isActive: isNavActive }) => `
                      group flex items-center px-3 py-3 text-sm font-medium rounded-lg w-full text-left transition-all duration-200
                      ${
                        isNavActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }
                    `}
                  >
                    {({ isActive: isNavActive }) => (
                      <motion.div
                        className="flex items-center space-x-3 flex-1"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            isNavActive ? "text-white" : "text-muted-foreground"
                          }`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{module.name}</span>
                            <div className="flex items-center space-x-1">
                              {isModuleLoading && (
                                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                              )}
                              {hasModuleError && (
                                <div className="w-2 h-2 bg-red-400 rounded-full" />
                              )}
                            </div>
                          </div>
                          <p
                            className={`text-xs mt-1 ${
                              isNavActive
                                ? "text-primary/80"
                                : "text-muted-foreground"
                            }`}
                          >
                            {module.description}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Status Indicator */}
            <div className="px-4 py-3 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      hasErrors
                        ? "bg-red-400"
                        : isLoading
                        ? "bg-yellow-400 animate-pulse"
                        : "bg-green-400"
                    }`}
                  />
                  <span className="text-xs text-muted-foreground">
                    {hasErrors
                      ? "Erros detectados"
                      : isLoading
                      ? "Carregando..."
                      : "Sistema OK"}
                  </span>
                </div>
                <Bell className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-40 lg:hidden"
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={() => setSidebarOpen(false)}
            >
              <div className="absolute inset-0 bg-background/75" />
            </motion.div>

            {/* Sidebar */}
            <motion.div
              className="fixed inset-y-0 left-0 z-50 w-64 bg-background shadow-lg border-r border-border lg:hidden"
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <Database className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <h1 className="text-lg font-bold text-foreground">
                      D4C Analytics
                    </h1>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-2 py-4 space-y-2">
                  {modules.map((module) => {
                    const Icon = module.icon;

                    return (
                      <NavLink
                        key={module.id}
                        to={module.path}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive: isNavActive }) => `
                          group flex items-center px-3 py-3 text-sm font-medium rounded-lg w-full text-left
                          ${
                            isNavActive
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          }
                        `}
                      >
                        {({ isActive: isNavActive }) => (
                          <>
                            <Icon
                              className={`w-5 h-5 mr-3 ${
                                isNavActive
                                  ? "text-white"
                                  : "text-muted-foreground"
                              }`}
                            />
                            <div>
                              <div className="font-medium">{module.name}</div>
                              <div
                                className={`text-xs ${
                                  isNavActive
                                    ? "text-primary/80"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {module.description}
                              </div>
                            </div>
                          </>
                        )}
                      </NavLink>
                    );
                  })}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-background shadow-sm border-b border-border">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Module Title */}
              <div className="flex items-center space-x-3">
                {currentModuleData && (
                  <>
                    <div
                      className={`w-8 h-8 ${currentModuleData.color} rounded-lg flex items-center justify-center`}
                    >
                      <currentModuleData.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        {currentModuleData.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {currentModuleData.description}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Global loading indicator */}
              {isLoading && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span>Carregando...</span>
                </div>
              )}

              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <motion.div
            key={currentModule}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full p-6"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};
