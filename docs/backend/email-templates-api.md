# Email Templates API Documentation

## Overview
This document describes the backend API endpoints required for the Email Templates customization page (`/setup/customize-emails`). The API manages email templates for various system notifications and master template settings.

## Base URL
```
/api/v1/email-templates
```

## Authentication
All endpoints require authentication via Bearer token:
```
Authorization: Bearer <token>
```

---

## Data Models

### EmailTemplateBody Model
```typescript
interface EmailTemplateBody {
  greeting: string;                    // Email greeting (e.g., "Dear «Name»,")
  intro: string;                       // Introduction paragraph
  intro2?: string;                     // Optional second introduction paragraph
  tableColumns: string[];              // Array of table column headers
  notes: string;                       // Notes section
  closing: string;                     // Closing paragraph
  disclaimer?: string;                 // Optional disclaimer text
}
```

### EmailTemplate Model
```typescript
interface EmailTemplate {
  id: string;                          // Template identifier (e.g., "check-out-email")
  name: string;                        // Template display name
  category: string;                    // Template category (e.g., "check-out-check-in")
  subject: string;                     // Email subject line
  showSignature: boolean;              // Whether to show signature in this template
  body: EmailTemplateBody;            // Email body structure
  updatedAt?: string;                  // ISO 8601 timestamp
  updatedBy?: number | string;         // User ID who last updated the template
}
```

### MasterTemplateSettings Model
```typescript
interface MasterTemplateSettings {
  replyToEnabled: boolean;             // Whether reply-to email is enabled
  replyToEmail: string;                // Reply-to email address
  logoOption: "assettiger-logo" | "company-logo" | "company-name";  // Logo display option
  signature: string;                   // Email signature (HTML or plain text)
  updatedAt?: string;                  // ISO 8601 timestamp
  updatedBy?: number | string;         // User ID who last updated the settings
}
```

### Error Response
```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

---

## API Endpoints

### 1. Get All Email Templates

**Endpoint:** `GET /api/v1/email-templates`

**Description:** Retrieve all email templates with their current configurations.

**Request Example:**
```http
GET /api/v1/email-templates
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": [
    {
      "id": "check-out-email",
      "name": "Check Out Email",
      "category": "check-out-check-in",
      "subject": "Asset Checkout",
      "showSignature": true,
      "body": {
        "greeting": "Dear «Name»,",
        "intro": "This is a confirmation email. The following items are in your possession:",
        "tableColumns": ["Asset Tag ID", "Description"],
        "notes": "Notes: «Check-out Notes»",
        "closing": "Thank you.",
        "disclaimer": "This e-mail address does not accept incoming mail."
      },
      "updatedAt": "2024-01-15T10:30:00Z",
      "updatedBy": 1
    },
    {
      "id": "check-in-email",
      "name": "Check In Email",
      "category": "check-out-check-in",
      "subject": "Check-in Complete",
      "showSignature": true,
      "body": {
        "greeting": "Dear «Name»,",
        "intro": "This is to confirm that the following items checked out to you have been returned:",
        "tableColumns": ["Asset Tag ID", "Description", "Check-out Date", "Due date"],
        "notes": "Notes: «Check-in Notes»",
        "closing": "Thank you.",
        "disclaimer": "This e-mail address does not accept incoming mail."
      },
      "updatedAt": "2024-01-15T10:30:00Z",
      "updatedBy": 1
    }
  ]
}
```

---

### 2. Get Specific Email Template

**Endpoint:** `GET /api/v1/email-templates/:templateId`

**Description:** Retrieve a specific email template by ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `templateId` | string | Yes | Template ID (e.g., "check-out-email") |

**Request Example:**
```http
GET /api/v1/email-templates/check-out-email
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": "check-out-email",
    "name": "Check Out Email",
    "category": "check-out-check-in",
    "subject": "Asset Checkout",
    "showSignature": true,
    "body": {
      "greeting": "Dear «Name»,",
      "intro": "This is a confirmation email. The following items are in your possession:",
      "tableColumns": ["Asset Tag ID", "Description"],
      "notes": "Notes: «Check-out Notes»",
      "closing": "Thank you.",
      "disclaimer": "This e-mail address does not accept incoming mail."
    },
    "updatedAt": "2024-01-15T10:30:00Z",
    "updatedBy": 1
  }
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Email template not found"
  }
}
```

---

### 3. Update Email Template

**Endpoint:** `PUT /api/v1/email-templates/:templateId`

**Description:** Update an email template's subject, signature visibility, or body components.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `templateId` | string | Yes | Template ID |

**Request Body:**
```json
{
  "subject": "Asset Checkout",              // Optional
  "showSignature": true,                     // Optional
  "body": {                                 // Optional, partial update supported
    "greeting": "Dear «Name»,",
    "intro": "Updated introduction text",
    "intro2": "Optional second intro",
    "tableColumns": ["Asset Tag ID", "Description", "Status"],
    "notes": "Notes: «Check-out Notes»",
    "closing": "Thank you.",
    "disclaimer": "This e-mail address does not accept incoming mail."
  }
}
```

**Request Example:**
```http
PUT /api/v1/email-templates/check-out-email
Authorization: Bearer <token>
Content-Type: application/json

