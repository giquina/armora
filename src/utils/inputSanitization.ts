/**
 * Input sanitization utilities to prevent Unicode errors and malformed JSON
 */

/**
 * Sanitizes text by removing unpaired Unicode surrogates that can cause JSON parsing errors
 * @param text - The text to sanitize
 * @returns Sanitized text safe for JSON serialization
 */
export const sanitizeText = (text: string): string => {
  if (!text) return text;

  // Remove unpaired surrogates that cause JSON parsing errors
  return text.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '');
};

/**
 * Validates that data can be safely JSON stringified
 * @param data - The data to validate
 * @returns true if data is safe to stringify, false otherwise
 */
export const validateJSON = (data: any): boolean => {
  try {
    JSON.stringify(data);
    return true;
  } catch (error) {
    console.error('Invalid JSON data:', error);
    return false;
  }
};

/**
 * Safely stringify data with sanitization
 * @param data - The data to stringify
 * @returns JSON string or null if data is invalid
 */
export const safeStringify = (data: any): string | null => {
  try {
    // Sanitize string values recursively
    const sanitized = sanitizeObject(data);
    return JSON.stringify(sanitized);
  } catch (error) {
    console.error('Failed to stringify data:', error);
    return null;
  }
};

/**
 * Recursively sanitize an object's string values
 * @param obj - The object to sanitize
 * @returns Sanitized object
 */
const sanitizeObject = (obj: any): any => {
  if (typeof obj === 'string') {
    return sanitizeText(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[sanitizeText(key)] = sanitizeObject(value);
    }
    return sanitized;
  }

  return obj;
};