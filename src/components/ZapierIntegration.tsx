import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Send, Check, AlertCircle, Trash2, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ZapierIntegrationProps {
  onBack: () => void;
}

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  trigger_type: 'new_post' | 'new_issue' | 'new_donation' | 'manual';
  is_active: boolean;
}

const ZapierIntegration: React.FC<ZapierIntegrationProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const { profile } = useAuth();
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    trigger_type: 'manual' as const
  });
  const [testingId, setTestingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile?.id) {
      loadWebhooks();
    }
  }, [profile?.id]);

  const loadWebhooks = async () => {
    // Load from localStorage for simplicity (could use Supabase in production)
    const saved = localStorage.getItem(`zapier_webhooks_${profile?.id}`);
    if (saved) {
      setWebhooks(JSON.parse(saved));
    }
  };

  const saveWebhooks = (updatedWebhooks: WebhookConfig[]) => {
    localStorage.setItem(`zapier_webhooks_${profile?.id}`, JSON.stringify(updatedWebhooks));
    setWebhooks(updatedWebhooks);
  };

  const handleAddWebhook = () => {
    if (!newWebhook.name || !newWebhook.url) {
      toast.error(language === 'kg' ? 'Бардык талааларды толтуруңуз' : 'Заполните все поля');
      return;
    }

    if (!newWebhook.url.includes('hooks.zapier.com')) {
      toast.error(language === 'kg' ? 'Zapier webhook URL киргизиңиз' : 'Введите Zapier webhook URL');
      return;
    }

    const webhook: WebhookConfig = {
      id: Date.now().toString(),
      ...newWebhook,
      is_active: true
    };

    saveWebhooks([...webhooks, webhook]);
    setNewWebhook({ name: '', url: '', trigger_type: 'manual' });
    setShowAddForm(false);
    toast.success(language === 'kg' ? 'Webhook кошулду' : 'Webhook добавлен');
  };

  const handleDeleteWebhook = (id: string) => {
    saveWebhooks(webhooks.filter(w => w.id !== id));
    toast.success(language === 'kg' ? 'Webhook өчүрүлдү' : 'Webhook удален');
  };

  const handleTestWebhook = async (webhook: WebhookConfig) => {
    setTestingId(webhook.id);
    
    try {
      await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          event: 'test',
          timestamp: new Date().toISOString(),
          triggered_from: window.location.origin,
          user: profile?.full_name || profile?.username,
          message: language === 'kg' 
            ? 'Бул тест билдирүүсү Айыл платформасынан' 
            : 'Это тестовое сообщение из платформы Айыл'
        }),
      });

      toast.success(
        language === 'kg' 
          ? 'Суроо-талап жөнөтүлдү! Zapier тарыхыңызды текшериңиз' 
          : 'Запрос отправлен! Проверьте историю в Zapier'
      );
    } catch (error) {
      console.error('Webhook error:', error);
      toast.error(language === 'kg' ? 'Ката кетти' : 'Ошибка');
    } finally {
      setTestingId(null);
    }
  };

  const triggerTypes = [
    { value: 'manual', label: language === 'kg' ? 'Кол менен' : 'Вручную' },
    { value: 'new_post', label: language === 'kg' ? 'Жаңы пост' : 'Новый пост' },
    { value: 'new_issue', label: language === 'kg' ? 'Жаңы көйгөй' : 'Новая проблема' },
    { value: 'new_donation', label: language === 'kg' ? 'Жаңы доната' : 'Новое пожертвование' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-3 -mt-2 mb-4">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Zapier</h1>
            <p className="text-xs text-muted-foreground">
              {language === 'kg' ? 'Автоматташтыруу' : 'Автоматизация'}
            </p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4">
        <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-orange-500" />
          {language === 'kg' ? 'Кантип иштетүү?' : 'Как использовать?'}
        </h3>
        <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
          <li>{language === 'kg' ? 'Zapier.com дан Zap түзүңүз' : 'Создайте Zap на Zapier.com'}</li>
          <li>{language === 'kg' ? 'Trigger катары "Webhooks by Zapier" тандаңыз' : 'Выберите "Webhooks by Zapier" как триггер'}</li>
          <li>{language === 'kg' ? 'Webhook URL\'ын көчүрүп, бул жерге коюңуз' : 'Скопируйте Webhook URL и вставьте сюда'}</li>
          <li>{language === 'kg' ? 'Action\'да Telegram, Email же башка тандаңыз' : 'В Action выберите Telegram, Email или другое'}</li>
        </ol>
      </div>

      {/* Webhooks List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">
            {language === 'kg' ? 'Webhook\'тар' : 'Вебхуки'} ({webhooks.length})
          </h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-foreground text-background rounded-full text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            {language === 'kg' ? 'Кошуу' : 'Добавить'}
          </button>
        </div>

        {webhooks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Zap className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">
              {language === 'kg' ? 'Webhook\'тар жок' : 'Нет вебхуков'}
            </p>
          </div>
        ) : (
          webhooks.map((webhook) => (
            <motion.div
              key={webhook.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-secondary/50 rounded-2xl p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium">{webhook.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {triggerTypes.find(t => t.value === webhook.trigger_type)?.label}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteWebhook(webhook.id)}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground font-mono mb-3 truncate">
                {webhook.url}
              </p>
              <button
                onClick={() => handleTestWebhook(webhook)}
                disabled={testingId === webhook.id}
                className="w-full py-2 bg-orange-500 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2"
              >
                {testingId === webhook.id ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {language === 'kg' ? 'Тест жөнөтүү' : 'Отправить тест'}
                  </>
                )}
              </button>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Webhook Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowAddForm(false)}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-background rounded-2xl w-full max-w-md p-5"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-bold text-lg mb-4">
              {language === 'kg' ? 'Жаңы Webhook' : 'Новый Webhook'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  {language === 'kg' ? 'Аталышы' : 'Название'}
                </label>
                <input
                  type="text"
                  value={newWebhook.name}
                  onChange={e => setNewWebhook(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={language === 'kg' ? 'Мисалы: Telegram билдирүү' : 'Например: Уведомление в Telegram'}
                  className="w-full px-4 py-3 bg-secondary rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Zapier Webhook URL
                </label>
                <input
                  type="url"
                  value={newWebhook.url}
                  onChange={e => setNewWebhook(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://hooks.zapier.com/hooks/catch/..."
                  className="w-full px-4 py-3 bg-secondary rounded-xl text-sm font-mono"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  {language === 'kg' ? 'Триггер түрү' : 'Тип триггера'}
                </label>
                <select
                  value={newWebhook.trigger_type}
                  onChange={e => setNewWebhook(prev => ({ ...prev, trigger_type: e.target.value as any }))}
                  className="w-full px-4 py-3 bg-secondary rounded-xl text-sm"
                >
                  {triggerTypes.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-3 bg-secondary rounded-xl font-medium"
              >
                {language === 'kg' ? 'Жокко чыгаруу' : 'Отмена'}
              </button>
              <button
                onClick={handleAddWebhook}
                className="flex-1 py-3 bg-foreground text-background rounded-xl font-medium"
              >
                {language === 'kg' ? 'Кошуу' : 'Добавить'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ZapierIntegration;
