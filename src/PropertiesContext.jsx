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

  // Strip frontend-only fields and any fields not explicitly in the DB schema
  const cleanPayload = (payload) => {
    const validDbFields = [
      'id', 'name', 'developer', 'price', 'price_str', 'price_sqm', 'bedrooms', 'size',
      'type', 'project_type', 'status', 'location_lat', 'location_lng', 'station',
      'distance_to_station', 'rating', 'reviews', 'image', 'logo', 'images', 'facilities',
      'building_details', 'promotions', 'floors', 'total_units',
      'unit_types', 'project_parking', 'total_land_area'
    ];
    const cleaned = {};
    for (const key of Object.keys(payload)) {
      if (validDbFields.includes(key)) {
        cleaned[key] = payload[key];
      }
    }
    return cleaned;
  };

  const addProperty = async (newProperty) => {
    const id = `p${Date.now()}`;
    const dbPayload = cleanPayload({ 
      ...newProperty, 
      id,
      location_lat: newProperty.location?.lat,
      location_lng: newProperty.location?.lng,
      unit_types: newProperty.unitTypes,
      project_parking: newProperty.projectParking,
      total_land_area: newProperty.totalLandArea
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
      location_lng: updatedProperty.location?.lng || 100.5,
      unit_types: updatedProperty.unitTypes,
      project_parking: updatedProperty.projectParking,
      total_land_area: updatedProperty.totalLandArea
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
