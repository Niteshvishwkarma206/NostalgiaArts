import { isFirebaseConfigured, db } from '../firebase.js';
import { SEED_ARTWORKS } from './seed.js';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

const ARTWORKS_KEY = 'era_nostalgia_artworks';
const HISTORY_KEY = 'era_nostalgia_upload_history';

/* ------------------------------------------------------------------ */
/* Sandbox (localStorage) engine                                       */
/* ------------------------------------------------------------------ */

const listeners = { artworks: new Set(), history: new Set() };

function readLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureSeeded() {
  const existing = readLocal(ARTWORKS_KEY, null);
  if (!existing) {
    writeLocal(ARTWORKS_KEY, SEED_ARTWORKS);
  }
  const historyExisting = readLocal(HISTORY_KEY, null);
  if (!historyExisting) {
    writeLocal(HISTORY_KEY, []);
  }
}

function notify(kind) {
  const key = kind === 'artworks' ? ARTWORKS_KEY : HISTORY_KEY;
  const data = readLocal(key, []).slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  listeners[kind].forEach((cb) => cb(data));
}

function localSubscribeArtworks(cb) {
  ensureSeeded();
  listeners.artworks.add(cb);
  notify('artworks');
  return () => listeners.artworks.delete(cb);
}

function localSubscribeHistory(cb) {
  ensureSeeded();
  listeners.history.add(cb);
  notify('history');
  return () => listeners.history.delete(cb);
}

function localAddArtwork(data) {
  ensureSeeded();
  const artworks = readLocal(ARTWORKS_KEY, []);
  const item = { ...data, id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: Date.now() };
  artworks.push(item);
  writeLocal(ARTWORKS_KEY, artworks);
  notify('artworks');
  return item.id;
}

function localUpdateArtwork(id, data) {
  const artworks = readLocal(ARTWORKS_KEY, []);
  const idx = artworks.findIndex((a) => a.id === id);
  if (idx !== -1) {
    artworks[idx] = { ...artworks[idx], ...data, updatedAt: Date.now() };
    writeLocal(ARTWORKS_KEY, artworks);
    notify('artworks');
  }
}

function localDeleteArtwork(id) {
  const artworks = readLocal(ARTWORKS_KEY, []).filter((a) => a.id !== id);
  writeLocal(ARTWORKS_KEY, artworks);
  notify('artworks');
}

function localAddHistory(entry) {
  const history = readLocal(HISTORY_KEY, []);
  const item = { ...entry, id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: Date.now() };
  history.push(item);
  writeLocal(HISTORY_KEY, history);
  notify('history');
  return item.id;
}

/* ------------------------------------------------------------------ */
/* Firestore engine                                                     */
/* ------------------------------------------------------------------ */

function firestoreSubscribeArtworks(cb) {
  const q = query(collection(db, 'artworks'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

function firestoreSubscribeHistory(cb) {
  const q = query(collection(db, 'uploadHistory'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

async function firestoreAddArtwork(data) {
  const ref = await addDoc(collection(db, 'artworks'), { ...data, createdAt: Date.now() });
  return ref.id;
}

async function firestoreUpdateArtwork(id, data) {
  await updateDoc(doc(db, 'artworks', id), { ...data, updatedAt: Date.now() });
}

async function firestoreDeleteArtwork(id) {
  await deleteDoc(doc(db, 'artworks', id));
}

async function firestoreAddHistory(entry) {
  const ref = await addDoc(collection(db, 'uploadHistory'), { ...entry, createdAt: Date.now() });
  return ref.id;
}

/* ------------------------------------------------------------------ */
/* Public unified API                                                   */
/* ------------------------------------------------------------------ */

export function subscribeArtworks(cb) {
  return isFirebaseConfigured ? firestoreSubscribeArtworks(cb) : localSubscribeArtworks(cb);
}

export function subscribeUploadHistory(cb) {
  return isFirebaseConfigured ? firestoreSubscribeHistory(cb) : localSubscribeHistory(cb);
}

export function addArtwork(data) {
  return isFirebaseConfigured ? firestoreAddArtwork(data) : Promise.resolve(localAddArtwork(data));
}

export function updateArtwork(id, data) {
  return isFirebaseConfigured ? firestoreUpdateArtwork(id, data) : Promise.resolve(localUpdateArtwork(id, data));
}

export function deleteArtwork(id) {
  return isFirebaseConfigured ? firestoreDeleteArtwork(id) : Promise.resolve(localDeleteArtwork(id));
}

export function addUploadHistory(entry) {
  return isFirebaseConfigured ? firestoreAddHistory(entry) : Promise.resolve(localAddHistory(entry));
}

export const _serverTimestamp = serverTimestamp;
