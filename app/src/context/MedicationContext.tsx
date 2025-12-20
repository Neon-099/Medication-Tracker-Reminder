import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  scheduledTime: string;
  frequency: 'once' | 'twice' | 'thrice' | 'daily';
  riskLevel: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
  instructions?: string;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  takenAt: string;
  scheduledTime: string;
  status: 'taken' | 'missed';
}

interface MedicationContextType {
  medications: Medication[];
  logs: MedicationLog[];
  addMedication: (medication: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMedication: (id: string, medication: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  getMedication: (id: string) => Medication | undefined;
  getTodayMedications: () => Medication[];
  markAsTaken: (id: string, time?: string) => void;
  getMedicationStatus: (medication: Medication) => 'taken' | 'upcoming' | 'missed';
  getTodayLogs: (medicationId: string) => MedicationLog[];
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

const STORAGE_KEY = 'medications';
const LOGS_STORAGE_KEY = 'medication_logs';

export const MedicationProvider = ({ children }: { children: ReactNode }) => {
  const [medications, setMedications] = useState<Medication[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    // Default medications
    return [
      {
        id: '1',
        name: 'Lisinopril',
        dosage: '10mg',
        scheduledTime: '08:00',
        frequency: 'once',
        riskLevel: 'medium',
        status: 'active',
        instructions: 'Take with food',
        startDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Metformin',
        dosage: '500mg',
        scheduledTime: '09:00',
        frequency: 'twice',
        riskLevel: 'low',
        status: 'active',
        startDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Atorvastatin',
        dosage: '20mg',
        scheduledTime: '07:00',
        frequency: 'once',
        riskLevel: 'high',
        status: 'active',
        startDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  });

  const [logs, setLogs] = useState<MedicationLog[]>(() => {
    const stored = localStorage.getItem(LOGS_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Persist medications to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(medications));
  }, [medications]);

  // Persist logs to localStorage
  useEffect(() => {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
  }, [logs]);

  const addMedication = (medication: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newMedication: Medication = {
      ...medication,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMedications((prev) => [...prev, newMedication]);
  };

  const updateMedication = (id: string, updates: Partial<Medication>) => {
    setMedications((prev) =>
      prev.map((med) =>
        med.id === id
          ? { ...med, ...updates, updatedAt: new Date().toISOString() }
          : med
      )
    );
  };

  const deleteMedication = (id: string) => {
    setMedications((prev) => prev.filter((med) => med.id !== id));
    // Also delete related logs
    setLogs((prev) => prev.filter((log) => log.medicationId !== id));
  };

  const getMedication = (id: string) => {
    return medications.find((med) => med.id === id);
  };

  const getTodayMedications = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return medications.filter((med) => {
      if (med.status !== 'active') return false;
      
      const startDate = new Date(med.startDate);
      startDate.setHours(0, 0, 0, 0);
      
      if (startDate > today) return false;
      
      if (med.endDate) {
        const endDate = new Date(med.endDate);
        endDate.setHours(0, 0, 0, 0);
        if (endDate < today) return false;
      }
      
      return true;
    });
  };

  const getTodayLogs = (medicationId: string): MedicationLog[] => {
    const today = new Date().toDateString();
    return logs.filter(
      (log) =>
        log.medicationId === medicationId &&
        new Date(log.takenAt).toDateString() === today
    );
  };

  const getMedicationStatus = (medication: Medication): 'taken' | 'upcoming' | 'missed' => {
    const today = new Date().toDateString();
    const todayLogs = getTodayLogs(medication.id);
    
    // Check if already taken today
    const scheduledTime = medication.scheduledTime;
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    const scheduledDateTime = new Date();
    scheduledDateTime.setHours(hours, minutes, 0, 0);
    
    // Check if there's a log for this scheduled time today
    const takenToday = todayLogs.some((log) => {
      const logTime = new Date(log.takenAt);
      return log.scheduledTime === scheduledTime;
    });
    
    if (takenToday) {
      return 'taken';
    }
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const scheduledTimeMinutes = hours * 60 + minutes;
    
    // If scheduled time has passed (with 30 min grace period)
    if (currentTime > scheduledTimeMinutes + 30) {
      return 'missed';
    }
    
    return 'upcoming';
  };

  const markAsTaken = (id: string, time?: string) => {
    const medication = getMedication(id);
    if (!medication) return;

    const takenAt = time || new Date().toISOString();
    const newLog: MedicationLog = {
      id: Date.now().toString(),
      medicationId: id,
      takenAt,
      scheduledTime: medication.scheduledTime,
      status: 'taken',
    };

    setLogs((prev) => [...prev, newLog]);
  };

  return (
    <MedicationContext.Provider
      value={{
        medications,
        logs,
        addMedication,
        updateMedication,
        deleteMedication,
        getMedication,
        getTodayMedications,
        markAsTaken,
        getMedicationStatus,
        getTodayLogs,
      }}
    >
      {children}
    </MedicationContext.Provider>
  );
};

export const useMedications = () => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error('useMedications must be used within MedicationProvider');
  }
  return context;
};