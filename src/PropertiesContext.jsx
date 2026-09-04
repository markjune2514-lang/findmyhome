import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';

const PropertiesContext = createContext();

export const useProperties = () => useContext(PropertiesContext);

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export const PropertiesProvider = ({ children }) => {
  const { user } = useAuth() || {};
  const cacheKey = user ? 'fmh_properties_admin_v4_cache' : 'fmh_properties_public_v4_cache';
  const cacheTimeKey = user ? 'fmh_properties_admin_v4_time' : 'fmh_properties_public_v4_time';
  const CACHE_KEY = cacheKey;

  const clearSessionCaches = () => {
    try {
      sessionStorage.removeItem('fmh_properties_admin_v4_cache');
      sessionStorage.removeItem('fmh_properties_admin_v4_time');
      sessionStorage.removeItem('fmh_properties_public_v4_cache');
      sessionStorage.removeItem('fmh_properties_public_v4_time');
    } catch (e) {
      console.warn('Failed to clear session cache', e);
    }
  };

  // Try initializing from session cache for instant render
  const [properties, setProperties] = useState(() => {
    try {
      const activeCacheKey = user ? 'fmh_properties_admin_v4_cache' : 'fmh_properties_public_v4_cache';
      const activeTimeKey = user ? 'fmh_properties_admin_v4_time' : 'fmh_properties_public_v4_time';
      const cached = sessionStorage.getItem(activeCacheKey);
      const cachedTime = sessionStorage.getItem(activeTimeKey);
      if (cached && cachedTime && (Date.now() - parseInt(cachedTime, 10) < CACHE_TTL_MS)) {
        return JSON.parse(cached);
      }
    } catch (e) {}
    return [];
  });

  const [loading, setLoading] = useState(() => properties.length === 0);
  const [heroImage, setHeroImage] = useState(() => localStorage.getItem('heroImage') || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80');

  // In-memory cache for full property details
  const fullPropertiesCacheRef = useRef({});

  useEffect(() => {
    localStorage.setItem('heroImage', heroImage);
  }, [heroImage]);

  // Format a raw Supabase property row
  const formatProperty = (item, isFull = false) => {
    let imageStr = '';
    if (Array.isArray(item.image)) {
      imageStr = item.image.filter(Boolean).join(',');
    } else if (typeof item.image === 'string') {
      imageStr = item.image;
    } else if (item.image) {
      imageStr = String(item.image);
    }

    const toArray = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
      return [val];
    };

    const rawPrice = item.price !== null && item.price !== undefined && item.price !== '' ? parseFloat(item.price) : null;
    let normalizedPrice = rawPrice;
    if (item.listing_type !== 'เช่า' && rawPrice !== null && !isNaN(rawPrice) && rawPrice >= 10000) {
      normalizedPrice = parseFloat((rawPrice / 1000000).toFixed(2));
    }

    return {
      ...item,
      price: normalizedPrice,
      image: imageStr,
      location: { 
        lat: typeof item.location_lat === 'number' ? item.location_lat : (parseFloat(item.location_lat) || 13.7563), 
        lng: typeof item.location_lng === 'number' ? item.location_lng : (parseFloat(item.location_lng) || 100.5018) 
      },
      projectType: item.project_type || '',
      priceSqm: item.price_sqm,
      priceTo: item.price_to,
      totalUnits: item.total_units,
      landSize: item.land_size || item.landSize || '',
      unitTypes: Array.isArray(item.unit_types) 
        ? item.unit_types.map(u => ({
            ...u,
            multipurpose: (u.multipurpose === 0 || u.multipurpose === '0' || !u.multipurpose) ? '' : u.multipurpose
          })) 
        : [],
      projectParking: item.project_parking,
      totalLandArea: item.total_land_area,
      facilityType: item.facility_type,
      distanceToStation: item.distance_to_station || '',
      categorizedLandmarks: item.categorized_landmarks || { transit: [], malls: [], hospitals: [], schools: [] },
      transitSystem: item.transit_system || '',
      transitLine: item.transit_line || '',
      roomType: item.room_type || '',
      livingFormat: item.living_format || '',
      special: toArray(item.special),
      facilities: toArray(item.facilities),
      healthFacilities: toArray(item.health_facilities),
      services: toArray(item.services),
      security: toArray(item.security),
      transport: toArray(item.transport),
      promotions: toArray(item.promotions),
      building_details: Array.isArray(item.building_details) ? item.building_details : (item.building_details ? [item.building_details] : []),
      fullyFurnished: !!item.fully_furnished,
      listingType: item.listing_type || 'ซื้อ',
      projectHighlights: item.project_highlights,
      package_tier: item.package_tier || 'standard',
      isFullyLoaded: isFull
    };
  };

  // Fetch all properties with full unit types, landmarks, and details
  const fetchProperties = async (forceRefresh = false) => {
    if (properties.length === 0 || forceRefresh) {
      setLoading(true);
    }

    try {
      let query = supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      // Security hardening: Public visitors do not fetch unpublished drafts
      if (!user) {
        query = query.neq('status', 'ฉบับร่าง');
      }

      const { data, error } = await query;
        
      if (error) {
        console.error("Error fetching properties:", error);
      } else {
        const formattedData = (data || []).map(item => formatProperty(item, true));
        setProperties(formattedData);
        
        // Save to sessionStorage using active user/public cache key
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(formattedData));
          sessionStorage.setItem(cacheTimeKey, String(Date.now()));
        } catch (e) {}
      }
    } catch (err) {
      console.error("Unexpected error in fetchProperties:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch full details of a single property on-demand with memory caching
  const fetchPropertyById = async (id) => {
    if (!id) return null;
    
    // 1. Check in-memory cache
    if (fullPropertiesCacheRef.current[id]) {
      return fullPropertiesCacheRef.current[id];
    }

    try {
      // 2. Fetch full single row from Supabase
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error(`Error fetching full details for property ${id}:`, error);
        // Fallback to summary property if available
        return properties.find(p => p.id === id) || null;
      }

      const fullProperty = formatProperty(data, true);
      
      // Store in memory cache
      fullPropertiesCacheRef.current[id] = fullProperty;
      
      return fullProperty;
    } catch (err) {
      console.error(`Unexpected error fetching property ${id}:`, err);
      return properties.find(p => p.id === id) || null;
    }
  };

  // Re-fetch when user auth state changes (e.g. login as admin or logout)
  useEffect(() => {
    fetchProperties(true);
  }, [user]);

  // Function to upload image to Supabase Storage with security validation
  const uploadImage = async (file, pathFolder = 'general') => {
    try {
      if (!file) return null;

      // Security hardening: restrict to valid image MIME types and extensions
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'];
      const fileExt = (file.name.split('.').pop() || '').toLowerCase();
      if (!allowedExtensions.includes(fileExt) || !file.type.startsWith('image/')) {
        console.error("Upload rejected: only valid image files (jpg, png, webp, gif) are allowed.");
        alert("กรุณาอัปโหลดไฟล์รูปภาพที่ถูกต้อง (JPG, PNG, WEBP, GIF เท่านั้น)");
        return null;
      }

      // Security hardening: 10MB maximum file size limit
      const MAX_SIZE_MB = 10;
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        console.error(`Upload rejected: File size exceeds ${MAX_SIZE_MB}MB limit.`);
        alert(`ขนาดไฟล์เกินกำหนด (สูงสุดไม่เกิน ${MAX_SIZE_MB}MB)`);
        return null;
      }
      
      // Create a unique sanitized file name
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
      'services', 'security', 'transport', 'buildings', 'fully_furnished', 'listing_type', 'project_highlights',
      'package_tier', 'rank_score'
    ];
    const cleaned = {};
    for (const key of Object.keys(payload)) {
      if (validDbFields.includes(key)) {
        cleaned[key] = payload[key];
      }
    }
    if (Array.isArray(cleaned.unit_types)) {
      cleaned.unit_types = cleaned.unit_types.map(u => ({
        ...u,
        multipurpose: (u.multipurpose === '0' || u.multipurpose === 0 || !u.multipurpose) ? '' : u.multipurpose
      }));
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
      land_size: (newProperty.landSize !== undefined && newProperty.landSize !== null) ? newProperty.landSize : (newProperty.land_size || ''),
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
    
    // Invalidate cache
    clearSessionCaches();
    await fetchProperties(true);
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
      land_size: (updatedProperty.landSize !== undefined && updatedProperty.landSize !== null) ? updatedProperty.landSize : (updatedProperty.land_size || ''),
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
    
    // Invalidate caches
    delete fullPropertiesCacheRef.current[id];
    clearSessionCaches();
    await fetchProperties(true);
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
    
    // Invalidate caches
    delete fullPropertiesCacheRef.current[id];
    clearSessionCaches();
    await fetchProperties(true);
    return true;
  };

  return (
    <PropertiesContext.Provider value={{ 
      properties, 
      addProperty, 
      updateProperty, 
      deleteProperty, 
      fetchProperties, 
      fetchPropertyById,
      loading, 
      uploadImage, 
      heroImage, 
      setHeroImage 
    }}>
      {children}
    </PropertiesContext.Provider>
  );
};
