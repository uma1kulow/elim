import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVillage } from '@/contexts/VillageContext';
interface HeaderProps {
  onVillageClick?: () => void;
}
const Header: React.FC<HeaderProps> = ({
  onVillageClick
}) => {
  const {
    language,
    setLanguage
  } = useLanguage();
  const {
    selectedVillage
  } = useVillage();
  return <motion.header initial={{
    opacity: 0,
    y: -10
  }} animate={{
    opacity: 1,
    y: 0
  }} className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-5 h-14">
        {/* Logo - Left */}
        <h1 className="text-xl font-bold tracking-tight">elim.</h1>

        {/* Village - Center (clickable) */}
        {selectedVillage && <button onClick={onVillageClick} className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <span>{language === 'kg' ? selectedVillage.name.kg : selectedVillage.name.ru}</span>
            
          </button>}

        {/* Language - Right */}
        <button onClick={() => setLanguage(language === 'kg' ? 'ru' : 'kg')} className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors uppercase">
          {language === 'kg' ? 'RU' : 'KG'}
        </button>
      </div>
    </motion.header>;
};
export default Header;