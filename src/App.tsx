
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/lib/auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Reports from "./pages/dashboard/Reports";
import Sessions from "./pages/dashboard/Sessions";
import Assessments from "./pages/dashboard/Assessments";
import Profile from "./pages/dashboard/Profile";
import BasicInfo from "./pages/dashboard/BasicInfo";
import DietPlans from "./pages/dashboard/DietPlans";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardHome />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="sessions" element={<Sessions />} />
                  <Route path="assessments" element={<Assessments />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="diet-plans" element={<DietPlans />} />
                  <Route path="basic-info" element={<BasicInfo />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
