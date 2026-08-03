import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useArtworks } from '../context/ArtworkContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Cart() {
  const { artworks, loading } = useArtworks();
  const { items, removeFromCart, updateQty } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const cartLines = items
    .map((line) => {
      const artwork = artworks.find((a) => a.id === line.artworkId);
      return artwork ? { ...line, artwork } : null;
    })
    .filter(Boolean);

  const subtotal = cartLines.reduce((sum, l) => sum + Number(l.artwork.price) * l.qty, 0);

  function handleCheckout() {
    if (cartLines.length === 0) return;
    if (!user) {
      showToast('Sign in to continue to checkout', 'info');
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16"
    >
      <p className="section-eyebrow flex items-center gap-1.5">
        <ShoppingBag size={14} /> Your Cart
      </p>
      <h1 className="page-title mt-1 mb-10">Shopping Cart</h1>

      {!loading && cartLines.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag className="mx-auto text-onyx-300 dark:text-onyx-700 mb-4" size={40} />
          <p className="text-onyx-500 dark:text-onyx-400 mb-6">Your cart is empty.</p>
          <Link to="/gallery" className="btn-gold">
            Browse Gallery
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {cartLines.map(({ artwork, qty }) => (
              <div
                key={artwork.id}
                className="flex gap-4 rounded-2xl border border-onyx-200 dark:border-onyx-800 p-4"
              >
                <Link to={`/artwork/${artwork.id}`} className="shrink-0">
                  <img
                    src={artwork.images?.[0]}
                    alt={artwork.title}
                    className="h-24 w-24 rounded-xl object-cover"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/artwork/${artwork.id}`} className="font-serif text-lg leading-tight hover:text-gold-600 dark:hover:text-gold-400">
                    {artwork.title}
                  </Link>
                  <p className="text-sm text-onyx-500 dark:text-onyx-400">{artwork.artist}</p>
                  <p className="text-sm font-semibold text-gold-600 dark:text-gold-400 mt-1">
                    ${Number(artwork.price).toLocaleString()}
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center rounded-full border border-onyx-200 dark:border-onyx-800">
                      <button
                        onClick={() => updateQty(artwork.id, qty - 1)}
                        disabled={qty <= 1}
                        className="p-2 disabled:opacity-30"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center text-sm">{qty}</span>
                      <button
                        onClick={() => updateQty(artwork.id, qty + 1)}
                        className="p-2"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(artwork.id)}
                      className="p-2 rounded-full hover:bg-red-500/10 text-red-500"
                      aria-label="Remove from cart"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-onyx-200 dark:border-onyx-800 p-6 h-fit">
            <p className="font-semibold mb-4">Order Summary</p>
            <div className="flex items-center justify-between text-sm text-onyx-500 dark:text-onyx-400 mb-2">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-onyx-500 dark:text-onyx-400 mb-4">
              <span>Shipping</span>
              <span>Calculated at delivery</span>
            </div>
            <div className="h-px bg-onyx-200 dark:bg-onyx-800 my-4" />
            <div className="flex items-center justify-between font-semibold mb-6">
              <span>Total</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <button onClick={handleCheckout} className="btn-gold w-full">
              Checkout <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
