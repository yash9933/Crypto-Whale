import { useEffect } from "react";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import MarketData from "./pages/MarketData";
import TransactionLogSimple from "./pages/TransactionLogSimple";
import PortfolioAnalysis from "./pages/PortfolioAnalysis";
import WalletConnection from "./pages/WalletConnection";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { AuthProvider } from "./contexts/AuthContext";
import { WalletContextProvider } from "./contexts/WalletContext";
import { queryClient } from "./lib/queryClient";
import { useSettingsStore } from "./store/store";

const App = () => {
  const { settings } = useSettingsStore();

  // Apply theme globally
  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.darkMode);
  }, [settings.darkMode]);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <WalletContextProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Router>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/market-data" element={<MarketData />} />
                <Route path="/transactions" element={<Navigate to="/transaction-log" replace />} />
                <Route path="/transaction-log" element={<TransactionLogSimple />} />
                <Route path="/portfolio-analysis" element={<PortfolioAnalysis />} />
                <Route path="/wallet-connection" element={<WalletConnection />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </TooltipProvider>
        </WalletContextProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;
