# Sites API Documentation

## Overview
This document describes the backend API endpoints required for the Sites management page (`/setup/sites`).

## Base URL
```
/api/v1/sites
```

## Authentication
All endpoints require authentication via Bearer token:
```
Authorization: Bearer <token>
```

---

## Data Models

### Site Model
```typescript
interface Site {
  id: number | string;              // Unique identifier
  site: string;                      // Site name (required, min 2 chars, max 255 chars, unique)
  description?: string;               // Site description (optional, max 1000 chars)
  address: string;                   // Street address (required, max 500 chars)
  aptSuite?: string;                 // Apartment/Suite (optional, max 100 chars)
  city: string;                      // City (required, max 100 chars)
  state: string;                     // State/Province (required, max 100 chars)
  zip: string;                       // ZIP/Postal code (required, max 20 chars)
  country: string;                   // Country (required, max 100 chars)
  locationCount?: number;             // Number of locations in this site (read-only)
  assetCount?: number;                // Number of assets in this site (read-only)
  createdAt?: string;                 // ISO 8601 timestamp
  updatedAt?: string;                 // ISO 8601 timestamp
  createdBy?: number | string;        // User ID who created the record
  updatedBy?: number | string;        // User ID who last updated the record
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

### 1. Get Sites List

**Endpoint:** `GET /api/v1/sites`

**Description:** Retrieve a paginated list of sites with optional search.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 10 | Records per page (10, 25, 50, 100) |
| `search` | string | No | - | Search query string (searches in site name, address, city) |

**Request Example:**
```http
GET /api/v1/sites?page=1&limit=10&search=Casagrand
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "site": "Casagrand Boulevard",
      "description": "Casagrand Boulevard is a wellness-themed residential project in Bangalore's Hennur Main Road area, offering luxury apartments with over 75 amenities focused on health and comfort.",
      "address": "Chikkagubbi Road, Doddagubbi, Post, Sonam Layout, Visthar, Bengaluru, Karnataka 560077",
      "aptSuite": "",
      "city": "Bangalore",
      "state": "Karnataka",
      "zip": "560077",
      "country": "India",
      "locationCount": 5,
      "assetCount": 25,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "createdBy": 1,
      "updatedBy": 1
    }
  ],
  "pagination": {
    "currentPage": 1,
    "recordsPerPage": 10,
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
    "message": "An error occurred while fetching sites"
  }
}
```

---

### 2. Get Single Site

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
    "description": "Casagrand Boulevard is a wellness-themed residential project...",
    "address": "Chikkagubbi Road, Doddagubbi, Post, Sonam Layout, Visthar, Bengaluru, Karnataka 560077",
    "aptSuite": "",
    "city": "Bangalore",
    "state": "Karnataka",
    "zip": "560077",
    "country": "India",
    "locationCount": 5,
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
    "message": "Site with ID 1 not found"
  }
}
```

---

### 3. Create Site

**Endpoint:** `POST /api/v1/sites`

**Description:** Create a new site.

**Request Body:**
```json
{
  "site": "Casagrand Boulevard",        // Required, min 2 chars, max 255 chars, unique
  "description": "Wellness-themed...",  // Optional, max 1000 chars
  "address": "Chikkagubbi Road...",     // Required, max 500 chars
  "aptSuite": "",                       // Optional, max 100 chars
  "city": "Bangalore",                  // Required, max 100 chars
  "state": "Karnataka",                 // Required, max 100 chars
  "zip": "560077",                      // Required, max 20 chars
  "country": "India"                    // Required, max 100 chars
}
```

**Request Example:**
```http
POST /api/v1/sites
Authorization: Bearer <token>
Content-Type: application/json

{
  "site": "Casagrand Boulevard",
  "description": "Wellness-themed residential project",
  "address": "Chikkagubbi Road, Doddagubbi, Post, Sonam Layout, Visthar, Bengaluru, Karnataka 560077",
  "aptSuite": "",
  "city": "Bangalore",
  "state": "Karnataka",
  "zip": "560077",
  "country": "India"
}
```

**Response Example (201 Created):**
```json
{
  "data": {
    "id": 1,
    "site": "Casagrand Boulevard",
    "description": "Wellness-themed residential project",
    "address": "Chikkagubbi Road, Doddagubbi, Post, Sonam Layout, Visthar, Bengaluru, Karnataka 560077",
    "aptSuite": "",
    "city": "Bangalore",
    "state": "Karnataka",
    "zip": "560077",
    "country": "India",
    "locationCount": 0,
    "assetCount": 0,
    "createdAt": "2024-01-20T10:30:00Z",
    "updatedAt": "2024-01-20T10:30:00Z",
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
      "site": "Site name is required",
      "address": "Address is required"
    }
  }
}

// 400 Bad Request - Duplicate Site
{
  "error": {
    "code": "DUPLICATE_ERROR",
    "message": "Site with this name already exists"
  }
}
```

---

### 4. Update Site

**Endpoint:** `PUT /api/v1/sites/:id`

**Description:** Update an existing site.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Site ID |

**Request Body:**
```json
{
  "site": "Casagrand Boulevard Updated",  // Optional, min 2 chars, max 255 chars
  "description": "Updated description",  // Optional, max 1000 chars
  "address": "Updated address",          // Optional, max 500 chars
  "aptSuite": "Suite 401",               // Optional, max 100 chars
  "city": "Bangalore",                   // Optional, max 100 chars
  "state": "Karnataka",                  // Optional, max 100 chars
  "zip": "560077",                       // Optional, max 20 chars
  "country": "India"                     // Optional, max 100 chars
}
```

