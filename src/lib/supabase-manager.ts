import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface SupabaseClientConfig {
  serviceName: string;
  storageKey: string;
  options?: any;
}

class SupabaseClientManager {
  private static instance: SupabaseClientManager;
  private clients: Map<string, SupabaseClient> = new Map();
  
  private constructor() {
    // Initialize debug monitoring in development
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      this.setupDebugMonitoring();
    }
  }
  
  static getInstance(): SupabaseClientManager {
    if (!SupabaseClientManager.instance) {
      SupabaseClientManager.instance = new SupabaseClientManager();
    }
    return SupabaseClientManager.instance;
  }
  
  getClient(config: SupabaseClientConfig): SupabaseClient {
    const { serviceName, storageKey, options = {} } = config;
    
    // Return existing client if already created
    if (this.clients.has(serviceName)) {
      return this.clients.get(serviceName)!;
    }
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(`Missing Supabase environment variables for service: ${serviceName}`);
    }
    
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storageKey: storageKey,
        persistSession: true,
        autoRefreshToken: true,
        ...options.auth,
      },
      global: {
        headers: {
          'X-Service-Name': serviceName,
          'X-Service-Purpose': 'gateway',
          'X-HMS-Priority': '2',
          ...options.global?.headers,
        },
      },
      ...options,
    });
    
    // Store client in map
    this.clients.set(serviceName, client);
    
    // Log client creation in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[HMS Client Manager] Created client for ${serviceName} (priority: 2)`);
      console.log(`[HMS Client Manager] Active clients: ${this.clients.size}`);
    }
    
    return client;
  }
  
  removeClient(serviceName: string): void {
    this.clients.delete(serviceName);
    if (process.env.NODE_ENV === 'development') {
      console.log(`[HMS Client Manager] Removed client for ${serviceName}`);
    }
  }
  
  clearAllClients(): void {
    this.clients.clear();
    if (process.env.NODE_ENV === 'development') {
      console.log(`[HMS Client Manager] Cleared all clients`);
    }
  }
  
  getActiveClients(): string[] {
    return Array.from(this.clients.keys());
  }
  
  getClientCount(): number {
    return this.clients.size;
  }
  
  private setupDebugMonitoring(): void {
    // Override console.warn to catch multiple client warnings
    const patchedConsole = console as typeof console & { __hmsWarnPatched?: boolean };

    if (patchedConsole.__hmsWarnPatched) return;

    const originalWarn = console.warn.bind(console);
    const originalGroup = console.group?.bind(console);
    const originalGroupEnd = console.groupEnd?.bind(console);
    const originalInfo = console.info?.bind(console) ?? console.log.bind(console);

    patchedConsole.__hmsWarnPatched = true;

    console.warn = (...args: any[]) => {
      const message = args
        .map((arg) => {
          if (typeof arg === 'string') return arg;
          try {
            return JSON.stringify(arg);
          } catch {
            return String(arg);
          }
        })
        .join(' ');

      if (message.includes('Multiple GoTrueClient instances detected')) {
        originalGroup?.('[HMS Client Manager] Multiple Client Warning Intercepted');
        originalWarn('🚨 Original warning:', ...args);
        originalInfo('📊 Current active clients:', this.getActiveClients());
        originalInfo('📈 Client count:', this.getClientCount());
        originalInfo('💡 This should not happen with the client manager active');
        originalGroupEnd?.();
        return;
      }

      originalWarn(...args);
    };
  }
}

export const supabaseClientManager = SupabaseClientManager.getInstance();

// ff-hms-6900 specific client with proper isolation
export const supabase = supabaseClientManager.getClient({
  serviceName: 'ff-hms-6900',
  storageKey: 'supabase.auth.gateway',
  options: {
    realtime: {
      params: {
        eventsPerSecond: 5,
      },
    },
  },
});

// Export the manager for cross-service usage
export default supabaseClientManager;