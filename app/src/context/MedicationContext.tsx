import { createContext, useContext, useState, type ReactNode } from 'react';

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

interface MedicationContextType {
  medications: Medication[];
  addMedication: (medication: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMedication: (id: string, medication: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  getMedication: (id: string) => Medication | undefined;
  getTodayMedications: () => Medication[];
  markAsTaken: (id: string, time: string) => void;
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

export const MedicationProvider = ({ children }: { children: ReactNode }) => {
  const [medications, setMedications] = useState<Medication[]>([
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
  ]);

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
  };

  const getMedication = (id: string) => {
    return medications.find((med) => med.id === id);
  };

  const getTodayMedications = () => {
    const today = new Date().toDateString();
    return medications.filter((med) => {
      const startDate = new Date(med.startDate).toDateString();
      const endDate = med.endDate ? new Date(med.endDate).toDateString() : null;
      return med.status === 'active' && startDate <= today && (!endDate || endDate >= today);
    });
  };

  const markAsTaken = (id: string, time: string) => {
    // This would typically update a log/history
    // For now, we'll just update the medication
    console.log(`Marked medication ${id} as taken at ${time}`);
  };

  return (
    <MedicationContext.Provider
      value={{
        medications,
        addMedication,
        updateMedication,
        deleteMedication,
        getMedication,
        getTodayMedications,
        markAsTaken,
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