// Migration script to move hardcoded documentation data to database
import { storage } from "../server/storage";

// Hardcoded documentation data from api-docs.tsx
const hardcodedDocumentationCategories = [
  {
    id: "introduction",
    name: "introduction", 
    title: "Introduction",
    icon: "BookOpen",
    description: "Getting started with AU Bank APIs",
    endpoints: [],
    displayOrder: 0
  },
  {
    id: "security",
    name: "security",
    title: "Security", 
    icon: "Shield",
    description: "Authentication and security protocols",
    displayOrder: 1,
    endpoints: [
      {
        id: "encryption",
        method: "POST",
        path: "/security/encrypt",
        title: "Encryption",
        description: "Encrypt sensitive data using AES-256 encryption",
        parameters: [
          { name: "data", type: "string", required: true, description: "Data to encrypt", example: "sensitive_information", displayOrder: 0 },
          { name: "algorithm", type: "string", required: false, description: "Encryption algorithm", example: "AES-256", displayOrder: 1 }
        ],
        responses: [
          { 
            status: 200, 
            description: "Successfully encrypted data",
            example: { encrypted_data: "3f4h5g6j7k8l9m0n", encryption_key: "abc123def456" },
            displayOrder: 0
          }
        ],
        examples: [{
          title: "Basic Encryption",
          request: { data: "sensitive_data", algorithm: "AES-256" },
          response: { encrypted_data: "3f4h5g6j7k8l9m0n", encryption_key: "abc123def456" },
          curlCommand: `curl -X POST "https://api.aubank.in/security/encrypt" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"data": "sensitive_data", "algorithm": "AES-256"}'`,
          displayOrder: 0
        }],
        security: [{ type: "API Key", description: "API Key required in header", displayOrder: 0 }],
        displayOrder: 0
      },
      {
        id: "test-api", 
        method: "GET",
        path: "/security/test",
        title: "Test API",
        description: "Test API connectivity and authentication",
        parameters: [],
        responses: [
          { 
            status: 200, 
            description: "API connection successful",
            example: { status: "success", message: "API is working", timestamp: "2024-12-01T10:30:00Z" },
            displayOrder: 0
          }
        ],
        examples: [{
          title: "Test Connection", 
          response: { status: "success", message: "API is working", timestamp: "2024-12-01T10:30:00Z" },
          curlCommand: `curl -X GET "https://api.aubank.in/security/test" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
          displayOrder: 0
        }],
        security: [{ type: "API Key", description: "API Key required in header", displayOrder: 0 }],
        displayOrder: 1
      },
      {
        id: "decryption",
        method: "POST", 
        path: "/security/decrypt",
        title: "Decryption",
        description: "Decrypt encrypted data using provided encryption key",
        parameters: [
          { name: "encrypted_data", type: "string", required: true, description: "Encrypted data to decrypt", example: "3f4h5g6j7k8l9m0n", displayOrder: 0 },
          { name: "encryption_key", type: "string", required: true, description: "Encryption key", example: "abc123def456", displayOrder: 1 }
        ],
        responses: [
          { 
            status: 200, 
            description: "Successfully decrypted data",
            example: { decrypted_data: "sensitive_information" },
            displayOrder: 0
          }
        ],
        examples: [{
          title: "Basic Decryption",
          request: { encrypted_data: "3f4h5g6j7k8l9m0n", encryption_key: "abc123def456" },
          response: { decrypted_data: "sensitive_information" },
          curlCommand: `curl -X POST "https://api.aubank.in/security/decrypt" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"encrypted_data": "3f4h5g6j7k8l9m0n", "encryption_key": "abc123def456"}'`,
          displayOrder: 0
        }],
        security: [{ type: "API Key", description: "API Key required in header", displayOrder: 0 }],
        displayOrder: 2
      }
    ]
  },
  {
    id: "customer",
    name: "customer",
    title: "Customer",
    icon: "Users", 
    description: "Customer management and authentication APIs",
    displayOrder: 2,
    subcategories: [
      {
        id: "customer-auth",
        name: "customer-auth",
        title: "Customer Authentication",
        endpoints: [
          {
            id: "otp-generation",
            method: "POST",
            path: "/auth/otp/generate", 
            title: "OTP Generation",
            description: "Generate One-Time Password for customer authentication",
            parameters: [
              { name: "mobile_number", type: "string", required: true, description: "Customer mobile number", example: "+919876543210", displayOrder: 0 },
              { name: "purpose", type: "string", required: true, description: "Purpose of OTP", example: "authentication", displayOrder: 1 }
            ],
            responses: [
              { 
                status: 200, 
                description: "OTP generated successfully",
                example: { otp_id: "otp_123456", expires_in: 300, message: "OTP sent successfully" },
                displayOrder: 0
              }
            ],
            examples: [{
              title: "Generate OTP",
              request: { mobile_number: "+919876543210", purpose: "authentication" },
              response: { otp_id: "otp_123456", expires_in: 300, message: "OTP sent successfully" },
              curlCommand: `curl -X POST "https://api.aubank.in/auth/otp/generate" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"mobile_number": "+919876543210", "purpose": "authentication"}'`,
              displayOrder: 0
            }],
            security: [{ type: "API Key", description: "API Key required in header", displayOrder: 0 }],
            displayOrder: 0
          },
          {
            id: "otp-verification",
            method: "POST", 
            path: "/auth/otp/verify",
            title: "OTP Verification",
            description: "Verify One-Time Password for customer authentication",
            parameters: [
              { name: "otp_id", type: "string", required: true, description: "OTP identifier", example: "otp_123456", displayOrder: 0 },
              { name: "otp_code", type: "string", required: true, description: "OTP code", example: "123456", displayOrder: 1 }
            ],
            responses: [
              { 
                status: 200, 
                description: "OTP verified successfully",
                example: { verified: true, customer_token: "token_789", expires_in: 3600 },
                displayOrder: 0
              }
            ],
            examples: [{
              title: "Verify OTP",
              request: { otp_id: "otp_123456", otp_code: "123456" },
              response: { verified: true, customer_token: "token_789", expires_in: 3600 },
              curlCommand: `curl -X POST "https://api.aubank.in/auth/otp/verify" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"otp_id": "otp_123456", "otp_code": "123456"}'`,
              displayOrder: 0
            }],
            security: [{ type: "API Key", description: "API Key required in header", displayOrder: 0 }],
            displayOrder: 1
          }
        ]
      }
    ]
  }
];

