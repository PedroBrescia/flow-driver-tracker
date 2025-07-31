import { useAppState } from '@/hooks/useAppState';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const { isLoggedIn, isLoading } = useAppState();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isLoggedIn ? <Dashboard /> : <LoginForm />;
};

export default Index;
