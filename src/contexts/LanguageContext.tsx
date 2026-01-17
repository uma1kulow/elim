import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'kg' | 'ru';

interface Translations {
  [key: string]: {
    kg: string;
    ru: string;
  };
}

const translations: Translations = {
  // Navigation
  home: { kg: 'Башкы', ru: 'Главная' },
  map: { kg: 'Карта', ru: 'Карта' },
  feed: { kg: 'Жаңылыктар', ru: 'Новости' },
  profile: { kg: 'Профиль', ru: 'Профиль' },
  
  // Intro
  welcomeTitle: { kg: 'Айылыңды өзгөрт', ru: 'Измени свой аил' },
  welcomeSubtitle: { kg: 'Бирге күчтүүбүз', ru: 'Вместе мы сильнее' },
  selectVillage: { kg: 'Айылыңызды тандаңыз', ru: 'Выберите ваш аил' },
  continue: { kg: 'Улантуу', ru: 'Продолжить' },
  
  // Home
  whatsHappening: { kg: 'Айылда эмне болуп жатат?', ru: 'Что происходит в аиле?' },
  viewAll: { kg: 'Баарын көрүү', ru: 'Смотреть все' },
  
  // Status
  problem: { kg: 'Көйгөй', ru: 'Проблема' },
  solved: { kg: 'Чечилди', ru: 'Решено' },
  inProgress: { kg: 'Процессте', ru: 'В процессе' },
  event: { kg: 'Иш-чара', ru: 'Мероприятие' },
  construction: { kg: 'Курулуш', ru: 'Строительство' },
  celebration: { kg: 'Майрам', ru: 'Праздник' },
  
  // Actions
  vote: { kg: 'Добуш бер', ru: 'Голосовать' },
  comment: { kg: 'Комментарий', ru: 'Комментарий' },
  share: { kg: 'Бөлүшүү', ru: 'Поделиться' },
  report: { kg: 'Кабар берүү', ru: 'Сообщить' },
  
  // Village Profile
  population: { kg: 'Калк саны', ru: 'Население' },
  activityIndex: { kg: 'Активдүүлүк', ru: 'Активность' },
  problemsSolved: { kg: 'Чечилген', ru: 'Решено' },
  rating: { kg: 'Рейтинг', ru: 'Рейтинг' },
  
  // Misc
  search: { kg: 'Издөө...', ru: 'Поиск...' },
  filter: { kg: 'Фильтр', ru: 'Фильтр' },
  today: { kg: 'Бүгүн', ru: 'Сегодня' },
  yesterday: { kg: 'Кечээ', ru: 'Вчера' },
  votes: { kg: 'добуш', ru: 'голосов' },
  comments: { kg: 'комментарий', ru: 'комментариев' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('kg');

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
