# Company Information API Documentation

## Overview
This document describes the backend API endpoints required for the Company Information management page (`/setup/company-info`).

## Base URL
```
/api/v1/company-info
```

## Authentication
All endpoints require authentication via Bearer token:
```
Authorization: Bearer <token>
```

---

## Data Models

### CompanyInfo Model
```typescript
interface CompanyInfo {
  id?: number | string;              // Unique identifier (read-only)
  company: string;                    // Company name (required, min 2 chars, max 255 chars)
  organizationType: string;           // Organization type (required)
  country: string;                   // Country (required)
  address: string;                    // Street address (required, max 500 chars)
  aptSuite?: string;                 // Apartment/Suite (optional, max 100 chars)
  city: string;                       // City (required, max 100 chars)
  state: string;                      // State/Province (required, max 100 chars)
  postalCode: string;                 // Postal/ZIP code (required, max 20 chars)
  timezone: string;                   // Timezone (required)
  currency: string;                   // Currency (required)
  dateFormat: string;                 // Date format (required: "MM/dd/yyyy", "dd/MM/yyyy", "yyyy-MM-dd")
  financialYearMonth: string;         // Financial year start month (required)
  financialYearDay: string;           // Financial year start day (required, 1-31)
  logoUrl?: string;                   // Company logo URL (optional, read-only)
  createdAt?: string;                 // ISO 8601 timestamp (read-only)
  updatedAt?: string;                 // ISO 8601 timestamp (read-only)
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

### 1. Get Company Information

**Endpoint:** `GET /api/v1/company-info`

**Description:** Retrieve the current company information.

**Request Example:**
```http
GET /api/v1/company-info
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "company": "Exozen",
    "organizationType": "Large Enterprise",
    "country": "India",
    "address": "25/1, 4th Floor, SKIP House, Museum Rd, near Brigade",
    "aptSuite": "",
    "city": "Bangalore",
    "state": "Karnataka",
    "postalCode": "560025",
    "timezone": "(GMT +5:30) Sri Jayawardenepura",
    "currency": "India Rupee (INR ₹)",
    "dateFormat": "MM/dd/yyyy",
    "financialYearMonth": "January",
    "financialYearDay": "1",
    "logoUrl": "https://example.com/logos/company-logo.png",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T11:00:00Z"
  }
}
```

**Error Responses:**
```json
// 401 Unauthorized
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}

// 404 Not Found (if company info doesn't exist yet)
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Company information not found"
  }
}
```

---

### 2. Update Company Information

**Endpoint:** `PUT /api/v1/company-info`

**Description:** Update company information. All fields are optional, but at least one field must be provided.

**Request Body:**
```json
{
  "company": "Exozen Updated",
  "organizationType": "Large Enterprise",
  "country": "India",
  "address": "25/1, 4th Floor, SKIP House, Museum Rd, near Brigade",
  "aptSuite": "Suite 401",
  "city": "Bangalore",
  "state": "Karnataka",
  "postalCode": "560025",
  "timezone": "(GMT +5:30) Sri Jayawardenepura",
  "currency": "India Rupee (INR ₹)",
  "dateFormat": "MM/dd/yyyy",
  "financialYearMonth": "January",
  "financialYearDay": "1"
}
```

**Request Example:**
```http
PUT /api/v1/company-info
Authorization: Bearer <token>
Content-Type: application/json

{
  "company": "Exozen Updated",
  "city": "Bangalore"
}
```

**Response Example (200 OK):**
```json
{
  "message": "Company information updated successfully",
  "data": {
    "id": 1,
    "company": "Exozen Updated",
    "organizationType": "Large Enterprise",
    "country": "India",
    "address": "25/1, 4th Floor, SKIP House, Museum Rd, near Brigade",
    "aptSuite": "Suite 401",
    "city": "Bangalore",
    "state": "Karnataka",
    "postalCode": "560025",
    "timezone": "(GMT +5:30) Sri Jayawardenepura",
    "currency": "India Rupee (INR ₹)",
    "dateFormat": "MM/dd/yyyy",
    "financialYearMonth": "January",
    "financialYearDay": "1",
    "logoUrl": "https://example.com/logos/company-logo.png",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T11:30:00Z"
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
      "company": "Company name is required",
      "city": "City must be less than 100 characters"
    }
  }
}
```

---

### 3. Upload Company Logo

**Endpoint:** `POST /api/v1/company-info/logo`

**Description:** Upload or replace the company logo.

**Request Body:** `multipart/form-data`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `logo` | File | Yes | Image file (JPG, PNG, or GIF), max 5MB |

**File Requirements:**
- Maximum file size: 5MB
- Supported formats: JPEG, JPG, PNG, GIF
- Recommended dimensions: 200x200 to 500x500 pixels

**Request Example:**
```http
POST /api/v1/company-info/logo
Authorization: Bearer <token>
Content-Type: multipart/form-data

logo: [binary file data]
```

**Response Example (200 OK):**
```json
{
  "message": "Logo uploaded successfully",
  "data": {
    "id": 1,
    "company": "Exozen",
    "logoUrl": "https://example.com/logos/company-logo-1234567890.png",
    "updatedAt": "2024-01-20T12:00:00Z"
  }
}
```

**Error Responses:**
```json
// 400 Bad Request - Invalid file format
{
  "error": {
    "code": "INVALID_FILE_FORMAT",
    "message": "File must be an image (JPG, PNG, or GIF)"
  }
}

