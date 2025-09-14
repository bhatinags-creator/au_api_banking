import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Safely parse JSON strings, preventing double-encoding issues
export function safeParseJson(value: any): any {
  if (typeof value !== 'string') return value;
  
  try {
    const parsed = JSON.parse(value);
    // If result is still a string and looks like JSON, parse once more
    if (typeof parsed === 'string' && (parsed.startsWith('{') || parsed.startsWith('['))) {
      try {
        return JSON.parse(parsed);
      } catch {
        return parsed;
      }
    }
    return parsed;
  } catch {
    return value; // Return original if parsing fails
  }
}

// Safely format values for display, handling both objects and strings
export function safeJsonStringify(value: any): string {
  if (typeof value === 'string') {
    // If it's already a string, try to parse and re-stringify for formatting
    try {
      const parsed = JSON.parse(value);
      return JSON.stringify(parsed, null, 2);
    } catch {
      // If parsing fails, return as-is (might be plain text or XML)
      return value;
    }
  }
  
  // If it's an object/array, stringify normally
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value, null, 2);
  }
  
  // For other types, convert to string
  return String(value);
}
