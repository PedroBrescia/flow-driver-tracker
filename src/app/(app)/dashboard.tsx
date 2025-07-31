import { useAppState } from '@/hooks/useAppState';
import StatusCard from '@/components/StatusCard';
import LocationCard from '@/components/LocationCard';
import OperationalButtons from '@/components/OperationalButtons';
import OperationHistory from '@/components/OperationHistory';
import SyncSection from '@/components/SyncSection';

export default function DashboardPage() {
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
    handleButtonPress,
    syncData
  } = useAppState();

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Status Cards Row - Improved for tablet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
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

      {/* Operational Controls - Enhanced grid for tablet */}
      <OperationalButtons 
        buttons={operationalButtons}
        activeButton={activeButton}
        elapsedTime={elapsedTime}
        onButtonPress={handleButtonPress}
      />

      {/* Bottom section - Side by side on tablet */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        {/* Operation History takes more space */}
        <div className="xl:col-span-2">
          <OperationHistory history={operationHistory} />
        </div>
        
        {/* Sync section on the side for tablet */}
        <div className="xl:col-span-1">
          <SyncSection onSync={syncData} />
        </div>
      </div>
    </div>
  );
}