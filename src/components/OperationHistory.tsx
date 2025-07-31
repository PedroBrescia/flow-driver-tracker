import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Check, AlertCircle } from 'lucide-react';

interface Operation {
  id: string;
  name: string;
  startTime: number;
  endTime?: number;
  duration?: string;
  status: 'pending' | 'synced';
}

interface OperationHistoryProps {
  history: Operation[];
}

export default function OperationHistory({ history }: OperationHistoryProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR');
  };

  return (
    <Card className="p-6 shadow-md">
      <h3 className="text-lg font-semibold text-foreground mb-6">Histórico do Turno</h3>
      
      {history.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            Nenhum histórico de operação para este turno.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {history.map((operation, index) => (
            <div 
              key={operation.id || index} 
              className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  operation.status === 'synced' ? 'bg-success' : 'bg-warning'
                }`} />
                <div>
                  <p className="font-medium text-sm">{operation.name}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Duração: {operation.duration}</span>
                    <span>Fim: {operation.endTime ? formatTime(operation.endTime) : 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge 
                  variant={operation.status === 'synced' ? "default" : "secondary"}
                  className={`text-xs ${
                    operation.status === 'synced' 
                      ? 'bg-success text-success-foreground' 
                      : 'bg-warning text-warning-foreground'
                  }`}
                >
                  {operation.status === 'synced' ? (
                    <>
                      <Check className="w-3 h-3 mr-1" />
                      Sincronizado
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Pendente
                    </>
                  )}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}