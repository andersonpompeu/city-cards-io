import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BusinessDetails from "./pages/BusinessDetails";
import AddBusiness from "./pages/AddBusiness";
import FAQ from "./pages/FAQ";

// Admin pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import BusinessList from "./pages/admin/BusinessList";
import BusinessForm from "./pages/admin/BusinessForm";
import CategoriesList from "./pages/admin/CategoriesList";
import BusinessUsersList from "./pages/admin/BusinessUsersList";
import AdminSettings from "./pages/admin/Settings";
import AdminSeoSettings from "./pages/admin/SeoSettings";
import AdminSeoAudit from "./pages/admin/SeoAudit";
import HighlightsList from "./pages/admin/HighlightsList";

// Business pages
import BusinessLogin from "./pages/business/Login";
import BusinessDashboard from "./pages/business/Dashboard";
import ProfileEdit from "./pages/business/ProfileEdit";
import ReviewsManagement from "./pages/business/ReviewsManagement";
import SecuritySettings from "./pages/business/SecuritySettings";
import Statistics from "./pages/business/Statistics";
import RequestHighlight from "./pages/business/RequestHighlight";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/empresa/:slug" element={<BusinessDetails />} />
          <Route path="/cadastrar" element={<AddBusiness />} />
          <Route path="/adicionar" element={<AddBusiness />} />
          <Route path="/faq" element={<FAQ />} />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/empresas" element={<BusinessList />} />
          <Route path="/admin/empresas/nova" element={<BusinessForm />} />
          <Route path="/admin/empresas/:id/editar" element={<BusinessForm />} />
          <Route path="/admin/anuncios" element={<HighlightsList />} />
          <Route path="/admin/categorias" element={<CategoriesList />} />
          <Route path="/admin/usuarios" element={<BusinessUsersList />} />
          <Route path="/admin/configuracoes" element={<AdminSettings />} />
          <Route path="/admin/seo" element={<AdminSeoSettings />} />
          <Route path="/admin/seo/auditoria" element={<AdminSeoAudit />} />
          
          {/* Business owner routes */}
          <Route path="/empresa/login" element={<BusinessLogin />} />
          <Route path="/empresa/dashboard" element={<BusinessDashboard />} />
          <Route path="/empresa/perfil" element={<ProfileEdit />} />
          <Route path="/empresa/destaque" element={<RequestHighlight />} />
          <Route path="/empresa/avaliacoes" element={<ReviewsManagement />} />
          <Route path="/empresa/senha" element={<SecuritySettings />} />
          <Route path="/empresa/estatisticas" element={<Statistics />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
