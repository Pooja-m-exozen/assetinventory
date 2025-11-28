# Locations API Documentation

## Overview
This document describes the backend API endpoints required for the Locations management page (`/setup/locations`).

## Base URL
```
/api/v1/locations
```

## Authentication
All endpoints require authentication via Bearer token:
```
Authorization: Bearer <token>
```

---

## Data Models

### Location Model
```typescript
interface Location {
  id: number | string;              // Unique identifier
  location: string;                  // Location name (required, min 2 chars, max 255 chars)
  siteId: number | string;           // Site ID (required)
  siteName?: string;                  // Site name (read-only, populated from siteId)
  description?: string;               // Location description (optional, max 1000 chars)
  assetCount?: number;                // Number of assets in this location (read-only)
  createdAt?: string;                 // ISO 8601 timestamp
  updatedAt?: string;                 // ISO 8601 timestamp
  createdBy?: number | string;        // User ID who created the record
  updatedBy?: number | string;       // User ID who last updated the record
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

### 1. Get Locations List

**Endpoint:** `GET /api/v1/locations`

**Description:** Retrieve a paginated list of locations with optional search and site filter.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 10 | Records per page (10, 25, 50, 100) |
| `search` | string | No | - | Search query string (searches in location name) |
| `siteId` | number/string | No | - | Filter locations by site ID |

**Request Example:**
```http
GET /api/v1/locations?page=1&limit=10&search=Car&siteId=1
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
      "siteName": "Casagrand Boulevard",
      "description": "Car washing area",
      "assetCount": 5,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "createdBy": 1,
      "updatedBy": 1
    },
    {
      "id": 2,
      "location": "Common Area",
      "siteId": 1,
      "siteName": "Casagrand Boulevard",
      "description": "Common area for residents",
      "assetCount": 12,
      "createdAt": "2024-01-15T10:35:00Z",
      "updatedAt": "2024-01-15T10:35:00Z",
      "createdBy": 1,
      "updatedBy": 1
    }
  ],
  "pagination": {
    "currentPage": 1,
    "recordsPerPage": 10,
    "totalRecords": 2,
    "totalPages": 1,
    "startRecord": 1,
    "endRecord": 2
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
    "message": "An error occurred while fetching locations"
  }
}
```

---

### 2. Get Single Location

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
    "siteName": "Casagrand Boulevard",
    "description": "Car washing area",
    "assetCount": 5,
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
    "message": "Location with ID 1 not found"
  }
}
```

---

### 3. Create Location

**Endpoint:** `POST /api/v1/locations`

**Description:** Create a new location.

**Request Body:**
```json
{
  "location": "Car washer",        // Required, min 2 chars, max 255 chars
  "siteId": 1,                      // Required, must be a valid site ID
  "description": "Car washing area" // Optional, max 1000 chars
}
```

**Request Example:**
```http
POST /api/v1/locations
Authorization: Bearer <token>
Content-Type: application/json

{
  "location": "Car washer",
  "siteId": 1,
  "description": "Car washing area"
}
```

**Response Example (201 Created):**
```json
{
  "data": {
    "id": 1,
    "location": "Car washer",
    "siteId": 1,
    "siteName": "Casagrand Boulevard",
    "description": "Car washing area",
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
      "location": "Location name is required",
      "siteId": "Site ID is required"
    }
  }
}

// 404 Not Found - Invalid Site ID
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Site with ID 1 not found"
  }
}
```

---

### 4. Update Location

**Endpoint:** `PUT /api/v1/locations/:id`

**Description:** Update an existing location.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Location ID |

**Request Body:**
```json
{
  "location": "Car washer Updated",  // Optional, min 2 chars, max 255 chars
  "siteId": 2,                         // Optional, must be a valid site ID
  "description": "Updated description" // Optional, max 1000 chars
}
```

**Request Example:**
```http
PUT /api/v1/locations/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "location": "Car washer Updated",
  "description": "Updated car washing area"
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "location": "Car washer Updated",
    "siteId": 1,
    "siteName": "Casagrand Boulevard",
    "description": "Updated car washing area",
    "assetCount": 5,
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
    "message": "Location with ID 1 not found"
  }
}

// 400 Bad Request - Validation Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "location": "Location name must be at least 2 characters"
    }
  }
}
```

---

### 5. Delete Location

**Endpoint:** `DELETE /api/v1/locations/:id`

