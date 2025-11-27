import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Business {
  id: string;
  name: string;
  status: string;
}

export const useBusinessAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBusinessOwner, setIsBusinessOwner] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for auth changes FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Use setTimeout to avoid deadlock
        setTimeout(() => {
          fetchUserRoleAndBusiness(session.user.id);
        }, 0);
      } else {
        setIsBusinessOwner(false);
        setBusiness(null);
      }
    });

    // THEN get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserRoleAndBusiness(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRoleAndBusiness = async (userId: string) => {
    try {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "business_owner")
        .maybeSingle();
      
      setIsBusinessOwner(!!roles);
      
      if (roles) {
        const { data: businessData } = await supabase
          .from("businesses")
          .select("id, name, status")
          .eq("owner_id", userId)
          .maybeSingle();
        
        setBusiness(businessData);
      }
    } catch (error) {
      console.error("Error fetching user role and business:", error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/empresa/login");
    toast.success("Logout realizado com sucesso");
  };

  return { user, loading, isBusinessOwner, business, signOut };
};
