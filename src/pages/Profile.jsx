import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, User, Heart, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Profile() {
  const { user, isAdmin, updateDisplayName } = useAuth();
  const { favorites } = useFavorites();
  const { showToast } = useToast();
  const [name, setName] = useState(user?.displayName || '');
  const [saving, setSaving] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateDisplayName(name);
      showToast('Profile updated', 'success');
    } catch {
      showToast('Could not update profile', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16"
    >
      <div className="flex items-center gap-4 mb-10">
        <div className="h-16 w-16 rounded-full bg-gold-500/10 text-gold-500 grid place-items-center">
          <User size={26} />
        </div>
        <div>
          <h1 className="font-serif text-2xl">{user?.displayName}</h1>
          <p className="text-sm text-onyx-500 dark:text-onyx-400">{user?.email}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <Link
          to="/favorites"
          className="rounded-2xl border border-onyx-200 dark:border-onyx-800 p-5 flex items-center gap-3 hover:border-gold-500 transition-colors"
        >
          <Heart className="text-gold-500" size={20} />
          <div>
            <p className="text-sm font-medium">Favorites</p>
            <p className="text-xs text-onyx-400">{favorites.length} saved artwork{favorites.length !== 1 && 's'}</p>
          </div>
        </Link>
        {isAdmin && (
          <Link
            to="/admin"
            className="rounded-2xl border border-onyx-200 dark:border-onyx-800 p-5 flex items-center gap-3 hover:border-gold-500 transition-colors"
          >
            <LayoutDashboard className="text-gold-500" size={20} />
            <div>
              <p className="text-sm font-medium">Admin Dashboard</p>
              <p className="text-xs text-onyx-400">Manage the catalog</p>
            </div>
          </Link>
        )}
      </div>

      <div className="rounded-2xl border border-onyx-200 dark:border-onyx-800 p-6">
        <p className="text-sm font-semibold mb-4">Edit Profile</p>
        <form onSubmit={handleSave} className="space-y-4 max-w-sm">
          <div>
            <label className="text-xs text-onyx-400 mb-1 block">Display Name</label>
            <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <button type="submit" disabled={saving} className="btn-gold">
            {saving && <Loader2 size={16} className="animate-spin" />}
            Save Changes
          </button>
        </form>
      </div>
    </motion.div>
  );
}
