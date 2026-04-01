import React, { useState } from 'react';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { LogIn, Shield, Zap, Globe, ArrowRight, Loader2, Sparkles, Lock, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../App';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    const toastId = toast.loading(t('toast_login_opening'));
    
    // Set custom parameters to ensure a fresh login experience
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const isAdminEmail = result.user.email === 'barehadahomed@gmail.com';
      
      // Fetch user role to decide redirection
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      const role = userDoc.exists() ? userDoc.data()?.role : (isAdminEmail ? 'admin' : 'user');

      toast.success(t('toast_login_welcome'), { id: toastId });
      
      if (role === 'admin' || isAdminEmail) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      // Only log unexpected errors
      if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        console.error('Login error:', error);
      }

      if (error.code === 'auth/popup-closed-by-user') {
        toast.error(t('toast_login_popup_closed'), { id: toastId });
      } else if (error.code === 'auth/cancelled-popup-request') {
        toast.dismiss(toastId);
      } else if (error.code === 'auth/popup-blocked') {
        toast.error(t('toast_login_popup_blocked'), { id: toastId });
      } else {
        toast.error(t('toast_login_failed'), { id: toastId });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 lg:p-12 overflow-hidden grid-pattern">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl">
        {/* Left Side: Brand & Info (7 cols) */}
        <div className="lg:col-span-7 p-12 lg:p-24 space-y-16 bg-white dark:bg-zinc-950/50 relative overflow-hidden border-r border-zinc-200 dark:border-zinc-800">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:40px_40px]" />
          </div>

          <div className="relative z-10 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center space-x-3 text-accent font-mono text-[11px] font-bold tracking-wider uppercase"
            >
              <div className="w-12 h-[1px] bg-accent" />
              <span>{t('login_identity_service')}</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl sm:text-7xl lg:text-8xl font-display font-bold tracking-tighter text-gradient uppercase leading-[0.85]"
            >
              {t('login_title').split(' ')[0]}<br />
              <span className="text-accent">{t('login_title').split(' ').slice(1).join(' ')}</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-zinc-500 dark:text-zinc-400 font-medium max-w-md leading-relaxed"
            >
              {t('login_subtitle')}
            </motion.p>
          </div>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-8 pt-12">
            <div className="space-y-4 group">
              <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center shadow-lg border border-zinc-200 dark:border-zinc-800 transition-transform group-hover:scale-110">
                <Lock className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-display font-bold text-black dark:text-zinc-100 uppercase tracking-tight">{t('login_encrypted_title')}</h4>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                {t('login_encrypted_desc')}
              </p>
            </div>

            <div className="space-y-4 group">
              <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center shadow-lg border border-zinc-200 dark:border-zinc-800 transition-transform group-hover:scale-110">
                <Cpu className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-display font-bold text-black dark:text-zinc-100 uppercase tracking-tight">{t('login_automated_title')}</h4>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                {t('login_automated_desc')}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Action (5 cols) */}
        <div className="lg:col-span-5 p-12 lg:p-24 flex flex-col items-center justify-center space-y-12 bg-white dark:bg-zinc-900">
          <div className="text-center space-y-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 bg-zinc-900 dark:bg-zinc-100 rounded-3xl flex items-center justify-center mx-auto shadow-2xl relative"
            >
              <LogIn className="w-10 h-10 text-white dark:text-zinc-900" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </motion.div>
            <div className="space-y-2">
              <h2 className="text-4xl font-display font-bold uppercase tracking-tight text-black dark:text-zinc-100">{t('nav_login')}</h2>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium">{t('login_subtitle')}</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center space-x-4 py-5 text-lg disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                <span>{t('login_btn')}</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </motion.button>

          <div className="pt-12 text-center space-y-6">
            <p className="text-zinc-400 dark:text-zinc-500 text-[11px] font-bold uppercase tracking-wider max-w-xs leading-relaxed">
              {t('login_terms_privacy').split('Terms')[0]} <a href="#" className="underline hover:text-accent">Terms</a> {t('login_terms_privacy').split('Terms')[1].split('Privacy')[0]} <a href="#" className="underline hover:text-accent">Privacy</a>.
            </p>
            
            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <button 
                onClick={() => navigate('/admin/login')}
                className="text-[10px] font-mono font-bold text-zinc-400 dark:text-zinc-500 hover:text-accent uppercase tracking-widest transition-colors"
              >
                System Access / Admin Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
