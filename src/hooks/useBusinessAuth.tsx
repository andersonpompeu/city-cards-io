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
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Check if user is business owner
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "business_owner")
          .single();
        
        setIsBusinessOwner(!!roles);
        
        // Get user's business
        if (roles) {
          const { data: businessData } = await supabase
            .from("businesses")
            .select("id, name, status")
            .eq("owner_id", session.user.id)
            .single();
          
          setBusiness(businessData);
        }
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "business_owner")
          .single();
        
        setIsBusinessOwner(!!roles);
        
        if (roles) {
          const { data: businessData } = await supabase
            .from("businesses")
            .select("id, name, status")
            .eq("owner_id", session.user.id)
            .single();
          
          setBusiness(businessData);
        }
      } else {
        setIsBusinessOwner(false);
        setBusiness(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/empresa/login");
    toast.success("Logout realizado com sucesso");
  };

  return { user, loading, isBusinessOwner, business, signOut };
};
