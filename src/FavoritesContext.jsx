import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('findmyhome_favorites');
    try { const parsed = JSON.parse(saved); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('findmyhome_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (propertyId) => {
    setFavorites(prev => prev.includes(propertyId) ? prev.filter(id => id !== propertyId) : [...prev, propertyId]);
  };

  const isFavorite = (propertyId) => favorites.includes(propertyId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
