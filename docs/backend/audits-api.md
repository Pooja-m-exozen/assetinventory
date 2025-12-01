# Audits API Documentation

## Overview
This document describes the backend API endpoints required for the Audit management page (`/tools/audit`).

## Base URL
```
/api/v1/audits
```

## Authentication
All endpoints require authentication via Bearer token:
```
Authorization: Bearer <token>
```

---

## Data Models

### Audit Model
```typescript
interface Audit {
  id: number | string;        // Unique identifier
  name: string;                // Audit name (required, min 2 chars, max 255)
  siteId: number | string;     // Site ID (required)
  siteName: string;            // Site name (read-only, populated from siteId)
  locationId: number | string; // Location ID (required)
  locationName: string;        // Location name (read-only, populated from locationId)
  status: string;              // Audit status: "draft", "in-progress", "completed", "cancelled" (default: "draft")
  assetCount?: number;         // Number of assets in audit (read-only)
  createdAt: string;           // ISO 8601 timestamp
  updatedAt: string;           // ISO 8601 timestamp
  createdBy?: number | string; // User ID who created the record
  updatedBy?: number | string; // User ID who last updated the record
}
```

### Site Model
```typescript
interface Site {
  id: number | string;         // Unique identifier
  site: string;                 // Site name (required)
  city?: string;                // City (optional)
  state?: string;               // State (optional)
  country?: string;             // Country (optional)
  address?: string;             // Full address (optional)
}
```

### Location Model
```typescript
interface Location {
  id: number | string;         // Unique identifier
  location: string;             // Location name (required)
  siteId?: number | string;     // Site ID (optional, for filtering)
  siteName?: string;            // Site name (read-only, populated from siteId)
}
```

### Asset Model
```typescript
interface Asset {
  id: number | string;          // Unique identifier
  assetId: string;              // Asset ID (required, unique)
  name: string;                 // Asset name (required)
  category?: string;            // Category name (optional)
  categoryId?: number | string; // Category ID (optional)
  siteId?: number | string;     // Site ID (optional)
  siteName?: string;            // Site name (read-only)
  locationId?: number | string; // Location ID (optional)
  locationName?: string;         // Location name (read-only)
  status?: string;              // Asset status (optional)
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

---

## API Endpoints

### 1. Get Audits List

**Endpoint:** `GET /api/v1/audits`

**Description:** Retrieve a paginated list of audits with optional search and filtering.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 100 | Records per page (10, 25, 50, 100) |
| `search` | string | No | - | Search query string (searches in name) |
| `status` | string | No | - | Filter by status: "draft", "in-progress", "completed", "cancelled" |

**Request Example:**
```http
GET /api/v1/audits?page=1&limit=100&status=draft
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Q1 2024 Audit",
      "siteId": 1,
      "siteName": "Casagrand Boulevard",
      "locationId": 1,
      "locationName": "Car washer",
      "status": "draft",
      "assetCount": 25,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "createdBy": 1,
      "updatedBy": 1
    }
  ],
  "pagination": {
    "currentPage": 1,
    "recordsPerPage": 100,
    "totalRecords": 1,
    "totalPages": 1,
    "startRecord": 1,
    "endRecord": 1
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
    "message": "An error occurred while fetching audits"
  }
}
```

---

### 2. Get Single Audit

**Endpoint:** `GET /api/v1/audits/:id`

**Description:** Retrieve a single audit by ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Audit ID |

**Request Example:**
```http
GET /api/v1/audits/1
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "name": "Q1 2024 Audit",
    "siteId": 1,
    "siteName": "Casagrand Boulevard",
    "locationId": 1,
    "locationName": "Car washer",
    "status": "draft",
    "assetCount": 25,
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
    "message": "Audit with ID 1 not found"
  }
}
```

---

### 3. Create Audit

**Endpoint:** `POST /api/v1/audits`

**Description:** Create a new audit.

**Request Body:**
```json
{
  "name": "Q1 2024 Audit",        // Required, min 2 chars, max 255
  "siteId": 1,                     // Required
  "locationId": 1,                 // Required
  "status": "draft"                // Optional, default: "draft"
}
```

**Request Example:**
```http
POST /api/v1/audits
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Q1 2024 Audit",
  "siteId": 1,
  "locationId": 1,
  "status": "draft"
}
```

**Response Example (201 Created):**
```json
{
  "data": {
    "id": 1,
    "name": "Q1 2024 Audit",
    "siteId": 1,
    "siteName": "Casagrand Boulevard",
    "locationId": 1,
    "locationName": "Car washer",
    "status": "draft",
    "assetCount": 0,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "createdBy": 1,
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
      "name": "Audit name is required",
      "siteId": "Site ID is required",
      "locationId": "Location ID is required"
    }
  }
}

