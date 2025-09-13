// Dynamic validation utility functions
// This replaces hardcoded validation logic throughout the application

export interface ValidationRule {
  type: string;
  rules: Record<string, any>;
  priority: number;
  isActive: boolean;
}

export interface FieldValidationConfig {
  validations: ValidationRule[];
  errorMessages: Record<string, string>;
}

export interface ValidationError {
  field: string;
  message: string;
  type: string;
}

// Cache for validation rules to avoid repeated API calls
let validationRulesCache: Record<string, Record<string, FieldValidationConfig>> | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch validation rules from backend with caching
 */
export const fetchValidationRules = async (entityType?: string, environment: string = 'all'): Promise<Record<string, Record<string, FieldValidationConfig>>> => {
  const now = Date.now();
  
  // Return cached rules if still valid
  if (validationRulesCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return validationRulesCache;
  }
  
  try {
    const params = new URLSearchParams();
    if (entityType) params.append('entityType', entityType);
    if (environment) params.append('environment', environment);
    
    const response = await fetch(`/api/validation-rules?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch validation rules');
    }
    
    const data = await response.json();
    validationRulesCache = data.data;
    cacheTimestamp = now;
    
    return validationRulesCache || {};
  } catch (error) {
    console.error('Error fetching validation rules:', error);
    return {}; // Return empty rules on error
  }
};

/**
 * Get validation rules for a specific entity and field
 */
export const getFieldValidationRules = async (entityType: string, fieldName: string, environment: string = 'all'): Promise<FieldValidationConfig | null> => {
  const allRules = await fetchValidationRules(entityType, environment);
  return allRules[entityType]?.[fieldName] || null;
};

/**
 * Validate a single field value against dynamic rules
 */
export const validateFieldDynamic = async (entityType: string, fieldName: string, value: string, environment: string = 'all'): Promise<ValidationError[]> => {
  const errors: ValidationError[] = [];
  const fieldConfig = await getFieldValidationRules(entityType, fieldName, environment);
  
  if (!fieldConfig || !fieldConfig.validations) {
    return errors; // No validation rules defined
  }
  
  // Sort validations by priority
  const sortedValidations = fieldConfig.validations
    .filter(v => v.isActive)
    .sort((a, b) => a.priority - b.priority);
  
  for (const validation of sortedValidations) {
    const error = validateByType(validation.type, value, validation.rules, fieldConfig.errorMessages[validation.type] || 'Validation failed');
    if (error) {
      errors.push({ field: fieldName, message: error, type: validation.type });
      
      // For required field validation, stop processing other validations if field is empty
      if (validation.type === 'required' && (!value || value.trim() === '')) {
        break;
      }
    }
  }
  
  return errors;
};

/**
 * Validate multiple fields in an object
 */
export const validateObjectDynamic = async (entityType: string, data: Record<string, any>, environment: string = 'all'): Promise<ValidationError[]> => {
  const allErrors: ValidationError[] = [];
  
  for (const [fieldName, value] of Object.entries(data)) {
    const fieldErrors = await validateFieldDynamic(entityType, fieldName, String(value || ''), environment);
    allErrors.push(...fieldErrors);
  }
  
  return allErrors;
};

/**
 * Core validation logic by type
 */
const validateByType = (type: string, value: string, rules: Record<string, any>, errorMessage: string): string | null => {
  switch (type) {
    case 'required':
      if (rules.required && (!value || value.trim() === '')) {
        return errorMessage;
      }
      break;
      
    case 'length':
      if (rules.minLength && value.length < rules.minLength) {
        return errorMessage;
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        return errorMessage;
      }
      if (rules.exactLength && value.length !== rules.exactLength) {
        return errorMessage;
      }
      break;
      
    case 'pattern':
      if (rules.pattern) {
        const regex = new RegExp(rules.pattern);
        if (!regex.test(value)) {
          return errorMessage;
        }
      }
      break;
      
    case 'range':
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        if (rules.minValue !== undefined && numValue < rules.minValue) {
          return errorMessage;
        }
        if (rules.maxValue !== undefined && numValue > rules.maxValue) {
          return errorMessage;
        }
      }
      break;
      
    case 'custom':
      // Handle custom validation rules
      if (rules.customValidator && typeof rules.customValidator === 'function') {
        const result = rules.customValidator(value);
        if (result !== true) {
          return typeof result === 'string' ? result : errorMessage;
        }
      }
      break;
  }
  
  return null;
};

/**
 * Get validation constraints for form field configuration
 * This helps with setting up form field props like maxLength, pattern, etc.
 */
export const getFieldConstraints = async (entityType: string, fieldName: string, environment: string = 'all'): Promise<Record<string, any>> => {
  const fieldConfig = await getFieldValidationRules(entityType, fieldName, environment);
  const constraints: Record<string, any> = {};
  
  if (!fieldConfig) return constraints;
  
  fieldConfig.validations.forEach(validation => {
    if (!validation.isActive) return;
    
    switch (validation.type) {
      case 'required':
        if (validation.rules.required) {
          constraints.required = true;
        }
        break;
        
      case 'length':
        if (validation.rules.maxLength) {
          constraints.maxLength = validation.rules.maxLength;
        }
        if (validation.rules.minLength) {
          constraints.minLength = validation.rules.minLength;
        }
        break;
        
      case 'pattern':
        if (validation.rules.pattern) {
          constraints.pattern = validation.rules.pattern;
        }
        break;
        
      case 'range':
        if (validation.rules.minValue !== undefined) {
          constraints.min = validation.rules.minValue;
        }
        if (validation.rules.maxValue !== undefined) {
          constraints.max = validation.rules.maxValue;
        }
        break;
    }
  });
  
  return constraints;
};

/**
 * Create a Zod schema from dynamic validation rules
 * This allows integration with react-hook-form and existing form validation
 */
export const createZodSchemaFromRules = async (entityType: string, fields: string[], environment: string = 'all') => {
  const { z } = await import('zod');
  const schemaFields: Record<string, any> = {};
  
  for (const fieldName of fields) {
    const fieldConfig = await getFieldValidationRules(entityType, fieldName, environment);
    if (!fieldConfig) continue;
    
    let fieldSchema = z.string();
    
    fieldConfig.validations.forEach(validation => {
      if (!validation.isActive) return;
      
      switch (validation.type) {
        case 'required':
          if (validation.rules.required) {
            fieldSchema = fieldSchema.min(1, validation.rules.message || 'This field is required');
          }
          break;
          
        case 'length':
          if (validation.rules.minLength) {
            fieldSchema = fieldSchema.min(validation.rules.minLength, fieldConfig.errorMessages[validation.type]);
          }
          if (validation.rules.maxLength) {
            fieldSchema = fieldSchema.max(validation.rules.maxLength, fieldConfig.errorMessages[validation.type]);
          }
          if (validation.rules.exactLength) {
            fieldSchema = fieldSchema.length(validation.rules.exactLength, fieldConfig.errorMessages[validation.type]);
          }
          break;
          
        case 'pattern':
          if (validation.rules.pattern) {
            fieldSchema = fieldSchema.regex(new RegExp(validation.rules.pattern), fieldConfig.errorMessages[validation.type]);
          }
          break;
      }
    });
    
    schemaFields[fieldName] = fieldSchema;
  }
  
  return z.object(schemaFields);
};

/**
 * Clear validation rules cache (useful for testing or when rules are updated)
 */
export const clearValidationCache = (): void => {
  validationRulesCache = null;
  cacheTimestamp = 0;
};

/**
 * Get all available validation rules for an entity type
 */
export const getEntityValidationRules = async (entityType: string, environment: string = 'all'): Promise<Record<string, FieldValidationConfig>> => {
  const allRules = await fetchValidationRules(entityType, environment);
  return allRules[entityType] || {};
};