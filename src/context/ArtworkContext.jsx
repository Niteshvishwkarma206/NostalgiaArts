import { createContext, useContext, useEffect, useState } from 'react';
import {
  subscribeArtworks,
  subscribeUploadHistory,
  addArtwork,
  updateArtwork,
  deleteArtwork,
  addUploadHistory,
} from '../lib/db.js';

const ArtworkContext = createContext(null);

export function ArtworkProvider({ children }) {
  const [artworks, setArtworks] = useState([]);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeArtworks((data) => {
      setArtworks(data);
      setLoading(false);
    });
    const unsubHistory = subscribeUploadHistory(setUploadHistory);
    return () => {
      unsub && unsub();
      unsubHistory && unsubHistory();
    };
  }, []);

  const categories = Array.from(new Set(artworks.map((a) => a.category))).sort();
  const artists = Array.from(new Set(artworks.map((a) => a.artist))).sort();

  const value = {
    artworks,
    uploadHistory,
    loading,
    categories,
    artists,
    addArtwork,
    updateArtwork,
    deleteArtwork,
    addUploadHistory,
  };

  return <ArtworkContext.Provider value={value}>{children}</ArtworkContext.Provider>;
}

export const useArtworks = () => useContext(ArtworkContext);
