import { useQuery } from "@tanstack/react-query";
import type { 
  UiConfiguration, 
  FormConfiguration, 
  SystemConfiguration, 
  ValidationConfiguration,
  ApiExplorerConfiguration,
  CategoryStyleConfiguration
} from "@shared/schema";

// Default fallback configurations
const DEFAULT_UI_CONFIG = {
  theme: "default",
  primaryColor: "#603078",
  secondaryColor: "#4d2661",
  accentColor: "#f59e0b",
  backgroundColor: "#fefefe",
  textColor: "#111827",
  borderRadius: "14px",
  fontFamily: "Inter",
  sidebarWidth: "16rem",
  headerHeight: "4rem"
};

const DEFAULT_FORM_CONFIG = {
  apiDefaults: {
    method: "GET",
    authType: "bearer",
    status: "active",
    timeout: 30000,
    requiresAuth: true,
    rateLimits: {
      sandbox: 100,
      production: 1000
    },
    sandbox: {
      enabled: true,
      testData: [],
      mockResponse: {}
    }
  },
  categoryDefaults: {
    color: "#603078",
    isActive: true
  },
  fieldOptions: {
    httpMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    authTypes: ["bearer", "apiKey", "oauth2", "basic"],
    statusOptions: ["active", "deprecated", "beta"],
    parameterTypes: ["string", "number", "boolean", "object", "array"]
  }
};

const DEFAULT_SYSTEM_CONFIG = {
  api: {
    defaultTimeout: 30000,
    maxRateLimit: 10000,
    defaultRateLimit: 100
  },
  validation: {
    maxNameLength: 100,
    maxDescriptionLength: 500,
    maxTagCount: 10
  }
};

const DEFAULT_API_EXPLORER_CONFIG = {
  environment: "all",
  testApiKeys: { default: "lEbnG39cJwC4lKUe5fliVA9HFcyR" },
  defaultApiKey: "lEbnG39cJwC4lKUe5fliVA9HFcyR",
  sampleRequestTemplates: {},
  endpointSettings: {},
  uiSettings: { showTestData: true, autoLoadApiKey: true },
  isActive: true
};

const DEFAULT_CATEGORY_STYLE_CONFIG = [
  {
    categoryName: "Authentication",
    iconName: "Shield",
    iconColor: "#603078",
    backgroundColor: "bg-gray-100",
    textColor: "text-gray-700",
    hoverBackgroundColor: "bg-gray-50",
    selectedBackgroundColor: "bg-blue-100",
    selectedTextColor: "text-blue-700",
    selectedBorderColor: "border-blue-200",
    displayOrder: 1,
    environment: "all",
    isActive: true
  },
  {
    categoryName: "Customer",
    iconName: "Users",
    iconColor: "#603078",
    backgroundColor: "bg-gray-100",
    textColor: "text-gray-700",
    hoverBackgroundColor: "bg-gray-50",
    selectedBackgroundColor: "bg-blue-100",
    selectedTextColor: "text-blue-700",
    selectedBorderColor: "border-blue-200",
    displayOrder: 2,
    environment: "all",
    isActive: true
  },
  {
    categoryName: "Payments",
    iconName: "CreditCard",
    iconColor: "#603078",
    backgroundColor: "bg-gray-100",
    textColor: "text-gray-700",
    hoverBackgroundColor: "bg-gray-50",
    selectedBackgroundColor: "bg-blue-100",
    selectedTextColor: "text-blue-700",
    selectedBorderColor: "border-blue-200",
    displayOrder: 3,
    environment: "all",
    isActive: true
  },
  {
    categoryName: "Cards",
    iconName: "CreditCard",
    iconColor: "#603078",
    backgroundColor: "bg-gray-100",
    textColor: "text-gray-700",
    hoverBackgroundColor: "bg-gray-50",
    selectedBackgroundColor: "bg-blue-100",
    selectedTextColor: "text-blue-700",
    selectedBorderColor: "border-blue-200",
    displayOrder: 4,
    environment: "all",
    isActive: true
  },
  {
    categoryName: "Loans",
    iconName: "DollarSign",
    iconColor: "#603078",
    backgroundColor: "bg-gray-100",
    textColor: "text-gray-700",
    hoverBackgroundColor: "bg-gray-50",
    selectedBackgroundColor: "bg-blue-100",
    selectedTextColor: "text-blue-700",
    selectedBorderColor: "border-blue-200",
    displayOrder: 5,
    environment: "all",
    isActive: true
  },
  {
    categoryName: "Trade Services",
    iconName: "Globe",
    iconColor: "#603078",
    backgroundColor: "bg-gray-100",
    textColor: "text-gray-700",
    hoverBackgroundColor: "bg-gray-50",
    selectedBackgroundColor: "bg-blue-100",
    selectedTextColor: "text-blue-700",
    selectedBorderColor: "border-blue-200",
    displayOrder: 6,
    environment: "all",
    isActive: true
  }
];

