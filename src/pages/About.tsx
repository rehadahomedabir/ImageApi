import React from 'react';
import { Users, Target, Rocket, Heart, Shield, Globe, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../App';

export default function About() {
  const { t } = useLanguage();
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest"
        >
          <Users className="w-3 h-3" />
          <span>{t('about_badge')}</span>
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter uppercase leading-none">
          {t('about_title').split(' ')[0]} <br />
          <span className="text-zinc-400">{t('about_title').split(' ').slice(1).join(' ')}</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl leading-relaxed">
          {t('about_subtitle')}
        </p>
      </section>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bento-card space-y-6">
          <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center">
            <Target className="w-6 h-6 text-accent" />
          </div>
          <h3 className="text-2xl font-display font-bold uppercase tracking-tight">{t('about_mission_title')}</h3>
          <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {t('about_mission_desc')}
          </p>
        </div>
        <div className="bento-card space-y-6">
          <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center">
            <Rocket className="w-6 h-6 text-accent" />
          </div>
          <h3 className="text-2xl font-display font-bold uppercase tracking-tight">{t('about_vision_title')}</h3>
          <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {t('about_vision_desc')}
          </p>
        </div>
      </div>

      {/* Values */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-400">{t('about_values_badge')}</h2>
          <p className="text-3xl font-display font-bold uppercase tracking-tight">{t('about_values_title')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Heart, title: t('about_value_dev_title'), desc: t('about_value_dev_desc') },
            { icon: Zap, title: t('about_value_speed_title'), desc: t('about_value_speed_desc') },
            { icon: Shield, title: t('about_value_security_title'), desc: t('about_value_security_desc') },
            { icon: Globe, title: t('about_value_global_title'), desc: t('about_value_global_desc') }
          ].map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] space-y-4"
            >
              <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center">
                <value.icon className="w-5 h-5 text-zinc-400" />
              </div>
              <h4 className="font-display font-bold uppercase tracking-tight">{value.title}</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Developer Information */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-400">{t('about_dev_title')}</h2>
          <p className="text-3xl font-display font-bold uppercase tracking-tight">Rehad Ahomed Abir</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bento-card grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">{t('about_dev_name')}</p>
              <p className="text-lg font-display font-bold text-black dark:text-zinc-100">Rehad Ahomed Abir</p>
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">{t('about_dev_contact')}</p>
              <p className="text-lg font-display font-bold text-black dark:text-zinc-100">+8809678797715</p>
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">{t('about_dev_email')}</p>
              <p className="text-lg font-display font-bold text-black dark:text-zinc-100">barehadahomed@gmail.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <div className="bg-zinc-900 rounded-[3rem] p-12 md:p-20 text-center text-white space-y-8">
        <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight uppercase">{t('about_cta_title')}</h2>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-medium">
          {t('about_cta_desc')}
        </p>
        <div className="flex justify-center pt-4">
          <button className="btn-primary px-12 py-6 text-lg">{t('about_cta_button')}</button>
        </div>
      </div>
    </div>
  );
}
