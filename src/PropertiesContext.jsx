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
        location: { lat: item.location_lat, lng: item.location_lng },
        projectType: item.project_type,
        priceSqm: item.price_sqm,
        priceTo: item.price_to,
        totalUnits: item.total_units,
        unitTypes: item.unit_types,
        projectParking: item.project_parking,
        totalLandArea: item.total_land_area,
        facilityType: item.facility_type,
        distanceToStation: item.distance_to_station,
        categorizedLandmarks: item.categorized_landmarks,
        transitSystem: item.transit_system,
        transitLine: item.transit_line,
        roomType: item.room_type,
        livingFormat: item.living_format,
        healthFacilities: item.health_facilities,
        fullyFurnished: item.fully_furnished,
        listingType: item.listing_type || 'ซื้อ',
        projectHighlights: item.project_highlights
      }));
      setProperties(formattedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Function to upload image to Supabase Storage
  const uploadImage = async (file, pathFolder = 'general') => {
    try {
      if (!file) return null;
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${pathFolder}/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) {
        console.error("Error uploading image:", error);
        return null;
      }
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);
        
      return publicUrlData.publicUrl;
    } catch (err) {
      console.error("Unexpected error in uploadImage:", err);
      return null;
    }
  };

  // Strip frontend-only fields and any fields not explicitly in the DB schema
  const cleanPayload = (payload) => {
    const validDbFields = [
      'id', 'name', 'developer', 'price', 'price_str', 'price_sqm', 'price_to', 'bedrooms', 'size',
      'type', 'project_type', 'status', 'location_lat', 'location_lng', 'station',
      'distance_to_station', 'rating', 'reviews', 'image', 'logo', 'images', 'facilities',
      'building_details', 'promotions', 'floors', 'total_units',
      'unit_types', 'project_parking', 'total_land_area', 'facility_type',
      'categorized_landmarks', 'province', 'district', 'transit_system', 'transit_line',
      'room_type', 'living_format', 'promotion', 'special', 'health_facilities',
      'services', 'security', 'transport', 'buildings', 'fully_furnished', 'listing_type', 'project_highlights'
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
      project_type: newProperty.projectType,
      price_sqm: newProperty.priceSqm,
      price_to: newProperty.priceTo,
      total_units: newProperty.totalUnits,
      unit_types: newProperty.unitTypes,
      project_parking: newProperty.projectParking,
      total_land_area: newProperty.totalLandArea,
      facility_type: newProperty.facilityType,
      distance_to_station: newProperty.distanceToStation,
      categorized_landmarks: newProperty.categorizedLandmarks,
      transit_system: newProperty.transitSystem,
      transit_line: newProperty.transitLine,
      room_type: newProperty.roomType,
      living_format: newProperty.livingFormat,
      health_facilities: newProperty.healthFacilities,
      fully_furnished: newProperty.fullyFurnished,
      listing_type: newProperty.listingType || 'ซื้อ',
      project_highlights: newProperty.projectHighlights
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
      project_type: updatedProperty.projectType,
      price_sqm: updatedProperty.priceSqm,
      price_to: updatedProperty.priceTo,
      total_units: updatedProperty.totalUnits,
      unit_types: updatedProperty.unitTypes,
      project_parking: updatedProperty.projectParking,
      total_land_area: updatedProperty.totalLandArea,
      facility_type: updatedProperty.facilityType,
      distance_to_station: updatedProperty.distanceToStation,
      categorized_landmarks: updatedProperty.categorizedLandmarks,
      transit_system: updatedProperty.transitSystem,
      transit_line: updatedProperty.transitLine,
      room_type: updatedProperty.roomType,
      living_format: updatedProperty.livingFormat,
      health_facilities: updatedProperty.healthFacilities,
      fully_furnished: updatedProperty.fullyFurnished,
      listing_type: updatedProperty.listingType || 'ซื้อ',
      project_highlights: updatedProperty.projectHighlights
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
    <PropertiesContext.Provider value={{ properties, addProperty, updateProperty, deleteProperty, fetchProperties, loading, uploadImage }}>
      {children}
    </PropertiesContext.Provider>
  );
};
