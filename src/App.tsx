
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import UniversityResult from "./pages/UniversityResult";
// import WhatsAppGenerator from "./pages/WhatsAppGenerator";
// import InstagramGenerator from "./pages/InstagramGenerator";
import TwitterGenerator from "./pages/TwitterGenerator";
import ExcelGenerator from "./pages/ExcelGenerator";
import NotFound from "./pages/NotFound";
import CertificateGenerator from "./pages/CertificateGenerator";
import LinkedInGenerator from "./pages/LinkedInGenerator";
import PortfolioGenerator from "./pages/PortfolioGenerator";
import CustomizeResults from "./pages/CustomizeResults";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/university/:universityId" element={<UniversityResult />} />
            {/* <Route path="/whatsapp-generator" element={<WhatsAppGenerator />} /> */}
            {/* <Route path="/instagram-generator" element={<InstagramGenerator />} /> */}
            <Route path="/twitter-generator" element={<TwitterGenerator />} />
            <Route path="/linkedin-generator" element={<LinkedInGenerator />} />
            <Route path="/portfolio-generator" element={<PortfolioGenerator />} />
            <Route path="/certificate-generator" element={<CertificateGenerator />} />
            <Route path="/excel-generator" element={<ExcelGenerator />} />
            <Route path="/customize-results" element={<CustomizeResults />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
