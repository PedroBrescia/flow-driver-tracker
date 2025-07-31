import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppState } from '@/hooks/useAppState';

interface OperationalButton {
  id: string;
  name: string;
  visible: boolean;
}

interface OperationalButtonsProps {
  buttons: OperationalButton[];
  activeButton: string | null;
  elapsedTime: string;
  onButtonPress: (buttonId: string) => void;
}

export default function OperationalButtons({ 
  buttons, 
  activeButton, 
  elapsedTime, 
  onButtonPress 
}: OperationalButtonsProps) {
  return (
    <Card className="p-6 shadow-md">
      <h3 className="text-lg font-semibold text-foreground mb-6">Controles Operacionais</h3>
      
      {/* Enhanced grid layout for better tablet experience */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3 lg:gap-4">
        {buttons.map((button) => (
          <Button
            key={button.id}
            variant={activeButton === button.id ? "operational_active" : "operational"}
            onClick={() => onButtonPress(button.id)}
            className="h-auto p-3 lg:p-4 flex flex-col items-center justify-center text-center min-h-[80px] lg:min-h-[100px] hover:shadow-md transition-all duration-200 text-xs lg:text-sm"
          >
            <span className="font-medium leading-tight mb-2 line-clamp-3 text-center">
              {button.name}
            </span>
            <span className="text-xs font-mono opacity-75 mt-auto">
              {activeButton === button.id ? elapsedTime : '00:00'}
            </span>
          </Button>
        ))}
      </div>
    </Card>
  );
}