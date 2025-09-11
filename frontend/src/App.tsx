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
import { useState, useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { WalletContextProvider } from "./contexts/WalletContext";
import { initializeTestUser } from "./lib/firebaseInit";
import { queryClient } from "./lib/queryClient";

const App = () => {
  const [testUserInfo, setTestUserInfo] = useState<{ email: string, password: string } | null>(null);

  useEffect(() => {
    // Initialize test user for development purposes
    const setupTestUser = async () => {
      try {
        const userInfo = await initializeTestUser();
        setTestUserInfo(userInfo);
        console.log('Test user available for login:', userInfo.email);
      } catch (error) {
        console.error('Error setting up test user:', error);
      }
    };
    
    setupTestUser();
  }, []);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <WalletContextProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {testUserInfo && (
              <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-md text-xs z-50">
                <p><strong>Test Account:</strong></p>
                <p>Email: {testUserInfo.email}</p>
                <p>Password: {testUserInfo.password}</p>
              </div>
            )}
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
