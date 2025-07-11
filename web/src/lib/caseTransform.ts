/**
 * Utility functions to transform between snake_case and camelCase
 */

/**
 * Convert snake_case string to camelCase
 */
function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert camelCase string to snake_case
 */
function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Transform object keys from snake_case to camelCase recursively
 */
export function transformToCamelCase<T = any>(obj: any): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => transformToCamelCase(item)) as T;
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    const result: any = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const camelKey = toCamelCase(key);
        result[camelKey] = transformToCamelCase(obj[key]);
      }
    }
    
    return result as T;
  }

  return obj;
}

/**
 * Transform object keys from camelCase to snake_case recursively
 */
export function transformToSnakeCase<T = any>(obj: any): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => transformToSnakeCase(item)) as T;
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    const result: any = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const snakeKey = toSnakeCase(key);
        result[snakeKey] = transformToSnakeCase(obj[key]);
      }
    }
    
    return result as T;
  }

  return obj;
}
