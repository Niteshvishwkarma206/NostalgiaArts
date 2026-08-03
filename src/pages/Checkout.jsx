import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Truck, Wallet, CreditCard } from 'lucide-react';
import { useArtworks } from '../context/ArtworkContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { addOrder } from '../lib/orders.js';

const PAYMENT_OPTIONS = [
  { id: 'COD', label: 'Cash on Delivery', icon: Wallet },
  { id: 'Online', label: 'Online Payment (UPI / Card)', icon: CreditCard },
];

export default function Checkout() {
  const { artworks, loading } = useArtworks();
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.displayName || '');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [placing, setPlacing] = useState(false);

  const cartLines = items
    .map((line) => {
      const artwork = artworks.find((a) => a.id === line.artworkId);
      return artwork ? { ...line, artwork } : null;
    })
    .filter(Boolean);

  const subtotal = cartLines.reduce((sum, l) => sum + Number(l.artwork.price) * l.qty, 0);

  if (!loading && cartLines.length === 0) return <Navigate to="/cart" replace />;

  async function handlePlaceOrder(e) {
    e.preventDefault();
    if (!name.trim() || !mobile.trim() || !address.trim()) {
      showToast('Please fill in your name, mobile and address', 'error');
      return;
    }
    if (!/^[0-9+\-\s]{7,15}$/.test(mobile.trim())) {
      showToast('Please enter a valid mobile number', 'error');
      return;
    }

    setPlacing(true);
    try {
      const order = await addOrder({
        userId: user.uid,
        customerName: name.trim(),
        customerEmail: user.email,
        mobile: mobile.trim(),
        address: address.trim(),
        items: cartLines.map((l) => ({
          artworkId: l.artwork.id,
          title: l.artwork.title,
          artist: l.artwork.artist,
          image: l.artwork.images?.[0] || '',
          price: Number(l.artwork.price),
          qty: l.qty,
        })),
        amount: subtotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'Online' ? 'Paid' : 'Pending',
        status: 'Pending',
      });
      clearCart();
      navigate(`/order-confirmation/${order.id}`);
    } catch (err) {
      showToast(err.message || 'Could not place your order', 'error');
    } finally {
      setPlacing(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16"
    >
      <p className="section-eyebrow flex items-center gap-1.5">
        <Truck size={14} /> Checkout
      </p>
      <h1 className="page-title mt-1 mb-10">Delivery &amp; Payment</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-onyx-200 dark:border-onyx-800 p-6 space-y-4">
            <p className="font-semibold">Contact &amp; Delivery Details</p>
            <div>
              <label className="text-xs text-onyx-400 mb-1 block">Full Name</label>
              <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs text-onyx-400 mb-1 block">Mobile Number</label>
              <input
                className="input-field"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="e.g. 9876543210"
                required
              />
            </div>
            <div>
              <label className="text-xs text-onyx-400 mb-1 block">Delivery Address</label>
              <textarea
                className="input-field min-h-[100px] resize-none"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House no., street, city, state, PIN code"
                required
              />
            </div>
          </div>

          <div className="rounded-2xl border border-onyx-200 dark:border-onyx-800 p-6 space-y-3">
            <p className="font-semibold mb-1">Payment Option</p>
            {PAYMENT_OPTIONS.map(({ id, label, icon: Icon }) => (
              <label
                key={id}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                  paymentMethod === id
                    ? 'border-gold-500 bg-gold-500/5'
                    : 'border-onyx-200 dark:border-onyx-800'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={id}
                  checked={paymentMethod === id}
                  onChange={() => setPaymentMethod(id)}
                  className="accent-gold-500"
                />
                <Icon size={17} className="text-gold-500" />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>

          <button type="submit" disabled={placing} className="btn-gold w-full">
            {placing && <Loader2 size={16} className="animate-spin" />}
            Place Order
          </button>
        </form>

        <div className="rounded-2xl border border-onyx-200 dark:border-onyx-800 p-6 h-fit">
          <p className="font-semibold mb-4">Order Summary</p>
          <div className="space-y-3 mb-4">
            {cartLines.map(({ artwork, qty }) => (
              <div key={artwork.id} className="flex items-center gap-3 text-sm">
                <img src={artwork.images?.[0]} alt="" className="h-12 w-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="truncate">{artwork.title}</p>
                  <p className="text-xs text-onyx-400">Qty {qty}</p>
                </div>
                <p className="font-medium">${(Number(artwork.price) * qty).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="h-px bg-onyx-200 dark:bg-onyx-800 my-4" />
          <div className="flex items-center justify-between font-semibold">
            <span>Total</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
