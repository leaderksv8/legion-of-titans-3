import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";

import HomePage from "@/spa/screens/HomePage";
import ThanksPage from "@/spa/screens/ThanksPage";
import AdminPage from "@/spa/screens/AdminPage";
import GuidePage from "@/spa/screens/GuidePage";
import EventPage from "@/spa/screens/EventPage";
import FounderPage from "@/spa/screens/FounderPage";
import TeamPage from "@/spa/screens/TeamPage";

// Lazy-load AdminPanel to prevent compilation errors from affecting the main site
const LazyAdminPage = lazy(() => import("@/spa/screens/AdminPage"));

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events/:id" element={<EventPage />} />
        <Route path="/founders/:id" element={<FounderPage />} />
        <Route path="/team/:id" element={<TeamPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/thanks" element={<ThanksPage />} />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<div>Завантажується...</div>}>
              <LazyAdminPage />
            </Suspense>
          }
        />
        <Route path="/moderation" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

