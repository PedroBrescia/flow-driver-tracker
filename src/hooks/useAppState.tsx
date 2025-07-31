import React, { createContext, useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

// Interfaces
interface Operation {
  id: string;
  name: string;
  startTime: number;
  endTime?: number;
  duration?: string;
  status: 'pending' | 'synced';
}

interface OperationalButton {
  id: string;
  name: string;
  visible: boolean;
}

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  heading?: number;
}

interface AppContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  location: Location | null;
  errorMsg: string | null;
  operationalButtons: OperationalButton[];
  activeButton: string | null;
  currentOperation: Operation | null;
  operationHistory: Operation[];
  vehiclePlate: string;
  isWaitingForLocation: boolean;
  elapsedTime: string;
  handleLogin: (cpf: string, password: string) => Promise<void>;
  handleLogout: () => Promise<void>;
  handleButtonPress: (buttonId: string) => Promise<void>;
  syncData: () => Promise<void>;
}

// Funções utilitárias
const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// Configurações e constantes
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const JWT_VALIDITY_HOURS = 12;
const GPS_RECORD_INTERVAL_MS = 15 * 1000; // 15 seconds
const GPS_RECORD_DISTANCE_METERS = 20;
const GPS_RECORD_ROTATION_DEGREES = 15;

// Botões operacionais padrão
const defaultButtons: OperationalButton[] = [
  { id: '1', name: 'Operando', visible: true },
  { id: '2', name: 'Deslocamento', visible: true },
  { id: '3', name: 'Carregamento', visible: true },
  { id: '4', name: 'Umectação', visible: true },
  { id: '5', name: 'Descarga', visible: true },
  { id: '6', name: 'Aguardando Apanhador de Água', visible: true },
  { id: '7', name: 'Abastecimento de Água', visible: true },
  { id: '8', name: 'Manutenção Corretiva', visible: true },
  { id: '9', name: 'Manutenção Preventiva', visible: true },
  { id: '10', name: 'Aguardando Orientação', visible: true },
  { id: '11', name: 'Disponível', visible: true },
  { id: '12', name: 'Indisponível', visible: true },
  { id: '13', name: 'Condições Climáticas Ruins', visible: true },
  { id: '14', name: 'Refeição', visible: true },
  { id: '15', name: 'CheckList', visible: true },
  { id: '16', name: 'Parada Particular', visible: true },
  { id: '17', name: 'Limpeza', visible: true }
];

