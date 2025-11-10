'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface LocationCurrency {
  id: string;
  country_code: string;
  country_name: string;
  currency_code: string;
  currency_name: string;
  currency_symbol: string;
  language_code: string;
  language_name: string;
  phone_country_code: string;
  isd_code: string;
  tel_digits: number;
  is_active: boolean;
}

interface PhoneValidationResult {
  isValid: boolean;
  expectedDigits: number | null;
  actualDigits: number;
  country: string | null;
  detectedISD?: string;
}

export function useLocationCurrency() {
  const { data: countries = [], isLoading, error } = useQuery({
    queryKey: ['location-currency'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('location_currency')
        .select('*')
        .eq('is_active', true)
        .order('country_name', { ascending: true });

      if (error) throw error;
      return data as LocationCurrency[];
    },
  });

  const getCountryByCode = (code: string) =>
    countries.find((country) => country.country_code === code);

  const getCountryByISD = (isdCode: string) =>
    countries.find((country) => country.isd_code === isdCode);

  const getLanguageForCountry = (countryCode: string) =>
    getCountryByCode(countryCode)?.language_code ?? 'en';

  const getCurrencyForCountry = (countryCode: string) =>
    getCountryByCode(countryCode)?.currency_code ?? 'USD';

  const getPhoneCountryCode = (countryCode: string) =>
    getCountryByCode(countryCode)?.phone_country_code ?? '+1';

  const isdCodes = Array.from(
    new Map(
      countries.map((country) => [
        country.isd_code,
        {
          isdCode: country.isd_code,
          telDigits: country.tel_digits,
          name: country.country_name,
          countryCode: country.country_code,
        },
      ])
    ).values()
  ).sort((a, b) => a.name.localeCompare(b.name));

  const validatePhoneNumber = (
    phoneNumber: string,
    isdCode?: string
  ): PhoneValidationResult => {
    const digitsOnly = phoneNumber.replace(/[^\d]/g, '');

    if (isdCode) {
      const country = getCountryByISD(isdCode);
      if (country) {
        const expectedLength = country.tel_digits;
        const prefix = isdCode.replace('+', '');
        const phoneWithoutISD = digitsOnly.startsWith(prefix)
          ? digitsOnly.substring(prefix.length)
          : digitsOnly;

        return {
          isValid: phoneWithoutISD.length === expectedLength,
          expectedDigits: expectedLength,
          actualDigits: phoneWithoutISD.length,
          country: country.country_name,
        };
      }
    }

    for (const country of countries) {
      const prefix = country.isd_code.replace('+', '');
      if (digitsOnly.startsWith(prefix)) {
        const phoneWithoutISD = digitsOnly.substring(prefix.length);
        if (phoneWithoutISD.length === country.tel_digits) {
          return {
            isValid: true,
            expectedDigits: country.tel_digits,
            actualDigits: phoneWithoutISD.length,
            country: country.country_name,
            detectedISD: country.isd_code,
          };
        }
      }
    }

    return {
      isValid: false,
      expectedDigits: null,
      actualDigits: digitsOnly.length,
      country: null,
    };
  };

  return {
    countries,
    isdCodes,
    isLoading,
    error,
    getCountryByCode,
    getCountryByISD,
    getLanguageForCountry,
    getCurrencyForCountry,
    getPhoneCountryCode,
    validatePhoneNumber,
  };
}
