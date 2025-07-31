import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Activity } from 'lucide-react';

interface StatusCardProps {
  vehiclePlate: string;
  currentOperation: {
    name: string;
  } | null;
  elapsedTime: string;
}

export default function StatusCard({ vehiclePlate, currentOperation, elapsedTime }: StatusCardProps) {
  return (
    <Card className="p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Status Operacional</h3>
        {vehiclePlate && (
          <Badge variant="outline" className="font-mono text-sm">
            {vehiclePlate}
          </Badge>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${
            currentOperation ? 'bg-primary' : 'bg-muted-foreground'
          }`} />
          <span className="text-base font-medium">
            {currentOperation ? currentOperation.name : 'Inativo'}
          </span>
        </div>

        {currentOperation && (
          <div className="bg-primary/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Em andamento</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-2xl font-mono font-bold text-primary">
                {elapsedTime}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}