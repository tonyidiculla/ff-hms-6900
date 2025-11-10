/**
 * Secure logging utilities to prevent PII exposure in production logs
 * 
 * CRITICAL: Never log sensitive data like emails, entity IDs, user IDs in production.
 * This is required for GDPR, HIPAA, and other privacy compliance.
 */

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * Mask email addresses for logging
 * Example: "user@example.com" -> "u***@e***.com" or "[MASKED_EMAIL]"
 */
export function maskEmail(email: string): string {
  if (IS_PRODUCTION) {
    return '[MASKED_EMAIL]';
  }
  
  if (!email || !email.includes('@')) {
    return '[INVALID_EMAIL]';
  }
  
  const [local, domain] = email.split('@');
  const maskedLocal = local.length > 2 ? local[0] + '***' : '***';
  const maskedDomain = domain.length > 4 ? domain[0] + '***.' + domain.split('.').pop() : '***';
  
  return `${maskedLocal}@${maskedDomain}`;
}

/**
 * Mask UUID/ID fields for logging
 * Example: "123e4567-e89b-12d3-a456-426614174000" -> "123e***4000" or "[MASKED_ID]"
 */
export function maskId(id: string): string {
  if (IS_PRODUCTION) {
    return '[MASKED_ID]';
  }
  
  if (!id || id.length < 8) {
    return '[INVALID_ID]';
  }
  
  return id.substring(0, 4) + '***' + id.substring(id.length - 4);
}

/**
 * Mask entity platform ID for logging
 */
export function maskEntityId(entityId: string): string {
  return maskId(entityId);
}

/**
 * Mask user ID for logging
 */
export function maskUserId(userId: string): string {
  return maskId(userId);
}

/**
 * Secure console.log wrapper that automatically masks common PII fields
 */
export function secureLog(message: string, data?: any): void {
  if (!data) {
    console.log(message);
    return;
  }

  const secureData = { ...data };
  
  // Mask known PII fields
  if (secureData.email) {
    secureData.email = maskEmail(secureData.email);
  }
  
  if (secureData.user_id) {
    secureData.user_id = maskUserId(secureData.user_id);
  }
  
  if (secureData.userId) {
    secureData.userId = maskUserId(secureData.userId);
  }
  
  if (secureData.entity_platform_id) {
    secureData.entity_platform_id = maskEntityId(secureData.entity_platform_id);
  }
  
  if (secureData.employee_entity_id) {
    secureData.employee_entity_id = maskEntityId(secureData.employee_entity_id);
  }
  
  if (secureData.entityId) {
    secureData.entityId = maskEntityId(secureData.entityId);
  }

  // Recursively mask nested objects
  Object.keys(secureData).forEach(key => {
    if (typeof secureData[key] === 'object' && secureData[key] !== null) {
      secureData[key] = maskPIIInObject(secureData[key]);
    }
  });
  
  console.log(message, secureData);
}

/**
 * Recursively mask PII in nested objects
 */
function maskPIIInObject(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(item => maskPIIInObject(item));
  }
  
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  const masked = { ...obj };
  
  Object.keys(masked).forEach(key => {
    const lowerKey = key.toLowerCase();
    
    if (lowerKey.includes('email')) {
      masked[key] = maskEmail(masked[key]);
    } else if (lowerKey.includes('id') && typeof masked[key] === 'string') {
      masked[key] = maskId(masked[key]);
    } else if (typeof masked[key] === 'object' && masked[key] !== null) {
      masked[key] = maskPIIInObject(masked[key]);
    }
  });
  
  return masked;
}

/**
 * Secure error logging that masks PII
 */
export function secureError(message: string, error?: any, context?: any): void {
  const secureContext = context ? maskPIIInObject(context) : undefined;
  
  console.error(message, error?.message || error, secureContext);
}

/**
 * Log authentication events securely
 */
export function logAuthEvent(event: string, userId?: string, entityId?: string, details?: any): void {
  secureLog(`[Auth] ${event}`, {
    userId: userId ? maskUserId(userId) : undefined,
    entityId: entityId ? maskEntityId(entityId) : undefined,
    timestamp: new Date().toISOString(),
    ...details
  });
}

/**
 * Log database operations securely  
 */
export function logDatabaseEvent(operation: string, table: string, recordId?: string, userId?: string, details?: any): void {
  secureLog(`[Database] ${operation} on ${table}`, {
    recordId: recordId ? maskId(recordId) : undefined,
    userId: userId ? maskUserId(userId) : undefined,
    timestamp: new Date().toISOString(),
    ...details
  });
}