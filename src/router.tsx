import { Route, Routes, Navigate } from "react-router-dom";
import { AdminLayout } from "./shared/layout/AdminLayout";
import { DashboardPage } from "./shared/pages/DashboardPage";
import { WaitlistPage } from "./waitlist/pages/WaitlistPage";

export function AppRouter() {
  // TODO: plug in real auth; for now assume authenticated admin
  const isAuthenticated = true;

  if (!isAuthenticated) {
    // In a real app, redirect to auth domain / SSO
    return <div>Unauthorized</div>;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/waitlist" element={<WaitlistPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminLayout>
  );
}

