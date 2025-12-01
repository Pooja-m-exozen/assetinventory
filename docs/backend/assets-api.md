# Assets API Documentation

## Overview
This document describes the backend API endpoints required for the Assets management page (`/assets/add` and related asset management pages).

## Base URL
```
/api/v1/assets
```

## Authentication
All endpoints require authentication via Bearer token:
```
Authorization: Bearer <token>
```

---

## Data Models

### Asset Model
```typescript
interface Asset {
  id: number;                    // Unique identifier
  description: string;            // Asset description (required)
  assetTagId: string;            // Asset Tag ID (required, unique)
  purchasedFrom?: string;        // Vendor/supplier name (optional)
  purchaseDate?: string;         // ISO 8601 date (optional)
  brand?: string;                // Brand name (optional)
  cost?: number;                 // Purchase cost in INR (optional)
  model?: string;                // Model number/name (optional)
  capacity?: string;             // Capacity specification (optional)
  serialNo?: string;             // Serial number (optional)
  site: string;                  // Site name (required)
  location: string;              // Location within site (required)
  category: string;              // Asset category (required)
  department: string;            // Department (required)
  photoUrl?: string;             // URL to asset photo (optional)
  depreciableAsset: boolean;     // Whether asset is depreciable (required)
  depreciableCost?: number;      // Depreciable cost in INR (optional, required if depreciableAsset is true)
  assetLife?: number;            // Asset life in months (optional, required if depreciableAsset is true)
  salvageValue: number;          // Salvage value in INR (default: 0)
  depreciationMethod?: string;   // "Declining Balance" or "Straight Line" (optional, required if depreciableAsset is true)
  dateAcquired?: string;         // ISO 8601 date - depreciation begin date (optional, required if depreciableAsset is true)
  createdAt: string;             // ISO 8601 timestamp
  updatedAt: string;             // ISO 8601 timestamp
  createdBy?: number;            // User ID who created the record
  updatedBy?: number;            // User ID who last updated the record
}
```

