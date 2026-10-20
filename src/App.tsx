import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WirdSharif from "./pages/WirdSharif";
import { ThemeProvider } from "@/components/ThemeProvider";
import { I18nProvider } from "@/i18n";

const queryClient = new QueryClient();

const AppContent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/wird-sharif" element={<WirdSharif />} />
        <Route path="/word" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
      <I18nProvider>
        <TooltipProvider delayDuration={200}>
          <Toaster />
          <Sonner position="top-center" richColors />
          <AppContent />
        </TooltipProvider>
      </I18nProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
