import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext(null);

function localKey(uid) {
  return `era_nostalgia_cart_${uid || 'guest'}`;
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]); // [{ artworkId, qty }]

  // Cart is device-local (per browser), scoped by signed-in user or guest.
  useEffect(() => {
    const stored = localStorage.getItem(localKey(user?.uid));
    setItems(stored ? JSON.parse(stored) : []);
  }, [user]);

  const persist = useCallback(
    (next) => {
      setItems(next);
      localStorage.setItem(localKey(user?.uid), JSON.stringify(next));
    },
    [user]
  );

  const addToCart = useCallback(
    (artworkId, qty = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.artworkId === artworkId);
        const next = existing
          ? prev.map((i) => (i.artworkId === artworkId ? { ...i, qty: i.qty + qty } : i))
          : [...prev, { artworkId, qty }];
        localStorage.setItem(localKey(user?.uid), JSON.stringify(next));
        return next;
      });
    },
    [user]
  );

  const removeFromCart = useCallback(
    (artworkId) => {
      persist(items.filter((i) => i.artworkId !== artworkId));
    },
    [items, persist]
  );

  const updateQty = useCallback(
    (artworkId, qty) => {
      if (qty < 1) return;
      persist(items.map((i) => (i.artworkId === artworkId ? { ...i, qty } : i)));
    },
    [items, persist]
  );

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const isInCart = (artworkId) => items.some((i) => i.artworkId === artworkId);
  const cartCount = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQty, clearCart, isInCart, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
