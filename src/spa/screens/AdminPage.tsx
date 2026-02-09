import { Helmet } from "react-helmet-async";
import { Suspense, useEffect } from "react";
import AdminPanel from "@/spa/screens/AdminPanel";
import ErrorBoundary from "@/features/admin/ErrorBoundary";

export default function AdminPage() {
  // Скролимо до верху при завантаженні сторінки
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ErrorBoundary>
      <Helmet>
        <title>Admin — ГО «ЛЕГІОН ТИТАНІВ»</title>
        <meta name="robots" content="noindex,nofollow" />
        <link rel="canonical" href="/admin" />
      </Helmet>
      <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center">Завантажується...</div>}>
        <AdminPanel />
      </Suspense>
    </ErrorBoundary>
  );
}

