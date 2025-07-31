import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./app/layout";
import AuthLayout from "./app/(auth)/layout";
import LoginPage from "./app/(auth)/login";
import AppLayout from "./app/(app)/layout";
import DashboardPage from "./app/(app)/dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route path="auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route index element={<LoginPage />} />
          </Route>
          <Route path="app" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
          </Route>
          <Route index element={<LoginPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
