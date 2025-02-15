import { Outlet } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useAuth } from '@/lib/auth';
import { Navigate } from 'react-router-dom';

export default function DashboardLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#04724D]" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <DashboardSidebar>
      <Outlet />
    </DashboardSidebar>
  );
}
