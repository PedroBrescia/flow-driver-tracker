import { Navigate, Outlet } from 'react-router-dom';
import { useAppState } from '@/hooks/useAppState';

export default function AuthLayout() {
  const { isLoggedIn, isLoading } = useAppState();

  if (isLoading) {
    return null;
  }

  if (isLoggedIn) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Outlet />
    </div>
  );
}