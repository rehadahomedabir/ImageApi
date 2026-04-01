import React, { useState, useEffect } from 'react';
import { useAuth, useLanguage } from '../App';
import { db, storage, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { 
  Upload, 
  Trash2, 
  ExternalLink, 
  Image as ImageIcon, 
  Loader2, 
  Plus, 
  Search, 
  Calendar, 
  HardDrive, 
  Copy, 
  Check,
  BarChart3,
  Activity,
  Layers,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'images'),
      where('ownerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const imgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setImages(imgs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'images');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('toast_size_error'));
      return;
    }

    setUploading(true);
    const toastId = toast.loading(t('toast_uploading'));
    const fileId = Math.random().toString(36).substring(2, 15);

    try {
      let url = '';
      let storagePath = '';

      // Try ImgBB first as a fallback for Firebase Storage issues
      const imgbbKey = import.meta.env.VITE_IMGBB_API_KEY || '3fe2bdd7dc3fccc8531f80dac38f8f5a';
      
      if (imgbbKey) {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        if (data.success) {
          url = data.data.url;
          storagePath = 'imgbb'; // Mark as ImgBB
        } else {
          throw new Error('ImgBB upload failed');
        }
      } else {
        // Fallback to Firebase Storage if no ImgBB key
        const storageRef = ref(storage, `images/${user.uid}/${fileId}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        url = await getDownloadURL(snapshot.ref);
        storagePath = snapshot.ref.fullPath;
      }

      const imageData = {
        id: fileId,
        url,
        name: file.name,
        ownerId: user.uid,
        createdAt: new Date().toISOString(),
        size: file.size,
        mimeType: file.type,
        storagePath: storagePath
      };

      await setDoc(doc(db, 'images', fileId), imageData);
      toast.success(t('toast_upload_success'), { id: toastId });
    } catch (error: any) {
      console.error('Upload error:', error);
      if (error.message?.includes('quota') || error.message?.includes('upgrade')) {
        toast.error(t('toast_storage_limit'), { id: toastId });
      } else {
        handleFirestoreError(error, OperationType.WRITE, `images/${fileId}`);
        toast.error(t('toast_upload_error'), { id: toastId });
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (image: any) => {
    const toastId = toast.loading(t('toast_deleting'));
    try {
      // Delete from storage if it's Firebase
      if (image.storagePath !== 'imgbb') {
        const storageRef = ref(storage, image.storagePath);
        await deleteObject(storageRef);
      }

      // Delete from firestore
      await deleteDoc(doc(db, 'images', image.id));
      toast.success(t('toast_delete_success'), { id: toastId });
      setDeleteConfirmId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `images/${image.id}`);
      toast.error(t('toast_delete_error'), { id: toastId });
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success(t('toast_url_copied'));
  };

  const filteredImages = images.filter(img => 
    img.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSize = images.reduce((acc, img) => acc + (img.size || 0), 0);
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  const storageLimitMB = 500; // Example limit
  const storagePercentage = Math.min((parseFloat(totalSizeMB) / storageLimitMB) * 100, 100);

  const totalRequests = images.length * 12; // Mock stat

  return (
    <div className="space-y-12 pb-20">
      {/* Dashboard Header - Technical Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
        <div className="md:col-span-2 bento-card flex flex-col justify-between p-6">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-accent" />
            </div>
            <span className="micro-label text-zinc-400">{t('status_active')}</span>
          </div>
          <div className="mt-4">
            <h1 className="text-2xl font-display font-bold text-black dark:text-zinc-100 uppercase tracking-tight">{t('dash_title')}</h1>
            <p className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider mt-1">{t('dash_subtitle')}</p>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative group w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 group-focus-within:text-accent transition-colors" />
              <input
                type="text"
                placeholder={t('search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-accent/20 focus:border-accent transition-all"
              />
            </div>
            <label className={cn(
              "bg-accent text-white w-full sm:w-auto px-8 py-2.5 rounded-lg flex items-center justify-center space-x-2 cursor-pointer hover:bg-accent-dark transition-all active:scale-95 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap",
              uploading && "opacity-50 cursor-not-allowed"
            )}>
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{t('dash_upload')}</span>
              <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept="image/*" />
            </label>
          </div>
        </div>

        <div className="bento-card flex flex-col justify-between p-6">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
              <HardDrive className="w-4 h-4 text-accent" />
            </div>
            <span className="micro-label text-zinc-400">{t('realtime_sync')}</span>
          </div>
          <div>
            <p className="text-5xl font-display font-bold text-black dark:text-zinc-100">{images.length}</p>
            <p className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider mt-1">{t('total_objects')}</p>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-green-500 uppercase tracking-wider">{t('operational')}</span>
          </div>
        </div>

        <div className="bento-card flex flex-col justify-between p-6 group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
            <HardDrive className="w-20 h-20" />
          </div>
          <div className="flex items-center justify-between relative z-10">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-accent" />
            </div>
            <span className="micro-label text-zinc-400">{storagePercentage.toFixed(1)}% {t('cap_used')}</span>
          </div>
          <div className="relative z-10 mt-4">
            <p className="text-5xl font-display font-bold text-black dark:text-zinc-100">{totalSizeMB}<span className="text-xl ml-1">MB</span></p>
            <p className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider mt-1">{t('consumed')}</p>
            <div className="mt-4 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${storagePercentage}%` }}
                className="h-full bg-accent relative"
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <div className="relative">
            <Loader2 className="w-16 h-16 animate-spin text-accent" />
            <div className="absolute inset-0 blur-xl bg-accent/20 animate-pulse" />
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 font-mono text-[10px] font-bold uppercase tracking-widest">{t('syncing_assets')}</p>
        </div>
      ) : filteredImages.length > 0 ? (
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center space-x-3">
              <Layers className="w-5 h-5 text-zinc-400" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-zinc-400">{t('object_collection')}</h2>
            </div>
            <button className="flex items-center space-x-2 text-zinc-400 hover:text-accent transition-colors">
              <Filter className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">{t('filter')}</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl">
              <div className="grid grid-cols-4 md:grid-cols-6 w-full gap-4 micro-label">
                <span className="md:col-span-2">{t('col_name')}</span>
                <span className="hidden md:block">{t('col_created')}</span>
                <span className="hidden md:block">{t('col_size')}</span>
                <span>{t('col_type')}</span>
                <span className="text-right">{t('col_actions')}</span>
              </div>
            </div>

            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {filteredImages.map((image, i) => (
                  <motion.div 
                    key={image.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, delay: i * 0.02 }}
                    className="group bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-accent/50 hover:bg-white dark:hover:bg-zinc-900/50 transition-all"
                  >
                    <div className="grid grid-cols-4 md:grid-cols-6 w-full gap-4 p-4 items-center">
                      <div className="md:col-span-2 flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 border border-zinc-200 dark:border-zinc-700">
                          <img src={image.url} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-display font-bold text-sm truncate" title={image.name}>{image.name}</span>
                      </div>
                      <span className="hidden md:block font-mono text-[11px] text-zinc-500">{format(new Date(image.createdAt), 'MMM d, yyyy')}</span>
                      <span className="hidden md:block font-mono text-[11px] text-zinc-500">{(image.size / 1024 / 1024).toFixed(2)} MB</span>
                      <span className="font-mono text-[11px] text-accent uppercase">{image.mimeType.split('/')[1]}</span>
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => copyToClipboard(image.url, image.id)}
                          className="p-2 text-zinc-400 hover:text-accent transition-colors"
                          title={t('copy_url')}
                        >
                          {copiedId === image.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <a
                          href={image.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-zinc-400 hover:text-accent transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => setDeleteConfirmId(image.id)}
                          className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    
                    {deleteConfirmId === image.id && (
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        className="bg-red-500/5 border-t border-red-500/20 p-4 flex items-center justify-between"
                      >
                        <span className="text-xs font-bold text-red-500 uppercase tracking-widest">{t('confirm_delete')}</span>
                        <div className="flex items-center space-x-3">
                          <button onClick={() => setDeleteConfirmId(null)} className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-700">{t('cancel')}</button>
                          <button onClick={() => handleDelete(image)} className="bg-red-50 text-red-500 dark:bg-red-500/20 px-4 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider hover:bg-red-100 dark:hover:bg-red-500/30 transition-all">{t('delete')}</button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-40 bg-white dark:bg-zinc-900/50 rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800 space-y-8"
        >
          <div className="relative">
            <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-3xl flex items-center justify-center">
              <ImageIcon className="w-10 h-10 text-zinc-300 dark:text-zinc-700" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center animate-bounce">
              <Plus className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-center space-y-3">
            <h3 className="text-3xl font-display font-bold text-black dark:text-zinc-100 uppercase">{t('dash_title')}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto font-medium">
              {searchTerm ? t('no_search_results') : t('dash_no_assets')}
            </p>
          </div>
          {!searchTerm && (
            <label className="btn-primary inline-flex items-center space-x-3 px-10 py-5 text-base cursor-pointer">
              <Upload className="w-6 h-6" />
              <span>{t('dash_upload')}</span>
              <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept="image/*" />
            </label>
          )}
        </motion.div>
      )}
    </div>
  );
}
