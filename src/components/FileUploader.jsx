import { useRef, useState } from 'react';
import { UploadCloud, FileImage, FileText, FileVideo, FileArchive, File, X, Loader2 } from 'lucide-react';
import { validateFile, classifyFile } from '../lib/storage.js';
import { useToast } from '../context/ToastContext.jsx';

const KIND_ICON = {
  image: FileImage,
  pdf: FileText,
  video: FileVideo,
  zip: FileArchive,
  other: File,
};

export default function FileUploader({ files, onChange, uploading }) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);
  const { showToast } = useToast();

  function addFiles(fileList) {
    const incoming = Array.from(fileList);
    const accepted = [...files];
    for (const file of incoming) {
      const result = validateFile(file, accepted);
      if (!result.valid) {
        showToast(result.error, 'error');
        continue;
      }
      accepted.push(file);
    }
    onChange(accepted);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  }

  function removeFile(idx) {
    onChange(files.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          dragOver ? 'border-gold-500 bg-gold-500/5' : 'border-onyx-300 dark:border-onyx-700'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          accept="image/*,application/pdf,video/*,.zip"
          onChange={(e) => addFiles(e.target.files)}
        />
        <UploadCloud className="mx-auto text-gold-500 mb-3" size={32} />
        <p className="text-sm font-medium">Drag & drop files, or click to browse</p>
        <p className="text-xs text-onyx-400 mt-1">
          Images, PDFs, Videos, ZIP files · multiple files supported
        </p>
      </div>

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file, idx) => {
            const kind = classifyFile(file);
            const Icon = KIND_ICON[kind] || File;
            return (
              <li
                key={`${file.name}-${idx}`}
                className="flex items-center gap-3 rounded-xl border border-onyx-200 dark:border-onyx-800 px-3 py-2.5"
              >
                <Icon size={18} className="text-gold-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{file.name}</p>
                  <p className="text-xs text-onyx-400">{(file.size / 1024).toFixed(0)} KB · {kind}</p>
                </div>
                {uploading ? (
                  <Loader2 size={16} className="animate-spin text-onyx-400" />
                ) : (
                  <button onClick={() => removeFile(idx)} aria-label="Remove file" className="text-onyx-400 hover:text-red-500">
                    <X size={16} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
