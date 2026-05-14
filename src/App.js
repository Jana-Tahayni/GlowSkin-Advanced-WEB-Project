import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { VerifyEmailPage } from "./auth/LoginForm";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Navbar             from "./components/Navbar";
import HistoryPage        from "./components/HistoryPage";
import GlowAuth           from "./auth/LoginForm";
import GoogleCallbackPage from "./auth/GoogleCallbackPage";
import AnalyzerPage       from "./pages/AnalyzerPage";

export default function App() {
  // Simple auth check — replace with real auth context later
  const isLoggedIn = () => !!localStorage.getItem("token");

  return (
    <>
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/auth"                  element={<GlowAuth />} />
        <Route path="/auth/google/callback"  element={<GoogleCallbackPage />} />
          <Route path="/forgot-password"        element={<ResetPasswordPage />} />
<Route path="/reset-password/:token"  element={<ResetPasswordPage />} />
<Route path="/verify/:token" element={<VerifyEmailPage />} />
        {/* Protected routes */}
        <Route
          path="/analyzer"
          element={isLoggedIn() ? <AnalyzerPage /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/history"
          element={isLoggedIn() ? <HistoryPage /> : <Navigate to="/auth" replace />}
        />

        {/* Default redirect */}
        <Route
          path="*"
          element={<Navigate to={isLoggedIn() ? "/analyzer" : "/auth"} replace />}
        />
      </Routes>
    </>
  );
}