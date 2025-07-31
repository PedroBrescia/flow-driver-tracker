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
    <Card className="p-6 lg:p-8 shadow-md">
      <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-6 lg:mb-8">Histórico do Turno</h3>
      
      {history.length === 0 ? (
        <div className="text-center py-8 lg:py-12">
          <Clock className="w-12 h-12 lg:w-16 lg:h-16 text-muted-foreground mx-auto mb-3 lg:mb-4" />
          <p className="text-muted-foreground text-base lg:text-lg">
            Nenhum histórico de operação para este turno.
          </p>
        </div>
      ) : (
        <div className="space-y-3 lg:space-y-4 max-h-64 lg:max-h-80 overflow-y-auto">
          {history.map((operation, index) => (
            <div 
              key={operation.id || index} 
              className="flex items-center justify-between p-4 lg:p-6 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 lg:gap-4">
                <div className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full ${
                  operation.status === 'synced' ? 'bg-success' : 'bg-warning'
                }`} />
                <div>
                  <p className="font-medium text-sm lg:text-base">{operation.name}</p>
                  <div className="flex items-center gap-4 text-xs lg:text-sm text-muted-foreground">
                    <span>Duração: {operation.duration}</span>
                    <span>Fim: {operation.endTime ? formatTime(operation.endTime) : 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge 
                  variant={operation.status === 'synced' ? "default" : "secondary"}
                  className={`text-xs lg:text-sm ${
                    operation.status === 'synced' 
                      ? 'bg-success text-success-foreground' 
                      : 'bg-warning text-warning-foreground'
                  }`}
                >
                  {operation.status === 'synced' ? (
                    <>
                      <Check className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                      <span className="hidden sm:inline">Sincronizado</span>
                      <span className="sm:hidden">Sync</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                      <span className="hidden sm:inline">Pendente</span>
                      <span className="sm:hidden">Pend</span>
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