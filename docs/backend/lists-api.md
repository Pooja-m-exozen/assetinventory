# Lists API Documentation

## Overview
This document describes the backend API endpoints required for the Lists pages (`/lists/*`). The API manages lists of assets, warranties, and maintenances with pagination, sorting, filtering, search, export, and import functionality.

## Base URL
```
/api/v1/lists
```

## Authentication
All endpoints require authentication via Bearer token:
```
Authorization: Bearer <token>
```

---

## Data Models

### ListAsset Model
```typescript
interface ListAsset {
  id: string;                        // Unique asset identifier
  assetTagId: string;                 // Asset tag ID (e.g., "EXO/2025/CGB-WTP-01")
  description: string;               // Asset description
  brand?: string;                     // Brand name
  purchaseDate?: string;              // Purchase date (MM/dd/yyyy format)
  status: "Available" | "Broken" | "Checked-out" | "Sold" | "Disposed" | string;
  serialNo?: string;                  // Serial number
  capacity?: string;                  // Capacity (e.g., "6LPH", "3.7HP")
  imageUrl?: string;                  // Asset image URL
  imageType?: string;                 // Image type identifier
  [key: string]: any;                 // Additional custom fields
}
```

### ListWarranty Model
```typescript
interface ListWarranty {
  id: string;                         // Unique warranty identifier
  active: boolean;                     // Whether warranty is active
  assetTagId: string;                  // Asset tag ID
  description: string;                 // Asset description
  lengthMonths: number;                // Warranty length in months
  expires: string;                     // Expiration date (MM/dd/yyyy format)
  notes?: string;                      // Warranty notes
  assetId?: string;                    // Asset ID reference
  createdAt?: string;                  // ISO 8601 timestamp
  updatedAt?: string;                  // ISO 8601 timestamp
  createdBy?: number | string;        // User ID who created
  updatedBy?: number | string;        // User ID who last updated
}
```

### ListMaintenance Model
```typescript
interface ListMaintenance {
  id: string;                          // Unique maintenance identifier
  status: "Scheduled" | "In progress" | "On Hold" | "Cancelled" | "Completed";
  expires: string;                     // Due date (MM/dd/yyyy format)
  assetTagId: string;                  // Asset tag ID
  description: string;                 // Asset description
  title: string;                       // Maintenance title
  maintenanceDetail: string;           // Maintenance details
  maintenanceBy?: string;              // Person doing maintenance
  dateCompleted?: string;              // Completion date (MM/dd/yyyy format)
  maintenanceCost?: number | string;   // Maintenance cost
  repeating?: boolean;                 // Whether maintenance repeats
  frequency?: "Daily" | "Weekly" | "Monthly" | string;
  recurOnEvery?: string;               // Recurrence pattern (e.g., "week on Monday")
  assetId?: string;                    // Asset ID reference
  createdAt?: string;                   // ISO 8601 timestamp
  updatedAt?: string;                   // ISO 8601 timestamp
  createdBy?: number | string;         // User ID who created
  updatedBy?: number | string;         // User ID who last updated
}
```

### PaginatedResponse Model
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

## Assets List API Endpoints

### 1. Get Assets List

**Endpoint:** `GET /api/v1/lists/assets`

**Description:** Retrieve a paginated list of assets with optional sorting, search, and filtering.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 10 | Records per page (10, 25, 50, 100) |
| `sortBy` | string | No | - | Field to sort by (e.g., "purchaseDate", "assetTagId", "description") |
| `sortOrder` | string | No | "asc" | Sort order: "asc" or "desc" |
| `search` | string | No | - | Search query (searches in assetTagId, description, brand, serialNo) |
| `status` | string | No | - | Filter by status: "Available", "Broken", "Checked-out", "Sold", "Disposed" |

