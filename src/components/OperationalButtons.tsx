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
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {buttons.map((button) => (
          <Button
            key={button.id}
            variant={activeButton === button.id ? "operational_active" : "operational"}
            onClick={() => onButtonPress(button.id)}
            className="h-auto p-3 flex flex-col items-center justify-center text-center min-h-[80px] hover:shadow-md transition-all duration-200"
          >
            <span className="text-xs font-medium leading-tight mb-2 line-clamp-2">
              {button.name}
            </span>
            <span className="text-xs font-mono opacity-75">
              {activeButton === button.id ? elapsedTime : '00:00'}
            </span>
          </Button>
        ))}
      </div>
    </Card>
  );
}