**Request Example:**
```http
PUT /api/v1/sites/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "site": "Casagrand Boulevard Updated",
  "city": "Bangalore"
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "site": "Casagrand Boulevard Updated",
    "description": "Wellness-themed residential project",
    "address": "Chikkagubbi Road, Doddagubbi, Post, Sonam Layout, Visthar, Bengaluru, Karnataka 560077",
    "aptSuite": "",
    "city": "Bangalore",
    "state": "Karnataka",
    "zip": "560077",
    "country": "India",
    "locationCount": 5,
    "assetCount": 25,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T11:00:00Z",
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
    "message": "Site with ID 1 not found"
  }
}

// 400 Bad Request - Validation Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "site": "Site name must be at least 2 characters"
    }
  }
}
```

---

### 5. Delete Site

**Endpoint:** `DELETE /api/v1/sites/:id`

**Description:** Delete a site by ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Site ID |

**Request Example:**
```http
DELETE /api/v1/sites/1
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "message": "Site deleted successfully"
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Site with ID 1 not found"
  }
}

// 400 Bad Request - Site has locations or assets
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Cannot delete site with locations or assets. Please reassign or remove locations/assets first."
  }
}
```

---

### 6. Bulk Delete Sites

**Endpoint:** `POST /api/v1/sites/bulk-delete`

**Description:** Delete multiple sites by their IDs.

**Request Body:**
```json
{
  "ids": [1, 2, 3]  // Array of site IDs
}
```

**Request Example:**
```http
POST /api/v1/sites/bulk-delete
Authorization: Bearer <token>
Content-Type: application/json

{
  "ids": [1, 2, 3]
}
```

**Response Example (200 OK):**
```json
{
  "message": "Sites deleted successfully",
  "deletedCount": 3
}
```

**Error Responses:**
```json
// 400 Bad Request
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "ids": "At least one site ID is required"
    }
  }
}
```

---

### 7. Import Sites

**Endpoint:** `POST /api/v1/sites/import`

**Description:** Import sites from CSV or Excel file.

**Request Body:** `multipart/form-data`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | Yes | CSV or Excel file (.csv, .xlsx, .xls) containing sites to import |

**File Format:**
- CSV or Excel (.csv, .xlsx, .xls)
- Required columns: `site`, `address`, `city`, `state`, `zip`, `country`
- Optional columns: `description`, `aptSuite`
- Maximum file size: 10MB
- Maximum records: 5,000

**Request Example:**
```http
POST /api/v1/sites/import
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: [binary file data]
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
      "site": "Casagrand Boulevard",
      "error": "Site already exists"
    },
    {
      "row": 7,
      "site": "",
      "error": "Site name is required"
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

### 8. Export Sites

**Endpoint:** `GET /api/v1/sites/export`

**Description:** Export sites to CSV or Excel file.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `format` | string | No | "csv" | Export format: "csv" or "xlsx" |

**Request Example:**
```http
GET /api/v1/sites/export?format=xlsx
Authorization: Bearer <token>
Accept: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
```

**Response:**
- Content-Type: `text/csv` or `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Content-Disposition: `attachment; filename="sites_export_{date}.{extension}"`
- Body: File content

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Export endpoint not found"
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
| `DUPLICATE_ERROR` | 400 | Site name already exists |
| `BAD_REQUEST` | 400 | Invalid request (e.g., cannot delete site with locations/assets) |
| `INVALID_FILE_FORMAT` | 400 | Invalid file format for import |
| `FILE_TOO_LARGE` | 413 | File size exceeds maximum limit |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## Usage Examples

### Example 1: Create and update site

```javascript
// 1. Create site
const site = await createSite({
  site: "Casagrand Boulevard",
  description: "Wellness-themed residential project",
  address: "Chikkagubbi Road, Doddagubbi, Post, Sonam Layout, Visthar, Bengaluru, Karnataka 560077",
  city: "Bangalore",
  state: "Karnataka",
  zip: "560077",
  country: "India"
});

// 2. Update site
await updateSite(site.data.id, {
  site: "Casagrand Boulevard Updated",
  city: "Bangalore"
});
```

### Example 2: Search sites

```javascript
const sites = await getSites(1, 10, "Casagrand");
console.log(sites.data);
```

### Example 3: Import sites

```javascript
const file = fileInput.files[0];
const result = await importSites(file);
console.log(`Imported ${result.importedCount} of ${result.totalRows} sites`);
```

---

## Notes

1. **Site Name Uniqueness:**
   - Site names must be unique
   - Case-insensitive comparison (e.g., "Casagrand Boulevard" and "casagrand boulevard" are considered duplicates)

2. **Site Deletion:**
   - Sites with locations or assets cannot be deleted
   - Users must reassign or remove locations/assets before deleting a site
   - The `locationCount` and `assetCount` fields indicate how many locations/assets use the site

3. **Search Functionality:**
   - Search works on site name, address, and city
   - Search is case-insensitive
   - Partial matches are supported

4. **Pagination:**
   - Default page size is 10
   - Maximum page size is 100
   - Pagination metadata is included in all list responses

5. **Import/Export:**
   - Import supports CSV and Excel formats
   - Export supports CSV and Excel formats
   - Import template should include: `site` (required), `address` (required), `city` (required), `state` (required), `zip` (required), `country` (required), `description` (optional), `aptSuite` (optional)

6. **Location and Asset Counts:**
   - The `locationCount` field shows how many locations are currently assigned to this site
   - The `assetCount` field shows how many assets are currently assigned to this site
   - These are read-only fields calculated by the backend
   - Sites with locations or assets cannot be deleted

7. **Address Fields:**
   - `address` is the main street address
   - `aptSuite` is for apartment or suite numbers
   - Both are used together to form the complete address

8. **Geographic Information:**
   - `city`, `state`, `zip`, and `country` are required for proper site identification
   - These fields are used for filtering and reporting
   - ZIP/Postal code format varies by country

