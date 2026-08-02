import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, Save } from 'lucide-react';
import FileUploader from './FileUploader.jsx';
import { uploadFiles } from '../lib/storage.js';
import { useArtworks } from '../context/ArtworkContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const CATEGORY_OPTIONS = ['Paintings', 'Digital Art', 'Photography', 'Sculptures'];

const EMPTY_FORM = {
  title: '',
  artist: '',
  category: 'Paintings',
  description: '',
  year: new Date().getFullYear(),
  price: '',
  availability: 'available',
  featured: false,
  enabled: true,
  tags: '',
};

export default function AdminArtworkModal({ artwork, onClose }) {
  const isEdit = Boolean(artwork);
  const { addArtwork, updateArtwork, addUploadHistory } = useArtworks();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState(
    isEdit
      ? {
          title: artwork.title,
          artist: artwork.artist,
          category: artwork.category,
          description: artwork.description,
          year: artwork.year,
          price: artwork.price,
          availability: artwork.availability,
          featured: artwork.featured,
          enabled: artwork.enabled !== false,
          tags: (artwork.tags || []).join(', '),
        }
      : EMPTY_FORM
  );
  const [newFiles, setNewFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.artist.trim() || !form.price) {
      showToast('Title, artist, and price are required', 'error');
      return;
    }

    setSaving(true);
    try {
      let images = artwork?.images || [];
      let resources = artwork?.resources || [];

      if (newFiles.length > 0) {
        const uploaded = await uploadFiles(newFiles, 'artworks');
        const imageUploads = uploaded.filter((f) => f.kind === 'image');
        const otherUploads = uploaded.filter((f) => f.kind !== 'image');

        images = [...images, ...imageUploads.map((f) => f.url)];
        resources = [...resources, ...otherUploads.map((f) => ({ name: f.name, url: f.url, type: f.type, size: f.size }))];

        for (const f of uploaded) {
          await addUploadHistory({
            fileName: f.name,
            fileType: f.type,
            kind: f.kind,
            size: f.size,
            artworkTitle: form.title,
            uploadedBy: user?.email,
          });
        }
      }

      if (images.length === 0) {
        images = ['https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=1200'];
      }

      const payload = {
        ...form,
        year: Number(form.year),
        price: Number(form.price),
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        images,
        resources,
      };

      if (isEdit) {
        await updateArtwork(artwork.id, payload);
        showToast('Artwork updated', 'success');
      } else {
        await addArtwork(payload);
        showToast('Artwork added to the gallery', 'success');
      }
      onClose();
    } catch (err) {
      showToast(err.message || 'Something went wrong while saving', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl bg-white dark:bg-onyx-900 border border-onyx-200 dark:border-onyx-800 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl">{isEdit ? 'Edit Artwork' : 'Add Artwork'}</h2>
          <button onClick={onClose} className="text-onyx-400 hover:text-onyx-700 dark:hover:text-onyx-200">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input className="input-field" placeholder="Artwork title" value={form.title} onChange={(e) => update('title', e.target.value)} required />
            <input className="input-field" placeholder="Artist name" value={form.artist} onChange={(e) => update('artist', e.target.value)} required />
          </div>

          <textarea
            className="input-field min-h-[100px] resize-none"
            placeholder="Description"
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />

          <div className="grid sm:grid-cols-3 gap-4">
            <select className="input-field" value={form.category} onChange={(e) => update('category', e.target.value)}>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="number"
              className="input-field"
              placeholder="Year"
              value={form.year}
              onChange={(e) => update('year', e.target.value)}
            />
            <input
              type="number"
              step="0.01"
              className="input-field"
              placeholder="Price (USD)"
              value={form.price}
              onChange={(e) => update('price', e.target.value)}
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <select className="input-field" value={form.availability} onChange={(e) => update('availability', e.target.value)}>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
            </select>
            <input
              className="input-field"
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={(e) => update('tags', e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} className="accent-gold-500" />
              Featured artwork
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.enabled} onChange={(e) => update('enabled', e.target.checked)} className="accent-gold-500" />
              Enabled (visible to customers)
            </label>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Upload Files</p>
            <FileUploader files={newFiles} onChange={setNewFiles} uploading={saving} />
            <p className="text-xs text-onyx-400 mt-2">
              Images become the artwork's gallery photos; PDFs, videos, and ZIPs are attached as downloadable resources.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-gold">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isEdit ? 'Save Changes' : 'Add Artwork'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