### Pagination Response
```typescript
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    recordsPerPage: number;
    totalRecords: number;
    totalPages: number;
    startRecord: number;
    endRecord: number;
  };
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

### Dropdown Option Model
```typescript
interface DropdownOption {
  id: number;
  value: string;
  label: string;
  type: "site" | "location" | "category" | "department";
  createdAt: string;
  updatedAt: string;
}
```

---

## API Endpoints

### 1. Get Assets List

**Endpoint:** `GET /api/v1/assets`

**Description:** Retrieve a paginated list of assets with optional search and filtering.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 10 | Records per page (10, 25, 50, 100) |
| `search` | string | No | - | Search query string |
| `searchField` | string | No | "all" | Field to search in: "all", "description", "assetTagId", "brand", "model", "serialNo" |
| `sortBy` | string | No | "createdAt" | Sort field: "description", "assetTagId", "purchaseDate", "cost", "createdAt" |
| `sortOrder` | string | No | "desc" | Sort order: "asc", "desc" |
| `site` | string | No | - | Filter by site |
| `location` | string | No | - | Filter by location |
| `category` | string | No | - | Filter by category |
| `department` | string | No | - | Filter by department |

**Request Example:**
```http
GET /api/v1/assets?page=1&limit=10&search=laptop&searchField=all&site=Casagrand Boulev
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "description": "Dell Laptop XPS 15",
      "assetTagId": "AST-001",
      "purchasedFrom": "Dell Technologies",
      "purchaseDate": "2024-01-15",
      "brand": "Dell",
      "cost": 85000,
      "model": "XPS 15 9520",
      "capacity": "512GB SSD, 16GB RAM",
      "serialNo": "DL123456789",
      "site": "Casagrand Boulev",
      "location": "Common Area",
      "category": "Asset",
      "department": "Asset",
      "photoUrl": "https://example.com/assets/photos/ast-001.jpg",
      "depreciableAsset": true,
      "depreciableCost": 85000,
      "assetLife": 36,
      "salvageValue": 0,
      "depreciationMethod": "Declining Balance",
      "dateAcquired": "2024-01-15",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "createdBy": 1,
      "updatedBy": 1
    }
  ],
  "pagination": {
    "currentPage": 1,
    "recordsPerPage": 10,
    "totalRecords": 25,
    "totalPages": 3,
    "startRecord": 1,
    "endRecord": 10
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

// 500 Internal Server Error
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An error occurred while fetching assets"
  }
}
```

---

### 2. Get Single Asset

**Endpoint:** `GET /api/v1/assets/:id`

**Description:** Retrieve a single asset by ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Asset ID |

**Request Example:**
```http
GET /api/v1/assets/1
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "description": "Dell Laptop XPS 15",
    "assetTagId": "AST-001",
    "purchasedFrom": "Dell Technologies",
    "purchaseDate": "2024-01-15",
    "brand": "Dell",
    "cost": 85000,
    "model": "XPS 15 9520",
    "capacity": "512GB SSD, 16GB RAM",
    "serialNo": "DL123456789",
    "site": "Casagrand Boulev",
    "location": "Common Area",
    "category": "Asset",
    "department": "Asset",
    "photoUrl": "https://example.com/assets/photos/ast-001.jpg",
    "depreciableAsset": true,
    "depreciableCost": 85000,
    "assetLife": 36,
    "salvageValue": 0,
    "depreciationMethod": "Declining Balance",
    "dateAcquired": "2024-01-15",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "createdBy": 1,
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
    "message": "Asset with ID 1 not found"
  }
}
```

---

### 3. Create Asset

**Endpoint:** `POST /api/v1/assets`

**Description:** Create a new asset.

**Request Body:**
```json
{
  "description": "Dell Laptop XPS 15",           // Required, min 2 chars, max 255
  "assetTagId": "AST-001",                       // Required, unique, max 50 chars
  "purchasedFrom": "Dell Technologies",          // Optional, max 255 chars
  "purchaseDate": "2024-01-15",                  // Optional, ISO 8601 date format
  "brand": "Dell",                               // Optional, max 100 chars
  "cost": 85000,                                 // Optional, number >= 0
  "model": "XPS 15 9520",                        // Optional, max 100 chars
  "capacity": "512GB SSD, 16GB RAM",             // Optional, max 255 chars
  "serialNo": "DL123456789",                     // Optional, max 100 chars
  "site": "Casagrand Boulev",                    // Required, max 100 chars
  "location": "Common Area",                     // Required, max 100 chars
  "category": "Asset",                           // Required, max 100 chars
  "department": "Asset",                         // Required, max 100 chars
  "depreciableAsset": true,                      // Required, boolean
  "depreciableCost": 85000,                      // Optional, required if depreciableAsset is true, number >= 0
  "assetLife": 36,                               // Optional, required if depreciableAsset is true, number > 0 (months)
  "salvageValue": 0,                            // Optional, default: 0, number >= 0
  "depreciationMethod": "Declining Balance",     // Optional, required if depreciableAsset is true, "Declining Balance" | "Straight Line"
  "dateAcquired": "2024-01-15"                  // Optional, required if depreciableAsset is true, ISO 8601 date format
}
```

**Request Example:**
```http
POST /api/v1/assets
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Dell Laptop XPS 15",
  "assetTagId": "AST-001",
  "purchasedFrom": "Dell Technologies",
  "purchaseDate": "2024-01-15",
  "brand": "Dell",
  "cost": 85000,
  "model": "XPS 15 9520",
  "capacity": "512GB SSD, 16GB RAM",
  "serialNo": "DL123456789",
  "site": "Casagrand Boulev",
  "location": "Common Area",
  "category": "Asset",
  "department": "Asset",
  "depreciableAsset": true,
  "depreciableCost": 85000,
  "assetLife": 36,
  "salvageValue": 0,
  "depreciationMethod": "Declining Balance",
  "dateAcquired": "2024-01-15"
}
```

**Response Example (201 Created):**
```json
{
  "data": {
    "id": 1,
    "description": "Dell Laptop XPS 15",
    "assetTagId": "AST-001",
    "purchasedFrom": "Dell Technologies",
    "purchaseDate": "2024-01-15",
    "brand": "Dell",
    "cost": 85000,
    "model": "XPS 15 9520",
    "capacity": "512GB SSD, 16GB RAM",
    "serialNo": "DL123456789",
    "site": "Casagrand Boulev",
    "location": "Common Area",
    "category": "Asset",
    "department": "Asset",
    "photoUrl": null,
    "depreciableAsset": true,
    "depreciableCost": 85000,
    "assetLife": 36,
    "salvageValue": 0,
    "depreciationMethod": "Declining Balance",
    "dateAcquired": "2024-01-15",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "createdBy": 1,
    "updatedBy": 1
  },
  "message": "Asset created successfully"
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
      "description": "Description is required",
      "assetTagId": "Asset Tag ID is required",
      "depreciableCost": "Depreciable cost is required when depreciable asset is true"
    }
  }
}

