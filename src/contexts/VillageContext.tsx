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
  region: string;
  district: string;
  population: number;
  activityIndex: number;
  problemsSolved: number;
  rating: number;
}

// Кыргызстандын бардык аймактары жана айылдары
const villages: Village[] = [
  // ==================== ЧҮЙОБЛАСЫ ====================
  { id: 'alamudun', name: { kg: 'Аламүдүн', ru: 'Аламудун' }, coordinates: { lat: 42.8746, lng: 74.5698 }, region: 'Чүй', district: 'Аламүдүн', population: 15200, activityIndex: 78, problemsSolved: 124, rating: 4.2 },
  { id: 'lebedinovka', name: { kg: 'Лебединовка', ru: 'Лебединовка' }, coordinates: { lat: 42.8834, lng: 74.6542 }, region: 'Чүй', district: 'Аламүдүн', population: 22000, activityIndex: 82, problemsSolved: 187, rating: 4.4 },
  { id: 'novopavlovka', name: { kg: 'Новопавловка', ru: 'Новопавловка' }, coordinates: { lat: 42.8423, lng: 74.5234 }, region: 'Чүй', district: 'Аламүдүн', population: 18500, activityIndex: 75, problemsSolved: 156, rating: 4.1 },
  { id: 'koy-tash', name: { kg: 'Көй-Таш', ru: 'Кой-Таш' }, coordinates: { lat: 42.7845, lng: 74.6123 }, region: 'Чүй', district: 'Аламүдүн', population: 8900, activityIndex: 71, problemsSolved: 89, rating: 4.0 },
  { id: 'vorontsovka', name: { kg: 'Воронцовка', ru: 'Воронцовка' }, coordinates: { lat: 42.7234, lng: 74.1567 }, region: 'Чүй', district: 'Аламүдүн', population: 6700, activityIndex: 65, problemsSolved: 56, rating: 3.8 },
  { id: 'sokuluk', name: { kg: 'Сокулук', ru: 'Сокулук' }, coordinates: { lat: 42.8501, lng: 74.1231 }, region: 'Чүй', district: 'Сокулук', population: 25000, activityIndex: 85, problemsSolved: 234, rating: 4.5 },
  { id: 'belovodskoe', name: { kg: 'Беловодское', ru: 'Беловодское' }, coordinates: { lat: 42.8289, lng: 73.9087 }, region: 'Чүй', district: 'Москва', population: 31000, activityIndex: 88, problemsSolved: 312, rating: 4.6 },
  { id: 'kara-balta', name: { kg: 'Кара-Балта', ru: 'Кара-Балта' }, coordinates: { lat: 42.8147, lng: 73.8492 }, region: 'Чүй', district: 'Жайыл', population: 45000, activityIndex: 91, problemsSolved: 456, rating: 4.7 },
  { id: 'kant', name: { kg: 'Кант', ru: 'Кант' }, coordinates: { lat: 42.8912, lng: 74.8523 }, region: 'Чүй', district: 'Ысык-Ата', population: 28000, activityIndex: 84, problemsSolved: 267, rating: 4.4 },
  { id: 'tokmok', name: { kg: 'Токмок', ru: 'Токмок' }, coordinates: { lat: 42.8397, lng: 75.2901 }, region: 'Чүй', district: 'Чүй', population: 65000, activityIndex: 89, problemsSolved: 534, rating: 4.5 },
  { id: 'kemin', name: { kg: 'Кемин', ru: 'Кемин' }, coordinates: { lat: 42.7856, lng: 75.6912 }, region: 'Чүй', district: 'Кемин', population: 12000, activityIndex: 72, problemsSolved: 98, rating: 4.0 },
  { id: 'shopokov', name: { kg: 'Шопоков', ru: 'Шопоков' }, coordinates: { lat: 42.8234, lng: 74.2345 }, region: 'Чүй', district: 'Сокулук', population: 14000, activityIndex: 76, problemsSolved: 112, rating: 4.1 },

  // ==================== ЫСЫК-КӨЛ ОБЛАСТЫ ====================
  { id: 'karakol', name: { kg: 'Каракол', ru: 'Каракол' }, coordinates: { lat: 42.4907, lng: 78.3958 }, region: 'Ысык-Көл', district: 'Ак-Суу', population: 75000, activityIndex: 92, problemsSolved: 678, rating: 4.8 },
  { id: 'cholpon-ata', name: { kg: 'Чолпон-Ата', ru: 'Чолпон-Ата' }, coordinates: { lat: 42.6498, lng: 77.0821 }, region: 'Ысык-Көл', district: 'Ысык-Көл', population: 15000, activityIndex: 87, problemsSolved: 234, rating: 4.6 },
  { id: 'balykchy', name: { kg: 'Балыкчы', ru: 'Балыкчы' }, coordinates: { lat: 42.4601, lng: 76.1851 }, region: 'Ысык-Көл', district: 'Балыкчы', population: 48000, activityIndex: 83, problemsSolved: 412, rating: 4.4 },
  { id: 'kyzyl-suu', name: { kg: 'Кызыл-Суу', ru: 'Кызыл-Суу' }, coordinates: { lat: 42.4528, lng: 78.3912 }, region: 'Ысык-Көл', district: 'Жети-Өгүз', population: 12500, activityIndex: 85, problemsSolved: 156, rating: 4.7 },
  { id: 'barskoon', name: { kg: 'Барскоон', ru: 'Барскоон' }, coordinates: { lat: 42.1436, lng: 77.5647 }, region: 'Ысык-Көл', district: 'Жети-Өгүз', population: 8200, activityIndex: 72, problemsSolved: 98, rating: 4.3 },
  { id: 'tamga', name: { kg: 'Тамга', ru: 'Тамга' }, coordinates: { lat: 42.1254, lng: 77.5413 }, region: 'Ысык-Көл', district: 'Жети-Өгүз', population: 5400, activityIndex: 68, problemsSolved: 67, rating: 4.1 },
  { id: 'bokonbaevo', name: { kg: 'Бөкөнбаево', ru: 'Бөкөнбаево' }, coordinates: { lat: 42.0731, lng: 77.0692 }, region: 'Ысык-Көл', district: 'Тоң', population: 9800, activityIndex: 91, problemsSolved: 203, rating: 4.8 },
  { id: 'tosor', name: { kg: 'Тосор', ru: 'Тосор' }, coordinates: { lat: 42.1011, lng: 77.4182 }, region: 'Ысык-Көл', district: 'Жети-Өгүз', population: 3200, activityIndex: 55, problemsSolved: 34, rating: 3.9 },
  { id: 'jyrgalan', name: { kg: 'Жыргалаң', ru: 'Джыргалан' }, coordinates: { lat: 42.5623, lng: 78.7234 }, region: 'Ысык-Көл', district: 'Ак-Суу', population: 4500, activityIndex: 73, problemsSolved: 56, rating: 4.2 },
  { id: 'engilchek', name: { kg: 'Эңилчек', ru: 'Энгильчек' }, coordinates: { lat: 42.2112, lng: 79.2453 }, region: 'Ысык-Көл', district: 'Ак-Суу', population: 2800, activityIndex: 58, problemsSolved: 32, rating: 3.7 },
  { id: 'ananyevo', name: { kg: 'Ананьево', ru: 'Ананьево' }, coordinates: { lat: 42.6234, lng: 77.5432 }, region: 'Ысык-Көл', district: 'Ысык-Көл', population: 6700, activityIndex: 69, problemsSolved: 78, rating: 4.0 },
  { id: 'bosteri', name: { kg: 'Бостери', ru: 'Бостери' }, coordinates: { lat: 42.6567, lng: 77.1234 }, region: 'Ысык-Көл', district: 'Ысык-Көл', population: 8900, activityIndex: 78, problemsSolved: 112, rating: 4.3 },
  { id: 'korumdu', name: { kg: 'Корумду', ru: 'Корумду' }, coordinates: { lat: 42.6123, lng: 77.3456 }, region: 'Ысык-Көл', district: 'Ысык-Көл', population: 4200, activityIndex: 62, problemsSolved: 45, rating: 3.9 },
  { id: 'kaji-say', name: { kg: 'Каджи-Сай', ru: 'Каджи-Сай' }, coordinates: { lat: 42.0512, lng: 76.9876 }, region: 'Ысык-Көл', district: 'Тоң', population: 5600, activityIndex: 64, problemsSolved: 56, rating: 4.0 },

  // ==================== НАРЫН ОБЛАСТЫ ====================
  { id: 'naryn', name: { kg: 'Нарын', ru: 'Нарын' }, coordinates: { lat: 41.4286, lng: 75.9911 }, region: 'Нарын', district: 'Нарын', population: 42000, activityIndex: 84, problemsSolved: 356, rating: 4.5 },
  { id: 'at-bashy', name: { kg: 'Ат-Башы', ru: 'Ат-Баши' }, coordinates: { lat: 41.1687, lng: 75.7978 }, region: 'Нарын', district: 'Ат-Башы', population: 18000, activityIndex: 76, problemsSolved: 145, rating: 4.2 },
  { id: 'kochkor', name: { kg: 'Кочкор', ru: 'Кочкор' }, coordinates: { lat: 42.2167, lng: 75.7567 }, region: 'Нарын', district: 'Кочкор', population: 15000, activityIndex: 79, problemsSolved: 123, rating: 4.3 },
  { id: 'chaek', name: { kg: 'Чаек', ru: 'Чаек' }, coordinates: { lat: 41.9234, lng: 75.4567 }, region: 'Нарын', district: 'Жумгал', population: 8500, activityIndex: 67, problemsSolved: 78, rating: 4.0 },
  { id: 'jumgal', name: { kg: 'Жумгал', ru: 'Джумгал' }, coordinates: { lat: 41.9123, lng: 75.4234 }, region: 'Нарын', district: 'Жумгал', population: 6200, activityIndex: 62, problemsSolved: 54, rating: 3.8 },
  { id: 'kazarman', name: { kg: 'Казарман', ru: 'Казарман' }, coordinates: { lat: 41.4012, lng: 74.0234 }, region: 'Нарын', district: 'Ак-Талаа', population: 12000, activityIndex: 71, problemsSolved: 89, rating: 4.1 },
  { id: 'baetov', name: { kg: 'Баетов', ru: 'Баетов' }, coordinates: { lat: 41.3456, lng: 74.5678 }, region: 'Нарын', district: 'Ак-Талаа', population: 5400, activityIndex: 58, problemsSolved: 45, rating: 3.7 },
  { id: 'dostuk-naryn', name: { kg: 'Достук', ru: 'Достук' }, coordinates: { lat: 41.5234, lng: 75.2345 }, region: 'Нарын', district: 'Нарын', population: 4800, activityIndex: 55, problemsSolved: 38, rating: 3.6 },

  // ==================== ТАЛАС ОБЛАСТЫ ====================
  { id: 'talas', name: { kg: 'Талас', ru: 'Талас' }, coordinates: { lat: 42.5228, lng: 72.2401 }, region: 'Талас', district: 'Талас', population: 38000, activityIndex: 86, problemsSolved: 312, rating: 4.6 },
  { id: 'manas', name: { kg: 'Манас', ru: 'Манас' }, coordinates: { lat: 42.5123, lng: 72.3456 }, region: 'Талас', district: 'Манас', population: 8500, activityIndex: 72, problemsSolved: 78, rating: 4.2 },
  { id: 'kara-buura', name: { kg: 'Кара-Буура', ru: 'Кара-Буура' }, coordinates: { lat: 42.4567, lng: 71.8901 }, region: 'Талас', district: 'Кара-Буура', population: 12000, activityIndex: 75, problemsSolved: 98, rating: 4.3 },
  { id: 'pokrovka-talas', name: { kg: 'Покровка', ru: 'Покровка' }, coordinates: { lat: 42.4012, lng: 72.0123 }, region: 'Талас', district: 'Кара-Буура', population: 6700, activityIndex: 68, problemsSolved: 67, rating: 4.0 },
  { id: 'bakai-ata', name: { kg: 'Бакай-Ата', ru: 'Бакай-Ата' }, coordinates: { lat: 42.3234, lng: 72.1234 }, region: 'Талас', district: 'Бакай-Ата', population: 9800, activityIndex: 74, problemsSolved: 89, rating: 4.2 },

  // ==================== ОШ ОБЛАСТЫ ====================
  { id: 'osh-city', name: { kg: 'Ош шаары', ru: 'Ош (город)' }, coordinates: { lat: 40.5283, lng: 72.7985 }, region: 'Ош', district: 'Ош шаары', population: 320000, activityIndex: 94, problemsSolved: 1234, rating: 4.8 },
  { id: 'kara-suu', name: { kg: 'Кара-Суу', ru: 'Кара-Суу' }, coordinates: { lat: 40.6989, lng: 72.8678 }, region: 'Ош', district: 'Кара-Суу', population: 28000, activityIndex: 82, problemsSolved: 267, rating: 4.4 },
  { id: 'uzgen', name: { kg: 'Өзгөн', ru: 'Узген' }, coordinates: { lat: 40.7678, lng: 73.2989 }, region: 'Ош', district: 'Өзгөн', population: 55000, activityIndex: 87, problemsSolved: 456, rating: 4.6 },
  { id: 'nookat', name: { kg: 'Ноокат', ru: 'Ноокат' }, coordinates: { lat: 40.2678, lng: 72.6234 }, region: 'Ош', district: 'Ноокат', population: 25000, activityIndex: 78, problemsSolved: 198, rating: 4.3 },
  { id: 'aravan', name: { kg: 'Араван', ru: 'Араван' }, coordinates: { lat: 40.5012, lng: 72.4567 }, region: 'Ош', district: 'Араван', population: 18000, activityIndex: 74, problemsSolved: 145, rating: 4.1 },
  { id: 'kurshab', name: { kg: 'Күршаб', ru: 'Куршаб' }, coordinates: { lat: 40.4234, lng: 73.0123 }, region: 'Ош', district: 'Өзгөн', population: 8900, activityIndex: 68, problemsSolved: 78, rating: 4.0 },
  { id: 'kerben', name: { kg: 'Кербен', ru: 'Кербен' }, coordinates: { lat: 41.4789, lng: 71.7567 }, region: 'Ош', district: 'Алай', population: 14000, activityIndex: 72, problemsSolved: 112, rating: 4.2 },
  { id: 'gulcha', name: { kg: 'Гүлчө', ru: 'Гульча' }, coordinates: { lat: 40.2567, lng: 73.4567 }, region: 'Ош', district: 'Алай', population: 12500, activityIndex: 76, problemsSolved: 134, rating: 4.3 },
  { id: 'daroot-korgon', name: { kg: 'Дароот-Коргон', ru: 'Дароот-Коргон' }, coordinates: { lat: 39.8234, lng: 72.2456 }, region: 'Ош', district: 'Чон-Алай', population: 8700, activityIndex: 65, problemsSolved: 67, rating: 3.9 },

  // ==================== ЖАЛАЛ-АБАД ОБЛАСТЫ ====================
  { id: 'jalal-abad', name: { kg: 'Жалал-Абад', ru: 'Джалал-Абад' }, coordinates: { lat: 40.9332, lng: 73.0017 }, region: 'Жалал-Абад', district: 'Жалал-Абад', population: 115000, activityIndex: 91, problemsSolved: 867, rating: 4.7 },
  { id: 'tash-kumyr', name: { kg: 'Таш-Көмүр', ru: 'Таш-Кумыр' }, coordinates: { lat: 41.3456, lng: 72.2345 }, region: 'Жалал-Абад', district: 'Тогуз-Торо', population: 32000, activityIndex: 83, problemsSolved: 289, rating: 4.4 },
  { id: 'kara-kul', name: { kg: 'Кара-Көл', ru: 'Кара-Куль' }, coordinates: { lat: 41.6234, lng: 72.8567 }, region: 'Жалал-Абад', district: 'Токтогул', population: 18000, activityIndex: 77, problemsSolved: 156, rating: 4.2 },
  { id: 'toktogul', name: { kg: 'Токтогул', ru: 'Токтогул' }, coordinates: { lat: 41.8745, lng: 72.9412 }, region: 'Жалал-Абад', district: 'Токтогул', population: 22000, activityIndex: 81, problemsSolved: 198, rating: 4.4 },
  { id: 'mailuu-suu', name: { kg: 'Майлуу-Суу', ru: 'Майлуу-Суу' }, coordinates: { lat: 41.2678, lng: 72.4567 }, region: 'Жалал-Абад', district: 'Майлуу-Суу', population: 25000, activityIndex: 78, problemsSolved: 212, rating: 4.3 },
  { id: 'bazar-korgon', name: { kg: 'Базар-Коргон', ru: 'Базар-Коргон' }, coordinates: { lat: 41.0345, lng: 72.7456 }, region: 'Жалал-Абад', district: 'Базар-Коргон', population: 28000, activityIndex: 82, problemsSolved: 245, rating: 4.4 },
  { id: 'suzak', name: { kg: 'Сузак', ru: 'Сузак' }, coordinates: { lat: 40.8901, lng: 72.9234 }, region: 'Жалал-Абад', district: 'Сузак', population: 15000, activityIndex: 74, problemsSolved: 123, rating: 4.1 },
  { id: 'nooken', name: { kg: 'Ноокен', ru: 'Ноокен' }, coordinates: { lat: 41.1234, lng: 72.5678 }, region: 'Жалал-Абад', district: 'Ноокен', population: 12000, activityIndex: 71, problemsSolved: 98, rating: 4.0 },
  { id: 'ala-buka', name: { kg: 'Ала-Бука', ru: 'Ала-Бука' }, coordinates: { lat: 41.4012, lng: 71.4567 }, region: 'Жалал-Абад', district: 'Ала-Бука', population: 14500, activityIndex: 73, problemsSolved: 112, rating: 4.1 },
  { id: 'aksy', name: { kg: 'Аксы', ru: 'Аксы' }, coordinates: { lat: 41.1678, lng: 72.0123 }, region: 'Жалал-Абад', district: 'Аксы', population: 11000, activityIndex: 69, problemsSolved: 89, rating: 3.9 },

  // ==================== БАТКЕН ОБЛАСТЫ ====================
  { id: 'batken', name: { kg: 'Баткен', ru: 'Баткен' }, coordinates: { lat: 40.0628, lng: 70.8191 }, region: 'Баткен', district: 'Баткен', population: 28000, activityIndex: 79, problemsSolved: 234, rating: 4.4 },
  { id: 'isfana', name: { kg: 'Исфана', ru: 'Исфана' }, coordinates: { lat: 39.8367, lng: 69.5289 }, region: 'Баткен', district: 'Лейлек', population: 22000, activityIndex: 76, problemsSolved: 189, rating: 4.2 },
  { id: 'sulukta', name: { kg: 'Сүлүктү', ru: 'Сулюкта' }, coordinates: { lat: 39.9345, lng: 69.5678 }, region: 'Баткен', district: 'Лейлек', population: 18000, activityIndex: 74, problemsSolved: 156, rating: 4.1 },
  { id: 'kyzyl-kiya', name: { kg: 'Кызыл-Кыя', ru: 'Кызыл-Кия' }, coordinates: { lat: 40.2567, lng: 72.1234 }, region: 'Баткен', district: 'Кадамжай', population: 35000, activityIndex: 81, problemsSolved: 278, rating: 4.4 },
  { id: 'kadamjay', name: { kg: 'Кадамжай', ru: 'Кадамжай' }, coordinates: { lat: 40.1234, lng: 71.7456 }, region: 'Баткен', district: 'Кадамжай', population: 16000, activityIndex: 72, problemsSolved: 134, rating: 4.0 },
  { id: 'khaidarken', name: { kg: 'Хайдаркен', ru: 'Хайдаркен' }, coordinates: { lat: 40.0678, lng: 71.1789 }, region: 'Баткен', district: 'Кадамжай', population: 12000, activityIndex: 68, problemsSolved: 98, rating: 3.9 },
  { id: 'samarkandek', name: { kg: 'Самаркандек', ru: 'Самаркандек' }, coordinates: { lat: 40.0123, lng: 70.6789 }, region: 'Баткен', district: 'Баткен', population: 8500, activityIndex: 65, problemsSolved: 67, rating: 3.8 },
];

interface VillageContextType {
  selectedVillage: Village | null;
  setSelectedVillage: (village: Village | null) => void;
  villages: Village[];
  hasSelectedVillage: boolean;
  searchVillages: (query: string) => Village[];
  getVillagesByRegion: (region: string) => Village[];
  regions: string[];
}

const VillageContext = createContext<VillageContextType | undefined>(undefined);

export const VillageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);

  const regions = [...new Set(villages.map(v => v.region))];

  const searchVillages = (query: string): Village[] => {
    if (!query.trim()) return villages;
    const lowerQuery = query.toLowerCase();
    return villages.filter(v => 
      v.name.kg.toLowerCase().includes(lowerQuery) ||
      v.name.ru.toLowerCase().includes(lowerQuery) ||
      v.region.toLowerCase().includes(lowerQuery) ||
      v.district.toLowerCase().includes(lowerQuery)
    );
  };

  const getVillagesByRegion = (region: string): Village[] => {
    return villages.filter(v => v.region === region);
  };

  return (
    <VillageContext.Provider
      value={{
        selectedVillage,
        setSelectedVillage,
        villages,
        hasSelectedVillage: selectedVillage !== null,
        searchVillages,
        getVillagesByRegion,
        regions,
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
