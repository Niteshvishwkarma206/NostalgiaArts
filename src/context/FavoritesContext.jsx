import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { isFirebaseConfigured, db } from '../firebase.js';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext.jsx';

const FavoritesContext = createContext(null);

function localKey(uid) {
  return `era_nostalgia_favorites_${uid}`;
}

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }

    if (isFirebaseConfigured) {
      const ref = doc(db, 'users', user.uid);
      const unsub = onSnapshot(ref, (snap) => {
        setFavorites(snap.exists() ? snap.data().favorites || [] : []);
      });
      return unsub;
    } else {
      const stored = localStorage.getItem(localKey(user.uid));
      setFavorites(stored ? JSON.parse(stored) : []);
    }
  }, [user]);

  const persist = useCallback(
    async (next) => {
      setFavorites(next);
      if (!user) return;
      if (isFirebaseConfigured) {
        await setDoc(doc(db, 'users', user.uid), { favorites: next }, { merge: true });
      } else {
        localStorage.setItem(localKey(user.uid), JSON.stringify(next));
      }
    },
    [user]
  );

  const toggleFavorite = useCallback(
    (artworkId) => {
      const next = favorites.includes(artworkId)
        ? favorites.filter((id) => id !== artworkId)
        : [...favorites, artworkId];
      persist(next);
    },
    [favorites, persist]
  );

  const isFavorite = (artworkId) => favorites.includes(artworkId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
