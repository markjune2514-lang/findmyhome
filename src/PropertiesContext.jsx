import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from './supabaseClient';

const PropertiesContext = createContext();

export const useProperties = () => useContext(PropertiesContext);

export const PropertiesProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching properties:", error);
    } else {
      const formattedData = data.map(item => ({
        ...item,
        location: { lat: item.location_lat, lng: item.location_lng }
      }));
      setProperties(formattedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const addProperty = async (newProperty) => {
    const id = `p${Date.now()}`;
    const dbPayload = { 
      ...newProperty, 
      id,
      location_lat: newProperty.location.lat,
      location_lng: newProperty.location.lng
    };
    delete dbPayload.location;
    
    const { error } = await supabase
      .from('properties')
      .insert([dbPayload]);
      
    if (error) {
      console.error("Error inserting property:", error);
      return null;
    }
    
    await fetchProperties();
    return id; 
  };

  return (
    <PropertiesContext.Provider value={{ properties, addProperty, loading }}>
      {children}
    </PropertiesContext.Provider>
  );
};
