import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Briefcase, Building2, Plus, MapPin, Phone, Mail, DollarSign } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEconomy } from '@/hooks/useJobs';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface EconomyViewProps {
  onBack: () => void;
}

const jobTypes = [
  { id: 'full-time', kg: 'Толук убакыт', ru: 'Полная занятость' },
  { id: 'part-time', kg: 'Жарым убакыт', ru: 'Частичная занятость' },
  { id: 'contract', kg: 'Келишим', ru: 'Контракт' },
  { id: 'temporary', kg: 'Убактылуу', ru: 'Временная' }
];

const businessCategories = [
  { id: 'retail', kg: 'Соода', ru: 'Торговля', icon: '🛒' },
  { id: 'food', kg: 'Тамак-аш', ru: 'Еда', icon: '🍽️' },
  { id: 'services', kg: 'Кызматтар', ru: 'Услуги', icon: '🔧' },
  { id: 'agriculture', kg: 'Айыл чарба', ru: 'Сельское хозяйство', icon: '🌾' },
  { id: 'construction', kg: 'Курулуш', ru: 'Строительство', icon: '🏗️' },
  { id: 'transport', kg: 'Транспорт', ru: 'Транспорт', icon: '🚗' },
  { id: 'education', kg: 'Билим берүү', ru: 'Образование', icon: '📚' },
  { id: 'health', kg: 'Саламаттык', ru: 'Здоровье', icon: '🏥' },
  { id: 'other', kg: 'Башка', ru: 'Другое', icon: '📦' }
];

