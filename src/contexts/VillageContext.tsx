import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Village {
  id: string;
  name: {
    kg: string;
    ru: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  population: number;
  activityIndex: number;
  problemsSolved: number;
  rating: number;
}

const villages: Village[] = [
  {
    id: 'kyzyl-suu',
    name: { kg: 'Кызыл-Суу', ru: 'Кызыл-Суу' },
    coordinates: { lat: 42.4528, lng: 78.3912 },
    population: 12500,
    activityIndex: 85,
    problemsSolved: 156,
    rating: 4.7,
  },
  {
    id: 'barskoon',
    name: { kg: 'Барскоон', ru: 'Барскоон' },
    coordinates: { lat: 42.1436, lng: 77.5647 },
    population: 8200,
    activityIndex: 72,
    problemsSolved: 98,
    rating: 4.3,
  },
  {
    id: 'tamga',
    name: { kg: 'Тамга', ru: 'Тамга' },
    coordinates: { lat: 42.1254, lng: 77.5413 },
    population: 5400,
    activityIndex: 68,
    problemsSolved: 67,
    rating: 4.1,
  },
  {
    id: 'bokonbaevo',
    name: { kg: 'Бөкөнбаево', ru: 'Бёкёнбаево' },
    coordinates: { lat: 42.0731, lng: 77.0692 },
    population: 9800,
    activityIndex: 91,
    problemsSolved: 203,
    rating: 4.8,
  },
  {
    id: 'tosor',
    name: { kg: 'Тосор', ru: 'Тосор' },
    coordinates: { lat: 42.1011, lng: 77.4182 },
    population: 3200,
    activityIndex: 55,
    problemsSolved: 34,
    rating: 3.9,
  },
];

interface VillageContextType {
  selectedVillage: Village | null;
  setSelectedVillage: (village: Village | null) => void;
  villages: Village[];
  hasSelectedVillage: boolean;
}

const VillageContext = createContext<VillageContextType | undefined>(undefined);

export const VillageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);

  return (
    <VillageContext.Provider
      value={{
        selectedVillage,
        setSelectedVillage,
        villages,
        hasSelectedVillage: selectedVillage !== null,
      }}
    >
      {children}
    </VillageContext.Provider>
  );
};

export const useVillage = (): VillageContextType => {
  const context = useContext(VillageContext);
  if (!context) {
    throw new Error('useVillage must be used within a VillageProvider');
  }
  return context;
};
