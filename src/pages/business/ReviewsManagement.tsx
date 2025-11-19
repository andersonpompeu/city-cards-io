import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BusinessLayout } from "@/components/business/BusinessLayout";
import { useBusinessAuth } from "@/hooks/useBusinessAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ReviewsManagement() {
  const { business } = useBusinessAuth();
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");
  const queryClient = useQueryClient();

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["business-reviews", business?.id],
    queryFn: async () => {
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("*, profiles(full_name, avatar_url)")
        .eq("business_id", business?.id)
        .order("created_at", { ascending: false });

      // Get responses for each review
      const reviewIds = reviewsData?.map((r) => r.id) || [];
      const { data: responses } = await supabase
        .from("review_responses")
        .select("*")
        .in("review_id", reviewIds);

      return reviewsData?.map((review) => ({
        ...review,
        response: responses?.find((r) => r.review_id === review.id),
      }));
    },
    enabled: !!business?.id,
  });

  const respondMutation = useMutation({
    mutationFn: async ({ reviewId, text }: { reviewId: string; text: string }) => {
      const { error } = await supabase.from("review_responses").insert([
        {
          review_id: reviewId,
          business_id: business?.id,
          response_text: text,
        },
      ]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-reviews"] });
      toast.success("Resposta enviada!");
      setRespondingTo(null);
      setResponseText("");
    },
  });

  const handleRespond = (reviewId: string) => {
    if (!responseText.trim()) {
      toast.error("Digite uma resposta");
      return;
    }
    respondMutation.mutate({ reviewId, text: responseText });
  };

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Avaliações</h1>
          <p className="text-muted-foreground">Gerencie as avaliações da sua empresa</p>
        </div>

        {isLoading ? (
          <p>Carregando...</p>
        ) : reviews?.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhuma avaliação ainda</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews?.map((review: any) => (
              <Card key={review.id}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={review.profiles?.avatar_url} />
                      <AvatarFallback>
                        {review.profiles?.full_name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{review.profiles?.full_name || "Usuário"}</span>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(review.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </span>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-foreground">{review.comment}</p>

                      {review.response ? (
                        <div className="mt-4 p-4 bg-accent rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-primary">
                              Resposta do Proprietário
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(review.response.created_at), "dd/MM/yyyy")}
                            </span>
                          </div>
                          <p className="text-sm">{review.response.response_text}</p>
                        </div>
                      ) : respondingTo === review.id ? (
                        <div className="mt-4 space-y-2">
                          <Textarea
                            placeholder="Digite sua resposta..."
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleRespond(review.id)}
                              disabled={respondMutation.isPending}
                            >
                              {respondMutation.isPending ? "Enviando..." : "Enviar Resposta"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setRespondingTo(null);
                                setResponseText("");
                              }}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-4"
                          onClick={() => setRespondingTo(review.id)}
                        >
                          Responder
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </BusinessLayout>
  );
}