const EconomyView: React.FC<EconomyViewProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const { profile } = useAuth();
  const { jobs, businesses, loading, createJob, createBusiness } = useEconomy();
  const [activeTab, setActiveTab] = useState('jobs');
  const [showJobModal, setShowJobModal] = useState(false);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    companyName: '',
    jobType: 'full-time',
    salaryMin: '',
    salaryMax: '',
    contactPhone: '',
    contactEmail: ''
  });

  const [newBusiness, setNewBusiness] = useState({
    name: '',
    description: '',
    category: 'other',
    address: '',
    phone: ''
  });

  const handleCreateJob = async () => {
    if (!newJob.title || !newJob.description || !newJob.companyName) return;
    
    await createJob(
      newJob.title,
      newJob.description,
      newJob.companyName,
      newJob.jobType,
      newJob.salaryMin ? parseFloat(newJob.salaryMin) : undefined,
      newJob.salaryMax ? parseFloat(newJob.salaryMax) : undefined,
      newJob.contactPhone || undefined,
      newJob.contactEmail || undefined
    );
    
    setShowJobModal(false);
    setNewJob({
      title: '',
      description: '',
      companyName: '',
      jobType: 'full-time',
      salaryMin: '',
      salaryMax: '',
      contactPhone: '',
      contactEmail: ''
    });
  };

  const handleCreateBusiness = async () => {
    if (!newBusiness.name || !newBusiness.category) return;
    
    await createBusiness(
      newBusiness.name,
      newBusiness.description,
      newBusiness.category,
      newBusiness.address || undefined,
      newBusiness.phone || undefined
    );
    
    setShowBusinessModal(false);
    setNewBusiness({
      name: '',
      description: '',
      category: 'other',
      address: '',
      phone: ''
    });
  };

  const formatSalary = (min?: number | null, max?: number | null) => {
    if (!min && !max) return null;
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} сом`;
    if (min) return `${language === 'kg' ? 'от' : 'от'} ${min.toLocaleString()} сом`;
    if (max) return `${language === 'kg' ? 'чейин' : 'до'} ${max.toLocaleString()} сом`;
    return null;
  };

  const getCategoryInfo = (categoryId: string) => {
    return businessCategories.find(c => c.id === categoryId) || businessCategories[8];
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 px-4 py-4 pt-16"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2.5 -ml-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" />
                {language === 'kg' ? 'Экономика' : 'Экономика'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {language === 'kg' ? 'Ишкерлер жана жумуштар' : 'Бизнес и работа'}
              </p>
            </div>
          </div>
          
          {profile && (
            <Button 
              size="sm" 
              onClick={() => activeTab === 'jobs' ? setShowJobModal(true) : setShowBusinessModal(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              {language === 'kg' ? 'Кошуу' : 'Добавить'}
            </Button>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4 pt-4">
        <TabsList className="w-full">
          <TabsTrigger value="jobs" className="flex-1">
            <Briefcase className="w-4 h-4 mr-2" />
            {language === 'kg' ? 'Жумуштар' : 'Вакансии'}
          </TabsTrigger>
          <TabsTrigger value="businesses" className="flex-1">
            <Building2 className="w-4 h-4 mr-2" />
            {language === 'kg' ? 'Ишкерлер' : 'Бизнес'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="mt-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {language === 'kg' ? 'Жумуш жарыялары жок' : 'Нет вакансий'}
            </div>
          ) : (
            jobs.map((job, index) => {
              const salary = formatSalary(job.salary_min, job.salary_max);
              const jobType = jobTypes.find(t => t.id === job.job_type);
              
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-2xl p-4 border border-border/50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">
                        {language === 'kg' ? job.title_kg || job.title : job.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{job.company_name}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-secondary">
                      {language === 'kg' ? jobType?.kg : jobType?.ru}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {language === 'kg' ? job.description_kg || job.description : job.description}
                  </p>

                  {salary && (
                    <div className="flex items-center gap-1 text-sm font-medium text-green-600 mb-3">
                      <DollarSign className="w-4 h-4" />
                      {salary}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {job.contact_phone && (
                      <a href={`tel:${job.contact_phone}`} className="flex items-center gap-1 hover:text-primary">
                        <Phone className="w-3 h-3" />
                        {job.contact_phone}
                      </a>
                    )}
                    {job.contact_email && (
                      <a href={`mailto:${job.contact_email}`} className="flex items-center gap-1 hover:text-primary">
                        <Mail className="w-3 h-3" />
                        {job.contact_email}
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="businesses" className="mt-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : businesses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {language === 'kg' ? 'Ишкерлер жок' : 'Нет бизнесов'}
            </div>
          ) : (
            businesses.map((business, index) => {
              const category = getCategoryInfo(business.category);
              
              return (
                <motion.div
                  key={business.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-2xl overflow-hidden border border-border/50"
                >
                  {business.image_url && (
                    <img 
                      src={business.image_url} 
                      alt="" 
                      className="w-full h-32 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <h3 className="font-semibold">
                          {language === 'kg' ? business.name_kg || business.name : business.name}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {language === 'kg' ? category.kg : category.ru}
                        </span>
                      </div>
                      {business.is_verified && (
                        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-600">
                          ✓ {language === 'kg' ? 'Текшерилген' : 'Проверено'}
                        </span>
                      )}
                    </div>

                    {business.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {language === 'kg' ? business.description_kg || business.description : business.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {business.address && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {business.address}
                        </div>
                      )}
                      {business.phone && (
                        <a href={`tel:${business.phone}`} className="flex items-center gap-1 hover:text-primary">
                          <Phone className="w-3 h-3" />
                          {business.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </TabsContent>
      </Tabs>

      {/* Create Job Modal */}
      <AnimatePresence>
        {showJobModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowJobModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={e => e.stopPropagation()}
              className="w-full bg-background rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold mb-4">
                {language === 'kg' ? 'Жумуш жарыялоо' : 'Разместить вакансию'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {language === 'kg' ? 'Кызмат аталышы' : 'Название должности'}
                  </label>
                  <Input
                    value={newJob.title}
                    onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                    placeholder={language === 'kg' ? 'мис: Сатуучу' : 'напр: Продавец'}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {language === 'kg' ? 'Компания аталышы' : 'Название компании'}
                  </label>
                  <Input
                    value={newJob.companyName}
                    onChange={e => setNewJob({ ...newJob, companyName: e.target.value })}
                    placeholder={language === 'kg' ? 'Компанияңыздын аты' : 'Название вашей компании'}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {language === 'kg' ? 'Сүрөттөмө' : 'Описание'}
                  </label>
                  <Textarea
                    value={newJob.description}
                    onChange={e => setNewJob({ ...newJob, description: e.target.value })}
                    placeholder={language === 'kg' ? 'Жумуш милдеттери жана талаптар' : 'Обязанности и требования'}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {language === 'kg' ? 'Жумуш түрү' : 'Тип занятости'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {jobTypes.map(type => (
                      <button
                        key={type.id}
                        onClick={() => setNewJob({ ...newJob, jobType: type.id })}
                        className={`p-2 rounded-xl text-sm transition-colors ${
                          newJob.jobType === type.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary hover:bg-secondary/80'
                        }`}
                      >
                        {language === 'kg' ? type.kg : type.ru}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      {language === 'kg' ? 'Мин. маяна' : 'Мин. зарплата'}
                    </label>
                    <Input
                      type="number"
                      value={newJob.salaryMin}
                      onChange={e => setNewJob({ ...newJob, salaryMin: e.target.value })}
                      placeholder="15000"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      {language === 'kg' ? 'Макс. маяна' : 'Макс. зарплата'}
                    </label>
                    <Input
                      type="number"
                      value={newJob.salaryMax}
                      onChange={e => setNewJob({ ...newJob, salaryMax: e.target.value })}
                      placeholder="30000"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {language === 'kg' ? 'Байланыш телефону' : 'Контактный телефон'}
                  </label>
                  <Input
                    type="tel"
                    value={newJob.contactPhone}
                    onChange={e => setNewJob({ ...newJob, contactPhone: e.target.value })}
                    placeholder="+996 XXX XXX XXX"
                  />
                </div>

                <Button className="w-full" onClick={handleCreateJob}>
                  {language === 'kg' ? 'Жарыялоо' : 'Опубликовать'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Business Modal */}
      <AnimatePresence>
        {showBusinessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowBusinessModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={e => e.stopPropagation()}
              className="w-full bg-background rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold mb-4">
                {language === 'kg' ? 'Бизнес каттоо' : 'Регистрация бизнеса'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {language === 'kg' ? 'Аталышы' : 'Название'}
                  </label>
                  <Input
                    value={newBusiness.name}
                    onChange={e => setNewBusiness({ ...newBusiness, name: e.target.value })}
                    placeholder={language === 'kg' ? 'Бизнесиңиздин аты' : 'Название вашего бизнеса'}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {language === 'kg' ? 'Категория' : 'Категория'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {businessCategories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setNewBusiness({ ...newBusiness, category: cat.id })}
                        className={`p-2 rounded-xl text-center transition-colors ${
                          newBusiness.category === cat.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary hover:bg-secondary/80'
                        }`}
                      >
                        <span className="text-xl block">{cat.icon}</span>
                        <span className="text-xs">{language === 'kg' ? cat.kg : cat.ru}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {language === 'kg' ? 'Сүрөттөмө' : 'Описание'}
                  </label>
                  <Textarea
                    value={newBusiness.description}
                    onChange={e => setNewBusiness({ ...newBusiness, description: e.target.value })}
                    placeholder={language === 'kg' ? 'Бизнесиңиз жөнүндө' : 'О вашем бизнесе'}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {language === 'kg' ? 'Дарек' : 'Адрес'}
                  </label>
                  <Input
                    value={newBusiness.address}
                    onChange={e => setNewBusiness({ ...newBusiness, address: e.target.value })}
                    placeholder={language === 'kg' ? 'Жайгашкан жери' : 'Местоположение'}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {language === 'kg' ? 'Телефон' : 'Телефон'}
                  </label>
                  <Input
                    type="tel"
                    value={newBusiness.phone}
                    onChange={e => setNewBusiness({ ...newBusiness, phone: e.target.value })}
                    placeholder="+996 XXX XXX XXX"
                  />
                </div>

                <Button className="w-full" onClick={handleCreateBusiness}>
                  {language === 'kg' ? 'Каттоо' : 'Зарегистрировать'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EconomyView;
