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
    <Card className="p-6 lg:p-8 shadow-md">
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <h3 className="text-lg lg:text-xl font-semibold text-foreground">Localização GPS</h3>
        <div className="flex items-center gap-2">
          {location ? (
            <Wifi className="w-4 h-4 lg:w-5 lg:h-5 text-success" />
          ) : (
            <WifiOff className="w-4 h-4 lg:w-5 lg:h-5 text-destructive" />
          )}
          <Badge 
            variant={location ? "default" : "destructive"}
            className={`text-xs lg:text-sm px-2 lg:px-3 py-1 ${location ? "bg-success" : ""}`}
          >
            {isWaitingForLocation ? 'Aguardando...' : (location ? 'GPS Ativo' : 'GPS Inativo')}
          </Badge>
        </div>
      </div>

      <div className="space-y-3 lg:space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <p className="text-sm lg:text-base font-medium text-muted-foreground">Latitude</p>
            <p className="text-sm lg:text-base font-mono">
              {location ? formatCoordinate(location.latitude, 'lat') : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm lg:text-base font-medium text-muted-foreground">Longitude</p>
            <p className="text-sm lg:text-base font-mono">
              {location ? formatCoordinate(location.longitude, 'lng') : 'N/A'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <p className="text-sm lg:text-base font-medium text-muted-foreground">Precisão</p>
            <p className="text-sm lg:text-base">
              {location ? `±${location.accuracy.toFixed(0)}m` : 'N/A'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
            <div>
              <p className="text-sm lg:text-base font-medium text-muted-foreground">Última atualização</p>
              <p className="text-xs lg:text-sm">
                {location ? formatTime(location.timestamp) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-destructive/10 text-destructive p-3 lg:p-4 rounded-lg text-sm lg:text-base">
            <MapPin className="w-4 h-4 lg:w-5 lg:h-5 inline mr-2" />
            {errorMsg}
          </div>
        )}
      </div>
    </Card>
  );
}