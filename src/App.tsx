import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { SyncProvider } from "@/contexts/SyncContext";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import UdemyLicenses from "@/pages/UdemyLicenses";
import TopLearners from "@/pages/TopLearners";
import IncompleteTrainings from "@/pages/IncompleteTrainings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SyncProvider>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/udemy-licenses" element={<UdemyLicenses />} />
                <Route path="/top-learners" element={<TopLearners />} />
                <Route path="/incomplete-trainings" element={<IncompleteTrainings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SyncProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
