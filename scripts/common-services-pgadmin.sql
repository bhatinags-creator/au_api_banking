-- =====================================================================
-- AU BANK DEVELOPER PORTAL - COMMON SERVICES PGADMIN-COMPATIBLE INSERT
-- =====================================================================
-- 
-- SIMPLIFIED VERSION FOR PGADMIN EXECUTION
-- This script uses simplified JSON structures compatible with pgAdmin
-- Creates Common Services category and all 10 APIs automatically
-- Safe to run multiple times (idempotent operations)
-- =====================================================================

BEGIN;

-- Create Common Services category (idempotent - safe to run multiple times)
INSERT INTO api_categories (
    id, 
    name, 
    description, 
    icon, 
    color, 
    display_order, 
    is_active,
    created_at,
    updated_at
) VALUES (
    '8a2b3c4d-5e6f-7890-ab12-cd34ef567890',
    'Common Services',
    'Cross-cutting integration utilities including communications, mandates, OTP services, policy management, and WhatsApp messaging',
    'PlugZap',
    '#0E7490',
    10,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Verify Common Services category now exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM api_categories WHERE id = '8a2b3c4d-5e6f-7890-ab12-cd34ef567890') THEN
        RAISE EXCEPTION 'Failed to create Common Services category. Please check database permissions and constraints.';
    END IF;
END $$;

-- Insert Common Services APIs with simplified JSON
INSERT INTO api_endpoints (
    id, category_id, category, name, path, method, description, summary, 
    parameters, headers, responses, request_example, response_example, 
    documentation, tags, response_schema, rate_limits, timeout, 
    requires_auth, auth_type, is_active, is_internal, 
    status, version, created_at, updated_at
) VALUES