// 409 Conflict - Duplicate Asset Tag ID
{
  "error": {
    "code": "DUPLICATE_ASSET_TAG",
    "message": "Asset with Tag ID 'AST-001' already exists"
  }
}
```

---

### 4. Update Asset

**Endpoint:** `PUT /api/v1/assets/:id`

**Description:** Update an existing asset.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Asset ID |

**Request Body:**
```json
{
  "description": "Dell Laptop XPS 15 Updated",  // Optional, min 2 chars, max 255
  "assetTagId": "AST-001",                       // Optional, unique, max 50 chars
  "purchasedFrom": "Dell Technologies",          // Optional, max 255 chars
  "purchaseDate": "2024-01-15",                  // Optional, ISO 8601 date format
  "brand": "Dell",                               // Optional, max 100 chars
  "cost": 90000,                                 // Optional, number >= 0
  "model": "XPS 15 9520",                        // Optional, max 100 chars
  "capacity": "1TB SSD, 32GB RAM",               // Optional, max 255 chars
  "serialNo": "DL123456789",                     // Optional, max 100 chars
  "site": "Casagrand Boulev",                    // Optional, max 100 chars
  "location": "Office Area",                     // Optional, max 100 chars
  "category": "Asset",                           // Optional, max 100 chars
  "department": "IT",                            // Optional, max 100 chars
  "depreciableAsset": true,                      // Optional, boolean
  "depreciableCost": 90000,                      // Optional, number >= 0
  "assetLife": 36,                               // Optional, number > 0 (months)
  "salvageValue": 5000,                          // Optional, number >= 0
  "depreciationMethod": "Straight Line",         // Optional, "Declining Balance" | "Straight Line"
  "dateAcquired": "2024-01-15"                  // Optional, ISO 8601 date format
}
```

**Request Example:**
```http
PUT /api/v1/assets/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "cost": 90000,
  "capacity": "1TB SSD, 32GB RAM",
  "location": "Office Area"
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "description": "Dell Laptop XPS 15",
    "assetTagId": "AST-001",
    "purchasedFrom": "Dell Technologies",
    "purchaseDate": "2024-01-15",
    "brand": "Dell",
    "cost": 90000,
    "model": "XPS 15 9520",
    "capacity": "1TB SSD, 32GB RAM",
    "serialNo": "DL123456789",
    "site": "Casagrand Boulev",
    "location": "Office Area",
    "category": "Asset",
    "department": "Asset",
    "photoUrl": "https://example.com/assets/photos/ast-001.jpg",
    "depreciableAsset": true,
    "depreciableCost": 85000,
    "assetLife": 36,
    "salvageValue": 0,
    "depreciationMethod": "Declining Balance",
    "dateAcquired": "2024-01-15",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T15:45:00Z",
    "createdBy": 1,
    "updatedBy": 1
  },
  "message": "Asset updated successfully"
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Asset with ID 1 not found"
  }
}

