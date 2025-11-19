import { Business } from "@/components/BusinessCard";

export type HighlightLevel = 'premium' | 'alto' | 'padrao';
export type HighlightStatus = 'ativo' | 'expirado' | 'pausado' | 'aguardando_aprovacao' | 'rejeitado';

export interface Highlight {
  id: string;
  business_id: string;
  level: HighlightLevel;
  start_date: string;
  end_date: string;
  status: HighlightStatus;
  manual_order: number | null;
  pin_to_top: boolean;
  badge_color: string;
  border_color: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  notes: string | null;
  request_notes: string | null;
}

export interface BusinessWithHighlight extends Business {
  highlight: Highlight | null;
}

export interface NewHighlight {
  business_id: string;
  level: HighlightLevel;
  start_date: string;
  end_date: string;
  status?: HighlightStatus;
  manual_order?: number | null;
  pin_to_top?: boolean;
  badge_color?: string;
  border_color?: string;
  notes?: string;
}

export interface HighlightRequest {
  level: HighlightLevel;
  duration_days: number;
  notes?: string;
}

export interface UpdateHighlight extends Partial<NewHighlight> {
  id: string;
}

export interface ApproveHighlight {
  id: string;
  updates?: Partial<NewHighlight>;
}

export interface RejectHighlight {
  id: string;
  reason: string;
}
