import { isFirebaseConfigured, storage } from '../firebase.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const ALLOWED_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  pdf: ['application/pdf'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
  zip: ['application/zip', 'application/x-zip-compressed', 'application/x-zip'],
};

export const MAX_FILE_SIZE = {
  image: 10 * 1024 * 1024, // 10MB
  pdf: 25 * 1024 * 1024, // 25MB
  video: 100 * 1024 * 1024, // 100MB
  zip: 50 * 1024 * 1024, // 50MB
  default: 25 * 1024 * 1024,
};

export function classifyFile(file) {
  for (const [kind, types] of Object.entries(ALLOWED_TYPES)) {
    if (types.includes(file.type)) return kind;
  }
  return 'other';
}

export function validateFile(file, existingFiles = []) {
  const kind = classifyFile(file);
  const maxSize = MAX_FILE_SIZE[kind] || MAX_FILE_SIZE.default;

  if (kind === 'other') {
    return { valid: false, error: `Unsupported file type: ${file.type || 'unknown'}` };
  }
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `${file.name} exceeds the ${(maxSize / (1024 * 1024)).toFixed(0)}MB limit for ${kind} files`,
    };
  }
  const duplicate = existingFiles.some(
    (f) => f.name === file.name && f.size === file.size
  );
  if (duplicate) {
    return { valid: false, error: `${file.name} has already been added to this upload` };
  }
  return { valid: true, kind };
}

// Converts a File to a base64 data URL - used only in sandbox mode so
// uploads work fully client-side without a Firebase Storage bucket.
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function uploadFile(file, pathPrefix = 'artworks') {
  const kind = classifyFile(file);

  if (isFirebaseConfigured) {
    const path = `${pathPrefix}/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { url, name: file.name, size: file.size, type: file.type, kind, path };
  }

  // Sandbox fallback: only inline small files as data URLs; larger files
  // (e.g. videos/zips) are represented by a blob object URL, which is
  // valid for the current browser session only.
  const url =
    file.size <= 2 * 1024 * 1024 ? await fileToDataUrl(file) : URL.createObjectURL(file);
  return { url, name: file.name, size: file.size, type: file.type, kind, path: null };
}

export async function uploadFiles(files, pathPrefix = 'artworks') {
  const results = [];
  for (const file of files) {
    results.push(await uploadFile(file, pathPrefix));
  }
  return results;
}