// 409 Conflict - Duplicate Asset Tag ID
{
  "error": {
    "code": "DUPLICATE_ASSET_TAG",
    "message": "Asset with Tag ID 'AST-002' already exists"
  }
}
```

---

### 5. Delete Asset

**Endpoint:** `DELETE /api/v1/assets/:id`

**Description:** Delete a single asset.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Asset ID |

**Request Example:**
```http
DELETE /api/v1/assets/1
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "message": "Asset deleted successfully"
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Asset with ID 1 not found"
  }
}

// 409 Conflict - Asset has active leases
{
  "error": {
    "code": "ASSET_IN_USE",
    "message": "Cannot delete asset. Asset has active leases or is currently assigned."
  }
}
```

---

### 6. Upload Asset Photo

**Endpoint:** `POST /api/v1/assets/:id/photo`

**Description:** Upload a photo for an asset. Replaces existing photo if one exists.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Asset ID |

**Request:**
- Content-Type: `multipart/form-data`
- Body: Form data with file field named `photo`

**File Requirements:**
- Allowed formats: JPG, JPEG, GIF, PNG
- Maximum file size: 5MB
- Recommended dimensions: 800x600px or larger

**Request Example:**
```http
POST /api/v1/assets/1/photo
Authorization: Bearer <token>
Content-Type: multipart/form-data

photo: <image file>
```

**Response Example (200 OK):**
```json
{
  "message": "Photo uploaded successfully",
  "photoUrl": "https://example.com/assets/photos/ast-001.jpg"
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Asset with ID 1 not found"
  }
}

