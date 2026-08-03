import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CheckCircle2, Package, MapPin, Phone, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { subscribeOrders } from '../lib/orders.js';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    const unsub = subscribeOrders(setOrders);
    return () => unsub && unsub();
  }, []);

  useEffect(() => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#d4af37', '#f1dd53', '#fdfbeb'] });
  }, []);

  if (orders === null) return null;
  const order = orders.find((o) => o.id === orderId);
  if (!order) return <Navigate to="/404" replace />;
  if (user && order.userId && order.userId !== user.uid) return <Navigate to="/404" replace />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16 text-center"
    >
      <div className="h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-500 grid place-items-center mx-auto mb-6">
        <CheckCircle2 size={32} />
      </div>
      <p className="section-eyebrow">Order Placed</p>
      <h1 className="page-title mt-1 mb-3">Thank you, {order.customerName.split(' ')[0]}!</h1>
      <p className="text-onyx-500 dark:text-onyx-400 mb-10">
        Your order has been received and is currently <strong className="text-gold-600 dark:text-gold-400">{order.status}</strong>.
      </p>

      <div className="rounded-2xl border border-onyx-200 dark:border-onyx-800 p-6 text-left space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-xs text-onyx-400">Order ID</p>
          <p className="text-xs font-mono">{order.id}</p>
        </div>

        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <img src={item.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="truncate">{item.title}</p>
                <p className="text-xs text-onyx-400">Qty {item.qty}</p>
              </div>
              <p className="font-medium">${(item.price * item.qty).toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="h-px bg-onyx-200 dark:bg-onyx-800" />

        <div className="flex items-center justify-between font-semibold">
          <span>Total</span>
          <span>${Number(order.amount).toLocaleString()}</span>
        </div>

        <div className="h-px bg-onyx-200 dark:bg-onyx-800" />

        <div className="space-y-2 text-sm text-onyx-500 dark:text-onyx-400">
          <p className="flex items-center gap-2">
            <MapPin size={14} className="shrink-0" /> {order.address}
          </p>
          <p className="flex items-center gap-2">
            <Phone size={14} className="shrink-0" /> {order.mobile}
          </p>
          <p className="flex items-center gap-2">
            <CreditCard size={14} className="shrink-0" /> {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'} · {order.paymentStatus}
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-10">
        <Link to="/gallery" className="btn-outline">Continue Browsing</Link>
        <Link to="/profile" className="btn-gold">
          <Package size={16} /> My Orders
        </Link>
      </div>
    </motion.div>
  );
}
