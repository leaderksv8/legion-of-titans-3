import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import HomePage from "@/spa/screens/HomePage";
import ThanksPage from "@/spa/screens/ThanksPage";
import AdminPage from "@/spa/screens/AdminPage";
import GuidePage from "@/spa/screens/GuidePage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/thanks" element={<ThanksPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/moderation" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

