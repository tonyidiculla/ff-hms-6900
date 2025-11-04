'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  jobTitle?: string | null;
  privilegeLevel?: number | null;
  entity_platform_id: string | null;
  employee_entity_id: string | null;
  user_platform_id: string | null;
  avatarUrl?: string | null;
  // HMS app specific fields
  firstName?: string;
  lastName?: string;
  userPlatformId?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  refreshProfile?: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('[AuthContext] Fetching user from local API...');
        // Fetch user info from local HMS API (avoids CORS issues)
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });

        if (response.ok) {
          const userData = await response.json();
          console.log('[AuthContext] User data from API:', userData);
          console.log('[AuthContext] avatarUrl from API:', userData.avatarUrl);
          
          setUser({
            id: userData.id || '',
            name: userData.name || 'User',
            email: userData.email || '',
            role: userData.role || 'user',
            jobTitle: userData.jobTitle || null,
            privilegeLevel: userData.privilegeLevel || null,
            entity_platform_id: userData.entity_platform_id || null,
            employee_entity_id: userData.employee_entity_id || null,
            user_platform_id: userData.user_platform_id || null,
            avatarUrl: userData.avatarUrl || null,
            firstName: userData.firstName || userData.first_name || '',
            lastName: userData.lastName || userData.last_name || '',
            userPlatformId: userData.user_platform_id || '',
          });
          console.log('[AuthContext] User set successfully from API');
          console.log('[AuthContext] User state avatarUrl:', userData.avatarUrl || null);
        } else {
          console.log('[AuthContext] Auth check failed, status:', response.status);
        }
      } catch (error) {
        console.error('[AuthContext] Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const refreshProfile = async (): Promise<void> => {
    try {
      console.log('[AuthContext] Refreshing user profile...');
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('[AuthContext] Profile refreshed:', userData);
        
        setUser(prevUser => ({
          ...prevUser!,
          avatarUrl: userData.avatarUrl || prevUser?.avatarUrl || null,
          jobTitle: userData.jobTitle || prevUser?.jobTitle || null,
          privilegeLevel: userData.privilegeLevel || prevUser?.privilegeLevel || null,
          // Update any other fields that might have changed
          name: userData.name || (userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : prevUser?.name || 'User'),
          firstName: userData.firstName || userData.first_name || prevUser?.firstName || '',
          lastName: userData.lastName || userData.last_name || prevUser?.lastName || '',
        }));
        console.log('[AuthContext] Profile updated successfully');
      } else {
        console.error('[AuthContext] Failed to refresh profile:', response.status);
      }
    } catch (error) {
      console.error('[AuthContext] Error refreshing profile:', error);
    }
  };

  const logout = async () => {
    console.log('[AuthContext] Logging out and clearing all session data...');
    
    try {
      // Sign out from Supabase
      const { supabase } = await import('@/lib/supabase-client');
      await supabase.auth.signOut();
      console.log('[AuthContext] Supabase session cleared');
    } catch (error) {
      console.warn('[AuthContext] Could not complete Supabase logout:', error);
    }
    
    // Clear any remaining session data
    try {
      const { clearAllSessionData } = await import('@/utils/sessionUtils');
      clearAllSessionData();
    } catch (error) {
      // Ignore if sessionUtils doesn't exist
      console.log('[AuthContext] Session utils not available');
    }
    
    // Reset user state
    setUser(null);
    
    console.log('[AuthContext] Session data cleared, redirecting to login page...');
    
    // Redirect to local login page
    window.location.href = '/auth/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
