import { Button } from '@/components/ui/button';
import { LogOut, RefreshCw } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';
import StatusCard from './StatusCard';
import LocationCard from './LocationCard';
import OperationalButtons from './OperationalButtons';
import OperationHistory from './OperationHistory';

export default function Dashboard() {
  const {
    location,
    errorMsg,
    operationalButtons,
    activeButton,
    currentOperation,
    operationHistory,
    vehiclePlate,
    isWaitingForLocation,
    elapsedTime,
    handleLogout,
    handleButtonPress,
    syncData
  } = useAppState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-sm border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">P</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">PipeFlow Operations</h1>
                <p className="text-sm text-muted-foreground">Rastreamento Operacional</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Status Cards Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatusCard 
            vehiclePlate={vehiclePlate}
            currentOperation={currentOperation}
            elapsedTime={elapsedTime}
          />
          <LocationCard 
            location={location}
            isWaitingForLocation={isWaitingForLocation}
            errorMsg={errorMsg}
          />
        </div>

        {/* Operational Controls */}
        <OperationalButtons 
          buttons={operationalButtons}
          activeButton={activeButton}
          elapsedTime={elapsedTime}
          onButtonPress={handleButtonPress}
        />

        {/* Operation History */}
        <OperationHistory history={operationHistory} />

        {/* Sync Button */}
        <div className="flex justify-center">
          <Button 
            onClick={syncData} 
            size="lg"
            className="min-w-48 shadow-lg"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Sincronizar Dados
          </Button>
        </div>
      </main>
    </div>
  );
}