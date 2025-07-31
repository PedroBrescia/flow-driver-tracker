import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Wifi, WifiOff } from 'lucide-react';

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface LocationCardProps {
  location: Location | null;
  isWaitingForLocation: boolean;
  errorMsg: string | null;
}

export default function LocationCard({ location, isWaitingForLocation, errorMsg }: LocationCardProps) {
  const formatCoordinate = (coord: number, type: 'lat' | 'lng') => {
    const direction = type === 'lat' ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W');
    return `${Math.abs(coord).toFixed(6)}° ${direction}`;
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR');
  };

  return (
    <Card className="p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Localização GPS</h3>
        <div className="flex items-center gap-2">
          {location ? (
            <Wifi className="w-4 h-4 text-success" />
          ) : (
            <WifiOff className="w-4 h-4 text-destructive" />
          )}
          <Badge 
            variant={location ? "default" : "destructive"}
            className={location ? "bg-success" : ""}
          >
            {isWaitingForLocation ? 'Aguardando...' : (location ? 'GPS Ativo' : 'GPS Inativo')}
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Latitude</p>
            <p className="text-sm font-mono">
              {location ? formatCoordinate(location.latitude, 'lat') : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Longitude</p>
            <p className="text-sm font-mono">
              {location ? formatCoordinate(location.longitude, 'lng') : 'N/A'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Precisão</p>
            <p className="text-sm">
              {location ? `±${location.accuracy.toFixed(0)}m` : 'N/A'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Última atualização</p>
              <p className="text-xs">
                {location ? formatTime(location.timestamp) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm">
            <MapPin className="w-4 h-4 inline mr-2" />
            {errorMsg}
          </div>
        )}
      </div>
    </Card>
  );
}