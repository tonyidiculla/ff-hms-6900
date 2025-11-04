'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { uploadFile } from '@/lib/storage-service';
import { supabase } from '@/lib/supabase-client';

// Helper function to get privilege level name
const getPrivilegeLevelName = (level: number): string => {
  switch (level) {
    case 1: return 'Platform Admin';
    case 5: return 'Org Owner';
    case 10: return 'Org Admin';
    case 20: return 'Entity Admin';
    case 25: return 'HR Manager';
    case 30: return 'Dept Manager';
    case 40: return 'Team Lead';
    case 50: return 'Employee';
    case 60: return 'Contractor';
    case 100: return 'Guest';
    default: return `Level ${level}`;
  }
};

export interface FurfieldHeaderProps {
  title?: string;
  homeRoute?: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  entityName?: string;
  entityLocation?: string;
  entityLogo?: string;
}

export const FurfieldHeader: React.FC<FurfieldHeaderProps> = ({
  title = 'Hospital Management System',
  homeRoute = '/',
  showSearch = false,
  onSearch,
  entityName,
  entityLocation,
  entityLogo,
}) => {
  const router = useRouter();
  const { user, logout, refreshProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derive displayName from user object
  const displayName = user?.name || (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'User');
  const initials = displayName.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) {
      e.target.value = '';
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('[FurfieldHeader] Please upload an image file');
      e.target.value = '';
      return;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    console.log('[FurfieldHeader] File size:', file.size, 'bytes, Max:', maxSize, 'bytes');
    if (file.size > maxSize) {
      console.error('[FurfieldHeader] Avatar file size must be less than 2MB. File size:', file.size, 'bytes');
      e.target.value = '';
      return;
    }

    try {
      console.log('[FurfieldHeader] Uploading avatar for user:', user.id);
      
      // Get user's platform ID from their profile
      const { data: profile } = await supabase
        .from('profiles_with_auth')
        .select('user_platform_id')
        .eq('user_id', user.id)
        .single();

      if (!profile?.user_platform_id) {
        throw new Error('User platform ID not found');
      }

      // Upload avatar using storage service
      const result = await uploadFile({
        file,
        type: 'user',
        id: profile.user_platform_id
      });

      console.log('[FurfieldHeader] Avatar uploaded successfully:', result.url);

      // Update user profile with new avatar storage in the profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_storage: {
            url: result.url,
            bucket: 'avatars',
            storage_type: 'supabase'
          },
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Refresh profile to get updated avatar URL
      if (refreshProfile) {
        await refreshProfile();
      }
    } catch (error) {
      console.error('[FurfieldHeader] Avatar upload failed:', error);
    } finally {
      e.target.value = '';
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-md shadow-md border-b border-white/30">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Entity Branding */}
        <div className="flex items-center gap-4">
          {/* Entity Logo and Name */}
          <div className="flex items-center gap-3">
            {entityLogo ? (
              <Image 
                src={entityLogo} 
                alt={`${entityName} Logo`} 
                width={48}
                height={48}
                className="rounded-lg"
                style={{ width: 'auto', height: 'auto' }}
                priority
              />
            ) : (
              <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {entityName ? entityName.charAt(0).toUpperCase() : 'H'}
                </span>
              </div>
            )}
            <div>
              {entityName ? (
                <>
                  <h1 className="text-2xl font-bold text-gray-900">{entityName}</h1>
                  {entityLocation && (
                    <p className="text-sm text-gray-600">{entityLocation}</p>
                  )}
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                  <p className="text-sm text-gray-600">Loading entity...</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Center Section - Search Bar (Optional) */}
        {showSearch && (
          <div className="flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </form>
          </div>
        )}

        {/* Right Section - User Profile & Logout */}
        <div className="flex items-center gap-4">
          {/* User Info */}
          <div className="text-right hidden sm:block">
            <div className="text-xs font-medium text-gray-900">{displayName}</div>
            <div className="text-[10px] text-gray-500">
              {user?.jobTitle || user?.role || 'HMS User'}
            </div>
            {user?.privilegeLevel && (
              <div className="text-[10px] text-gray-400">
                {getPrivilegeLevelName(user.privilegeLevel)}
              </div>
            )}
          </div>
          
          {/* Avatar */}
          <div 
            className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold cursor-pointer hover:shadow-lg transition-shadow"
            onClick={handleAvatarClick}
            title="Upload Avatar"
          >
            {user?.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full object-cover"
                onError={(e) => {
                  console.error('[FurfieldHeader] Image failed to load:', user.avatarUrl);
                  e.currentTarget.style.display = 'none';
                }}
                onLoad={() => console.log('[FurfieldHeader] Avatar loaded successfully:', user.avatarUrl)}
              />
            ) : (
              <span className="text-sm">{initials}</span>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Sign Out"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Hidden file input for avatar upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </header>
  );
};

export default FurfieldHeader;