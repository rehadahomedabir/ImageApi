import React, { useState } from 'react';
import { useAuth, useLanguage } from '../App';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Smartphone, 
  Globe, 
  Lock, 
  Save,
  Camera,
  Trash2,
  AlertCircle,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Settings() {
  const { user, userData } = useAuth();
  const { t } = useLanguage();
  const [displayName, setDisplayName] = useState(userData?.displayName || '');
  const [saving, setSaving] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName,
        updatedAt: new Date().toISOString()
      });
      toast.success(t('toast_profile_updated'));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
      toast.error(t('toast_profile_error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 text-accent">
          <Shield className="w-6 h-6" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider">System / Profile / Configuration</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-display tracking-tighter text-black dark:text-zinc-100 uppercase leading-tight">
          {t('settings_title').split(' ')[0]} <span className="text-zinc-400">{t('settings_title').split(' ').slice(1).join(' ')}</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-xl text-lg">
          {t('settings_subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Navigation */}
        <div className="space-y-2">
          {[
            { label: t('settings_profile_tab'), icon: User, active: true },
            { label: t('settings_security_tab'), icon: Lock, active: false },
            { label: t('settings_notifications_tab'), icon: Bell, active: false },
            { label: t('settings_api_tab'), icon: Globe, active: false },
          ].map((item, i) => (
            <button
              key={i}
              className={cn(
                "w-full flex items-center space-x-3 px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all",
                item.active 
                  ? "bg-accent text-white shadow-lg shadow-accent/20" 
                  : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900/50"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-[2.5rem] p-8 md:p-12 border-zinc-200 dark:border-zinc-800 space-y-10"
          >
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-3xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border-2 border-zinc-200 dark:border-zinc-700 overflow-hidden">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-zinc-400" />
                  )}
                </div>
                <button className="absolute -bottom-2 -right-2 p-2 bg-accent text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all active:scale-90">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            <div className="space-y-1">
                <h3 className="text-xl font-bold text-black dark:text-zinc-100 uppercase tracking-tight">{userData?.displayName || 'User'}</h3>
                <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">{userData?.role || 'Developer'} Account</p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="micro-label text-zinc-400">{t('settings_display_name')}</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                      placeholder="Your Name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="micro-label text-zinc-400">{t('settings_email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full pl-12 pr-4 py-4 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm text-zinc-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-[11px] text-zinc-400 font-mono uppercase tracking-wider">{t('settings_email_oauth_desc')}</p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center space-x-2 bg-accent text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-accent-dark transition-all active:scale-95 shadow-lg shadow-accent/20 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? t('settings_saving') : t('settings_save_profile')}</span>
                </button>
              </div>
            </form>
          </motion.div>

          {/* Support Section */}
          <div id="support" className="space-y-6 pt-8 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold uppercase tracking-tight">{t('settings_support')}</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{t('settings_support_desc')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href="mailto:support@image-api.pro.bd" className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-6 hover:border-accent/50 transition-all group">
                <h4 className="font-display font-bold uppercase tracking-tight group-hover:text-accent transition-colors">{t('settings_email_support')}</h4>
                <p className="text-xs text-zinc-500 mt-1">{t('settings_email_support_desc')}</p>
              </a>
              <Link to="/developer" className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-6 hover:border-accent/50 transition-all group">
                <h4 className="font-display font-bold uppercase tracking-tight group-hover:text-accent transition-colors">{t('settings_docs')}</h4>
                <p className="text-xs text-zinc-500 mt-1">{t('settings_docs_desc')}</p>
              </Link>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-[2.5rem] p-8 md:p-12 space-y-6">
            <div className="flex items-center space-x-3 text-red-500">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-lg font-bold uppercase tracking-tight">{t('settings_danger_zone')}</h3>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <p className="text-sm font-bold text-black dark:text-zinc-100 uppercase">{t('settings_delete_account')}</p>
                <p className="text-xs text-zinc-500">{t('settings_delete_account_desc')}</p>
              </div>
              <button className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-red-500 text-red-500 rounded-xl font-bold uppercase tracking-wider text-[11px] hover:bg-red-500 hover:text-white transition-all active:scale-95">
                <Trash2 className="w-4 h-4" />
                <span>{t('settings_delete_account')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
