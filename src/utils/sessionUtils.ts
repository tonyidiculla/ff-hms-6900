/**
 * Utility functions for session management and cookie handling
 * Provides comprehensive session cleanup for FURFIELD authentication system
 */

/**
 * Comprehensive cookie clearing function
 * Clears cookies across multiple domains and paths to ensure complete cleanup
 */
export const clearCookie = (name: string): void => {
  // Clear for current domain and path
  document.cookie = `${name}=; Max-Age=0; path=/;`;
  
  // Clear for localhost domain specifically (for cross-port SSO)
  document.cookie = `${name}=; Max-Age=0; path=/; domain=localhost;`;
  
  // Clear for current hostname
  document.cookie = `${name}=; Max-Age=0; path=/; domain=${window.location.hostname};`;
  
  // Clear for root domain (if subdomain)
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  if (parts.length > 1) {
    const rootDomain = parts.slice(-2).join('.');
    document.cookie = `${name}=; Max-Age=0; path=/; domain=.${rootDomain};`;
  }
  
  // Clear without domain (browser default)
  document.cookie = `${name}=; Max-Age=0; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
};

/**
 * Clear all FURFIELD-related cookies
 * Removes all known authentication and session cookies
 */
export const clearAllFurfieldCookies = (): void => {
  console.log('[SessionUtils] Clearing all FURFIELD session cookies...');
  
  // Main authentication cookies
  clearCookie('furfield_token');
  clearCookie('furfield_refresh_token');
  clearCookie('auth_token');
  clearCookie('refresh_token');
  
  // Legacy cookies (may exist from previous versions)
  clearCookie('furfield_user');
  clearCookie('furfield_session');
  clearCookie('user');
  clearCookie('session');
  
  // Framework cookies that might be set
  clearCookie('next-auth.session-token');
  clearCookie('__Secure-next-auth.session-token');
  clearCookie('__Host-next-auth.csrf-token');
  
  // Supabase auth cookies (in case they're used anywhere)
  clearCookie('sb-access-token');
  clearCookie('sb-refresh-token');
  clearCookie('supabase-auth-token');
  
  console.log('[SessionUtils] All cookies cleared');
};

/**
 * Clear all browser storage
 * Clears localStorage and sessionStorage completely
 */
export const clearAllStorage = (): void => {
  console.log('[SessionUtils] Clearing all browser storage...');
  
  // Clear specific auth items first (in case clear() fails)
  try {
    const keysToRemove = [
      'auth_token',
      'refresh_token',
      'furfield_token',
      'furfield_refresh_token',
      'user',
      'furfield_user',
      'session',
      'furfield_session'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    
    console.log('[SessionUtils] Specific auth items removed');
  } catch (error) {
    console.warn('[SessionUtils] Could not remove specific items:', error);
  }
  
  // Clear localStorage completely
  try {
    localStorage.clear();
    console.log('[SessionUtils] localStorage cleared completely');
  } catch (error) {
    console.warn('[SessionUtils] Could not clear localStorage:', error);
  }
  
  // Clear sessionStorage completely
  try {
    sessionStorage.clear();
    console.log('[SessionUtils] sessionStorage cleared completely');
  } catch (error) {
    console.warn('[SessionUtils] Could not clear sessionStorage:', error);
  }
};

/**
 * Complete session cleanup
 * Performs comprehensive cleanup of all session data
 */
export const clearAllSessionData = (): void => {
  console.log('[SessionUtils] Performing complete session cleanup...');
  
  clearAllFurfieldCookies();
  clearAllStorage();
  
  console.log('[SessionUtils] Complete session cleanup finished');
};

/**
 * Get all cookies as an object (for debugging)
 */
export const getAllCookies = (): Record<string, string> => {
  return document.cookie
    .split(';')
    .reduce((cookies, cookie) => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
      return cookies;
    }, {} as Record<string, string>);
};

/**
 * Debug function to log all current cookies
 */
export const logAllCookies = (): void => {
  const cookies = getAllCookies();
  console.log('[SessionUtils] Current cookies:', cookies);
  console.log('[SessionUtils] Cookie count:', Object.keys(cookies).length);
};