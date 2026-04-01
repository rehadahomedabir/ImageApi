import React from 'react';
import { Check, Zap, Shield, Globe, ArrowRight, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../App';

export default function Pricing() {
  const { t } = useLanguage();
  const plans = [
    {
      name: t('pricing_starter_name'),
      price: "$0",
      desc: t('pricing_starter_desc'),
      features: [
        "1,000 requests per hour",
        "10GB bandwidth",
        "Standard support",
        "Global edge delivery",
        "Basic analytics"
      ],
      cta: t('pricing_starter_cta'),
      popular: false
    },
    {
      name: t('pricing_pro_name'),
      price: "$49",
      desc: t('pricing_pro_desc'),
      features: [
        "10,000 requests per hour",
        "100GB bandwidth",
        "Priority support",
        "Advanced analytics",
        "Custom domains",
        "Image optimization"
      ],
      cta: t('pricing_pro_cta'),
      popular: true
    },
    {
      name: t('pricing_enterprise_name'),
      price: "Custom",
      desc: t('pricing_enterprise_desc'),
      features: [
        "Unlimited requests",
        "Unlimited bandwidth",
        "Dedicated support",
        "Custom SLAs",
        "SSO & SAML",
        "Private infrastructure"
      ],
      cta: t('pricing_enterprise_cta'),
      popular: false
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Header */}
      <section className="text-center space-y-8 max-w-4xl mx-auto pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-[11px] font-bold uppercase tracking-wider"
        >
          <Star className="w-3 h-3" />
          <span>{t('pricing_badge')}</span>
        </motion.div>
        <h1 className="text-6xl md:text-9xl font-display font-bold tracking-tighter uppercase leading-[0.85] text-gradient">
          {t('pricing_title').split(' ')[0]} <br />
          <span className="text-zinc-400 dark:text-zinc-600">{t('pricing_title').split(' ').slice(1).join(' ')}</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto font-medium">
          {t('pricing_subtitle')}
        </p>
      </section>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`relative p-8 rounded-[3rem] border flex flex-col justify-between h-full ${
              plan.popular 
                ? "bg-zinc-900 text-white border-zinc-800 shadow-2xl shadow-accent/20" 
                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                {t('pricing_popular_badge')}
              </div>
            )}
            
            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-zinc-400">{plan.name}</h3>
                <div className="flex items-baseline space-x-1">
                  <span className="text-5xl font-display font-bold tracking-tight">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-zinc-400 text-sm">/mo</span>}
                </div>
                <p className={`text-sm ${plan.popular ? "text-zinc-400" : "text-zinc-500"}`}>{plan.desc}</p>
              </div>

              <div className="space-y-4">
                <div className="h-[1px] w-full bg-zinc-100 dark:bg-zinc-800" />
                <ul className="space-y-4">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center space-x-3 text-sm">
                      <Check className={`w-4 h-4 ${plan.popular ? "text-accent" : "text-zinc-400"}`} />
                      <span className={plan.popular ? "text-zinc-300" : "text-zinc-600 dark:text-zinc-400"}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-12">
              <button className={`w-full py-6 rounded-2xl font-display font-bold text-lg uppercase tracking-wider transition-all active:scale-95 shadow-xl ${
                plan.popular 
                  ? "bg-accent text-white hover:bg-accent/90" 
                  : "bg-black dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
              }`}>
                {plan.cta}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* FAQ Preview */}
      <section className="bg-white dark:bg-zinc-900/50 rounded-[3rem] p-12 md:p-20 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-zinc-400">{t('pricing_faq_badge')}</h2>
          <p className="text-3xl font-display font-bold uppercase tracking-tight">{t('pricing_faq_title')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            { q: t('pricing_faq_q1'), a: t('pricing_faq_a1') },
            { q: t('pricing_faq_q2'), a: t('pricing_faq_a2') },
            { q: t('pricing_faq_q3'), a: t('pricing_faq_a3') },
            { q: t('pricing_faq_q4'), a: t('pricing_faq_a4') }
          ].map((faq, i) => (
            <div key={i} className="space-y-3">
              <h4 className="font-display font-bold uppercase tracking-tight text-black dark:text-zinc-100">{faq.q}</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