// 400 Bad Request - Invalid file format
{
  "error": {
    "code": "INVALID_FILE_FORMAT",
    "message": "File must be JPG, GIF, or PNG format"
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

### 7. Delete Asset Photo

**Endpoint:** `DELETE /api/v1/assets/:id/photo`

**Description:** Delete the photo associated with an asset.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Asset ID |

**Request Example:**
```http
DELETE /api/v1/assets/1/photo
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "message": "Photo deleted successfully"
}
```

---

### 8. Get Dropdown Options

**Endpoint:** `GET /api/v1/assets/dropdowns/:type`

**Description:** Get list of available options for sites, locations, categories, or departments.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | Yes | Type of dropdown: "site", "location", "category", "department" |

**Request Example:**
```http
GET /api/v1/assets/dropdowns/site
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "value": "Casagrand Boulev",
      "label": "Casagrand Boulev",
      "type": "site",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "value": "Main Office",
      "label": "Main Office",
      "type": "site",
      "createdAt": "2024-01-16T10:30:00Z",
      "updatedAt": "2024-01-16T10:30:00Z"
    }
  ]
}
```

---

### 9. Create Dropdown Option

**Endpoint:** `POST /api/v1/assets/dropdowns`

**Description:** Create a new dropdown option (site, location, category, or department).

**Request Body:**
```json
{
  "type": "site",              // Required: "site" | "location" | "category" | "department"
  "value": "New Site Name",     // Required, max 100 chars, unique per type
  "label": "New Site Name"      // Optional, defaults to value, max 100 chars
}
```

**Request Example:**
```http
POST /api/v1/assets/dropdowns
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "site",
  "value": "New Site Name",
  "label": "New Site Name"
}
```

**Response Example (201 Created):**
```json
{
  "data": {
    "id": 3,
    "value": "New Site Name",
    "label": "New Site Name",
    "type": "site",
    "createdAt": "2024-01-20T10:30:00Z",
    "updatedAt": "2024-01-20T10:30:00Z"
  },
  "message": "Dropdown option created successfully"
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
      "type": "Type must be one of: site, location, category, department",
      "value": "Value is required"
    }
  }
}

// 409 Conflict - Duplicate Value
{
  "error": {
    "code": "DUPLICATE_VALUE",
    "message": "A site with value 'New Site Name' already exists"
  }
}
```

---

### 10. Bulk Delete Assets

**Endpoint:** `DELETE /api/v1/assets/bulk`

**Description:** Delete multiple assets at once.

**Request Body:**
```json
{
  "ids": [1, 2, 3, 4, 5]  // Array of asset IDs
}
```

**Request Example:**
```http
DELETE /api/v1/assets/bulk
Authorization: Bearer <token>
Content-Type: application/json

{
  "ids": [1, 2, 3]
}
```

**Response Example (200 OK):**
```json
{
  "message": "3 assets deleted successfully",
  "deletedCount": 3,
  "failedCount": 0,
  "failedIds": []
}
```

**Response Example (Partial Success - 207 Multi-Status):**
```json
{
  "message": "Bulk delete completed with some failures",
  "deletedCount": 2,
  "failedCount": 1,
  "failedIds": [3],
  "errors": {
    "3": "Asset has active leases"
  }
}
```

---

### 11. Import Assets

**Endpoint:** `POST /api/v1/assets/import`

**Description:** Import assets from CSV or Excel file.

**Request:**
- Content-Type: `multipart/form-data`
- Body: Form data with file field

**Request Example:**
```http
POST /api/v1/assets/import
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <CSV or Excel file>
```

**CSV Format:**
```csv
description,assetTagId,purchasedFrom,purchaseDate,brand,cost,model,capacity,serialNo,site,location,category,department,depreciableAsset,depreciableCost,assetLife,salvageValue,depreciationMethod,dateAcquired
Dell Laptop XPS 15,AST-001,Dell Technologies,2024-01-15,Dell,85000,XPS 15 9520,512GB SSD 16GB RAM,DL123456789,Casagrand Boulev,Common Area,Asset,Asset,true,85000,36,0,Declining Balance,2024-01-15
```

**Response Example (200 OK):**
```json
{
  "message": "Import completed successfully",
  "totalRows": 100,
  "importedCount": 95,
  "failedCount": 5,
  "errors": [
    {
      "row": 3,
      "assetTagId": "AST-001",
      "error": "Duplicate Asset Tag ID"
    },
    {
      "row": 7,
      "assetTagId": "AST-005",
      "error": "Invalid date format for purchaseDate"
    }
  ]
}
```

**Error Responses:**
```json
// 400 Bad Request - Invalid file format
{
  "error": {
    "code": "INVALID_FILE_FORMAT",
    "message": "File must be CSV or Excel format (.csv, .xlsx, .xls)"
  }
}

// 400 Bad Request - File too large
{
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "File size exceeds maximum limit of 10MB"
  }
}
```

---

### 12. Export Assets

**Endpoint:** `GET /api/v1/assets/export`

**Description:** Export assets to CSV or Excel file.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `format` | string | No | "csv" | Export format: "csv", "xlsx" |
| `search` | string | No | - | Search query (same as list endpoint) |
| `searchField` | string | No | "all" | Search field (same as list endpoint) |
| `site` | string | No | - | Filter by site |
| `location` | string | No | - | Filter by location |
| `category` | string | No | - | Filter by category |
| `department` | string | No | - | Filter by department |

**Request Example:**
```http
GET /api/v1/assets/export?format=csv&search=laptop&site=Casagrand Boulev
Authorization: Bearer <token>
```

**Response:**
- Content-Type: `text/csv` or `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Content-Disposition: `attachment; filename="assets_export_2024-01-20.csv"`
- Body: File content

---

## Validation Rules

### Description
- Required
- Minimum length: 2 characters
- Maximum length: 255 characters
- Pattern: Letters, numbers, spaces, hyphens, and common punctuation

### Asset Tag ID
- Required
- Maximum length: 50 characters
- Must be unique across all assets
- Pattern: Alphanumeric, hyphens, underscores
- Case-sensitive

### Purchase Date / Date Acquired
- Optional (but required if depreciableAsset is true for dateAcquired)
- Valid ISO 8601 date format (YYYY-MM-DD)
- Cannot be a future date (for purchaseDate)
- Cannot be before purchaseDate (for dateAcquired)

### Cost / Depreciable Cost / Salvage Value
- Optional (but depreciableCost required if depreciableAsset is true)
- Must be a number >= 0
- Maximum value: 999,999,999.99
- Precision: 2 decimal places

### Asset Life
- Optional (but required if depreciableAsset is true)
- Must be a positive integer (number > 0)
- Represents months
- Maximum value: 600 (50 years)

### Depreciation Method
- Optional (but required if depreciableAsset is true)
- Must be one of: "Declining Balance", "Straight Line"
- Case-sensitive

### Site / Location / Category / Department
- Required (for site, location, category, department)
- Maximum length: 100 characters
- Must exist in dropdown options (or can be created via dropdown API)

### Photo
- Optional
- Allowed formats: JPG, JPEG, GIF, PNG
- Maximum file size: 5MB
- Recommended dimensions: 800x600px or larger

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Authentication required or invalid token |
| `FORBIDDEN` | 403 | User doesn't have permission to perform action |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `DUPLICATE_ASSET_TAG` | 409 | Asset Tag ID already exists |
| `ASSET_IN_USE` | 409 | Asset cannot be deleted (has active leases or assignments) |
| `INVALID_FILE_FORMAT` | 400 | Invalid file format for photo or import |
| `FILE_TOO_LARGE` | 400 | File size exceeds limit |
| `DUPLICATE_VALUE` | 409 | Dropdown option value already exists for the type |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## Rate Limiting

- **Standard endpoints:** 100 requests per minute per user
- **Photo upload endpoint:** 20 requests per hour per user
- **Import endpoint:** 10 requests per hour per user
- **Export endpoint:** 20 requests per hour per user

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642680000
```

---

## Database Schema

### assets Table
```sql
CREATE TABLE assets (
  id SERIAL PRIMARY KEY,
  description VARCHAR(255) NOT NULL,
  asset_tag_id VARCHAR(50) NOT NULL UNIQUE,
  purchased_from VARCHAR(255),
  purchase_date DATE,
  brand VARCHAR(100),
  cost DECIMAL(12, 2),
  model VARCHAR(100),
  capacity VARCHAR(255),
  serial_no VARCHAR(100),
  site VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  photo_url VARCHAR(500),
  depreciable_asset BOOLEAN NOT NULL DEFAULT false,
  depreciable_cost DECIMAL(12, 2),
  asset_life INTEGER,
  salvage_value DECIMAL(12, 2) DEFAULT 0,
  depreciation_method VARCHAR(50),
  date_acquired DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id),
  updated_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_assets_asset_tag_id ON assets(asset_tag_id);
CREATE INDEX idx_assets_site ON assets(site);
CREATE INDEX idx_assets_location ON assets(location);
CREATE INDEX idx_assets_category ON assets(category);
CREATE INDEX idx_assets_department ON assets(department);
CREATE INDEX idx_assets_description ON assets(description);
```

### asset_dropdown_options Table
```sql
CREATE TABLE asset_dropdown_options (
  id SERIAL PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('site', 'location', 'category', 'department')),
  value VARCHAR(100) NOT NULL,
  label VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(type, value)
);

CREATE INDEX idx_dropdown_options_type ON asset_dropdown_options(type);
```

---

## Frontend Integration Example

### Create Asset
```typescript
const createAsset = async (assetData: {
  description: string;
  assetTagId: string;
  purchasedFrom?: string;
  purchaseDate?: string;
  brand?: string;
  cost?: number;
  model?: string;
  capacity?: string;
  serialNo?: string;
  site: string;
  location: string;
  category: string;
  department: string;
  depreciableAsset: boolean;
  depreciableCost?: number;
  assetLife?: number;
  salvageValue?: number;
  depreciationMethod?: string;
  dateAcquired?: string;
}) => {
  const response = await fetch("/api/v1/assets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(assetData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  return response.json();
};
```

### Upload Asset Photo
```typescript
const uploadAssetPhoto = async (assetId: number, file: File) => {
  const formData = new FormData();
  formData.append("photo", file);

  const response = await fetch(`/api/v1/assets/${assetId}/photo`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  return response.json();
};
```

### Get Dropdown Options
```typescript
const getDropdownOptions = async (type: "site" | "location" | "category" | "department") => {
  const response = await fetch(`/api/v1/assets/dropdowns/${type}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dropdown options");
  }

  const data = await response.json();
  return data.data.map((option: any) => ({
    value: option.value,
    label: option.label || option.value,
  }));
};
```

### Create Dropdown Option
```typescript
const createDropdownOption = async (
  type: "site" | "location" | "category" | "department",
  value: string,
  label?: string
) => {
  const response = await fetch("/api/v1/assets/dropdowns", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ type, value, label: label || value }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  return response.json();
};
```

---

## Testing

### Postman Collection
A Postman collection is available at: `/docs/postman/assets-api.json`

### Example cURL Commands

**Create Asset:**
```bash
curl -X POST "https://api.example.com/api/v1/assets" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Dell Laptop XPS 15",
    "assetTagId": "AST-001",
    "site": "Casagrand Boulev",
    "location": "Common Area",
    "category": "Asset",
    "department": "Asset",
    "depreciableAsset": true,
    "depreciableCost": 85000,
    "assetLife": 36,
    "depreciationMethod": "Declining Balance",
    "dateAcquired": "2024-01-15"
  }'
