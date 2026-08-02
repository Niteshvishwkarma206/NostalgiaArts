import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutGrid, Image, History, Plus, Pencil, Trash2, Eye, EyeOff, Star,
  Package, DollarSign, CheckCircle2, Clock,
} from 'lucide-react';
import { useArtworks } from '../../context/ArtworkContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import AdminArtworkModal from '../../components/AdminArtworkModal.jsx';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'artworks', label: 'Manage Artworks', icon: Image },
  { id: 'history', label: 'Upload History', icon: History },
];

export default function AdminDashboard() {
  const { artworks, uploadHistory, updateArtwork, deleteArtwork } = useArtworks();
  const { showToast } = useToast();
  const [tab, setTab] = useState('overview');
  const [modalArtwork, setModalArtwork] = useState(undefined); // undefined = closed, null = add, object = edit
  const [confirmDelete, setConfirmDelete] = useState(null);

  const stats = {
    total: artworks.length,
    available: artworks.filter((a) => a.availability === 'available').length,
    featured: artworks.filter((a) => a.featured).length,
    value: artworks.reduce((sum, a) => sum + (Number(a.price) || 0), 0),
  };

  async function handleToggleEnabled(artwork) {
    await updateArtwork(artwork.id, { enabled: !(artwork.enabled !== false) });
    showToast(artwork.enabled !== false ? 'Artwork disabled' : 'Artwork enabled', 'success');
  }

  async function handleDelete(id) {
    await deleteArtwork(id);
    setConfirmDelete(null);
    showToast('Artwork deleted', 'success');
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p className="section-eyebrow">Admin Console</p>
          <h1 className="page-title mt-1 text-3xl">Dashboard</h1>
        </div>
        <button onClick={() => setModalArtwork(null)} className="btn-gold">
          <Plus size={16} /> Add Artwork
        </button>
      </div>

      <div className="flex gap-2 mb-8 border-b border-onyx-200 dark:border-onyx-800">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === id
                ? 'border-gold-500 text-gold-600 dark:text-gold-400'
                : 'border-transparent text-onyx-500 hover:text-onyx-800 dark:hover:text-onyx-200'
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard icon={Package} label="Total Artworks" value={stats.total} />
          <StatCard icon={CheckCircle2} label="Available" value={stats.available} />
          <StatCard icon={Star} label="Featured" value={stats.featured} />
          <StatCard icon={DollarSign} label="Catalog Value" value={`$${stats.value.toLocaleString()}`} />
        </div>
      )}

      {tab === 'artworks' && (
        <div className="overflow-x-auto rounded-2xl border border-onyx-200 dark:border-onyx-800">
          <table className="w-full text-sm">
            <thead className="bg-onyx-50 dark:bg-onyx-900/60 text-onyx-500 dark:text-onyx-400">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Artwork</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Price</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Status</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {artworks.map((artwork) => (
                <tr key={artwork.id} className="border-t border-onyx-200 dark:border-onyx-800">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={artwork.images?.[0]} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium flex items-center gap-1.5">
                          {artwork.title}
                          {artwork.featured && <Star size={12} className="text-gold-500 fill-gold-500" />}
                        </p>
                        <p className="text-xs text-onyx-400">{artwork.artist}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-onyx-500 dark:text-onyx-400">{artwork.category}</td>
                  <td className="px-4 py-3 hidden md:table-cell">${Number(artwork.price).toLocaleString()}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${artwork.enabled === false ? 'bg-onyx-200 dark:bg-onyx-800 text-onyx-500' : 'bg-emerald-500/10 text-emerald-600'}`}>
                      {artwork.enabled === false ? 'Disabled' : 'Live'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleToggleEnabled(artwork)} className="p-2 rounded-lg hover:bg-onyx-100 dark:hover:bg-onyx-800" aria-label="Toggle visibility">
                        {artwork.enabled === false ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <button onClick={() => setModalArtwork(artwork)} className="p-2 rounded-lg hover:bg-onyx-100 dark:hover:bg-onyx-800" aria-label="Edit artwork">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setConfirmDelete(artwork)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-500" aria-label="Delete artwork">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {artworks.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-onyx-400">No artworks yet — add your first piece.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'history' && (
        <div className="rounded-2xl border border-onyx-200 dark:border-onyx-800 divide-y divide-onyx-200 dark:divide-onyx-800">
          {uploadHistory.length === 0 && (
            <p className="px-4 py-10 text-center text-onyx-400">No uploads yet.</p>
          )}
          {uploadHistory.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{entry.fileName}</p>
                <p className="text-xs text-onyx-400">
                  {entry.artworkTitle ? `Attached to “${entry.artworkTitle}”` : 'Upload'} · {entry.kind}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-onyx-400">
                <Clock size={12} />
                {new Date(entry.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalArtwork !== undefined && (
        <AdminArtworkModal artwork={modalArtwork} onClose={() => setModalArtwork(undefined)} />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setConfirmDelete(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white dark:bg-onyx-900 border border-onyx-200 dark:border-onyx-800 p-6">
            <h3 className="font-serif text-xl mb-2">Delete "{confirmDelete.title}"?</h3>
            <p className="text-sm text-onyx-500 dark:text-onyx-400 mb-6">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button className="btn-outline" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn-gold !bg-red-500 hover:!bg-red-600 !text-white" onClick={() => handleDelete(confirmDelete.id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-onyx-200 dark:border-onyx-800 p-5">
      <div className="h-10 w-10 rounded-full bg-gold-500/10 text-gold-500 grid place-items-center mb-3">
        <Icon size={18} />
      </div>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-sm text-onyx-500 dark:text-onyx-400">{label}</p>
    </div>
  );
}
