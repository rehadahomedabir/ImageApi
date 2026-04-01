import React, { useState } from 'react';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Shield, Lock, ArrowRight, Loader2, Sparkles, Cpu, Terminal } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useLanguage, useAuth } from '../App';

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { userData } = useAuth();

  const handleAdminLogin = async () => {
    if (loading) return;
    setLoading(true);
    const toastId = toast.loading('Initiating Secure Admin Login...');
    
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const isAdminEmail = result.user.email === 'barehadahomed@gmail.com';
      
      // Fetch user role to decide redirection
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      const role = userDoc.exists() ? userDoc.data()?.role : (isAdminEmail ? 'admin' : 'user');

      if (role === 'admin' || isAdminEmail) {
        toast.success('Admin Authentication Successful', { id: toastId });
        navigate('/admin/dashboard');
      } else {
        toast.error('Access Denied: Not an Administrator', { id: toastId });
        // Optionally sign out if not an admin
        // await auth.signOut();
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Admin Login error:', error);
      toast.error('Admin Authentication Failed', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 lg:p-12 overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-zinc-900 rounded-[2rem] border border-zinc-800 overflow-hidden shadow-2xl relative z-10">
        {/* Left Side: System Info */}
        <div className="p-12 lg:p-20 space-y-12 bg-zinc-950/50 border-r border-zinc-800">
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center space-x-3 text-accent font-mono text-[10px] font-bold tracking-[0.3em] uppercase"
            >
              <Terminal className="w-4 h-4" />
              <span>System / Admin / Protocol</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl lg:text-6xl font-display font-bold tracking-tighter text-white uppercase leading-[0.9]"
            >
              Admin <span className="text-accent">Access</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-zinc-400 font-medium max-w-sm leading-relaxed"
            >
              Restricted access for system administrators. Authenticate with your authorized Google account.
            </motion.p>
          </div>

          <div className="space-y-6 pt-8">
            <div className="flex items-center space-x-4 group">
              <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800 group-hover:border-accent transition-colors">
                <Lock className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Secure Vault</h4>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">End-to-end encrypted</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 group">
              <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800 group-hover:border-accent transition-colors">
                <Cpu className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Neural Core</h4>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Automated Management</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Action */}
        <div className="p-12 lg:p-20 flex flex-col items-center justify-center space-y-10">
          <div className="text-center space-y-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 bg-zinc-100 rounded-3xl flex items-center justify-center mx-auto shadow-2xl relative"
            >
              <Shield className="w-10 h-10 text-zinc-900" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </motion.div>
            <div className="space-y-2">
              <h2 className="text-3xl font-display font-bold uppercase tracking-tight text-white">Authenticate</h2>
              <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest font-bold">Admin Identity Service</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdminLogin}
            disabled={loading}
            className="w-full bg-white text-zinc-900 hover:bg-accent hover:text-white transition-all duration-300 flex items-center justify-center space-x-4 py-5 rounded-2xl text-sm font-bold uppercase tracking-widest disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                <span>Admin Login</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </motion.button>

          <p className="text-zinc-600 text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-center leading-relaxed">
            Unauthorized access is strictly prohibited and monitored by system protocols.
          </p>
        </div>
      </div>
    </div>
  );
}
