import { Truck } from "lucide-react";

const AppLogo = () => (
  <div className="flex flex-col items-center justify-center mb-8">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center shadow-lg">
        <Truck className="w-6 h-6 text-primary-foreground" />
      </div>
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-primary">PipeFlow</h1>
        <p className="text-lg font-semibold text-muted-foreground -mt-1">Operations</p>
      </div>
    </div>
    <p className="text-sm text-muted-foreground text-center max-w-sm">
      Sistema de Rastreamento Operacional para Motoristas
    </p>
  </div>
);

export default AppLogo;