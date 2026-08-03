import { isFirebaseConfigured, db } from '../firebase.js';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';

const ORDERS_KEY = 'era_nostalgia_orders';

export const ORDER_STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
export const PAYMENT_STATUSES = ['Pending', 'Paid'];

/* ------------------------------------------------------------------ */
/* Sandbox (localStorage) engine                                       */
/* ------------------------------------------------------------------ */

const listeners = new Set();

function readLocal() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeLocal(value) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(value));
}

function notify() {
  const data = readLocal().slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  listeners.forEach((cb) => cb(data));
}

function localSubscribeOrders(cb) {
  listeners.add(cb);
  notify();
  return () => listeners.delete(cb);
}

function localAddOrder(data) {
  const orders = readLocal();
  const item = {
    ...data,
    id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
  };
  orders.push(item);
  writeLocal(orders);
  notify();
  return item;
}

function localUpdateOrder(id, data) {
  const orders = readLocal();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx !== -1) {
    orders[idx] = { ...orders[idx], ...data, updatedAt: Date.now() };
    writeLocal(orders);
    notify();
  }
}

/* ------------------------------------------------------------------ */
/* Firestore engine                                                     */
/* ------------------------------------------------------------------ */

function firestoreSubscribeOrders(cb) {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

async function firestoreAddOrder(data) {
  const payload = { ...data, createdAt: Date.now() };
  const ref = await addDoc(collection(db, 'orders'), payload);
  return { id: ref.id, ...payload };
}

async function firestoreUpdateOrder(id, data) {
  await updateDoc(doc(db, 'orders', id), { ...data, updatedAt: Date.now() });
}

/* ------------------------------------------------------------------ */
/* Public unified API                                                   */
/* ------------------------------------------------------------------ */

export function subscribeOrders(cb) {
  return isFirebaseConfigured ? firestoreSubscribeOrders(cb) : localSubscribeOrders(cb);
}

export function addOrder(data) {
  return isFirebaseConfigured ? firestoreAddOrder(data) : Promise.resolve(localAddOrder(data));
}

export function updateOrder(id, data) {
  return isFirebaseConfigured ? firestoreUpdateOrder(id, data) : Promise.resolve(localUpdateOrder(id, data));
}
