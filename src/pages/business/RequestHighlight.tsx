import { BusinessLayout } from "@/components/business/BusinessLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useBusinessHighlight } from "@/hooks/useBusinessHighlight";
import { useBusinessAuth } from "@/hooks/useBusinessAuth";
import { HighlightLevelBadge } from "@/components/admin/HighlightLevelBadge";
import { HighlightStatusBadge } from "@/components/admin/HighlightStatusBadge";
import { Flame, Star, Sparkles, TrendingUp, Eye, Target, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { HighlightLevel } from "@/types/highlight";

export default function RequestHighlight() {
  const { business } = useBusinessAuth();
  const { highlight, hasActiveHighlight, hasPendingRequest, requestHighlight, isRequesting } = useBusinessHighlight(business?.id || '');
  const [selectedLevel, setSelectedLevel] = useState<HighlightLevel>('padrao');
  const [duration, setDuration] = useState(30);
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    requestHighlight({
      level: selectedLevel,
      duration_days: duration,
      notes: notes.trim() || undefined,
    });
  };

  const plans = [
    {
      level: 'premium' as HighlightLevel,
      title: 'Premium',
      price: 'R$ 299/mês',
      icon: Flame,
      color: '#FFD700',
      features: [
        '1º lugar garantido',
        'Destaque máximo',
        'Badge dourado',
        'Visibilidade premium',
      ],
    },
    {
      level: 'alto' as HighlightLevel,
      title: 'Alto',
      price: 'R$ 199/mês',
      icon: Star,
      color: '#3B82F6',
      features: [
        'Top 3 posições',
        'Destaque visual acentuado',
        'Badge azul',
        'Alta visibilidade',
      ],
    },
    {
      level: 'padrao' as HighlightLevel,
      title: 'Padrão',
      price: 'R$ 99/mês',
      icon: Sparkles,
      color: '#10B981',
      features: [
        'Top 10 posições',
        'Destaque visual básico',
        'Badge verde',
        'Boa visibilidade',
      ],
    },
  ];

  if (hasActiveHighlight && highlight) {
    const daysRemaining = differenceInDays(new Date(highlight.end_date), new Date());
    
    return (
      <BusinessLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Destaque Ativo</h1>
            <p className="text-muted-foreground">Seu anúncio está em destaque</p>
          </div>

          <Card className="border-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  Seu Anúncio Está Ativo!
                </CardTitle>
                <HighlightStatusBadge status={highlight.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Nível</Label>
                  <div className="mt-1">
                    <HighlightLevelBadge level={highlight.level} />
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Período</Label>
                  <div className="text-sm mt-1">
                    {format(new Date(highlight.start_date), 'dd/MM/yyyy', { locale: ptBR })} até {format(new Date(highlight.end_date), 'dd/MM/yyyy', { locale: ptBR })}
                  </div>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {daysRemaining > 0 ? `${daysRemaining} dias restantes` : 'Expira hoje'}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Seu destaque expira em {format(new Date(highlight.end_date), "dd 'de' MMMM", { locale: ptBR })}
                </p>
              </div>

              <Button disabled className="w-full">
                Renovar Destaque (em breve)
              </Button>
            </CardContent>
          </Card>
        </div>
      </BusinessLayout>
    );
  }

  if (hasPendingRequest && highlight) {
    return (
      <BusinessLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Solicitação em Análise</h1>
            <p className="text-muted-foreground">Aguardando aprovação do administrador</p>
          </div>

          <Card className="border-yellow-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-6 w-6 text-yellow-600" />
                  Solicitação Pendente
                </CardTitle>
                <HighlightStatusBadge status={highlight.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Seu pedido de destaque está sendo analisado pela nossa equipe. 
                  Você receberá uma notificação assim que for aprovado.
                </p>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Nível Solicitado</Label>
                  <div className="mt-1">
                    <HighlightLevelBadge level={highlight.level} />
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Solicitado em</Label>
                  <div className="text-sm mt-1">
                    {format(new Date(highlight.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </div>
                </div>
              </div>

              {highlight.request_notes && (
                <div>
                  <Label className="text-muted-foreground">Suas Observações</Label>
                  <p className="text-sm mt-1">{highlight.request_notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </BusinessLayout>
    );
  }

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Solicitar Destaque</h1>
          <p className="text-muted-foreground">Aumente sua visibilidade na plataforma</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Apareça no Topo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Sua empresa aparece nas primeiras posições da listagem
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Eye className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Mais Visualizações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Aumente significativamente o número de pessoas que veem seu negócio
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Target className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Alcance Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Converta mais visualizações em clientes reais
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Escolha seu Plano</CardTitle>
            <CardDescription>Selecione o nível de destaque ideal para sua empresa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={selectedLevel} onValueChange={(value) => setSelectedLevel(value as HighlightLevel)}>
              <div className="grid gap-4 md:grid-cols-3">
                {plans.map((plan) => (
                  <Label
                    key={plan.level}
                    htmlFor={plan.level}
                    className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                      selectedLevel === plan.level ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    <RadioGroupItem value={plan.level} id={plan.level} className="sr-only" />
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <plan.icon className="h-8 w-8" style={{ color: plan.color }} />
                        {selectedLevel === plan.level && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-lg">{plan.title}</div>
                        <div className="text-sm text-muted-foreground">{plan.price}</div>
                      </div>
                      <ul className="space-y-1">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Label>
                ))}
              </div>
            </RadioGroup>

            <div>
              <Label htmlFor="duration">Duração</Label>
              <RadioGroup value={String(duration)} onValueChange={(value) => setDuration(Number(value))}>
                <div className="grid gap-2 grid-cols-2 md:grid-cols-4 mt-2">
                  <Label htmlFor="7" className={`cursor-pointer border rounded-lg p-3 text-center ${duration === 7 ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <RadioGroupItem value="7" id="7" className="sr-only" />
                    <div className="font-medium">7 dias</div>
                  </Label>
                  <Label htmlFor="15" className={`cursor-pointer border rounded-lg p-3 text-center ${duration === 15 ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <RadioGroupItem value="15" id="15" className="sr-only" />
                    <div className="font-medium">15 dias</div>
                  </Label>
                  <Label htmlFor="30" className={`cursor-pointer border rounded-lg p-3 text-center ${duration === 30 ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <RadioGroupItem value="30" id="30" className="sr-only" />
                    <div className="font-medium">30 dias</div>
                    <Badge variant="secondary" className="mt-1">Popular</Badge>
                  </Label>
                  <Label htmlFor="90" className={`cursor-pointer border rounded-lg p-3 text-center ${duration === 90 ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <RadioGroupItem value="90" id="90" className="sr-only" />
                    <div className="font-medium">90 dias</div>
                    <Badge variant="secondary" className="mt-1">Economia</Badge>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Conte-nos por que você merece destaque..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={300}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {notes.length}/300 caracteres
              </p>
            </div>

            <Button 
              onClick={handleSubmit} 
              disabled={isRequesting}
              className="w-full"
              size="lg"
            >
              {isRequesting ? 'Enviando...' : 'Enviar Solicitação'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </BusinessLayout>
  );
}