**Request Example:**
```http
GET /api/v1/lists/assets?page=1&limit=10&sortBy=purchaseDate&sortOrder=asc&status=Available
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": [
    {
      "id": "1",
      "assetTagId": "EXO/2025/CGB-WTP-01",
      "description": "Water Treatment Plant 200 KLD",
      "brand": "Kirloskar",
      "purchaseDate": "11/19/2025",
      "status": "Available",
      "serialNo": "NA",
      "capacity": "",
      "imageUrl": "https://example.com/image.jpg",
      "imageType": "grid"
    },
    {
      "id": "2",
      "assetTagId": "EXO/2025/CGB-WTP-D01",
      "description": "Dosing-1",
      "brand": "",
      "purchaseDate": "11/19/2025",
      "status": "Broken",
      "serialNo": "241114ED1022",
      "capacity": "6LPH",
      "imageUrl": "https://example.com/image2.jpg",
      "imageType": "pump"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "recordsPerPage": 10,
    "totalRecords": 5,
    "totalPages": 1,
    "startRecord": 1,
    "endRecord": 5
  }
}
```

---

### 2. Export Assets List

**Endpoint:** `GET /api/v1/lists/assets/export`

**Description:** Export assets list to CSV or Excel format.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `format` | string | No | "csv" | Export format: "csv" or "xlsx" |
| `sortBy` | string | No | - | Field to sort by |
| `sortOrder` | string | No | "asc" | Sort order: "asc" or "desc" |
| `search` | string | No | - | Search query |
| `status` | string | No | - | Filter by status |

**Request Example:**
```http
GET /api/v1/lists/assets/export?format=csv&sortBy=purchaseDate&sortOrder=asc
Authorization: Bearer <token>
```