{
  "subject": "Asset Checkout Confirmation",
  "showSignature": true,
  "body": {
    "greeting": "Dear «Name»,",
    "intro": "This is a confirmation email. The following items are in your possession:",
    "tableColumns": ["Asset Tag ID", "Description", "Serial Number"],
    "notes": "Notes: «Check-out Notes»",
    "closing": "Thank you for your attention.",
    "disclaimer": "This e-mail address does not accept incoming mail."
  }
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": "check-out-email",
    "name": "Check Out Email",
    "category": "check-out-check-in",
    "subject": "Asset Checkout Confirmation",
    "showSignature": true,
    "body": {
      "greeting": "Dear «Name»,",
      "intro": "This is a confirmation email. The following items are in your possession:",
      "tableColumns": ["Asset Tag ID", "Description", "Serial Number"],
      "notes": "Notes: «Check-out Notes»",
      "closing": "Thank you for your attention.",
      "disclaimer": "This e-mail address does not accept incoming mail."
    },
    "updatedAt": "2024-01-20T11:00:00Z",
    "updatedBy": 1
  }
}
```

**Error Responses:**
```json
// 400 Bad Request - Validation Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "subject": "Subject is required and must be less than 255 characters",
      "body.greeting": "Greeting is required",
      "body.tableColumns": "Table columns must be an array with at least one column"
    }
  }
}
```

---

### 4. Get Master Template Settings

**Endpoint:** `GET /api/v1/email-templates/master-settings`

**Description:** Retrieve master template settings (reply-to email, logo option, signature).

**Request Example:**
```http
GET /api/v1/email-templates/master-settings
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": {
    "replyToEnabled": false,
    "replyToEmail": "",
    "logoOption": "company-logo",
    "signature": "Best regards,\nJohn Doe\nAsset Manager",
    "updatedAt": "2024-01-15T10:30:00Z",
    "updatedBy": 1
  }
}
```

**Error Responses:**
```json
// 404 Not Found (if settings haven't been set yet)
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Master template settings not found"
  }
}
```

**Note:** If master template settings don't exist, the backend should return default values:
- `replyToEnabled`: `false`
- `replyToEmail`: `""`
- `logoOption`: `"company-logo"`
- `signature`: `""`

---

### 5. Update Master Template Settings

**Endpoint:** `PUT /api/v1/email-templates/master-settings`

**Description:** Update master template settings including reply-to email, logo option, and signature.

**Request Body:**
```json
{
  "replyToEnabled": true,                    // Optional, boolean
  "replyToEmail": "noreply@example.com",     // Optional, string (required if replyToEnabled is true)
  "logoOption": "company-logo",              // Optional, one of: "assettiger-logo", "company-logo", "company-name"
  "signature": "Best regards,\nJohn Doe"     // Optional, string (HTML or plain text)
}
```

**Request Example:**
```http
PUT /api/v1/email-templates/master-settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "replyToEnabled": true,
  "replyToEmail": "support@example.com",
  "logoOption": "company-logo",
  "signature": "Best regards,\nJohn Doe\nAsset Manager\nCompany Name"
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "replyToEnabled": true,
    "replyToEmail": "support@example.com",
    "logoOption": "company-logo",
    "signature": "Best regards,\nJohn Doe\nAsset Manager\nCompany Name",
    "updatedAt": "2024-01-20T11:00:00Z",
    "updatedBy": 1
  }
}
```

**Error Responses:**
```json
// 400 Bad Request - Validation Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "replyToEmail": "Reply-to email is required when replyToEnabled is true",
      "replyToEmail": "Invalid email format",
      "logoOption": "Logo option must be one of: assettiger-logo, company-logo, company-name"
    }
  }
}
```

---

### 6. Reset Email Template to Default

**Endpoint:** `POST /api/v1/email-templates/:templateId/reset`

**Description:** Reset an email template to its default configuration.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `templateId` | string | Yes | Template ID |

**Request Example:**
```http
POST /api/v1/email-templates/check-out-email/reset
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": "check-out-email",
    "name": "Check Out Email",
    "category": "check-out-check-in",
    "subject": "Asset Checkout",
    "showSignature": true,
    "body": {
      "greeting": "Dear «Name»,",
      "intro": "This is a confirmation email. The following items are in your possession:",
      "tableColumns": ["Asset Tag ID", "Description"],
      "notes": "Notes: «Check-out Notes»",
      "closing": "Thank you.",
      "disclaimer": "This e-mail address does not accept incoming mail."
    },
    "updatedAt": "2024-01-20T11:00:00Z",
    "updatedBy": 1
  }
}
```

---

## Validation Rules

### Email Template Subject
- Required when updating template
- Maximum 255 characters
- Cannot be empty

### Email Template Body
- `greeting`: Required, maximum 500 characters
- `intro`: Required, maximum 2000 characters
- `intro2`: Optional, maximum 2000 characters
- `tableColumns`: Required, array with at least 1 column, maximum 10 columns
- `notes`: Required (can be empty string), maximum 1000 characters
- `closing`: Required, maximum 500 characters
- `disclaimer`: Optional, maximum 500 characters

### Master Template Settings
- `replyToEmail`: Required if `replyToEnabled` is `true`, must be valid email format
- `logoOption`: Must be one of: `"assettiger-logo"`, `"company-logo"`, `"company-name"`
- `signature`: Optional, maximum 5000 characters (supports HTML)

---

## Template IDs

The following template IDs are available:

### Check Out/Check In Emails
- `check-out-email` - Check Out Email
- `check-in-email` - Check In Email
- `upcoming-asset-due-email` - Upcoming Asset Due Email
- `asset-past-due-email` - Asset Past Due Email
- `reserve-to-person-email` - Reserve To Person Email

### Lease/Lease Return Emails
- `lease-email` - Lease Email
- `lease-return-email` - Lease Return Email
- `lease-return-due-email` - Lease Return Due Email
- `lease-return-past-due-email` - Lease Return Past Due Email
- `reserve-to-customer-email` - Reserve To Customer Email

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Authentication required or invalid token |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## Usage Examples

### Example 1: Get and update email template

```javascript
// 1. Get all templates
const templates = await getEmailTemplates();
console.log(templates.data);