```

**Upload Asset Photo:**
```bash
curl -X POST "https://api.example.com/api/v1/assets/1/photo" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "photo=@asset-photo.jpg"
```

**Get Dropdown Options:**
```bash
curl -X GET "https://api.example.com/api/v1/assets/dropdowns/site" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Import Assets:**
```bash
curl -X POST "https://api.example.com/api/v1/assets/import" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@assets.csv"
```

---

## Notes

1. **Asset Tag ID Uniqueness:** Asset Tag ID must be unique across all assets. The system should check for duplicates before creating or updating.

2. **Depreciation Logic:** When `depreciableAsset` is `true`, the following fields become required:
   - `depreciableCost`
   - `assetLife`
   - `depreciationMethod`
   - `dateAcquired`

3. **Photo Storage:** Asset photos should be stored in a cloud storage service (e.g., AWS S3, Azure Blob Storage) or a dedicated file server. The `photoUrl` should be a publicly accessible URL.

4. **Date Validation:**
   - `purchaseDate` cannot be in the future
   - `dateAcquired` cannot be before `purchaseDate` (if both are provided)
   - `dateAcquired` is the date when depreciation begins

5. **Dropdown Options:** Sites, locations, categories, and departments should be managed through the dropdown API. When creating an asset, if a new value is provided that doesn't exist, the system can either:
   - Reject the request and ask user to create the option first
   - Automatically create the option (if user has permission)

6. **File Upload Limits:**
   - Maximum file size for photos: 5MB
   - Maximum file size for import: 10MB
   - Maximum rows per import: 10,000
   - Supported formats: CSV, XLSX, XLS (for import)

7. **Soft Delete:** Consider implementing soft delete (mark as deleted) instead of hard delete to maintain data integrity and audit trails, especially for assets with depreciation history.

8. **Audit Logging:** All create, update, and delete operations should be logged for audit purposes, including who performed the action and when.

9. **Depreciation Calculations:** The backend should calculate depreciation schedules based on:
   - Depreciable Cost
   - Asset Life (in months)
   - Salvage Value
   - Depreciation Method (Declining Balance or Straight Line)
   - Date Acquired

10. **Asset Status:** Consider adding an asset status field (e.g., "Active", "Inactive", "Disposed", "Under Maintenance") for better asset lifecycle management.

---

## Version History

- **v1.0.0** (2024-01-20): Initial API documentation