// Hook to fetch UI configuration
export const useUiConfiguration = (environment: string = 'all') => {
  return useQuery({
    queryKey: ['/api/config/ui', { environment }],
    queryFn: async () => {
      const response = await fetch(`/api/config/ui?environment=${environment}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch UI configuration');
      }
      
      const data = await response.json();
      return data.data as UiConfiguration;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    // Return default config on error
    select: (data) => data || DEFAULT_UI_CONFIG
  });
};

// Hook to fetch form configuration
export const useFormConfiguration = (formType?: string, environment: string = 'all') => {
  return useQuery({
    queryKey: ['/api/config/forms', { formType, environment }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (formType) params.append('formType', formType);
      if (environment) params.append('environment', environment);
      
      const response = await fetch(`/api/config/forms?${params.toString()}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch form configuration');
      }
      
      const data = await response.json();
      return data.data as FormConfiguration[];
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    // Return default config on error
    select: (data) => {
      if (!data || data.length === 0) {
        return DEFAULT_FORM_CONFIG;
      }
      
      // Process and merge configurations
      const processedConfig = { ...DEFAULT_FORM_CONFIG };
      
      data.forEach((config) => {
        if (config.formType === 'api-admin' && config.fieldDefaults) {
          processedConfig.apiDefaults = {
            ...processedConfig.apiDefaults,
            ...config.fieldDefaults
          };
        }
        
        if (config.formType === 'category-admin' && config.fieldDefaults) {
          processedConfig.categoryDefaults = {
            ...processedConfig.categoryDefaults,
            ...config.fieldDefaults
          };
        }
      });
      
      return processedConfig;
    }
  });
};

// Hook to fetch system configuration
export const useSystemConfiguration = (module?: string, environment: string = 'all') => {
  return useQuery({
    queryKey: ['/api/config/system', { module, environment }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (module) params.append('module', module);
      if (environment) params.append('environment', environment);
      
      const response = await fetch(`/api/config/system?${params.toString()}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch system configuration');
      }
      
      const data = await response.json();
      return data.data as SystemConfiguration[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes for system config
    retry: 1,
    select: (data) => {
      if (!data || data.length === 0) {
        return DEFAULT_SYSTEM_CONFIG;
      }
      
      // Process system configurations
      const processedConfig = { ...DEFAULT_SYSTEM_CONFIG };
      
      data.forEach((config) => {
        if (config.module === 'api') {
          if (config.setting === 'default_timeout') {
            processedConfig.api.defaultTimeout = Number(config.value) || DEFAULT_SYSTEM_CONFIG.api.defaultTimeout;
          }
          if (config.setting === 'max_rate_limit') {
            processedConfig.api.maxRateLimit = Number(config.value) || DEFAULT_SYSTEM_CONFIG.api.maxRateLimit;
          }
          if (config.setting === 'default_rate_limit') {
            processedConfig.api.defaultRateLimit = Number(config.value) || DEFAULT_SYSTEM_CONFIG.api.defaultRateLimit;
          }
        }
        
        if (config.module === 'validation') {
          if (config.setting === 'max_name_length') {
            processedConfig.validation.maxNameLength = Number(config.value) || DEFAULT_SYSTEM_CONFIG.validation.maxNameLength;
          }
          if (config.setting === 'max_description_length') {
            processedConfig.validation.maxDescriptionLength = Number(config.value) || DEFAULT_SYSTEM_CONFIG.validation.maxDescriptionLength;
          }
          if (config.setting === 'max_tag_count') {
            processedConfig.validation.maxTagCount = Number(config.value) || DEFAULT_SYSTEM_CONFIG.validation.maxTagCount;
          }
        }
      });
      
      return processedConfig;
    }
  });
};

// Hook to fetch validation configuration (admin only)
export const useValidationConfiguration = (entityType?: string, environment: string = 'all') => {
  return useQuery({
    queryKey: ['/api/config/validation', { entityType, environment }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (entityType) params.append('entityType', entityType);
      if (environment) params.append('environment', environment);
      
      const response = await fetch(`/api/config/validation?${params.toString()}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch validation configuration');
      }
      
      const data = await response.json();
      return data.data as ValidationConfiguration[];
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    select: (data) => data || []
  });
};

// Hook to fetch public validation rules for frontend forms
export const useValidationRules = (entityType?: string, environment: string = 'all') => {
  return useQuery({
    queryKey: ['/api/validation-rules', { entityType, environment }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (entityType) params.append('entityType', entityType);
      if (environment) params.append('environment', environment);
      
      const response = await fetch(`/api/validation-rules?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch validation rules');
      }
      
      const data = await response.json();
      return data.data as Record<string, Record<string, any>>;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    select: (data) => data || {}
  });
};

// Combined hook for admin forms
export const useAdminFormConfigurations = (environment: string = 'all') => {
  const uiConfig = useUiConfiguration(environment);
  const formConfig = useFormConfiguration('admin', environment);
  const systemConfig = useSystemConfiguration('api', environment);
  const validationConfig = useValidationConfiguration('api', environment);
  
  return {
    ui: uiConfig,
    form: formConfig,
    system: systemConfig,
    validation: validationConfig,
    isLoading: uiConfig.isLoading || formConfig.isLoading || systemConfig.isLoading || validationConfig.isLoading,
    isError: uiConfig.isError || formConfig.isError || systemConfig.isError || validationConfig.isError,
    // Merged configuration for easy access
    merged: {
      ui: uiConfig.data || DEFAULT_UI_CONFIG,
      form: formConfig.data || DEFAULT_FORM_CONFIG,
      system: systemConfig.data || DEFAULT_SYSTEM_CONFIG,
      validation: validationConfig.data || []
    }
  };
};

// Hook to fetch API Explorer configuration
export const useApiExplorerConfiguration = (environment: string = 'all') => {
  return useQuery({
    queryKey: ['/api/config/api-explorer', { environment }],
    queryFn: async () => {
      const response = await fetch(`/api/config/api-explorer?environment=${environment}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch API Explorer configuration');
      }
      
      const data = await response.json();
      return data.data as ApiExplorerConfiguration;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    // Return default config on error
    select: (data) => data || DEFAULT_API_EXPLORER_CONFIG
  });
};

// Hook to fetch Category Style configurations
export const useCategoryStyleConfiguration = (environment: string = 'all') => {
  return useQuery({
    queryKey: ['/api/config/category-styling', { environment }],
    queryFn: async () => {
      const response = await fetch(`/api/config/category-styling?environment=${environment}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch Category Style configurations');
      }
      
      const data = await response.json();
      return data.data as CategoryStyleConfiguration[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    // Return default config on error
    select: (data) => data && data.length > 0 ? data : DEFAULT_CATEGORY_STYLE_CONFIG
  });
};

// Helper hook to get category styling for API Explorer
export const useApiExplorerStyling = (environment: string = 'all') => {
  const { data: categoryStyles = [], isLoading, isError } = useCategoryStyleConfiguration(environment);
  
  // Convert array to icon and color mappings for easy use in components
  const categoryIcons = categoryStyles.reduce((acc, style) => {
    acc[style.categoryName.toLowerCase()] = style.iconName;
    return acc;
  }, {} as Record<string, string>);
  
  const categoryColors = categoryStyles.reduce((acc, style) => {
    acc[style.categoryName.toLowerCase()] = {
      background: style.backgroundColor,
      text: style.textColor,
      hover: style.hoverBackgroundColor,
      selected: style.selectedBackgroundColor,
      selectedText: style.selectedTextColor,
      selectedBorder: style.selectedBorderColor,
      iconColor: style.iconColor
    };
    return acc;
  }, {} as Record<string, any>);
  
  return {
    categoryIcons,
    categoryColors,
    categoryStyles,
    isLoading,
    isError
  };
};

// Combined hook for API Explorer - includes both configuration and styling
export const useApiExplorerConfig = (environment: string = 'all') => {
  const explorerConfig = useApiExplorerConfiguration(environment);
  const stylingConfig = useApiExplorerStyling(environment);
  
  return {
    config: explorerConfig,
    styling: stylingConfig,
    isLoading: explorerConfig.isLoading || stylingConfig.isLoading,
    isError: explorerConfig.isError || stylingConfig.isError,
    // Easy access to common values
    apiKey: explorerConfig.data?.defaultApiKey || DEFAULT_API_EXPLORER_CONFIG.defaultApiKey,
    testApiKeys: explorerConfig.data?.testApiKeys || DEFAULT_API_EXPLORER_CONFIG.testApiKeys,
    categoryIcons: stylingConfig.categoryIcons,
    categoryColors: stylingConfig.categoryColors
  };
};

// Export default configurations for direct use
export { 
  DEFAULT_UI_CONFIG, 
  DEFAULT_FORM_CONFIG, 
  DEFAULT_SYSTEM_CONFIG,
  DEFAULT_API_EXPLORER_CONFIG,
  DEFAULT_CATEGORY_STYLE_CONFIG
};