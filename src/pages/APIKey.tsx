import React, { useState, useEffect } from 'react';
import { useAuth, useLanguage } from '../App';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { 
  Key, 
  Copy, 
  Check, 
  RefreshCw, 
  Terminal, 
  Shield, 
  Cpu, 
  Zap, 
  Info, 
  ExternalLink,
  Lock,
  AlertTriangle,
  Globe,
  Code2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function APIKey() {
  const { user, userData } = useAuth();
  const { t } = useLanguage();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        setApiKey(doc.data().apiKey || null);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const generateKey = async () => {
    if (!user) return;
    
    setRegenerating(true);
    const newKey = `ia_${crypto.randomUUID().replace(/-/g, '').substring(0, 24)}`;
    
    try {
      await setDoc(doc(db, 'users', user.uid), {
        apiKey: newKey,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      toast.success(t('toast_api_gen_success'));
      setShowConfirm(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
      toast.error(t('toast_api_gen_error'));
    } finally {
      setRegenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(t('toast_url_copied'));
  };

  const curlExample = `curl -X POST https://api.image-api.pro.bd/v1/upload \\
  -H "X-API-Key: ${apiKey || 'YOUR_API_KEY'}" \\
  -F "image=@/path/to/image.jpg"`;

  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-accent">
            <Cpu className="w-6 h-6" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">{t('system_auth_management')}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display tracking-tighter text-black dark:text-zinc-100 uppercase leading-tight">
            {t('api_title').split(' ')[0]} <span className="text-zinc-400">{t('api_title').split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-xl text-lg">
            {t('api_subtitle')}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right hidden md:block">
            <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">{t('footer_status')}</p>
            <div className="flex items-center justify-end space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="font-mono text-xs font-bold text-black dark:text-zinc-100 uppercase">{t('operational')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Key Card */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group border-zinc-200 dark:border-zinc-800"
          >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Shield className="w-64 h-64" />
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-20"></div>

            <div className="relative space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-black dark:bg-zinc-100 rounded-2xl flex items-center justify-center shadow-xl">
                    <Key className="w-6 h-6 text-white dark:text-zinc-900" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black dark:text-zinc-100 uppercase tracking-tight">Production API Key</h3>
                    <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Active Session Credential</p>
                  </div>
                </div>
                <div className="px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                  <span className="text-[11px] font-mono font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">v1.0.4 / Stable</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative group/key">
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover/key:opacity-100 transition duration-500"></div>
                  <div className="relative flex items-center bg-white dark:bg-zinc-900/50 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 font-mono text-lg md:text-2xl break-all shadow-inner min-h-[5rem]">
                    {loading ? (
                      <div className="w-full h-8 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                    ) : (
                      <span className="flex-1 text-black dark:text-zinc-100 tracking-tight">
                        {apiKey || '••••••••••••••••••••••••••••'}
                      </span>
                    )}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={copyToClipboard}
                        disabled={!apiKey}
                        className="p-2 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-100 rounded-lg transition-all shadow-sm border border-zinc-200 dark:border-zinc-700 active:scale-90 disabled:opacity-50"
                        title={t('api_copy')}
                      >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center space-x-2 text-zinc-400">
                    <Lock className="w-3 h-3" />
                    <span className="text-[11px] font-mono uppercase tracking-wider">{t('encrypted_storage')}</span>
                  </div>
                  
                  {showConfirm ? (
                    <div className="flex items-center space-x-3 bg-white dark:bg-zinc-900 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg">
                      <span className="text-[11px] font-bold text-red-500 uppercase tracking-wider px-2">{t('confirm_regeneration')}</span>
                      <button
                        onClick={generateKey}
                        disabled={regenerating}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg font-bold text-[11px] uppercase tracking-wider hover:bg-red-600 transition-all active:scale-95"
                      >
                        {regenerating ? t('regenerating') : t('yes_rotate')}
                      </button>
                      <button
                        onClick={() => setShowConfirm(false)}
                        className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg font-bold text-[11px] uppercase tracking-wider hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all active:scale-95"
                      >
                        {t('cancel')}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => apiKey ? setShowConfirm(true) : generateKey()}
                      disabled={regenerating}
                      className="flex items-center space-x-2 text-zinc-500 hover:text-black dark:hover:text-zinc-100 transition-colors group/regen"
                    >
                      <RefreshCw className={cn("w-4 h-4 transition-transform group-hover/regen:rotate-180", regenerating && "animate-spin")} />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {apiKey ? t('api_regenerate') : t('step_01_title_key')}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: t('requests_label'), value: t('unlimited'), icon: Zap },
                  { label: t('region_label'), value: t('global'), icon: Globe },
                  { label: t('latency_label'), value: '< 50ms', icon: Cpu },
                  { label: t('uptime_label'), value: '99.99%', icon: Shield },
                ].map((stat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center space-x-2 text-zinc-400">
                      <stat.icon className="w-3 h-3" />
                      <span className="text-[11px] font-mono uppercase tracking-wider">{stat.label}</span>
                    </div>
                    <p className="font-bold text-black dark:text-zinc-100">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Integration */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Terminal className="w-5 h-5 text-zinc-400" />
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-400">{t('quick_integration')}</h3>
            </div>
            <div className="bg-zinc-900 rounded-3xl p-8 relative group overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-4">
                <Code2 className="w-12 h-12 text-zinc-800" />
              </div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">{t('bash_curl')}</span>
              </div>
              <pre className="font-mono text-sm text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {curlExample}
              </pre>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(curlExample);
                  toast.success(t('example_copied'));
                }}
                className="absolute bottom-6 right-6 p-3 bg-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-all opacity-0 group-hover:opacity-100"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="glass rounded-[2.5rem] p-8 border-zinc-200 dark:border-zinc-800 space-y-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center">
                <Info className="w-6 h-6 text-accent" />
              </div>
              <h4 className="text-lg font-bold text-black dark:text-zinc-100 uppercase tracking-tight">{t('setup_guide')}</h4>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                {t('setup_guide_desc')}
              </p>
            </div>

            <div className="space-y-6 pt-8 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                  <span className="font-mono text-xs font-bold">{t('step_01_label')}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-black dark:text-zinc-100 uppercase">{t('step_01_title_key')}</p>
                  <p className="text-xs text-zinc-500">{t('step_01_desc_key')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                  <span className="font-mono text-xs font-bold">{t('step_02_label')}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-black dark:text-zinc-100 uppercase">{t('step_02_title_key')}</p>
                  <p className="text-xs text-zinc-500">{t('step_02_desc_key')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                  <span className="font-mono text-xs font-bold">{t('step_03_label')}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-black dark:text-zinc-100 uppercase">{t('step_03_title_key')}</p>
                  <p className="text-xs text-zinc-500">{t('step_03_desc_key')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-[2.5rem] p-8 border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center space-x-3 text-amber-500">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="text-sm font-bold uppercase tracking-tight">{t('security_protocol')}</h4>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
              {t('security_protocol_desc')}
            </p>
          </div>

          <div className="bg-accent rounded-[2.5rem] p-8 text-white space-y-4 shadow-xl shadow-accent/20">
            <h4 className="text-lg font-bold uppercase tracking-tight">{t('need_help')}</h4>
            <p className="text-white/80 text-sm leading-relaxed">
              {t('need_help_desc')}
            </p>
            <button className="w-full py-3 bg-white text-accent rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-zinc-100 transition-colors">
              {t('view_docs')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
