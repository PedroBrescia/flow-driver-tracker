import { Navigate, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Truck } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';

export default function AppLayout() {
  const { isLoggedIn, isLoading, handleLogout } = useAppState();

  if (isLoading) {
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-sm border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 lg:w-6 lg:h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-primary">PipeFlow Operations</h1>
                <p className="text-sm lg:text-base text-muted-foreground">Rastreamento Operacional</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground h-10 lg:h-12 px-4 lg:px-6"
            >
              <LogOut className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-6 py-4 lg:py-6">
        <Outlet />
      </main>
    </div>
  );
}