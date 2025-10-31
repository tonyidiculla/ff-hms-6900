/**
 * Shared Custom Hooks
 * Common hooks for both HMS and Organization apps
 */

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OrganizationService, EntityService } from '../lib/shared-services';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Types
export interface CountryOption {
  value: string; // country_code
  label: string; // country_name
}

export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  countryCode: string;
  countryName: string;
}

/**
 * Organizations Hook
 * Fetches organizations for the current user using React Query
 */
export function useOrganizations() {
  return useQuery({
    queryKey: ['user-organizations'],
    queryFn: async () => {
      const response = await fetch('/api/organizations', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch organizations');
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch organizations');
      }
      
      return result.data.organizations;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Entities Hook
 * Fetches entities for the current user or specific organization
 */
export function useEntities(organizationPlatformId?: string) {
  return useQuery({
    queryKey: ['user-entities', organizationPlatformId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (organizationPlatformId) {
        params.append('organizationPlatformId', organizationPlatformId);
      }
      
      const response = await fetch(`/api/entities?${params.toString()}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch entities');
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch entities');
      }
      
      return result.data.entities;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Countries Hook
 * Fetches available countries from location_currency table
 */
export function useCountries() {
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCountries() {
      try {
        setLoading(true);
        setError(null);

        // Get distinct countries from location_currency table
        const { data, error: supabaseError } = await supabase
          .from('location_currency')
          .select('country_code, country_name')
          .eq('is_active', true)
          .order('country_name');

        if (supabaseError) throw supabaseError;

        // Remove duplicates and format for select options
        const uniqueCountries = data?.reduce((acc: CountryOption[], curr) => {
          if (!acc.find(country => country.value === curr.country_code)) {
            acc.push({
              value: curr.country_code,
              label: curr.country_name
            });
          }
          return acc;
        }, []) || [];

        setCountries(uniqueCountries);
      } catch (err: any) {
        console.error('Error fetching countries:', err);
        setError(err.message || 'Failed to fetch countries');
      } finally {
        setLoading(false);
      }
    }

    fetchCountries();
  }, []);

  return { countries, loading, error };
}

/**
 * Currencies Hook
 * Fetches available currencies from location_currency table
 */
export function useCurrencies(activeOnly: boolean = true) {
  const [currencies, setCurrencies] = useState<CurrencyOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrencies = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('location_currency')
        .select('currency_code, currency_name, currency_symbol, country_name, country_code');

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error: supabaseError } = await query.order('currency_name');

      if (supabaseError) throw supabaseError;

      const formattedCurrencies = data?.map(currency => ({
        code: currency.currency_code,
        name: currency.currency_name,
        symbol: currency.currency_symbol,
        countryCode: currency.country_code,
        countryName: currency.country_name
      })) || [];

      setCurrencies(formattedCurrencies);
    } catch (err: any) {
      console.error('Error fetching currencies:', err);
      setError(err.message || 'Failed to fetch currencies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, [activeOnly]);

  return { currencies, loading, error, refetch: fetchCurrencies };
}

/**
 * User Profile Hook
 * Fetches current user profile information
 */
export function useProfile(userId?: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Data Fetching Hook
 * Generic hook for fetching data with loading states
 */
export function useAsyncData<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err: any) {
      console.error('Error in useAsyncData:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, dependencies);

  return { data, loading, error, refetch };
}

/**
 * Local Storage Hook
 * Hook for managing localStorage with JSON serialization
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

/**
 * Debounced Value Hook
 * Hook for debouncing values (useful for search inputs)
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Window Size Hook
 * Hook for tracking window dimensions
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return windowSize;
}