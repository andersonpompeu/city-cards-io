import { ReactNode } from "react";
import { BusinessSidebar } from "./BusinessSidebar";
import { BusinessHeader } from "./BusinessHeader";
import { useBusinessAuth } from "@/hooks/useBusinessAuth";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface BusinessLayoutProps {
  children: ReactNode;
}

export const BusinessLayout = ({ children }: BusinessLayoutProps) => {
  const { user, loading, isBusinessOwner, business } = useBusinessAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isBusinessOwner || !business) {
    return <Navigate to="/empresa/login" replace />;
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      <BusinessSidebar />
      <div className="flex-1 flex flex-col">
        <BusinessHeader />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