// 2. Get specific template
const template = await getEmailTemplate("check-out-email");
console.log(template.data);

// 3. Update template
await updateEmailTemplate("check-out-email", {
  subject: "Asset Checkout Confirmation",
  showSignature: true,
  body: {
    greeting: "Dear «Name»,",
    intro: "Updated introduction",
    tableColumns: ["Asset Tag ID", "Description"],
    notes: "Notes: «Check-out Notes»",
    closing: "Thank you."
  }
});
```

### Example 2: Get and update master template settings

```javascript
// 1. Get master settings
const settings = await getMasterTemplateSettings();
console.log(settings.data);

// 2. Update master settings
await updateMasterTemplateSettings({
  replyToEnabled: true,
  replyToEmail: "support@example.com",
  logoOption: "company-logo",
  signature: "Best regards,\nJohn Doe"
});
```

### Example 3: Reset template to default

```javascript
await resetEmailTemplate("check-out-email");
```

---

## Notes

1. **Template Variables:**
   - Templates support variables like `«Name»`, `«Check-out Notes»`, `«Due Date»`
   - These variables are replaced with actual values when emails are sent
   - Variables are case-sensitive and must match exactly

2. **Partial Updates:**
   - The API supports partial updates for email templates
   - Only provided fields in the `body` object will be updated
   - Other body fields will remain unchanged

3. **Master Template Settings:**
   - Master template settings apply to all email templates
   - Logo option determines which logo appears in all emails
   - Signature is appended to emails where `showSignature` is `true`

4. **Default Templates:**
   - Each template has default values defined in the system
   - Resetting a template restores these defaults
   - Defaults should be stored in the backend configuration

5. **HTML Support:**
   - Signature field supports HTML formatting
   - Email body components are plain text (variables are replaced)
   - HTML can be added to signature for rich formatting

6. **Table Columns:**
   - Table columns define the structure of data tables in emails
   - Column order matters and should be preserved
   - Maximum 10 columns per template

7. **User-Specific vs System-wide:**
   - Email templates can be either user-specific or system-wide
   - If user-specific, each user can customize their own templates
   - If system-wide, changes affect all users
   - Implementation should be consistent with system architecture

