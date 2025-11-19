import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ReviewFormProps {
  businessId: string;
  onSuccess: () => void;
}

export const ReviewForm = ({ businessId, onSuccess }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        variant: "destructive",
        title: "Avaliação incompleta",
        description: "Por favor, selecione uma nota de 1 a 5 estrelas.",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Você precisa estar logado para avaliar.",
        });
        return;
      }

      const { error } = await supabase.from("reviews").insert({
        business_id: businessId,
        user_id: user.id,
        rating,
        comment: comment.trim(),
      });

      if (error) throw error;

      toast({
        title: "Avaliação enviada!",
        description: "Obrigado pelo seu feedback.",
      });

      setRating(0);
      setComment("");
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar avaliação",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-lg bg-card">
      <div className="space-y-2">
        <Label>Sua Avaliação</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoveredRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Comentário</Label>
        <Textarea
          id="comment"
          placeholder="Compartilhe sua experiência..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          minLength={10}
          maxLength={500}
          className="min-h-[100px]"
        />
        <p className="text-sm text-muted-foreground">
          {comment.length}/500 caracteres
        </p>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Enviando..." : "Enviar Avaliação"}
      </Button>
    </form>
  );
};
