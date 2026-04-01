import * as React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Toaster } from 'react-hot-toast';
import { AlertCircle, RefreshCcw, Image } from 'lucide-react';
import { translations, Language, TranslationKey } from './translations';

// Language Context
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

export const useLanguage = () => useContext(LanguageContext);

// Error Boundary Component
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = translations[localStorage.getItem('language') as Language || 'en'].something_went_wrong;
      try {
        const parsed = JSON.parse(this.state.error.message);
        if (parsed.error) errorMessage = parsed.error;
      } catch (e) {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 p-4">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-xl max-w-md w-full text-center space-y-6">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">
                {translations[localStorage.getItem('language') as Language || 'en'].application_error}
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">{errorMessage}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center space-x-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-4 rounded-xl font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-95 shadow-xl"
            >
              <RefreshCcw className="w-4 h-4" />
              <span>{translations[localStorage.getItem('language') as Language || 'en'].reload_application}</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import APIKey from './pages/APIKey';
import Developer from './pages/Developer';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';

// Components
import Navbar from './components/Navbar';

// Auth Context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  userData: any | null;
}

// Theme Context
interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, userData: null });
const ThemeContext = createContext<ThemeContextType>({ isDark: false, toggleTheme: () => {} });

export const useAuth = () => useContext(AuthContext);
export const useTheme = () => useContext(ThemeContext);

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('language') as Language) || 'en';
    }
    return 'en';
  });

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: TranslationKey) => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          // Fetch or create user data in Firestore
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
            if (userDoc.exists()) {
              const data = userDoc.data();
              const isAdmin = user.email === 'barehadahomed@gmail.com';
              if (isAdmin && data.role !== 'admin') {
                const updatedData = { ...data, role: 'admin' };
                await setDoc(userDocRef, updatedData);
                setUserData(updatedData);
              } else {
                setUserData(data);
              }
            } else {
              // Create user doc if it doesn't exist
              const isAdmin = user.email === 'barehadahomed@gmail.com';
              const newUserData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                apiKey: `ia_${crypto.randomUUID().replace(/-/g, '').substring(0, 24)}`,
                createdAt: new Date().toISOString(),
                role: isAdmin ? 'admin' : 'user'
              };
              await setDoc(userDocRef, newUserData);
              setUserData(newUserData);
            }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-zinc-950">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-zinc-200 dark:border-zinc-800 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-accent rounded-full animate-spin border-t-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Image className="w-8 h-8 text-accent animate-pulse" />
          </div>
        </div>
        <p className="mt-6 text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-[0.2em] animate-pulse">
          {translations[language].initializing}
        </p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <LanguageContext.Provider value={{ language, setLanguage, t }}>
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
          <AuthContext.Provider value={{ user, loading, userData }}>
            <BrowserRouter>
              <div className="min-h-screen transition-colors duration-300 bg-white dark:bg-zinc-950">
                <Navbar />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={user ? (userData?.role === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/dashboard" />) : <Login />} />
                    <Route path="/admin/login" element={user ? (userData?.role === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/dashboard" />) : <AdminLogin />} />
                    <Route path="/dashboard" element={user ? (userData?.role === 'admin' ? <Navigate to="/admin/dashboard" /> : <Dashboard />) : <Navigate to="/login" />} />
                    <Route path="/admin/dashboard" element={user && userData?.role === 'admin' ? <Admin /> : <Navigate to="/admin/login" />} />
                    <Route path="/api-key" element={user ? <APIKey /> : <Navigate to="/login" />} />
                    <Route path="/developer" element={<Developer />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
                  </Routes>
                </main>
                <Toaster position="bottom-right" toastOptions={{
                  className: 'glass dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-2xl font-bold uppercase tracking-widest text-xs',
                }} />
              </div>
            </BrowserRouter>
          </AuthContext.Provider>
        </ThemeContext.Provider>
      </LanguageContext.Provider>
    </ErrorBoundary>
  );
}
