export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ads_highlight: {
        Row: {
          badge_color: string | null
          border_color: string | null
          business_id: string
          created_at: string | null
          created_by: string | null
          end_date: string
          id: string
          level: Database["public"]["Enums"]["highlight_level"]
          manual_order: number | null
          notes: string | null
          pin_to_top: boolean | null
          request_notes: string | null
          start_date: string
          status: Database["public"]["Enums"]["highlight_status"]
          updated_at: string | null
        }
        Insert: {
          badge_color?: string | null
          border_color?: string | null
          business_id: string
          created_at?: string | null
          created_by?: string | null
          end_date: string
          id?: string
          level?: Database["public"]["Enums"]["highlight_level"]
          manual_order?: number | null
          notes?: string | null
          pin_to_top?: boolean | null
          request_notes?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["highlight_status"]
          updated_at?: string | null
        }
        Update: {
          badge_color?: string | null
          border_color?: string | null
          business_id?: string
          created_at?: string | null
          created_by?: string | null
          end_date?: string
          id?: string
          level?: Database["public"]["Enums"]["highlight_level"]
          manual_order?: number | null
          notes?: string | null
          pin_to_top?: boolean | null
          request_notes?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["highlight_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ads_highlight_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      ads_settings: {
        Row: {
          alto_color: string | null
          auto_expire_enabled: boolean | null
          created_at: string | null
          default_duration_days: number | null
          id: string
          max_active_highlights: number | null
          padrao_color: string | null
          premium_color: string | null
          updated_at: string | null
        }
        Insert: {
          alto_color?: string | null
          auto_expire_enabled?: boolean | null
          created_at?: string | null
          default_duration_days?: number | null
          id?: string
          max_active_highlights?: number | null
          padrao_color?: string | null
          premium_color?: string | null
          updated_at?: string | null
        }
        Update: {
          alto_color?: string | null
          auto_expire_enabled?: boolean | null
          created_at?: string | null
          default_duration_days?: number | null
          id?: string
          max_active_highlights?: number | null
          padrao_color?: string | null
          premium_color?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      business_analytics: {
        Row: {
          business_id: string
          created_at: string
          event_type: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          business_id: string
          created_at?: string
          event_type: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_analytics_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          address: string
          address_locality: string | null
          address_region: string | null
          approved_at: string | null
          approved_by: string | null
          category: string
          created_at: string
          description: string
          email: string | null
          founding_date: string | null
          gallery_images: string[] | null
          id: string
          image: string
          keywords: string[] | null
          latitude: number | null
          long_description: string | null
          longitude: number | null
          meta_description: string | null
          name: string
          neighborhood: string | null
          opening_hours: string[] | null
          owner_id: string | null
          phone: string
          postal_code: string | null
          price_range: string | null
          rating: number | null
          rejection_reason: string | null
          slug: string | null
          status: string | null
          street_address: string | null
          updated_at: string
          views_count: number | null
          website: string | null
        }
        Insert: {
          address: string
          address_locality?: string | null
          address_region?: string | null
          approved_at?: string | null
          approved_by?: string | null
          category: string
          created_at?: string
          description: string
          email?: string | null
          founding_date?: string | null
          gallery_images?: string[] | null
          id: string
          image: string
          keywords?: string[] | null
          latitude?: number | null
          long_description?: string | null
          longitude?: number | null
          meta_description?: string | null
          name: string
          neighborhood?: string | null
          opening_hours?: string[] | null
          owner_id?: string | null
          phone: string
          postal_code?: string | null
          price_range?: string | null
          rating?: number | null
          rejection_reason?: string | null
          slug?: string | null
          status?: string | null
          street_address?: string | null
          updated_at?: string
          views_count?: number | null
          website?: string | null
        }
        Update: {
          address?: string
          address_locality?: string | null
          address_region?: string | null
          approved_at?: string | null
          approved_by?: string | null
          category?: string
          created_at?: string
          description?: string
          email?: string | null
          founding_date?: string | null
          gallery_images?: string[] | null
          id?: string
          image?: string
          keywords?: string[] | null
          latitude?: number | null
          long_description?: string | null
          longitude?: number | null
          meta_description?: string | null
          name?: string
          neighborhood?: string | null
          opening_hours?: string[] | null
          owner_id?: string | null
          phone?: string
          postal_code?: string | null
          price_range?: string | null
          rating?: number | null
          rejection_reason?: string | null
          slug?: string | null
          status?: string | null
          street_address?: string | null
          updated_at?: string
          views_count?: number | null
          website?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          long_description: string | null
          meta_description: string | null
          meta_title: string | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          long_description?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          long_description?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      review_responses: {
        Row: {
          business_id: string
          created_at: string | null
          id: string
          response_text: string
          review_id: string
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          id?: string
          response_text: string
          review_id: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          id?: string
          response_text?: string
          review_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review_responses_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_responses_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: true
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          business_id: string
          comment: string
          created_at: string
          id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          business_id: string
          comment: string
          created_at?: string
          id?: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          business_id?: string
          comment?: string
          created_at?: string
          id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      expire_old_highlights: { Args: never; Returns: undefined }
      generate_slug: { Args: { id: string; name: string }; Returns: string }
      get_business_analytics_stats: {
        Args: {
          p_business_id: string
          p_end_date?: string
          p_start_date?: string
        }
        Returns: {
          count: number
          event_type: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "business_owner" | "user"
      highlight_level: "premium" | "alto" | "padrao"
      highlight_status:
        | "ativo"
        | "expirado"
        | "pausado"
        | "aguardando_aprovacao"
        | "rejeitado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "business_owner", "user"],
      highlight_level: ["premium", "alto", "padrao"],
      highlight_status: [
        "ativo",
        "expirado",
        "pausado",
        "aguardando_aprovacao",
        "rejeitado",
      ],
    },
  },
} as const
