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
    <Card className="p-6 lg:p-8 shadow-md">
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <h3 className="text-lg lg:text-xl font-semibold text-foreground">Status Operacional</h3>
        {vehiclePlate && (
          <Badge variant="outline" className="font-mono text-sm lg:text-base px-3 py-1">
            {vehiclePlate}
          </Badge>
        )}
      </div>

      <div className="space-y-4 lg:space-y-6">
        <div className="flex items-center gap-3 lg:gap-4">
          <div className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full ${
            currentOperation ? 'bg-primary' : 'bg-muted-foreground'
          }`} />
          <span className="text-base lg:text-lg font-medium">
            {currentOperation ? currentOperation.name : 'Inativo'}
          </span>
        </div>

        {currentOperation && (
          <div className="bg-primary/10 rounded-lg p-4 lg:p-6">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
              <span className="text-sm lg:text-base font-medium text-primary">Em andamento</span>
            </div>
            <div className="flex items-center gap-2 lg:gap-3">
              <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
              <span className="text-2xl lg:text-4xl font-mono font-bold text-primary">
                {elapsedTime}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}