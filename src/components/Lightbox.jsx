import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ZoomIn, ZoomOut, Download } from 'lucide-react';

export default function Lightbox({ src, alt, onClose, allowDownload = false }) {
  const [zoomed, setZoomed] = useState(false);

  if (!src) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setZoomed((z) => !z);
            }}
            className="grid place-items-center h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Toggle zoom"
          >
            {zoomed ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
          </button>
          {allowDownload && (
            <a
              href={src}
              download
              onClick={(e) => e.stopPropagation()}
              className="grid place-items-center h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label="Download image"
            >
              <Download size={18} />
            </a>
          )}
          <button
            onClick={onClose}
            className="grid place-items-center h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Close preview"
          >
            <X size={18} />
          </button>
        </div>
        <motion.img
          src={src}
          alt={alt}
          onClick={(e) => e.stopPropagation()}
          className={`max-h-[90vh] max-w-[92vw] rounded-lg shadow-dark-glow transition-transform duration-300 cursor-zoom-in ${
            zoomed ? 'scale-150 cursor-zoom-out' : 'scale-100'
          }`}
          onDoubleClick={() => setZoomed((z) => !z)}
        />
      </motion.div>
    </AnimatePresence>
  );
}