// 404 Not Found - Site or Location not found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Site with ID 1 not found"
  }
}
```

---

### 4. Update Audit

**Endpoint:** `PUT /api/v1/audits/:id`

**Description:** Update an existing audit.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Audit ID |

**Request Body:**
```json
{
  "name": "Q1 2024 Audit Updated",  // Optional, min 2 chars, max 255
  "siteId": 2,                      // Optional
  "locationId": 2,                  // Optional
  "status": "in-progress"           // Optional
}
```

**Request Example:**
```http
PUT /api/v1/audits/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Q1 2024 Audit Updated",
  "status": "in-progress"
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "name": "Q1 2024 Audit Updated",
    "siteId": 1,
    "siteName": "Casagrand Boulevard",
    "locationId": 1,
    "locationName": "Car washer",
    "status": "in-progress",
    "assetCount": 25,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:00:00Z",
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
    "message": "Audit with ID 1 not found"
  }
}

// 400 Bad Request - Validation Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "name": "Audit name must be at least 2 characters"
    }
  }
}
```

---

### 5. Delete Audit

**Endpoint:** `DELETE /api/v1/audits/:id`

**Description:** Delete an audit by ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Audit ID |

**Request Example:**
```http
DELETE /api/v1/audits/1
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "message": "Audit deleted successfully"
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Audit with ID 1 not found"
  }
}

// 400 Bad Request - Cannot delete audit with assets
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Cannot delete audit with existing assets. Please remove assets first."
  }
}
```

---

### 6. Add Assets to Audit

**Endpoint:** `POST /api/v1/audits/:id/assets`

**Description:** Add one or more assets to an audit.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Audit ID |

**Request Body:**
```json
{
  "assetIds": [1, 2, 3, "ASSET-001", "ASSET-002"]  // Array of asset IDs (number or string)
}
```

**Request Example:**
```http
POST /api/v1/audits/1/assets
Authorization: Bearer <token>
Content-Type: application/json

{
  "assetIds": ["ASSET-001", "ASSET-002", "ASSET-003"]
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "name": "Q1 2024 Audit",
    "siteId": 1,
    "siteName": "Casagrand Boulevard",
    "locationId": 1,
    "locationName": "Car washer",
    "status": "draft",
    "assetCount": 3,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:00:00Z",
    "createdBy": 1,
    "updatedBy": 1
  },
  "message": "Successfully added 3 asset(s) to audit"
}
```

**Error Responses:**
```json
// 404 Not Found - Audit not found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Audit with ID 1 not found"
  }
}

