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

  // Strip computed/frontend-only fields that don't exist in the DB schema
  const cleanPayload = (payload) => {
    const nonDbFields = [
      'location', 'categorizedLandmarks', 'nearbyPlaces', 'distanceInfo',
      'computedPrice', 'displayPrice', 'formattedAddress'
    ];
    const cleaned = { ...payload };
    nonDbFields.forEach(f => delete cleaned[f]);
    return cleaned;
  };

  const addProperty = async (newProperty) => {
    const id = `p${Date.now()}`;
    const dbPayload = cleanPayload({ 
      ...newProperty, 
      id,
      location_lat: newProperty.location?.lat,
      location_lng: newProperty.location?.lng
    });
    
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

  const updateProperty = async (id, updatedProperty) => {
    const dbPayload = cleanPayload({ 
      ...updatedProperty,
      location_lat: updatedProperty.location?.lat || 13.75,
      location_lng: updatedProperty.location?.lng || 100.5
    });
    
    const { error } = await supabase
      .from('properties')
      .update(dbPayload)
      .eq('id', id);
      
    if (error) {
      console.error("Error updating property:", error);
      return { success: false, message: error.message || JSON.stringify(error) };
    }
    
    await fetchProperties();
    return { success: true };
  };


  const deleteProperty = async (id) => {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting property:", error);
      return false;
    }
    
    await fetchProperties();
    return true;
  };

  return (
    <PropertiesContext.Provider value={{ properties, addProperty, updateProperty, deleteProperty, fetchProperties, loading }}>
      {children}
    </PropertiesContext.Provider>
  );
};