**Description:** Delete a location by ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Location ID |

**Request Example:**
```http
DELETE /api/v1/locations/1
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "message": "Location deleted successfully"
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Location with ID 1 not found"
  }
}

// 400 Bad Request - Location has assets
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Cannot delete location with assets. Please reassign or remove assets first."
  }
}
```

---

### 6. Bulk Delete Locations

**Endpoint:** `POST /api/v1/locations/bulk-delete`

**Description:** Delete multiple locations by their IDs.

**Request Body:**
```json
{
  "ids": [1, 2, 3]  // Array of location IDs
}
```

**Request Example:**
```http
POST /api/v1/locations/bulk-delete
Authorization: Bearer <token>
Content-Type: application/json

{
  "ids": [1, 2, 3]
}
```

**Response Example (200 OK):**
```json
{
  "message": "Locations deleted successfully",
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
      "ids": "At least one location ID is required"
    }
  }
}
```

---

### 7. Import Locations

**Endpoint:** `POST /api/v1/locations/import`

**Description:** Import locations from CSV or Excel file.

**Request Body:** `multipart/form-data`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | Yes | CSV or Excel file (.csv, .xlsx, .xls) containing locations to import |

**File Format:**
- CSV or Excel (.csv, .xlsx, .xls)
- Required columns: `location`, `siteId`
- Optional columns: `description`
- Maximum file size: 10MB
- Maximum records: 5,000

**Request Example:**
```http
POST /api/v1/locations/import
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
      "location": "Car washer",
      "error": "Location already exists for this site"
    },
    {
      "row": 7,
      "location": "",
      "error": "Location name is required"
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

### 8. Export Locations

**Endpoint:** `GET /api/v1/locations/export`

**Description:** Export locations to CSV or Excel file.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `format` | string | No | "csv" | Export format: "csv" or "xlsx" |
| `siteId` | number/string | No | - | Filter locations by site ID for export |

**Request Example:**
```http
GET /api/v1/locations/export?format=xlsx&siteId=1
Authorization: Bearer <token>
Accept: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
```

**Response:**
- Content-Type: `text/csv` or `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Content-Disposition: `attachment; filename="locations_export_{date}.{extension}"`
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
| `BAD_REQUEST` | 400 | Invalid request (e.g., cannot delete location with assets) |
| `INVALID_FILE_FORMAT` | 400 | Invalid file format for import |
| `FILE_TOO_LARGE` | 413 | File size exceeds maximum limit |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## Usage Examples

### Example 1: Create and update location

```javascript
// 1. Create location
const location = await createLocation({
  location: "Car washer",
  siteId: 1,
  description: "Car washing area"
});

// 2. Update location
await updateLocation(location.data.id, {
  location: "Car washer Updated",
  description: "Updated car washing area"
});
```

### Example 2: Search locations by site

```javascript
const locations = await getLocations(1, 10, "", 1);
console.log(locations.data);
```

### Example 3: Import locations

```javascript
const file = fileInput.files[0];
const result = await importLocations(file);
console.log(`Imported ${result.importedCount} of ${result.totalRows} locations`);
```

---

## Notes

1. **Location Name:**
   - Location names must be at least 2 characters and maximum 255 characters
   - Location names can be duplicated across different sites
   - Location names are case-sensitive

2. **Site Relationship:**
   - Every location must belong to a site
   - The `siteId` must reference an existing site
   - The `siteName` field is read-only and populated from the site

3. **Location Deletion:**
   - Locations with assets cannot be deleted
   - Users must reassign or remove assets before deleting a location
   - The `assetCount` field indicates how many assets use the location

4. **Search Functionality:**
   - Search works on location name
   - Search is case-insensitive
   - Partial matches are supported

5. **Pagination:**
   - Default page size is 10
   - Maximum page size is 100
   - Pagination metadata is included in all list responses

6. **Import/Export:**
   - Import supports CSV and Excel formats
   - Export supports CSV and Excel formats
   - Import template should include: `location` (required), `siteId` (required), `description` (optional)

7. **Asset Count:**
   - The `assetCount` field shows how many assets are currently assigned to this location
   - This is a read-only field calculated by the backend
   - Locations with assets cannot be deleted

8. **Site Filtering:**
   - Locations can be filtered by `siteId` in the list endpoint
   - This allows users to view locations for a specific site
   - The filter is optional - omitting it returns all locations

