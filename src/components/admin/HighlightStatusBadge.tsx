import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, Pause, AlertCircle } from "lucide-react";

interface HighlightStatusBadgeProps {
  status: 'ativo' | 'expirado' | 'pausado' | 'aguardando_aprovacao' | 'rejeitado';
}

export const HighlightStatusBadge = ({ status }: HighlightStatusBadgeProps) => {
  const config = {
    ativo: {
      label: 'Ativo',
      icon: CheckCircle,
      className: 'bg-green-100 text-green-800 border-green-200',
    },
    expirado: {
      label: 'Expirado',
      icon: Clock,
      className: 'bg-gray-100 text-gray-800 border-gray-200',
    },
    pausado: {
      label: 'Pausado',
      icon: Pause,
      className: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    aguardando_aprovacao: {
      label: 'Aguardando',
      icon: AlertCircle,
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
    rejeitado: {
      label: 'Rejeitado',
      icon: XCircle,
      className: 'bg-red-100 text-red-800 border-red-200',
    },
  };
  
  const { label, icon: Icon, className } = config[status];
  
  return (
    <Badge variant="outline" className={className}>
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </Badge>
  );
};
