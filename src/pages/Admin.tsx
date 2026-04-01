import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Image as ImageIcon, 
  Shield, 
  Activity, 
  Search, 
  Filter, 
  MoreVertical, 
  UserCheck, 
  UserX, 
  Trash2,
  ArrowUpRight,
  TrendingUp,
  Database
} from 'lucide-react';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, getDocs, where } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage, handleFirestoreError, OperationType } from '../firebase';
import { useLanguage } from '../App';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  role?: string;
  createdAt: string;
  apiKey: string;
}

interface ImageMetadata {
  id: string;
  url: string;
  name: string;
  ownerId: string;
  createdAt: string;
  size: number;
  mimeType: string;
  storagePath?: string;
}

export default function Admin() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<UserData[]>([]);
  const [images, setImages] = useState<ImageMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'images'>('users');

  const SUPER_ADMIN_EMAIL = 'barehadahomed@gmail.com';

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const userData = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as UserData));
      setUsers(userData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });

    const unsubImages = onSnapshot(collection(db, 'images'), (snapshot) => {
      const imageData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ImageMetadata));
      setImages(imageData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'images');
    });

    return () => {
      unsubUsers();
      unsubImages();
    };
  }, []);

  const toggleRole = async (user: UserData) => {
    if (user.email === SUPER_ADMIN_EMAIL) {
      toast.error('Cannot change role of super admin');
      return;
    }
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        role: newRole
      });
      toast.success('Role updated successfully');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const deleteUser = async (user: UserData) => {
    if (user.email === SUPER_ADMIN_EMAIL) {
      toast.error('Cannot delete super admin');
      return;
    }
    if (window.confirm('Are you sure you want to delete this user and all their images? This action cannot be undone.')) {
      const toastId = toast.loading('Deleting user and assets...');
      try {
        // 1. Find and delete all user images
        const q = query(collection(db, 'images'), where('ownerId', '==', user.uid));
        const imageDocs = await getDocs(q);
        
        const deletePromises = imageDocs.docs.map(async (imageDoc) => {
          const imageData = imageDoc.data() as ImageMetadata;
          // Delete from storage if it's Firebase
          if (imageData.storagePath && imageData.storagePath !== 'imgbb') {
            try {
              const storageRef = ref(storage, imageData.storagePath);
              await deleteObject(storageRef);
            } catch (e) {
              console.error('Error deleting storage object:', e);
            }
          }
          // Delete from firestore
          await deleteDoc(doc(db, 'images', imageDoc.id));
        });

        await Promise.all(deletePromises);

        // 2. Delete the user document
        await deleteDoc(doc(db, 'users', user.uid));
        
        toast.success('User and all assets deleted successfully', { id: toastId });
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}`);
        toast.error('Error deleting user', { id: toastId });
      }
    }
  };

  const deleteImage = async (img: ImageMetadata) => {
    if (window.confirm(t('admin_delete_image_confirm'))) {
      const toastId = toast.loading('Deleting image...');
      try {
        if (img.storagePath && img.storagePath !== 'imgbb') {
          try {
            const storageRef = ref(storage, img.storagePath);
            await deleteObject(storageRef);
          } catch (storageErr) {
            console.error('Error deleting storage object:', storageErr);
            // Continue to delete from Firestore even if storage delete fails
          }
        }
        await deleteDoc(doc(db, 'images', img.id));
        toast.success('Image deleted successfully', { id: toastId });
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `images/${img.id}`);
        toast.error('Error deleting image', { id: toastId });
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredImages = images.filter(img => 
    img.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    img.ownerId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'text-blue-500' },
    { label: 'Total Images', value: images.length, icon: ImageIcon, color: 'text-purple-500' },
    { label: 'Admins', value: users.filter(u => u.role === 'admin').length, icon: Shield, color: 'text-accent' },
    { label: 'Storage Used', value: `${(images.reduce((acc, img) => acc + img.size, 0) / (1024 * 1024)).toFixed(2)} MB`, icon: Database, color: 'text-orange-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 text-accent">
          <Shield className="w-6 h-6" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider">System / Administration / Control</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-display tracking-tighter text-black dark:text-zinc-100 uppercase leading-tight">
          {t('admin_title').split(' ')[0]} <span className="text-zinc-400">{t('admin_title').split(' ').slice(1).join(' ')}</span>
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bento-card p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <TrendingUp className="w-4 h-4 text-zinc-400" />
            </div>
            <div>
              <p className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-500">
                {stat.label === 'Total Users' ? t('admin_stats_users') : 
                 stat.label === 'Total Images' ? t('admin_stats_images') : 
                 stat.label === 'Admins' ? t('admin_stats_admins') : 
                 t('admin_stats_storage')}
              </p>
              <p className="text-3xl font-display font-bold text-black dark:text-zinc-100">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="space-y-8">
        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
                activeTab === 'users' 
                  ? 'bg-white dark:bg-zinc-700 text-black dark:text-zinc-100 shadow-sm' 
                  : 'text-zinc-500 hover:text-black dark:hover:text-zinc-300'
              }`}
            >
              {t('admin_tab_users')}
            </button>
            <button
              onClick={() => setActiveTab('images')}
              className={`px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
                activeTab === 'images' 
                  ? 'bg-white dark:bg-zinc-700 text-black dark:text-zinc-100 shadow-sm' 
                  : 'text-zinc-500 hover:text-black dark:hover:text-zinc-300'
              }`}
            >
              {t('admin_tab_images')}
            </button>
          </div>

          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder={activeTab === 'users' ? t('admin_search_users') : t('admin_search_images')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-accent outline-none transition-all"
            />
          </div>
        </div>

        {/* Table/List View */}
        <div className="bento-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-bottom border-zinc-200 dark:border-zinc-800">
                  {activeTab === 'users' ? (
                    <>
                      <th className="px-6 py-4 text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">{t('admin_col_user')}</th>
                      <th className="px-6 py-4 text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">{t('admin_col_role')}</th>
                      <th className="px-6 py-4 text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">{t('admin_col_joined')}</th>
                      <th className="px-6 py-4 text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 text-right">{t('admin_actions')}</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-4 text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">{t('admin_col_image')}</th>
                      <th className="px-6 py-4 text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">{t('admin_col_owner')}</th>
                      <th className="px-6 py-4 text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">{t('admin_col_size')}</th>
                      <th className="px-6 py-4 text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 text-right">{t('admin_actions')}</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {activeTab === 'users' ? (
                  filteredUsers.map((user) => (
                    <tr key={user.uid} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center font-bold text-zinc-500">
                            {user.displayName?.[0] || user.email[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-black dark:text-zinc-100">{user.displayName || 'Anonymous'}</p>
                            <p className="text-xs text-zinc-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          user.role === 'admin' 
                            ? 'bg-accent/10 text-accent' 
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                        }`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-500">
                        {user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => toggleRole(user)}
                            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-accent"
                            title={user.role === 'admin' ? t('admin_demote') : t('admin_promote')}
                          >
                            {user.role === 'admin' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                          <button 
                            onClick={() => deleteUser(user)}
                            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-red-500"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  filteredImages.map((img) => (
                    <tr key={img.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                            <img src={img.url} alt={img.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-black dark:text-zinc-100 truncate max-w-[200px]">{img.name}</p>
                            <p className="text-xs text-zinc-500">{format(new Date(img.createdAt), 'MMM dd, HH:mm')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-zinc-500">
                        {img.ownerId}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-500">
                        {(img.size / 1024).toFixed(1)} KB
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <a 
                            href={img.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-accent"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </a>
                          <button 
                            onClick={() => deleteImage(img)}
                            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {((activeTab === 'users' && filteredUsers.length === 0) || 
            (activeTab === 'images' && filteredImages.length === 0)) && (
            <div className="py-20 text-center space-y-4">
              <div className="inline-flex p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-400">
                <Search className="w-8 h-8" />
              </div>
              <p className="text-zinc-500 font-mono text-sm uppercase tracking-wider">{t('no_search_results')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
