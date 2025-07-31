import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wifi, Clock } from 'lucide-react';

interface SyncSectionProps {
  onSync: () => Promise<void>;
}

export default function SyncSection({ onSync }: SyncSectionProps) {
  return (
    <Card className="p-6 shadow-md h-fit">
      <div className="space-y-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <Wifi className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Sincronização de Dados
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Sincronize suas operações e localização com o servidor
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Sincronização automática a cada 5 minutos</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="w-4 h-4" />
            <span>Dados são salvos localmente até a sincronização</span>
          </div>
        </div>

        <Button 
          onClick={onSync} 
          className="w-full h-12 text-base font-semibold shadow-md"
          size="lg"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Sincronizar Agora
        </Button>
      </div>
    </Card>
  );
}