**Response Example (200 OK):**
- Content-Type: `text/csv` or `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Body: CSV or Excel file content

---

## Warranties List API Endpoints

### 1. Get Warranties List

**Endpoint:** `GET /api/v1/lists/warranties`

**Description:** Retrieve a paginated list of warranties with optional sorting, filtering, and search.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 10 | Records per page (10, 25, 50, 100) |
| `sortBy` | string | No | "expires" | Field to sort by (e.g., "expires", "assetTagId", "description", "lengthMonths") |
| `sortOrder` | string | No | "asc" | Sort order: "asc" or "desc" |
| `filter` | string | No | "all" | Filter: "all", "active", or "expired" |
| `search` | string | No | - | Search query (searches in assetTagId, description) |

**Request Example:**
```http
GET /api/v1/lists/warranties?page=1&limit=10&sortBy=expires&sortOrder=asc&filter=active
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": [
    {
      "id": "1",
      "active": false,
      "assetTagId": "EXO/2025/CGB-WTP-01",
      "description": "Water Treatment Plant 200 KLD",
      "lengthMonths": 6,
      "expires": "11/19/2025",
      "notes": "",
      "assetId": "1",
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

---

### 2. Get Warranty by ID

**Endpoint:** `GET /api/v1/lists/warranties/:id`

**Description:** Retrieve a specific warranty by ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Warranty ID |

**Request Example:**
```http
GET /api/v1/lists/warranties/1
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": "1",
    "active": false,
    "assetTagId": "EXO/2025/CGB-WTP-01",
    "description": "Water Treatment Plant 200 KLD",
    "lengthMonths": 6,
    "expires": "11/19/2025",
    "notes": "",
    "assetId": "1",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "createdBy": 1,
    "updatedBy": 1
  }
}
```

---

### 3. Create Warranty

**Endpoint:** `POST /api/v1/lists/warranties`

**Description:** Create a new warranty for an asset.

**Request Body:**
```json
{
  "assetId": "1",                      // Required, asset ID
  "lengthMonths": 6,                   // Optional, warranty length in months
  "expirationDate": "2025-11-19",     // Required, expiration date (YYYY-MM-DD)
  "notes": "Renew warranty if equipment in good condition."  // Optional
}
```

**Request Example:**
```http
POST /api/v1/lists/warranties
Authorization: Bearer <token>
Content-Type: application/json

{
  "assetId": "1",
  "lengthMonths": 6,
  "expirationDate": "2025-11-19",
  "notes": "Renew warranty if equipment in good condition."
}
```

**Response Example (201 Created):**
```json
{
  "data": {
    "id": "1",
    "active": true,
    "assetTagId": "EXO/2025/CGB-WTP-01",
    "description": "Water Treatment Plant 200 KLD",
    "lengthMonths": 6,
    "expires": "11/19/2025",
    "notes": "Renew warranty if equipment in good condition.",
    "assetId": "1",
    "createdAt": "2024-01-20T11:00:00Z",
    "updatedAt": "2024-01-20T11:00:00Z",
    "createdBy": 1,
    "updatedBy": 1
  }
}
```

---

### 4. Update Warranty

**Endpoint:** `PUT /api/v1/lists/warranties/:id`

**Description:** Update an existing warranty.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Warranty ID |

**Request Body:**
```json
{
  "lengthMonths": 12,                  // Optional
  "expirationDate": "2026-11-19",     // Optional
  "notes": "Updated notes",            // Optional
  "active": true                       // Optional
}
```

**Request Example:**
```http
PUT /api/v1/lists/warranties/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "lengthMonths": 12,
  "expirationDate": "2026-11-19",
  "notes": "Updated notes",
  "active": true
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": "1",
    "active": true,
    "assetTagId": "EXO/2025/CGB-WTP-01",
    "description": "Water Treatment Plant 200 KLD",
    "lengthMonths": 12,
    "expires": "11/19/2026",
    "notes": "Updated notes",
    "assetId": "1",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T11:00:00Z",
    "createdBy": 1,
    "updatedBy": 1
  }
}
```

---

### 5. Delete Warranty

**Endpoint:** `DELETE /api/v1/lists/warranties/:id`

**Description:** Delete a warranty.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Warranty ID |

**Request Example:**
```http
DELETE /api/v1/lists/warranties/1
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "message": "Warranty deleted successfully"
}
```

---

### 6. Export Warranties List

**Endpoint:** `GET /api/v1/lists/warranties/export`

**Description:** Export warranties list to CSV or Excel format.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `format` | string | No | "csv" | Export format: "csv" or "xlsx" |
| `sortBy` | string | No | - | Field to sort by |
| `sortOrder` | string | No | "asc" | Sort order: "asc" or "desc" |
| `filter` | string | No | "all" | Filter: "all", "active", or "expired" |
| `search` | string | No | - | Search query |

**Request Example:**
```http
GET /api/v1/lists/warranties/export?format=csv&filter=active
Authorization: Bearer <token>
```

**Response Example (200 OK):**
- Content-Type: `text/csv` or `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Body: CSV or Excel file content

---

### 7. Import Warranties

**Endpoint:** `POST /api/v1/lists/warranties/import`

**Description:** Import warranties from a CSV or Excel file.

**Request Body:**
- Content-Type: `multipart/form-data`
- Field: `file` (CSV or Excel file)

**Request Example:**
```http
POST /api/v1/lists/warranties/import
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: [CSV or Excel file]
```

**Response Example (200 OK):**
```json
{
  "message": "Import completed successfully",
  "totalRows": 10,
  "importedCount": 8,
  "failedCount": 2,
  "errors": [
    {
      "row": 3,
      "assetTagId": "EXO/2025/CGB-WTP-03",
      "error": "Asset not found"
    },
    {
      "row": 7,
      "expirationDate": "invalid-date",
      "error": "Invalid date format"
    }
  ]
}
```

**CSV/Excel File Format:**
- Required columns: `assetTagId` (or `assetId`), `expirationDate`
- Optional columns: `lengthMonths`, `notes`
- Date format: `YYYY-MM-DD` or `MM/dd/yyyy`

---

## Maintenances List API Endpoints

### 1. Get Maintenances List

**Endpoint:** `GET /api/v1/lists/maintenances`

**Description:** Retrieve a paginated list of maintenances with optional sorting, filtering, and search.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 10 | Records per page (10, 25, 50, 100) |
| `sortBy` | string | No | "expires" | Field to sort by (e.g., "expires", "status", "assetTagId", "title") |
| `sortOrder` | string | No | "asc" | Sort order: "asc" or "desc" |
| `filter` | string | No | "all" | Filter: "all", "scheduled", "completed", or "cancelled" |
| `search` | string | No | - | Search query (searches in assetTagId, description, title) |

**Request Example:**
```http
GET /api/v1/lists/maintenances?page=1&limit=10&sortBy=expires&sortOrder=asc&filter=scheduled
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": [
    {
      "id": "1",
      "status": "Scheduled",
      "expires": "11/20/2025",
      "assetTagId": "EXO/2025/CGB-WTP-01",
      "description": "Water Treatment Plant 200 KLD",
      "title": "Testing",
      "maintenanceDetail": "Testing",
      "maintenanceBy": "Pooja",
      "dateCompleted": null,
      "maintenanceCost": null,
      "repeating": true,
      "frequency": "Weekly",
      "recurOnEvery": "week on Monday",
      "assetId": "1",
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

---

### 2. Get Maintenance by ID

**Endpoint:** `GET /api/v1/lists/maintenances/:id`

**Description:** Retrieve a specific maintenance by ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Maintenance ID |

**Request Example:**
```http
GET /api/v1/lists/maintenances/1
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": "1",
    "status": "Scheduled",
    "expires": "11/20/2025",
    "assetTagId": "EXO/2025/CGB-WTP-01",
    "description": "Water Treatment Plant 200 KLD",
    "title": "Testing",
    "maintenanceDetail": "Testing",
    "maintenanceBy": "Pooja",
    "dateCompleted": null,
    "maintenanceCost": null,
    "repeating": true,
    "frequency": "Weekly",
    "recurOnEvery": "week on Monday",
    "assetId": "1",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "createdBy": 1,
    "updatedBy": 1
  }
}
```

---

### 3. Create Maintenance

**Endpoint:** `POST /api/v1/lists/maintenances`

**Description:** Create a new maintenance for an asset.

**Request Body:**
```json
{
  "assetId": "1",                      // Required, asset ID
  "title": "Monthly Calibration",      // Required
  "details": "Calibrate to 120 units", // Optional
  "dueDate": "2025-11-20",            // Optional (YYYY-MM-DD)
  "maintenanceBy": "John Doe",        // Optional
  "maintenanceStatus": "Scheduled",   // Optional, default: "Scheduled"
  "dateCompleted": null,              // Optional
  "maintenanceCost": "1000.00",       // Optional
  "repeating": true,                  // Optional, default: false
  "frequency": "Weekly",              // Optional, required if repeating: true
  "recurOnEvery": "week on Monday"    // Optional
}
```

**Request Example:**
```http
POST /api/v1/lists/maintenances
Authorization: Bearer <token>
Content-Type: application/json

{
  "assetId": "1",
  "title": "Monthly Calibration",
  "details": "Calibrate to 120 units",
  "dueDate": "2025-11-20",
  "maintenanceBy": "John Doe",
  "maintenanceStatus": "Scheduled",
  "repeating": true,
  "frequency": "Weekly",
  "recurOnEvery": "week on Monday"
}
```

**Response Example (201 Created):**
```json
{
  "data": {
    "id": "1",
    "status": "Scheduled",
    "expires": "11/20/2025",
    "assetTagId": "EXO/2025/CGB-WTP-01",
    "description": "Water Treatment Plant 200 KLD",
    "title": "Monthly Calibration",
    "maintenanceDetail": "Calibrate to 120 units",
    "maintenanceBy": "John Doe",
    "dateCompleted": null,
    "maintenanceCost": null,
    "repeating": true,
    "frequency": "Weekly",
    "recurOnEvery": "week on Monday",
    "assetId": "1",
    "createdAt": "2024-01-20T11:00:00Z",
    "updatedAt": "2024-01-20T11:00:00Z",
    "createdBy": 1,
    "updatedBy": 1
  }
}
```

---

### 4. Update Maintenance

**Endpoint:** `PUT /api/v1/lists/maintenances/:id`

**Description:** Update an existing maintenance.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Maintenance ID |

**Request Body:**
```json
{
  "title": "Updated Title",            // Optional
  "details": "Updated details",       // Optional
  "dueDate": "2025-12-20",            // Optional
  "maintenanceBy": "Jane Doe",        // Optional
  "maintenanceStatus": "Completed",   // Optional
  "dateCompleted": "2025-11-20",      // Optional
  "maintenanceCost": "1500.00",       // Optional
  "repeating": false,                 // Optional
  "frequency": "Monthly",             // Optional
  "recurOnEvery": "month on 1st"      // Optional
}
```

**Request Example:**
```http
PUT /api/v1/lists/maintenances/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "details": "Updated details",
  "maintenanceStatus": "Completed",
  "dateCompleted": "2025-11-20",
  "maintenanceCost": "1500.00"
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": "1",
    "status": "Completed",
    "expires": "11/20/2025",
    "assetTagId": "EXO/2025/CGB-WTP-01",
    "description": "Water Treatment Plant 200 KLD",
    "title": "Updated Title",
    "maintenanceDetail": "Updated details",
    "maintenanceBy": "Jane Doe",
    "dateCompleted": "11/20/2025",
    "maintenanceCost": "1500.00",
    "repeating": false,
    "frequency": null,
    "recurOnEvery": null,
    "assetId": "1",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T11:00:00Z",
    "createdBy": 1,
    "updatedBy": 1
  }
}
```

---

### 5. Delete Maintenance

**Endpoint:** `DELETE /api/v1/lists/maintenances/:id`

**Description:** Delete a maintenance.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Maintenance ID |

**Request Example:**
```http
DELETE /api/v1/lists/maintenances/1
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "message": "Maintenance deleted successfully"
}
```

---

### 6. Export Maintenances List

**Endpoint:** `GET /api/v1/lists/maintenances/export`

**Description:** Export maintenances list to CSV or Excel format.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `format` | string | No | "csv" | Export format: "csv" or "xlsx" |
| `sortBy` | string | No | - | Field to sort by |
| `sortOrder` | string | No | "asc" | Sort order: "asc" or "desc" |
| `filter` | string | No | "all" | Filter: "all", "scheduled", "completed", or "cancelled" |
| `search` | string | No | - | Search query |

**Request Example:**
```http
GET /api/v1/lists/maintenances/export?format=csv&filter=scheduled
Authorization: Bearer <token>
```

**Response Example (200 OK):**
- Content-Type: `text/csv` or `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Body: CSV or Excel file content

---

### 7. Import Maintenances

**Endpoint:** `POST /api/v1/lists/maintenances/import`

**Description:** Import maintenances from a CSV or Excel file.

**Request Body:**
- Content-Type: `multipart/form-data`
- Field: `file` (CSV or Excel file)

**Request Example:**
```http
POST /api/v1/lists/maintenances/import
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: [CSV or Excel file]
```

**Response Example (200 OK):**
```json
{
  "message": "Import completed successfully",
  "totalRows": 10,
  "importedCount": 8,
  "failedCount": 2,
  "errors": [
    {
      "row": 3,
      "assetTagId": "EXO/2025/CGB-WTP-03",
      "error": "Asset not found"
    },
    {
      "row": 7,
      "title": "",
      "error": "Title is required"
    }
  ]
}
```

**CSV/Excel File Format:**
- Required columns: `assetTagId` (or `assetId`), `title`
- Optional columns: `details`, `dueDate`, `maintenanceBy`, `maintenanceStatus`, `dateCompleted`, `maintenanceCost`, `repeating`, `frequency`, `recurOnEvery`
- Date format: `YYYY-MM-DD` or `MM/dd/yyyy`

---

## Validation Rules

### Assets List
- `page`: Must be a positive integer
- `limit`: Must be one of: 10, 25, 50, 100
- `sortBy`: Must be a valid asset field
- `sortOrder`: Must be "asc" or "desc"
- `status`: Must be a valid status value

### Warranties
- `assetId`: Required when creating, must reference an existing asset
- `expirationDate`: Required when creating, must be a valid date (YYYY-MM-DD)
- `lengthMonths`: Optional, must be a positive integer if provided
- `active`: Boolean value

### Maintenances
- `assetId`: Required when creating, must reference an existing asset
- `title`: Required when creating, maximum 255 characters
- `dueDate`: Optional, must be a valid date (YYYY-MM-DD) if provided
- `maintenanceStatus`: Must be one of: "Scheduled", "In progress", "On Hold", "Cancelled", "Completed"
- `dateCompleted`: Optional, must be a valid date (YYYY-MM-DD) if provided
- `maintenanceCost`: Optional, must be a valid number if provided
- `repeating`: Boolean value
- `frequency`: Required if `repeating` is true, must be one of: "Daily", "Weekly", "Monthly"

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Authentication required or invalid token |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `ASSET_NOT_FOUND` | 400 | Referenced asset does not exist |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## Usage Examples

### Example 1: Get assets list with pagination and sorting

```javascript
const response = await getAssetsList(1, 10, "purchaseDate", "asc", "", "Available");
console.log(response.data);
console.log(response.pagination);
```

### Example 2: Create and update warranty

```javascript
// Create warranty
const warranty = await createWarranty({
  assetId: "1",
  lengthMonths: 6,
  expirationDate: "2025-11-19",
  notes: "Renew if in good condition"
});

// Update warranty
await updateWarranty(warranty.data.id, {
  lengthMonths: 12,
  expirationDate: "2026-11-19"
});
```

### Example 3: Create and update maintenance

```javascript
// Create maintenance
const maintenance = await createMaintenance({
  assetId: "1",
  title: "Monthly Calibration",
  details: "Calibrate to 120 units",
  dueDate: "2025-11-20",
  maintenanceBy: "John Doe",
  repeating: true,
  frequency: "Weekly",
  recurOnEvery: "week on Monday"
});

// Update maintenance status
await updateMaintenance(maintenance.data.id, {
  maintenanceStatus: "Completed",
  dateCompleted: "2025-11-20",
  maintenanceCost: "1500.00"
});
```

### Example 4: Export and import

```javascript
// Export warranties
const blob = await exportWarrantiesList("csv", "expires", "asc", "active");
const url = URL.createObjectURL(blob);
const link = document.createElement("a");
link.href = url;
link.download = "warranties.csv";
link.click();

// Import warranties
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];
const result = await importWarranties(file);
console.log(`Imported: ${result.importedCount}, Failed: ${result.failedCount}`);
```

---

## Notes

1. **Date Formats:**
   - API accepts dates in `YYYY-MM-DD` format
   - API returns dates in `MM/dd/yyyy` format for display
   - Frontend should convert between formats as needed

2. **Pagination:**
   - Page numbers start at 1
   - `startRecord` and `endRecord` are calculated by backend
   - `totalPages` is calculated as `Math.ceil(totalRecords / recordsPerPage)`

3. **Sorting:**
   - Default sort column varies by list type
   - Multiple sort columns not supported (single column only)
   - Sort order can be "asc" or "desc"

4. **Search:**
   - Search is case-insensitive
   - Searches across multiple relevant fields
   - Search is combined with filters (AND logic)

5. **Filtering:**
   - Filters are applied in addition to search
   - Multiple filters not supported (single filter value)
   - Filter values are predefined

6. **Export:**
   - Export includes all records matching current filters/search
   - Export respects current sort order
   - CSV format is recommended for compatibility
   - Excel format (.xlsx) requires proper MIME type handling

7. **Import:**
   - Import validates all rows before processing
   - Partial imports are supported (some rows may fail)
   - Error details include row number and specific error message
   - Import file must match expected column format

8. **Asset References:**
   - Warranties and maintenances reference assets by `assetId`
   - Asset `assetTagId` is included in responses for display
   - Asset must exist before creating warranty/maintenance

9. **Repeating Maintenances:**
   - When `repeating` is true, `frequency` is required
   - Backend should create recurring maintenance records
   - `recurOnEvery` provides additional recurrence details

10. **Status Management:**
    - Warranty `active` status is calculated based on expiration date
    - Maintenance status can be manually updated
    - Status changes may trigger notifications or workflows

