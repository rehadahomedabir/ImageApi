import React from 'react';
import { Link } from 'react-router-dom';
import { Image, Code, Upload, Globe, ArrowRight, Key, Sparkles, Zap, Shield, Cpu, Layers, ArrowUpRight, MousePointer2, Terminal, BarChart3, Cloud } from 'lucide-react';
import { useAuth, useLanguage } from '../App';
import { motion } from 'motion/react';

export default function Landing() {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center w-full min-h-screen grid-pattern">
      {/* Hero Section - High Impact SaaS */}
      <section className="relative w-full pt-48 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-accent/10 blur-[150px] rounded-full opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto text-center space-y-12 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full text-[11px] font-bold uppercase tracking-wider text-accent"
          >
            <Sparkles className="w-3 h-3" />
            <span>{t('infra_live')}</span>
          </motion.div>

          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-7xl md:text-9xl font-display font-bold tracking-tighter text-gradient uppercase leading-[1.1]"
            >
              {t('hero_title')} <br />
              <span className="text-accent">{t('hero_subtitle')}</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-2xl text-zinc-500 dark:text-zinc-400 max-w-3xl mx-auto font-medium leading-relaxed"
            >
              {t('hero_description')}
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
          >
            <Link to={user ? "/dashboard" : "/login"} className="bg-accent text-white px-12 py-6 rounded-2xl font-display font-bold text-xl uppercase tracking-wider hover:bg-accent-dark transition-all active:scale-95 shadow-2xl shadow-accent/20 flex items-center space-x-3">
              <span>{t('hero_cta_primary')}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/developer" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-12 py-6 rounded-2xl font-display font-bold text-xl uppercase tracking-wider hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all active:scale-95">
              {t('hero_cta_secondary')}
            </Link>
          </motion.div>

          {/* Technical Specs Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="pt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto"
          >
            {[
              { label: t('dev_protocol'), value: 'v4.2.0-stable' },
              { label: t('nav_developer'), value: '128 Active', live: true },
              { label: t('edge_pulse'), value: 'WebSocket/TLS' },
              { label: t('secure_vault'), value: '99.9999%' },
            ].map((spec, i) => (
              <div key={i} className="p-6 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-left space-y-2 group hover:border-accent/50 transition-colors">
                <p className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">{spec.label}</p>
                <div className="flex items-center space-x-2">
                  {spec.live && <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />}
                  <p className="text-lg font-display font-bold text-zinc-900 dark:text-zinc-100">{spec.value}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features - Bento Grid */}
      <section id="features" className="w-full max-w-7xl mx-auto px-6 py-20 space-y-20">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-display font-bold">{t('built_for_performance')}</h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            {t('performance_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 - Large */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 bento-card flex flex-col md:flex-row gap-12 items-center"
          >
            <div className="w-32 h-32 bg-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Upload className="w-12 h-12 text-accent" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-display font-bold">{t('unlimited_ingestion')}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {t('unlimited_ingestion_desc')}
              </p>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bento-card flex flex-col justify-between"
          >
            <Shield className="w-10 h-10 text-accent mb-8" />
            <div className="space-y-2">
              <h3 className="text-xl font-display font-bold">{t('secure_vault')}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {t('secure_vault_desc')}
              </p>
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bento-card flex flex-col justify-between"
          >
            <Zap className="w-10 h-10 text-accent mb-8" />
            <div className="space-y-2">
              <h3 className="text-xl font-display font-bold">{t('edge_pulse')}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {t('edge_pulse_desc')}
              </p>
            </div>
          </motion.div>

          {/* Feature 4 - Large */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 bento-card flex flex-col md:flex-row gap-12 items-center"
          >
            <div className="w-32 h-32 bg-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Terminal className="w-12 h-12 text-accent" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-display font-bold">{t('dev_protocol')}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {t('dev_protocol_desc')}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Integration Guide Section */}
        <div className="pt-20 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tight">{t('integration_guide')}</h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
              {t('integration_guide_desc')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: t('step_01_title'), desc: t('step_01_desc') },
              { step: '02', title: t('step_02_title'), desc: t('step_02_desc') },
              { step: '03', title: t('step_03_title'), desc: t('step_03_desc') },
            ].map((item, i) => (
              <div key={i} className="space-y-4 p-8 bg-white dark:bg-zinc-900/30 rounded-3xl border border-zinc-200 dark:border-zinc-800">
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center font-mono font-bold text-white">
                  {item.step}
                </div>
                <h4 className="text-xl font-display font-bold uppercase tracking-tight">{item.title}</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-20 bg-white dark:bg-zinc-900/50 border-y border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: t('latency'), value: '< 50ms' },
            { label: t('uptime'), value: '99.99%' },
            { label: t('assets'), value: '10B+' },
            { label: t('requests'), value: '1M/s' },
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-2">
              <div className="text-3xl md:text-4xl font-display font-bold text-accent">{stat.value}</div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="w-full max-w-4xl mx-auto px-6 py-40 text-center space-y-8">
        <h2 className="text-5xl md:text-6xl font-display font-bold tracking-tight">{t('ready_to_scale')}</h2>
        <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium">
          {t('join_devs')}
        </p>
        <div className="pt-4">
          <Link to="/login" className="btn-primary inline-flex items-center space-x-2 px-12 py-6 text-lg">
            <span>{t('get_started_free')}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-12 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Image className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">IMAGE-API</span>
        </div>
        <div className="flex items-center space-x-8 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
          <Link to="/about" className="hover:text-accent transition-colors">{t('nav_about')}</Link>
          <Link to="/pricing" className="hover:text-accent transition-colors">{t('nav_pricing')}</Link>
          <Link to="/developer" className="hover:text-accent transition-colors">{t('nav_developer')}</Link>
          <Link to="/developer" className="hover:text-accent transition-colors">{t('footer_docs')}</Link>
          <Link to="/about" className="hover:text-accent transition-colors">{t('footer_privacy')}</Link>
          <Link to="/pricing" className="hover:text-accent transition-colors">{t('footer_status')}</Link>
        </div>
        <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
          {t('copyright')}
        </div>
      </footer>
    </div>
  );
}
