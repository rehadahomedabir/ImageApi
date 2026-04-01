import React from 'react';
import { 
  Terminal, 
  Code2, 
  Cpu, 
  Zap, 
  Shield, 
  Globe, 
  ArrowRight, 
  Copy, 
  Check,
  BookOpen,
  Layers,
  Webhook,
  Server,
  Database,
  Lock
} from 'lucide-react';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';
import { useLanguage } from '../App';

export default function Developer() {
  const { t } = useLanguage();
  const [copiedText, setCopiedText] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
    toast.success(`${label} copied to clipboard`);
  };

  const endpoints = [
    {
      method: 'POST',
      path: '/v1/upload',
      description: t('dev_upload_desc'),
      auth: 'X-API-Key',
      params: [
        { name: 'image', type: 'File', required: true, desc: t('dev_param_image_desc') },
        { name: 'folder', type: 'String', required: false, desc: t('dev_param_folder_desc') }
      ]
    },
    {
      method: 'GET',
      path: '/v1/assets',
      description: t('dev_assets_desc'),
      auth: 'X-API-Key',
      params: [
        { name: 'limit', type: 'Number', required: false, desc: t('dev_param_limit_desc') },
        { name: 'offset', type: 'Number', required: false, desc: t('dev_param_offset_desc') }
      ]
    }
  ];

  const codeExample = `// Example Upload Request (JavaScript)
const formData = new FormData();
formData.append('image', imageFile);

const response = await fetch('https://api.image-api.pro.bd/v1/upload', {
  method: 'POST',
  headers: {
    'X-API-Key': 'YOUR_API_KEY_HERE'
  },
  body: formData
});

const data = await response.json();
console.log('Asset URL:', data.url);`;

  return (
    <div className="space-y-16 pb-20">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[2rem] bg-zinc-900 p-8 md:p-12 text-white">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Terminal className="w-48 h-48" />
        </div>
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex items-center space-x-2 text-accent">
            <Code2 className="w-5 h-5" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">{t('dev_title')} / API</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tighter uppercase leading-tight">
            {t('dev_title').split(' ')[0]} <br />
            <span className="text-zinc-400">{t('dev_title').split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-zinc-400 text-base md:text-lg font-medium leading-relaxed">
            {t('dev_subtitle')}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a href="#endpoints" className="btn-primary !py-3 !px-8 flex items-center space-x-2 text-sm">
              <span>{t('dev_view_endpoints')}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <button 
              onClick={() => copyToClipboard('https://api.image-api.pro.bd/v1', t('dev_base_url'))}
              className="btn-secondary !py-3 !px-8 bg-zinc-800 hover:bg-zinc-700 text-white border-none flex items-center space-x-2 text-sm"
            >
              <Globe className="w-4 h-4" />
              <span>api.image-api.pro.bd/v1</span>
            </button>
          </div>
        </div>
      </div>

      {/* Core Specs - Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bento-card !p-6 md:col-span-2 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-accent" />
            </div>
            <h3 className="text-xl font-display font-bold uppercase tracking-tight">{t('dev_auth')}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {t('dev_auth_header')}
            </p>
          </div>
          <div className="mt-6 p-3 bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 font-mono text-[11px]">
            <span className="text-zinc-400"># Header Example</span><br />
            <span className="text-accent">X-API-Key:</span> <span className="text-zinc-600 dark:text-zinc-300">ia_7k2m9n...</span>
          </div>
        </div>

        <div className="bento-card !p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-accent" />
            </div>
            <h3 className="text-lg font-display font-bold uppercase tracking-tight">{t('dev_rate_limits')}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {t('dev_rate_limits_desc')}
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">
            <span>{t('dev_burst')}</span>
            <span>{t('dev_sla')}</span>
          </div>
        </div>
      </div>

      {/* API Endpoints Section */}
      <section id="endpoints" className="space-y-8">
        <div className="flex items-center space-x-3">
          <Layers className="w-5 h-5 text-zinc-400" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-400">{t('dev_endpoint_ref')}</h2>
        </div>

        <div className="space-y-6">
          {endpoints.map((endpoint, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] overflow-hidden"
            >
              <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center space-x-4">
                  <span className={cn(
                    "px-3 py-1 rounded-lg font-mono text-xs font-bold text-white",
                    endpoint.method === 'POST' ? "bg-green-500" : "bg-blue-500"
                  )}>
                    {endpoint.method}
                  </span>
                  <code className="text-lg font-mono font-bold text-black dark:text-zinc-100">
                    {endpoint.path}
                  </code>
                </div>
                <div className="flex items-center space-x-2 text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                  <Lock className="w-3 h-3" />
                  <span>Auth: {endpoint.auth}</span>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <p className="text-zinc-600 dark:text-zinc-400 font-medium">
                  {endpoint.description}
                </p>
                
                <div className="space-y-4">
                  <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">{t('dev_params')}</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-zinc-100 dark:border-zinc-800">
                          <th className="pb-3 font-bold text-black dark:text-zinc-100">{t('dev_param_name')}</th>
                          <th className="pb-3 font-bold text-black dark:text-zinc-100">{t('dev_param_type')}</th>
                          <th className="pb-3 font-bold text-black dark:text-zinc-100">{t('dev_param_required')}</th>
                          <th className="pb-3 font-bold text-black dark:text-zinc-100">{t('dev_param_desc')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                        {endpoint.params.map((param, j) => (
                          <tr key={j}>
                            <td className="py-4 font-mono text-accent">{param.name}</td>
                            <td className="py-4 text-zinc-500">{param.type}</td>
                            <td className="py-4">
                              {param.required ? (
                                <span className="text-red-500 font-bold">{t('dev_yes')}</span>
                              ) : (
                                <span className="text-zinc-400">{t('dev_no')}</span>
                              )}
                            </td>
                            <td className="py-4 text-zinc-500">{param.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Code Example */}
      <section className="space-y-8">
        <div className="flex items-center space-x-3">
          <Webhook className="w-5 h-5 text-zinc-400" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-400">{t('dev_implementation')}</h2>
        </div>
        
        <div className="bg-zinc-900 rounded-[2.5rem] p-8 md:p-12 relative group overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Cpu className="w-48 h-48 text-white" />
          </div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            </div>
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">{t('dev_js_fetch')}</span>
          </div>
          <pre className="font-mono text-sm md:text-base text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {codeExample}
          </pre>
          <button 
            onClick={() => copyToClipboard(codeExample, 'Code example')}
            className="absolute bottom-8 right-8 p-4 bg-zinc-800 text-zinc-400 hover:text-white rounded-2xl transition-all opacity-0 group-hover:opacity-100 shadow-xl"
          >
            {copiedText === 'Code example' ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </section>

      {/* Technical Infrastructure */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bento-card !p-6 space-y-4">
          <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
            <Server className="w-5 h-5 text-accent" />
          </div>
          <h3 className="text-lg font-display font-bold uppercase tracking-tight">{t('dev_edge_network')}</h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
            {t('dev_edge_network_desc')}
          </p>
        </div>
        <div className="bento-card !p-6 space-y-4">
          <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
            <Database className="w-5 h-5 text-accent" />
          </div>
          <h3 className="text-lg font-display font-bold uppercase tracking-tight">{t('dev_persistence')}</h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
            {t('dev_persistence_desc')}
          </p>
        </div>
        <div className="bento-card !p-6 space-y-4 border-accent/20 bg-accent/5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-accent" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[11px] font-mono font-bold text-green-500 uppercase tracking-wider">{t('dev_live')}</span>
            </div>
          </div>
          <h3 className="text-lg font-display font-bold uppercase tracking-tight">{t('dev_api_status')}</h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            {t('dev_api_status_desc')}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-accent rounded-[2rem] p-8 md:p-12 text-center text-white space-y-6 shadow-2xl shadow-accent/20">
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight uppercase">{t('dev_ready_to_deploy')}</h2>
        <p className="text-lg text-white/80 max-w-2xl mx-auto font-medium">
          {t('dev_ready_to_deploy_desc')}
        </p>
        <div className="flex justify-center pt-2">
          <a href="/dashboard" className="bg-white text-accent px-8 py-4 rounded-xl font-display font-bold text-lg uppercase tracking-wider hover:bg-zinc-100 transition-all active:scale-95 shadow-xl">
            {t('dev_go_to_dash')}
          </a>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
