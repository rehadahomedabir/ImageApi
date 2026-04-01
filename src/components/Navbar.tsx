import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, useTheme, useLanguage } from '../App';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Image, LogOut, LayoutDashboard, Key, LogIn, Sun, Moon, Menu, X, Code2, Shield, Languages } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { TranslationKey } from '../translations';

export default function Navbar() {
  const { user, userData } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  const navItems: { name: TranslationKey; path: string; icon: any }[] = [
    { name: 'nav_dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'nav_apiKey', path: '/api-key', icon: Key },
    { name: 'nav_settings', path: '/settings', icon: Shield },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12">
            <Image className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">IMAGEAPI</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/about"
            className={cn(
              "text-[11px] font-bold uppercase tracking-wider transition-colors",
              location.pathname === '/about' ? "text-accent" : "text-zinc-500 hover:text-accent"
            )}
          >
            {t('nav_about')}
          </Link>
          <Link
            to="/pricing"
            className={cn(
              "text-[11px] font-bold uppercase tracking-wider transition-colors",
              location.pathname === '/pricing' ? "text-accent" : "text-zinc-500 hover:text-accent"
            )}
          >
            {t('nav_pricing')}
          </Link>
          <Link
            to="/developer"
            className={cn(
              "text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center space-x-2",
              location.pathname === '/developer' ? "text-accent" : "text-zinc-500 hover:text-accent"
            )}
          >
            <Code2 className="w-3 h-3" />
            <span>{t('nav_developer')}</span>
          </Link>

          {user ? (
            <>
              {userData?.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className={cn(
                    "text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center space-x-2 text-accent",
                    location.pathname === '/admin/dashboard' ? "opacity-100" : "opacity-70 hover:opacity-100"
                  )}
                >
                  <Shield className="w-3 h-3" />
                  <span>Admin</span>
                </Link>
              )}
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center space-x-2",
                    location.pathname === item.path ? "text-accent" : "text-zinc-500 hover:text-accent"
                  )}
                >
                  <item.icon className="w-3 h-3" />
                  <span>{t(item.name)}</span>
                </Link>
              ))}
              <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800" />
              <button 
                onClick={toggleLanguage}
                className="p-2 text-zinc-500 hover:text-accent transition-colors flex items-center space-x-1"
              >
                <Languages className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">{language === 'en' ? t('lang_bn') : t('lang_en')}</span>
              </button>
              <button 
                onClick={toggleTheme}
                className="p-2 text-zinc-500 hover:text-accent transition-colors"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={handleLogout}
                className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-95"
              >
                {t('nav_logout')}
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={toggleLanguage}
                className="p-2 text-zinc-500 hover:text-accent transition-colors flex items-center space-x-1"
              >
                <Languages className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">{language === 'en' ? t('lang_bn') : t('lang_en')}</span>
              </button>
              <button 
                onClick={toggleTheme}
                className="p-2 text-zinc-500 hover:text-accent transition-colors"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <Link to="/login" className="bg-accent text-white text-[11px] font-bold uppercase tracking-wider px-6 py-2 rounded-lg hover:bg-accent-dark transition-all active:scale-95 shadow-lg shadow-accent/20">
                {t('nav_login')}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-zinc-500"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 p-6 space-y-4"
          >
            <Link 
              to="/about" 
              onClick={() => setIsMenuOpen(false)} 
              className={cn(
                "block text-[11px] font-bold uppercase tracking-wider",
                location.pathname === '/about' ? "text-accent" : "text-zinc-500"
              )}
            >
              {t('nav_about')}
            </Link>
            <Link 
              to="/pricing" 
              onClick={() => setIsMenuOpen(false)} 
              className={cn(
                "block text-[11px] font-bold uppercase tracking-wider",
                location.pathname === '/pricing' ? "text-accent" : "text-zinc-500"
              )}
            >
              {t('nav_pricing')}
            </Link>
            <Link 
              to="/developer" 
              onClick={() => setIsMenuOpen(false)} 
              className={cn(
                "block text-[11px] font-bold uppercase tracking-wider",
                location.pathname === '/developer' ? "text-accent" : "text-zinc-500"
              )}
            >
              {t('nav_developer')}
            </Link>

            {user ? (
              <>
                {userData?.role === 'admin' && (
                  <Link 
                    to="/admin/dashboard" 
                    onClick={() => setIsMenuOpen(false)} 
                    className={cn(
                      "block text-[11px] font-bold uppercase tracking-wider text-accent",
                      location.pathname === '/admin/dashboard' ? "opacity-100" : "opacity-70"
                    )}
                  >
                    Admin Dashboard
                  </Link>
                )}
                {navItems.map((item) => (
                  <Link 
                    key={item.path}
                    to={item.path} 
                    onClick={() => setIsMenuOpen(false)} 
                    className={cn(
                      "block text-[11px] font-bold uppercase tracking-wider",
                      location.pathname === item.path ? "text-accent" : "text-zinc-500"
                    )}
                  >
                    {t(item.name)}
                  </Link>
                ))}
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={toggleLanguage}
                    className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-[11px] font-bold uppercase tracking-wider py-4 rounded-xl flex items-center justify-center space-x-2"
                  >
                    <Languages className="w-4 h-4" />
                    <span>{language === 'en' ? t('lang_bn') : t('lang_en')}</span>
                  </button>
                  <button 
                    onClick={toggleTheme}
                    className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-[11px] font-bold uppercase tracking-wider py-4 rounded-xl flex items-center justify-center space-x-2"
                  >
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    <span>{isDark ? t('theme_light') : t('theme_dark')}</span>
                  </button>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[11px] font-bold uppercase tracking-wider py-4 rounded-xl flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('nav_logout')}</span>
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={toggleLanguage}
                    className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-[11px] font-bold uppercase tracking-wider py-4 rounded-xl flex items-center justify-center space-x-2"
                  >
                    <Languages className="w-4 h-4" />
                    <span>{language === 'en' ? t('lang_bn') : t('lang_en')}</span>
                  </button>
                  <button 
                    onClick={toggleTheme}
                    className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-[11px] font-bold uppercase tracking-wider py-4 rounded-xl flex items-center justify-center space-x-2"
                  >
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    <span>{isDark ? t('theme_light') : t('theme_dark')}</span>
                  </button>
                </div>
                <Link 
                  to="/login" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="block w-full bg-accent text-white text-[11px] font-bold uppercase tracking-wider py-4 rounded-xl text-center shadow-lg shadow-accent/20"
                >
                  {t('nav_login')}
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