// 400 Bad Request - Invalid asset IDs
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "assetIds": "Some asset IDs are invalid or not found"
    }
  }
}
```

---

## Sites API Endpoints

### 7. Get Sites List

**Endpoint:** `GET /api/v1/sites`

**Description:** Retrieve a list of all sites.

**Request Example:**
```http
GET /api/v1/sites
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "site": "Casagrand Boulevard",
      "city": "Bangalore",
      "state": "Karnataka",
      "country": "India",
      "address": "Chikkagubbi Road, Doddagubbi, Post, Sonam Layout, Visthar, Bengaluru, Karnataka 560077"
    }
  ]
}
```

---

### 8. Get Single Site

**Endpoint:** `GET /api/v1/sites/:id`

**Description:** Retrieve a single site by ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Site ID |

**Request Example:**
```http
GET /api/v1/sites/1
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "site": "Casagrand Boulevard",
    "city": "Bangalore",
    "state": "Karnataka",
    "country": "India",
    "address": "Chikkagubbi Road, Doddagubbi, Post, Sonam Layout, Visthar, Bengaluru, Karnataka 560077"
  }
}
```

---

## Locations API Endpoints

### 9. Get Locations List

**Endpoint:** `GET /api/v1/locations`

**Description:** Retrieve a list of locations, optionally filtered by site.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `siteId` | number/string | No | - | Filter locations by site ID |

**Request Example:**
```http
GET /api/v1/locations?siteId=1
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "location": "Car washer",
      "siteId": 1,
      "siteName": "Casagrand Boulevard"
    },
    {
      "id": 2,
      "location": "Common Area",
      "siteId": 1,
      "siteName": "Casagrand Boulevard"
    }
  ]
}
```

---

### 10. Get Single Location

**Endpoint:** `GET /api/v1/locations/:id`

**Description:** Retrieve a single location by ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Location ID |

**Request Example:**
```http
GET /api/v1/locations/1
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "location": "Car washer",
    "siteId": 1,
    "siteName": "Casagrand Boulevard"
  }
}
```

---

## Assets API Endpoints

### 11. Get Assets List

**Endpoint:** `GET /api/v1/assets`

**Description:** Retrieve a paginated list of assets with optional filtering.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 100 | Records per page (10, 25, 50, 100) |
| `categoryId` | number/string | No | - | Filter by category ID |
| `siteId` | number/string | No | - | Filter by site ID |
| `locationId` | number/string | No | - | Filter by location ID |
| `search` | string | No | - | Search query string (searches in assetId, name) |

**Request Example:**
```http
GET /api/v1/assets?page=1&limit=100&siteId=1&locationId=1&categoryId=5
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "assetId": "ASSET-001",
      "name": "Laptop Dell XPS 15",
      "category": "Electronics",
      "categoryId": 5,
      "siteId": 1,
      "siteName": "Casagrand Boulevard",
      "locationId": 1,
      "locationName": "Car washer",
      "status": "active"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "recordsPerPage": 100,
    "totalRecords": 1,
    "totalPages": 1,
    "startRecord": 1,
    "endRecord": 1
  }
}
```

---

### 12. Get Asset Categories

**Endpoint:** `GET /api/v1/assets/categories`

**Description:** Retrieve a list of all asset categories.

**Request Example:**
```http
GET /api/v1/assets/categories
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Electronics"
    },
    {
      "id": 2,
      "name": "Furniture"
    },
    {
      "id": 3,
      "name": "Vehicles"
    }
  ]
}
```

---

### 13. Get Assets by IDs

**Endpoint:** `POST /api/v1/assets/by-ids`

**Description:** Retrieve assets by their IDs (for validating asset IDs entered in textarea).

**Request Body:**
```json
{
  "assetIds": ["ASSET-001", "ASSET-002", 3, 4]  // Array of asset IDs (number or string)
}
```

**Request Example:**
```http
POST /api/v1/assets/by-ids
Authorization: Bearer <token>
Content-Type: application/json

{
  "assetIds": ["ASSET-001", "ASSET-002", "ASSET-003"]
}
```

**Response Example (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "assetId": "ASSET-001",
      "name": "Laptop Dell XPS 15",
      "category": "Electronics",
      "categoryId": 5,
      "siteId": 1,
      "siteName": "Casagrand Boulevard",
      "locationId": 1,
      "locationName": "Car washer",
      "status": "active"
    },
    {
      "id": 2,
      "assetId": "ASSET-002",
      "name": "Monitor LG 27inch",
      "category": "Electronics",
      "categoryId": 5,
      "siteId": 1,
      "siteName": "Casagrand Boulevard",
      "locationId": 1,
      "locationName": "Car washer",
      "status": "active"
    }
  ]
}
```

**Error Responses:**
```json
// 400 Bad Request - Some asset IDs not found
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Some asset IDs not found",
    "details": {
      "notFound": ["ASSET-999"]
    }
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Authentication required or invalid token |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `BAD_REQUEST` | 400 | Invalid request (e.g., cannot delete audit with assets) |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## Usage Examples

### Example 1: Create a new audit and add assets

```javascript
// 1. Create audit
const audit = await createAudit({
  name: "Q1 2024 Audit",
  siteId: 1,
  locationId: 1,
  status: "draft"
});

// 2. Add assets to audit
await addAssetsToAudit({
  auditId: audit.data.id,
  assetIds: ["ASSET-001", "ASSET-002", "ASSET-003"]
});
```

### Example 2: Get assets filtered by site, location, and category

```javascript
const assets = await getAssets(
  1,        // page
  100,      // limit
  5,        // categoryId
  1,        // siteId
  1,        // locationId
  ""        // search
);
```

### Example 3: Update audit status

```javascript
await updateAudit(1, {
  status: "in-progress"
});
```

---

## Notes

1. **Asset IDs Format**: Asset IDs can be either numeric IDs or string identifiers (e.g., "ASSET-001"). The API should handle both formats.

2. **Location Filtering**: When fetching locations, if `siteId` is provided, only locations belonging to that site are returned.

3. **Asset Filtering**: Assets can be filtered by multiple criteria simultaneously (category, site, location). All filters are applied as AND conditions.

4. **Audit Status**: Valid status values are:
   - `draft`: Audit is being prepared
   - `in-progress`: Audit is currently being conducted
   - `completed`: Audit has been completed
   - `cancelled`: Audit has been cancelled

5. **Bulk Asset Addition**: When adding assets to an audit, if some asset IDs are invalid, the API should still add the valid ones and return information about which ones failed.