-- 1. SMS Communication Service
(
    'common-communications-sms-send-001',
    '8a2b3c4d-5e6f-7890-ab12-cd34ef567890',
    'Common Services',
    'SMS Communication Service',
    '/CommunicationRestService/sendSMS',
    'POST',
    'Send SMS communications to customers for debit, credit, and spend alerts with whitelisted templates and OTP/Non-OTP message types.',
    'Send SMS notifications to customers',
    '[{"name": "RequestId", "type": "string", "required": true, "description": "Unique Reference number", "example": "12343566"}]',
    '[{"name": "Content-Type", "value": "application/json", "required": true}]',
    '[{"status": 200, "description": "Success - SMS sent successfully"}]',
    '{"RequestId": "12343566", "Channel": "DEC", "GroupID": "AUBANK"}',
    '{"TransactionStatus": {"ResponseCode": "0", "ResponseMessage": "Success"}}',
    'SMS communication service for customer notifications and alerts',
    '["Common", "Communications", "SMS"]',
    '{"type": "object"}',
    '{"sandbox": 100, "production": 1000}',
    30000,
    true,
    'bearer',
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 2. Email Communication Service
(
    'common-communications-email-send-002',
    '8a2b3c4d-5e6f-7890-ab12-cd34ef567890',
    'Common Services',
    'Email Communication Service',
    '/CommunicationRestService/mail',
    'POST',
    'Send email communications to customers with support for TO, CC, BCC recipients and customizable subject and body content.',
    'Send email notifications to customers',
    '[{"name": "RequestId", "type": "string", "required": true, "description": "Unique Reference number", "example": "123456"}]',
    '[{"name": "Content-Type", "value": "application/json", "required": true}]',
    '[{"status": 200, "description": "Success - Email sent successfully"}]',
    '{"RequestId": "123456", "Channel": "DEC", "TO": "customer@example.com"}',
    '{"TransactionStatus": {"ResponseCode": "0", "ResponseMessage": "Success"}}',
    'Email communication service for customer notifications and alerts',
    '["Common", "Communications", "Email"]',
    '{"type": "object"}',
    '{"sandbox": 100, "production": 1000}',
    30000,
    true,
    'bearer',
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 3. Generate OTP
(
    'common-otp-generate-005',
    '8a2b3c4d-5e6f-7890-ab12-cd34ef567890',
    'Common Services',
    'Generate OTP',
    '/OTPEngineRestService/generateOTP',
    'POST',
    'Generate one-time password (OTP) for customer verification with configurable length, timeout, and delivery via SMS and email.',
    'Generate OTP for customer verification',
    '[{"name": "requestId", "type": "string", "required": true, "description": "Unique Reference number", "example": "4543656546"}]',
    '[{"name": "Content-Type", "value": "application/json", "required": true}]',
    '[{"status": 200, "description": "Success - OTP generated successfully"}]',
    '{"requestId": "4543656546", "channel": "FABL", "otptype": "1"}',
    '{"StatusDesc": "The Otp is generated successfully", "StatusCode": 100}',
    'OTP generation service for secure customer verification',
    '["Common", "OTP", "Security", "Authentication"]',
    '{"type": "object"}',
    '{"sandbox": 20, "production": 200}',
    30000,
    true,
    'bearer',
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 4. Validate OTP
(
    'common-otp-validate-006',
    '8a2b3c4d-5e6f-7890-ab12-cd34ef567890',
    'Common Services',
    'Validate OTP',
    '/OTPEngineRestService/validateOTP',
    'POST',
    'Validate customer-provided OTP against previously generated OTP for secure transaction verification.',
    'Validate customer OTP',
    '[{"name": "requestId", "type": "string", "required": true, "description": "Unique Reference number", "example": "65465656"}]',
    '[{"name": "Content-Type", "value": "application/json", "required": true}]',
    '[{"status": 200, "description": "Success - OTP validated successfully"}]',
    '{"requestId": "65465656", "channel": "FABL", "mobile": "7989443652"}',
    '{"StatusDesc": "OTP Verified successfully", "StatusCode": 100}',
    'OTP validation service for secure customer verification',
    '["Common", "OTP", "Security", "Validation"]',
    '{"type": "object"}',
    '{"sandbox": 50, "production": 500}',
    15000,
    true,
    'bearer',
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 5. Resend OTP
(
    'common-otp-resend-007',
    '8a2b3c4d-5e6f-7890-ab12-cd34ef567890',
    'Common Services',
    'Resend OTP',
    '/OTPEngineRestService/resendOTP',
    'POST',
    'Resend OTP to customer when the original OTP was not received or has expired.',
    'Resend OTP to customer',
    '[{"name": "requestId", "type": "string", "required": true, "description": "Unique Reference number", "example": "SFDCPROD_123"}]',
    '[{"name": "Content-Type", "value": "application/json", "required": true}]',
    '[{"status": 200, "description": "Success - OTP resent successfully"}]',
    '{"requestId": "SFDCPROD_123", "channel": "SFDC", "mobile": "7498520699"}',
    '{"StatusDesc": "The Otp has been sent Successfully", "StatusCode": 100}',
    'OTP resend service for customer convenience',
    '["Common", "OTP", "Security", "Resend"]',
    '{"type": "object"}',
    '{"sandbox": 10, "production": 100}',
    30000,
    true,
    'bearer',
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 6. Emandate Registration (Without Confirmation)
(
    'common-emandate-register-without-confirmation-003',
    '8a2b3c4d-5e6f-7890-ab12-cd34ef567890',
    'Common Services',
    'Emandate User Registration (Without Confirmation)',
    '/EmandateUserRegistrationRestService/withoutUserConfirmation',
    'POST',
    'Register user mandate without user confirmation for automated mandate creation and processing.',
    'Register emandate without user confirmation',
    '[{"name": "requestId", "type": "string", "required": true, "description": "Unique Reference number", "example": "175741972981981910"}]',
    '[{"name": "Content-Type", "value": "application/json", "required": true}]',
    '[{"status": 200, "description": "Success - Mandate registered successfully"}]',
    '{"requestId": "175741972981981910", "channel": "Monedo"}',
    '{"TransactionStatus": {"ResponseCode": "0", "ResponseMessage": "Success"}}',
    'Emandate user registration service without user confirmation',
    '["Common", "Emandate", "Registration"]',
    '{"type": "object"}',
    '{"sandbox": 50, "production": 500}',
    45000,
    true,
    'bearer',
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 7. Emandate Registration (With Confirmation)
(
    'common-emandate-register-with-confirmation-004',
    '8a2b3c4d-5e6f-7890-ab12-cd34ef567890',
    'Common Services',
    'Emandate User Registration (With Confirmation)',
    '/EmandateUserRegistrationRestService/userconfirmation',
    'POST',
    'Register user mandate with user confirmation for secure mandate creation requiring customer approval.',
    'Register emandate with user confirmation',
    '[{"name": "requestId", "type": "string", "required": true, "description": "Unique Reference number", "example": "175741972981981911"}]',
    '[{"name": "Content-Type", "value": "application/json", "required": true}]',
    '[{"status": 200, "description": "Success - Mandate registered with confirmation"}]',
    '{"requestId": "175741972981981911", "channel": "Monedo"}',
    '{"TransactionStatus": {"ResponseCode": "0", "ResponseMessage": "Success"}}',
    'Emandate user registration service with user confirmation',
    '["Common", "Emandate", "Registration", "Confirmation"]',
    '{"type": "object"}',
    '{"sandbox": 50, "production": 500}',
    45000,
    true,
    'bearer',
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 8. Nvest Fetch Quote Premium
(
    'common-nvest-fetch-quote-premium-008',
    '8a2b3c4d-5e6f-7890-ab12-cd34ef567890',
    'Common Services',
    'Nvest Fetch Quote Premium',
    '/NvestCreatePolicyService/AUFetchQuotePremium',
    'POST',
    'Fetch insurance quote premium for policy creation with comprehensive customer and loan details.',
    'Fetch insurance quote premium',
    '[{"name": "RequestId", "type": "string", "required": true, "description": "Unique Reference number", "example": "11q1"}]',
    '[{"name": "Content-Type", "value": "application/json", "required": true}]',
    '[{"status": 200, "description": "Success - Quote premium fetched successfully"}]',
    '{"RequestId": "11q1", "Channel": "Protean"}',
    '{"TransactionStatus": {"ResponseCode": "0", "ResponseMessage": "Success"}}',
    'Nvest service for fetching insurance quote premiums',
    '["Common", "Nvest", "Insurance", "Quote"]',
    '{"type": "object"}',
    '{"sandbox": 50, "production": 500}',
    45000,
    true,
    'bearer',
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 9. Nvest Create Policy
(
    'common-nvest-create-policy-009',
    '8a2b3c4d-5e6f-7890-ab12-cd34ef567890',
    'Common Services',
    'Nvest Create Policy',
    '/NvestCreatePolicyService/createPolicy',
    'POST',
    'Create insurance policy with comprehensive customer details and policy configuration.',
    'Create insurance policy',
    '[{"name": "RequestId", "type": "string", "required": true, "description": "Unique Reference number", "example": "POL123456"}]',
    '[{"name": "Content-Type", "value": "application/json", "required": true}]',
    '[{"status": 200, "description": "Success - Policy created successfully"}]',
    '{"RequestId": "POL123456", "Channel": "Protean"}',
    '{"TransactionStatus": {"ResponseCode": "0", "ResponseMessage": "Success"}}',
    'Nvest service for creating insurance policies',
    '["Common", "Nvest", "Insurance", "Policy"]',
    '{"type": "object"}',
    '{"sandbox": 30, "production": 300}',
    60000,
    true,
    'bearer',
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
),

-- 10. WhatsApp Send Message
(
    'common-whatsapp-send-message-010',
    '8a2b3c4d-5e6f-7890-ab12-cd34ef567890',
    'Common Services',
    'WhatsApp Send Message',
    '/ValueFirstWhatsappIntegration/Message',
    'POST',
    'Send WhatsApp messages to customers with support for various message types including text, images, and templates.',
    'Send WhatsApp messages to customers',
    '[{"name": "SMS[0].TYPE", "type": "string", "required": true, "description": "Message type", "example": "image"}]',
    '[{"name": "Content-Type", "value": "application/json", "required": true}]',
    '[{"status": 200, "description": "Success - WhatsApp message sent successfully"}]',
    '{"SMS": [{"TYPE": "image", "TEMPLATENAME": "customer_template"}]}',
    '{"MESSAGEACK": {"GUID": [{"GUID": "message123", "ID": "1"}]}}',
    'WhatsApp integration service for customer messaging',
    '["Common", "WhatsApp", "Messaging", "Communication"]',
    '{"type": "object"}',
    '{"sandbox": 50, "production": 1000}',
    30000,
    true,
    'bearer',
    true,
    true,
    'active',
    'v1',
    NOW(),
    NOW()
);

COMMIT;

-- Success Message
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'COMMON SERVICES APIS INSERTION COMPLETE';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Total Common Services APIs inserted: 10';
    RAISE NOTICE 'SMS Communication Service';
    RAISE NOTICE 'Email Communication Service';
    RAISE NOTICE 'Generate OTP';
    RAISE NOTICE 'Validate OTP';
    RAISE NOTICE 'Resend OTP';
    RAISE NOTICE 'Emandate Registration (Without Confirmation)';
    RAISE NOTICE 'Emandate Registration (With Confirmation)';
    RAISE NOTICE 'Nvest Fetch Quote Premium';
    RAISE NOTICE 'Nvest Create Policy';
    RAISE NOTICE 'WhatsApp Send Message';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'All Common Services are now active and available';
    RAISE NOTICE 'in the AU Bank Developer Portal';
    RAISE NOTICE '========================================';
END $$;