// 400 Bad Request - File too large
{
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "File size exceeds maximum limit of 5MB"
  }
}
```

---

### 4. Delete Company Logo

**Endpoint:** `DELETE /api/v1/company-info/logo`

**Description:** Delete the company logo.

**Request Example:**
```http
DELETE /api/v1/company-info/logo
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "message": "Logo deleted successfully"
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Logo not found"
  }
}
```

---

### 5. Delete Company and All Data

**Endpoint:** `DELETE /api/v1/company-info/delete-company`

**Description:** Delete the company account, all user accounts, and all asset data. This operation is IRREVOCABLE.

**Request Example:**
```http
DELETE /api/v1/company-info/delete-company
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "message": "Company account and all data deleted successfully"
}
```

**Error Responses:**
```json
// 403 Forbidden - Insufficient permissions
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Only company administrators can delete the company account"
  }
}

// 400 Bad Request
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Cannot delete company account. Please contact support."
  }
}
```

**Security Notes:**
- This operation requires admin/owner permissions
- All data is permanently deleted and cannot be recovered
- Users are automatically logged out after deletion
- Consider implementing a confirmation step (e.g., typing "DELETE" to confirm)

---

### 6. Delete Asset Data

**Endpoint:** `POST /api/v1/company-info/delete-asset-data`

**Description:** Delete specific types of asset data. This operation is IRREVOCABLE.

**Request Body:**
```json
{
  "dataTypes": ["assets", "sites", "locations", "categories", "departments", "contracts", "insurances", "funds"]
}
```

**Supported Data Types:**
- `assets` - All asset records
- `sites` - All site records
- `locations` - All location records
- `categories` - All category records
- `departments` - All department records
- `contracts` - All contract records
- `insurances` - All insurance records
- `funds` - All fund records

**Request Example:**
```http
POST /api/v1/company-info/delete-asset-data
Authorization: Bearer <token>
Content-Type: application/json

{
  "dataTypes": ["assets", "sites", "locations"]
}
```

**Response Example (200 OK):**
```json
{
  "message": "Asset data deleted successfully",
  "deletedCount": 3
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
      "dataTypes": "At least one data type is required"
    }
  }
}

// 400 Bad Request - Invalid data type
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid data type: 'invalid_type'"
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Authentication required or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `INVALID_FILE_FORMAT` | 400 | Invalid file format for logo upload |
| `FILE_TOO_LARGE` | 413 | File size exceeds maximum limit |
| `BAD_REQUEST` | 400 | Invalid request |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## Usage Examples

### Example 1: Get and update company information

```javascript
// 1. Get company info
const companyInfo = await getCompanyInfo();
console.log(companyInfo.data);

// 2. Update company info
await updateCompanyInfo({
  company: "Exozen Updated",
  city: "Bangalore"
});
```

### Example 2: Upload company logo

```javascript
const file = fileInput.files[0];
const result = await uploadCompanyLogo(file);
console.log("Logo URL:", result.data.logoUrl);
```

### Example 3: Delete asset data

```javascript
await deleteAssetData(["assets", "sites", "locations"]);
console.log("Asset data deleted successfully");
```

---

## Notes

1. **Company Information:**
   - There is typically only one company information record per account
   - The record is created automatically when the account is set up
   - All fields are required when creating, but optional when updating

2. **Logo Upload:**
   - Logo is stored on the server and a URL is returned
   - Previous logo is automatically replaced when a new one is uploaded
   - Logo URL is accessible publicly (no authentication required)

3. **Financial Year:**
   - Financial year is defined by month and day
   - Example: January 1 means financial year starts on January 1st each year
   - Used for financial reporting and asset depreciation calculations

4. **Date Format:**
   - Supported formats: "MM/dd/yyyy", "dd/MM/yyyy", "yyyy-MM-dd"
   - Used throughout the application for displaying dates
   - Changing date format affects all date displays

5. **Timezone:**
   - Timezone is used for scheduling, timestamps, and reports
   - Format: "(GMT ±HH:MM) Timezone Name"
   - Changing timezone affects all time-based operations

6. **Currency:**
   - Currency is used for displaying monetary values
   - Format: "Currency Name (CODE SYMBOL)"
   - Changing currency affects all monetary displays

7. **Delete Operations:**
   - Both delete operations are IRREVOCABLE
   - Consider implementing confirmation dialogs and double confirmation
   - Delete company operation logs out all users
   - Delete asset data operation only deletes selected data types

8. **Validation:**
   - All required fields must be provided when creating
   - Field length limits are enforced
   - Invalid data types are rejected

9. **Permissions:**
   - Company information can be viewed by all authenticated users
   - Only administrators/owners can update company information
   - Only administrators/owners can delete company or asset data

10. **Logo Management:**
    - Logo can be uploaded, updated, or deleted
    - Logo is displayed in various places throughout the application
    - Logo should be optimized for web (compressed, appropriate size)

