import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { MainLayout } from "./components/Layout/MainLayout";
import { LoadingSpinner, PageErrorDisplay } from "./components/Common";
import { ThemeProvider } from "./components/ThemeProvider";

const ETLModule = React.lazy(() => import("./pages/ETL/ETLModule"));
const ReportsModule = React.lazy(() => import("./pages/Reports/ReportsModule"));
import { ObservabilityModule } from "./pages/Observability/ObservabilityModule";

function App() {
  const [appError, setAppError] = React.useState<string | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Global error:", event.error);
      setAppError(event.error?.message || "Erro inesperado na aplicação");
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason);
      setAppError(
        event.reason?.message || "Erro de comunicação com o servidor"
      );
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, []);

  const handleRetryError = () => {
    setAppError(null);
    window.location.reload();
  };

  const handleGoHome = () => {
    setAppError(null);
    window.location.href = "/";
  };

  if (appError) {
    return (
      <PageErrorDisplay
        error={appError}
        title="Erro na Aplicação"
        description="Ocorreu um erro inesperado na aplicação. Tente recarregar a página."
        onRetry={handleRetryError}
        onGoHome={handleGoHome}
      />
    );
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="d4c-ui-theme">
      <Router>
        <div className="App">
          <MainLayout>
            <React.Suspense
              fallback={
                <div className="flex items-center justify-center h-full">
                  <LoadingSpinner
                    size="lg"
                    text="Carregando módulo..."
                    color="blue"
                  />
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<ETLModule />} />
                <Route path="/etl" element={<Navigate to="/" replace />} />
                <Route path="/relatorios" element={<ReportsModule />} />
                <Route
                  path="/observabilidade"
                  element={<ObservabilityModule />}
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </React.Suspense>
          </MainLayout>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
