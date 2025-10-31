'use client';

import React, { useState, useEffect } from 'react';
import { FurfieldHeader } from './FurfieldHeader';
import { useAuth } from '@/context/AuthContext';

export const Header: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const [entityName, setEntityName] = useState<string | undefined>(undefined);
  const [entityLocation, setEntityLocation] = useState<string | undefined>(undefined);
  const [entityLogo, setEntityLogo] = useState<string | undefined>(undefined);

  // Fetch entity data directly using employee_entity_id from auth
  useEffect(() => {
    const fetchEntityData = async () => {
      try {
        // First try to get from auth/me API
        const authResponse = await fetch('/api/auth/me');
        if (authResponse.ok) {
          const authData = await authResponse.json();
          const entityId = authData.employee_entity_id || authData.entity_platform_id;
          
          if (entityId) {
            // Now fetch the entity details from hospital_master
            const supabase = (await import('@/lib/supabase-client')).supabase;
            const { data: entity, error } = await supabase
              .from('hospital_master')
              .select('entity_name, city, state, country, logo_storage')
              .eq('entity_platform_id', entityId)
              .single();
            
            if (!error && entity) {
              setEntityName(entity.entity_name);
              
              // Build location string
              const locationParts = [entity.city, entity.state, entity.country].filter(Boolean);
              if (locationParts.length > 0) {
                setEntityLocation(locationParts.join(', '));
              }
              
              // Parse logo storage if it exists
              if (entity.logo_storage && typeof entity.logo_storage === 'object') {
                setEntityLogo(entity.logo_storage.url || entity.logo_storage.publicUrl);
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch entity data:', error);
      }
    };

    if (!loading && user) {
      fetchEntityData();
    }
  }, [loading, user]);

  const handleLogout = () => {
    logout();
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      console.log('📤 Starting avatar upload:', { name: file.name, size: file.size, type: file.type });
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size must be less than 5MB');
      }

      const formData = new FormData();
      formData.append('avatar', file);

      // Import Cookies dynamically
      const Cookies = (await import('js-cookie')).default;
      const token = Cookies.get('furfield_token');
      
      if (!token) {
        throw new Error('Not authenticated');
      }

      console.log('🌐 Uploading to /auth/api/auth/avatar...');
      const response = await fetch('/auth/api/auth/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      console.log('📥 Upload response:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload avatar');
      }

      console.log('✅ Avatar uploaded successfully');
      
      // Note: Profile refresh would happen automatically on next auth check
      
      alert('Avatar uploaded successfully!');
    } catch (error: any) {
      console.error('❌ Avatar upload error:', error);
      alert(error.message || 'Failed to upload avatar');
    }
  };

  return (
    <FurfieldHeader
      entityName={entityName}
      entityLocation={entityLocation}
      entityLogo={entityLogo}
    />
  );
};