// Criação do Contexto
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState<Location | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [operationalButtons, setOperationalButtons] = useState<OperationalButton[]>([]);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [currentOperation, setCurrentOperation] = useState<Operation | null>(null);
  const [operationHistory, setOperationHistory] = useState<Operation[]>([]);
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [isWaitingForLocation, setIsWaitingForLocation] = useState(false);
  const [elapsedTime, setElapsedTime] = useState('00:00');

  const { toast } = useToast();

  // Refs para timers e watchers
  const watchId = useRef<number | null>(null);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const elapsedTimeTimer = useRef<NodeJS.Timeout | null>(null);
  const lastRecordedCoords = useRef<Location | null>(null);
  const lastRecordedTime = useRef(0);
  const autoSyncTimerId = useRef<NodeJS.Timeout | null>(null);

  const syncData = useCallback(async () => {
    console.log('Sincronizando dados com o servidor (simulado)...');
    try {
      const storedEvents = localStorage.getItem('events');
      const storedLocations = localStorage.getItem('locations');
      const storedHistory = localStorage.getItem('operationHistory');

      let eventsToSync = storedEvents ? JSON.parse(storedEvents) : [];
      let locationsToSync = storedLocations ? JSON.parse(storedLocations) : [];
      let operationHistoryToSync = storedHistory ? JSON.parse(storedHistory) : [];

      const pendingEvents = eventsToSync.filter((event: any) => event.status === 'pending');
      const pendingLocations = locationsToSync.filter((loc: any) => loc.status === 'pending');
      const pendingOperationHistory = operationHistoryToSync.filter((op: any) => op.status === 'pending');

      if (pendingEvents.length > 0 || pendingLocations.length > 0 || pendingOperationHistory.length > 0) {
        // Simula a resposta de sucesso do backend
        eventsToSync = eventsToSync.map((event: any) => 
          event.status === 'pending' ? { ...event, status: 'synced' } : event
        );
        locationsToSync = locationsToSync.map((loc: any) => 
          loc.status === 'pending' ? { ...loc, status: 'synced' } : loc
        );
        operationHistoryToSync = operationHistoryToSync.map((op: any) => 
          op.status === 'pending' ? { ...op, status: 'synced' } : op
        );

        localStorage.setItem('events', JSON.stringify(eventsToSync));
        localStorage.setItem('locations', JSON.stringify(locationsToSync));
        localStorage.setItem('operationHistory', JSON.stringify(operationHistoryToSync));
        setOperationHistory(operationHistoryToSync);
        
        toast({
          title: "Sucesso",
          description: 'Sincronização concluída com sucesso!',
        });
      } else {
        toast({
          title: "Informação",
          description: 'Nenhum dado pendente para sincronização.',
        });
      }
    } catch (e) {
      console.error('Erro durante a sincronização (simulado):', e);
      toast({
        title: "Erro",
        description: 'Erro durante a sincronização. Tente novamente.',
        variant: "destructive",
      });
    }
  }, [toast]);

  const startAutoSync = useCallback(() => {
    if (autoSyncTimerId.current) {
      clearInterval(autoSyncTimerId.current);
    }
    autoSyncTimerId.current = setInterval(syncData, 5 * 60 * 1000); // A cada 5 minutos
    console.log('Sincronização automática iniciada.');
  }, [syncData]);

  const stopLocationTracking = useCallback(() => {
    if (watchId.current) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
      console.log('Rastreamento de localização parado.');
    }
  }, []);

  const startLocationTracking = useCallback(async () => {
    setIsWaitingForLocation(true);
    
    if (!navigator.geolocation) {
      setErrorMsg('Geolocalização não é suportada neste navegador.');
      toast({
        title: "Erro",
        description: 'Geolocalização não é suportada neste navegador.',
        variant: "destructive",
      });
      setIsWaitingForLocation(false);
      return;
    }

    stopLocationTracking();

    console.log('Iniciando rastreamento GPS...');

    const success = (position: GeolocationPosition) => {
      const now = Date.now();
      const newLocation: Location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: now,
        heading: position.coords.heading || undefined,
      };

      const timeElapsed = now - lastRecordedTime.current;
      const recordByTime = timeElapsed >= GPS_RECORD_INTERVAL_MS;

      let recordByDistance = false;
      let recordByRotation = false;

      if (lastRecordedCoords.current) {
        const distance = haversineDistance(
          lastRecordedCoords.current.latitude,
          lastRecordedCoords.current.longitude,
          newLocation.latitude,
          newLocation.longitude
        );
        recordByDistance = distance >= GPS_RECORD_DISTANCE_METERS;

        if (newLocation.heading !== undefined && lastRecordedCoords.current.heading !== undefined) {
          let rotationChange = Math.abs(newLocation.heading - lastRecordedCoords.current.heading);
          if (rotationChange > 180) rotationChange = 360 - rotationChange;
          recordByRotation = rotationChange >= GPS_RECORD_ROTATION_DEGREES;
        }
      }

      if (recordByTime || recordByDistance || recordByRotation || !lastRecordedCoords.current) {
        setLocation(newLocation);
        storeLocation(newLocation);
        lastRecordedCoords.current = newLocation;
        lastRecordedTime.current = now;
      }
      setIsWaitingForLocation(false);
    };

    const error = (err: GeolocationPositionError) => {
      console.error('Erro de geolocalização:', err);
      setErrorMsg(`Erro de GPS: ${err.message}`);
      setIsWaitingForLocation(false);
    };

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 1000
    };

    watchId.current = navigator.geolocation.watchPosition(success, error, options);
  }, [toast]);

  const handleLogout = useCallback(async () => {
    setIsLoggedIn(false);
    localStorage.clear();
    setCurrentOperation(null);
    setVehiclePlate('');
    stopLocationTracking();
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    if (elapsedTimeTimer.current) {
      clearTimeout(elapsedTimeTimer.current);
    }
    if (autoSyncTimerId.current) {
      clearInterval(autoSyncTimerId.current);
    }
    
    toast({
      title: "Logout",
      description: 'Logout realizado com sucesso.',
    });
    
    // Navigate to login after logout
    window.location.href = '/auth/login';
  }, [toast, stopLocationTracking]);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    inactivityTimer.current = setTimeout(handleLogout, INACTIVITY_TIMEOUT_MS);
  }, [handleLogout]);

  const loadInitialState = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedToken = localStorage.getItem('jwtToken');
      const tokenExpiration = localStorage.getItem('jwtExpiration');
      
      if (storedToken && tokenExpiration && Date.now() < parseInt(tokenExpiration)) {
        setIsLoggedIn(true);
        const storedCurrentOperation = localStorage.getItem('currentOperation');
        const storedOperationHistory = localStorage.getItem('operationHistory');
        const storedVehiclePlate = localStorage.getItem('vehiclePlate');

        if (storedCurrentOperation) {
          setCurrentOperation(JSON.parse(storedCurrentOperation));
        }
        if (storedOperationHistory) {
          setOperationHistory(JSON.parse(storedOperationHistory));
        }
        if (storedVehiclePlate) {
          setVehiclePlate(storedVehiclePlate);
        }
        setOperationalButtons(defaultButtons.filter(b => b.visible));
      }
    } catch (e) {
      console.error('Erro ao carregar dados iniciais:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const storeLocation = useCallback(async (loc: Location) => {
    const id = Date.now().toString();
    try {
      const storedLocations = localStorage.getItem('locations');
      const currentLocations = storedLocations ? JSON.parse(storedLocations) : [];
      currentLocations.push({
        id,
        timestamp: loc.timestamp,
        latitude: loc.latitude,
        longitude: loc.longitude,
        heading: loc.heading,
        status: 'pending'
      });
      localStorage.setItem('locations', JSON.stringify(currentLocations));
    } catch (e) {
      console.error('Erro ao salvar localização:', e);
    }
  }, []);

  const handleLogin = useCallback(async (cpf: string, password: string) => {
    const cleanedCpf = cpf.replace(/\D/g, '');
    
    toast({
      title: "Verificando",
      description: 'Verificando credenciais...',
    });

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let mockResponse;
      if (cleanedCpf === '12345678900' && password === 'senha123') {
        const imei = 'WEB_SIMULATED_IMEI_' + Date.now().toString().slice(-8);
        mockResponse = {
          success: true,
          message: 'Login bem-sucedido!',
          token: `mock_jwt_${Date.now()}`,
          expiration: Date.now() + (JWT_VALIDITY_HOURS * 60 * 60 * 1000),
          userData: {
            userId: 'motorista123',
            status: 'active',
            imei: imei,
            vehiclePlate: 'ABC1234',
            activeButtonIds: ['1', '2', '6', '7', '8', '9', '14', '15', '16'],
            customButtonDescriptions: [
              { id: '6', name: 'Aguardando Carga de Água' },
              { id: '14', name: 'Pausa para Almoço' }
            ]
          }
        };
      } else {
        mockResponse = {
          success: false,
          message: 'CPF ou senha inválidos ou usuário inativo.',
          token: null,
          expiration: null,
          userData: null
        };
      }

      if (mockResponse.success) {
        const { token, expiration, userData } = mockResponse;
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('jwtExpiration', expiration.toString());
        localStorage.setItem('vehiclePlate', userData.vehiclePlate);
        setVehiclePlate(userData.vehiclePlate);
        setIsLoggedIn(true);
        
        let filteredButtons = defaultButtons.filter(button => 
          userData.activeButtonIds.includes(button.id)
        );
        filteredButtons = filteredButtons.map(button => {
          const customDesc = userData.customButtonDescriptions.find(cb => cb.id === button.id);
          return customDesc ? { ...button, name: customDesc.name } : button;
        });
        setOperationalButtons(filteredButtons);
        
        console.log('IMEI Capturado (Simulado):', userData.imei);
        
        toast({
          title: "Sucesso",
          description: mockResponse.message,
        });
        
        // Navigate to app after successful login
        window.location.href = '/app';
      } else {
        toast({
          title: "Erro",
          description: mockResponse.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro na simulação de login:', error);
      toast({
        title: "Erro",
        description: 'Erro ao tentar fazer login. Tente novamente mais tarde.',
        variant: "destructive",
      });
    }
  }, [toast]);

  const startOperation = useCallback(async (operation: Operation) => {
    const coords = location || { latitude: 0, longitude: 0 };
    try {
      const storedEvents = localStorage.getItem('events');
      const currentEvents = storedEvents ? JSON.parse(storedEvents) : [];
      currentEvents.push({
        id: operation.id,
        button_name: operation.name,
        timestamp: operation.startTime,
        latitude: coords.latitude,
        longitude: coords.longitude,
        status: 'pending'
      });
      localStorage.setItem('events', JSON.stringify(currentEvents));
      
      toast({
        title: "Operação Iniciada",
        description: `Operação "${operation.name}" iniciada!`,
      });
    } catch (e) {
      console.error('Erro ao iniciar evento:', e);
    }
  }, [location, toast]);

  const endOperation = useCallback(async (operationToEnd: Operation) => {
    const endTime = Date.now();
    const durationMs = endTime - operationToEnd.startTime;
    const durationMinutes = Math.floor(durationMs / (1000 * 60));
    const durationSeconds = Math.floor((durationMs % (1000 * 60)) / 1000);
    const formattedDuration = `${durationMinutes.toString().padStart(2, '0')}:${durationSeconds.toString().padStart(2, '0')}`;

    const completedOperation: Operation = { 
      ...operationToEnd, 
      endTime, 
      duration: formattedDuration, 
      status: 'pending' 
    };

    const storedHistory = localStorage.getItem('operationHistory');
    const currentHistory = storedHistory ? JSON.parse(storedHistory) : [];
    const newHistory = [...currentHistory, completedOperation];
    localStorage.setItem('operationHistory', JSON.stringify(newHistory));
    setOperationHistory(newHistory);

    try {
      const storedEvents = localStorage.getItem('events');
      const currentEvents = storedEvents ? JSON.parse(storedEvents) : [];
      const updatedEvents = currentEvents.map((event: any) =>
        event.id === operationToEnd.id 
          ? { ...event, endTime, duration: formattedDuration, status: 'pending' } 
          : event
      );
      localStorage.setItem('events', JSON.stringify(updatedEvents));
    } catch (e) {
      console.error('Erro ao atualizar evento:', e);
    }

    setCurrentOperation(null);
    setActiveButton(null);
    localStorage.removeItem('currentOperation');
    
    toast({
      title: "Operação Encerrada",
      description: `Operação "${operationToEnd.name}" encerrada. Duração: ${formattedDuration}`,
    });
    
    syncData();
  }, [toast, syncData]);

  const handleButtonPress = useCallback(async (buttonId: string) => {
    const selectedButton = operationalButtons.find(b => b.id === buttonId);
    if (!selectedButton) return;

    if (activeButton === buttonId) {
      if (currentOperation) {
        await endOperation(currentOperation);
      }
    } else {
      if (currentOperation) {
        await endOperation(currentOperation);
      }
      const newOperation: Operation = {
        id: Date.now().toString(),
        name: selectedButton.name,
        startTime: Date.now(),
        status: 'pending'
      };
      setCurrentOperation(newOperation);
      setActiveButton(buttonId);
      localStorage.setItem('currentOperation', JSON.stringify(newOperation));
      await startOperation(newOperation);
      syncData();
    }
  }, [activeButton, currentOperation, endOperation, operationalButtons, startOperation, syncData]);

  // Efeitos
  useEffect(() => {
    if (isLoggedIn) {
      resetInactivityTimer();
      startLocationTracking();
      startAutoSync();
    } else {
      stopLocationTracking();
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
      if (autoSyncTimerId.current) {
        clearInterval(autoSyncTimerId.current);
      }
    }
    return () => {
      stopLocationTracking();
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
      if (elapsedTimeTimer.current) {
        clearTimeout(elapsedTimeTimer.current);
      }
      if (autoSyncTimerId.current) {
        clearInterval(autoSyncTimerId.current);
      }
    };
  }, [isLoggedIn, resetInactivityTimer, startLocationTracking, startAutoSync, stopLocationTracking]);

  useEffect(() => {
    if (currentOperation && currentOperation.startTime) {
      if (elapsedTimeTimer.current) {
        clearInterval(elapsedTimeTimer.current);
      }
      elapsedTimeTimer.current = setInterval(() => {
        const durationMs = Date.now() - currentOperation.startTime;
        const minutes = Math.floor(durationMs / (1000 * 60));
        const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
        setElapsedTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);
    } else {
      if (elapsedTimeTimer.current) {
        clearInterval(elapsedTimeTimer.current);
      }
      setElapsedTime('00:00');
    }
    return () => {
      if (elapsedTimeTimer.current) {
        clearInterval(elapsedTimeTimer.current);
      }
    };
  }, [currentOperation]);

  // Load initial state on mount
  useEffect(() => {
    loadInitialState();
  }, [loadInitialState]);

  const value: AppContextType = {
    isLoggedIn,
    isLoading,
    location,
    errorMsg,
    operationalButtons,
    activeButton,
    currentOperation,
    operationHistory,
    vehiclePlate,
    isWaitingForLocation,
    elapsedTime,
    handleLogin,
    handleLogout,
    handleButtonPress,
    syncData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};