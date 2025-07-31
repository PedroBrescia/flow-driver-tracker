import { Outlet } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useAppState } from '@/hooks/useAppState';

function RootLayoutContent() {
  const { isLoggedIn, isLoading } = useAppState();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RootLayoutContent />
      </TooltipProvider>
    </AppProvider>
  );
}