export async function migrateDocumentationData() {
  console.log("🚀 Starting documentation data migration...");
  
  try {
    // First, create categories and subcategories
    const categoryMap = new Map<string, string>(); // old_id -> new_id
    const subcategoryMap = new Map<string, string>(); // old_id -> new_id

    for (const category of hardcodedDocumentationCategories) {
      console.log(`📁 Creating category: ${category.title}`);
      
      const createdCategory = await storage.createDocumentationCategory({
        name: category.name,
        title: category.title,
        description: category.description,
        icon: category.icon,
        displayOrder: category.displayOrder,
        isActive: true
      });
      
      categoryMap.set(category.id, createdCategory.id);
      console.log(`✅ Created category: ${category.title} (${createdCategory.id})`);
      
      // Create subcategories if they exist
      if (category.subcategories) {
        for (const subcategory of category.subcategories) {
          console.log(`📂 Creating subcategory: ${subcategory.title}`);
          
          const createdSubcategory = await storage.createDocumentationCategory({
            name: subcategory.name,
            title: subcategory.title,
            description: `${subcategory.title} endpoints`,
            icon: category.icon, // Use parent icon
            parentId: createdCategory.id,
            displayOrder: 0,
            isActive: true
          });
          
          subcategoryMap.set(subcategory.id, createdSubcategory.id);
          console.log(`✅ Created subcategory: ${subcategory.title} (${createdSubcategory.id})`);
        }
      }
    }

    // Now create endpoints with their related data
    for (const category of hardcodedDocumentationCategories) {
      const categoryId = categoryMap.get(category.id);
      if (!categoryId) continue;

      // Process direct endpoints
      if (category.endpoints) {
        await processEndpoints(category.endpoints, categoryId, null);
      }

      // Process subcategory endpoints  
      if (category.subcategories) {
        for (const subcategory of category.subcategories) {
          const subcategoryId = subcategoryMap.get(subcategory.id);
          if (subcategoryId && subcategory.endpoints) {
            await processEndpoints(subcategory.endpoints, categoryId, subcategoryId);
          }
        }
      }
    }

    console.log("✅ Documentation migration completed successfully!");
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

async function processEndpoints(endpoints: any[], categoryId: string, subcategoryId: string | null) {
  for (const endpoint of endpoints) {
    console.log(`🔗 Creating endpoint: ${endpoint.title}`);
    
    const createdEndpoint = await storage.createDocumentationEndpoint({
      categoryId,
      subcategoryId,
      name: endpoint.id,
      title: endpoint.title,
      method: endpoint.method,
      path: endpoint.path,
      description: endpoint.description,
      displayOrder: endpoint.displayOrder || 0,
      isActive: true
    });
    
    console.log(`✅ Created endpoint: ${endpoint.title} (${createdEndpoint.id})`);

    // Create parameters
    if (endpoint.parameters) {
      for (const param of endpoint.parameters) {
        await storage.createDocumentationParameter({
          endpointId: createdEndpoint.id,
          name: param.name,
          type: param.type,
          required: param.required,
          description: param.description,
          example: param.example,
          displayOrder: param.displayOrder || 0
        });
      }
      console.log(`📝 Created ${endpoint.parameters.length} parameters for ${endpoint.title}`);
    }

    // Create responses
    if (endpoint.responses) {
      for (const response of endpoint.responses) {
        await storage.createDocumentationResponse({
          endpointId: createdEndpoint.id,
          status: response.status,
          description: response.description,
          example: response.example,
          displayOrder: response.displayOrder || 0
        });
      }
      console.log(`📤 Created ${endpoint.responses.length} responses for ${endpoint.title}`);
    }

    // Create examples
    if (endpoint.examples) {
      for (const example of endpoint.examples) {
        await storage.createDocumentationExample({
          endpointId: createdEndpoint.id,
          title: example.title,
          request: example.request,
          response: example.response,
          curlCommand: example.curlCommand,
          displayOrder: example.displayOrder || 0
        });
      }
      console.log(`💡 Created ${endpoint.examples.length} examples for ${endpoint.title}`);
    }

    // Create security requirements
    if (endpoint.security) {
      for (const security of endpoint.security) {
        await storage.createDocumentationSecurity({
          endpointId: createdEndpoint.id,
          type: security.type,
          description: security.description,
          displayOrder: security.displayOrder || 0
        });
      }
      console.log(`🔐 Created ${endpoint.security.length} security requirements for ${endpoint.title}`);
    }
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateDocumentationData()
    .then(() => {
      console.log("✅ Migration completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Migration failed:", error);
      process.exit(1);
    });
}