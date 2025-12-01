# Assets Check-In API Documentation

## Overview
This document describes the backend API endpoints required for the Assets Check-In page (`/assets/checkin`). The check-in functionality allows tracking when assets are returned to the organization after being checked out or assigned.

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

### Asset Check-In Model
```typescript
interface AssetCheckIn {
  id: number;                    // Unique identifier
  assetId: number;               // Asset ID (required)
  assetTagId: string;            // Asset Tag ID (for reference)
  description: string;           // Asset description (for reference)
  checkinDate: string;           // ISO 8601 date - when asset was checked in
  checkedInBy: number;           // User ID who performed check-in
  notes?: string;                // Optional notes about check-in
  condition?: string;             // Asset condition: "Good", "Damaged", "Needs Repair"
  previousStatus?: string;        // Previous status before check-in
  newStatus: string;              // New status after check-in: "Available", "Broken", "Under Maintenance"
  assignedTo?: number;            // Person/Employee ID if previously assigned (null after check-in)
  leaseTo?: number;               // Customer ID if previously leased (null after check-in)
  site: string;                   // Site name
  location: string;                // Location within site
  createdAt: string;               // ISO 8601 timestamp
  updatedAt: string;               // ISO 8601 timestamp
}
```

### Asset Model (Extended for Check-In)
```typescript
interface Asset {
  id: number;                    // Unique identifier
  assetTagId: string;            // Asset Tag ID (required, unique)
  description: string;            // Asset description (required)
  status: string;                 // Current status: "Available", "Broken", "Checked Out", "Checked In", "Under Maintenance"
  assignedTo?: number;            // Person/Employee ID if assigned (null if available)
  assignedToName?: string;        // Person/Employee name (for display)
  leaseTo?: number;               // Customer ID if leased (null if not leased)
  leaseToName?: string;           // Customer name (for display)
  site: string;                   // Site name (required)
  location: string;               // Location within site (required)
  category: string;               // Asset category (required)
  department: string;             // Department (required)
  lastCheckoutDate?: string;      // ISO 8601 date - last checkout date
  lastCheckinDate?: string;       // ISO 8601 date - last check-in date
  createdAt: string;               // ISO 8601 timestamp
  updatedAt: string;               // ISO 8601 timestamp
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

### 1. Get Assets for Check-In

**Endpoint:** `GET /api/v1/assets/checkin/available`

**Description:** Retrieve a paginated list of assets that are available for check-in (currently checked out, assigned, or leased).

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 10 | Records per page (10, 25, 50, 100) |
| `search` | string | No | - | Search query string (searches assetTagId and description) |
| `searchField` | string | No | "all" | Field to search in: "all", "description", "assetTagId" |
| `status` | string | No | - | Filter by status: "Checked Out", "Assigned", "Leased" |
| `site` | string | No | - | Filter by site |
| `location` | string | No | - | Filter by location |
| `assignedTo` | number | No | - | Filter by assigned person/employee ID |
| `leaseTo` | number | No | - | Filter by customer ID (if leased) |
| `sortBy` | string | No | "lastCheckoutDate" | Sort field: "assetTagId", "description", "lastCheckoutDate", "assignedTo" |
| `sortOrder` | string | No | "desc" | Sort order: "asc", "desc" |

**Request Example:**
```http
GET /api/v1/assets/checkin/available?page=1&limit=10&search=laptop&status=Checked Out
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "assetTagId": "AST-001",
      "description": "Dell Laptop XPS 15",
      "status": "Checked Out",
      "assignedTo": 5,
      "assignedToName": "John Doe",
      "leaseTo": null,
      "leaseToName": null,
      "site": "Casagrand Boulev",
      "location": "Common Area",
      "category": "Asset",
      "department": "IT",
      "lastCheckoutDate": "2024-01-10",
      "lastCheckinDate": "2024-01-05",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-10T14:20:00Z"
    },
    {
      "id": 2,
      "assetTagId": "AST-002",
      "description": "HP Printer LaserJet",
      "status": "Leased",
      "assignedTo": null,
      "assignedToName": null,
      "leaseTo": 3,
      "leaseToName": "ABC Corporation",
      "site": "Casagrand Boulev",
      "location": "Office Area",
      "category": "Asset",
      "department": "Asset",
      "lastCheckoutDate": "2024-01-08",
      "lastCheckinDate": null,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-08T09:15:00Z"
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

### 2. Check-In Single Asset

**Endpoint:** `POST /api/v1/assets/checkin`

**Description:** Check in a single asset. Updates asset status and creates a check-in record.

**Request Body:**
```json
{
  "assetId": 1,                    // Required, asset ID
  "checkinDate": "2024-01-20",     // Optional, ISO 8601 date (defaults to current date)
  "condition": "Good",              // Optional: "Good", "Damaged", "Needs Repair"
  "newStatus": "Available",         // Optional: "Available", "Broken", "Under Maintenance" (defaults to "Available")
  "notes": "Returned in good condition"  // Optional, max 500 chars
}
```

**Request Example:**
```http
POST /api/v1/assets/checkin
Authorization: Bearer <token>
Content-Type: application/json

{
  "assetId": 1,
  "checkinDate": "2024-01-20",
  "condition": "Good",
  "newStatus": "Available",
  "notes": "Returned in good condition"
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "assetId": 1,
    "assetTagId": "AST-001",
    "description": "Dell Laptop XPS 15",
    "checkinDate": "2024-01-20",
    "checkedInBy": 1,
    "notes": "Returned in good condition",
    "condition": "Good",
    "previousStatus": "Checked Out",
    "newStatus": "Available",
    "assignedTo": null,
    "leaseTo": null,
    "site": "Casagrand Boulev",
    "location": "Common Area",
    "createdAt": "2024-01-20T10:30:00Z",
    "updatedAt": "2024-01-20T10:30:00Z"
  },
  "message": "Asset checked in successfully"
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
      "assetId": "Asset ID is required",
      "newStatus": "Invalid status. Must be one of: Available, Broken, Under Maintenance"
    }
  }
}

// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Asset with ID 1 not found"
  }
}

// 409 Conflict - Asset already checked in
{
  "error": {
    "code": "ALREADY_CHECKED_IN",
    "message": "Asset is already checked in and available"
  }
}

// 409 Conflict - Invalid status
{
  "error": {
    "code": "INVALID_STATUS",
    "message": "Asset cannot be checked in. Current status is 'Available'"
  }
}
```

---

### 3. Bulk Check-In Assets

**Endpoint:** `POST /api/v1/assets/checkin/bulk`

**Description:** Check in multiple assets at once. Updates asset statuses and creates check-in records for each asset.

**Request Body:**
```json
{
  "assetIds": [1, 2, 3, 4, 5],     // Required, array of asset IDs
  "checkinDate": "2024-01-20",     // Optional, ISO 8601 date (defaults to current date)
  "condition": "Good",              // Optional: "Good", "Damaged", "Needs Repair" (applies to all)
  "newStatus": "Available",         // Optional: "Available", "Broken", "Under Maintenance" (applies to all, defaults to "Available")
  "notes": "Bulk check-in"          // Optional, max 500 chars (applies to all)
}
```

**Request Example:**
```http
POST /api/v1/assets/checkin/bulk
Authorization: Bearer <token>
Content-Type: application/json

{
  "assetIds": [1, 2, 3],
  "checkinDate": "2024-01-20",
  "condition": "Good",
  "newStatus": "Available",
  "notes": "Bulk check-in - all returned in good condition"
}
```

**Response Example (200 OK):**
```json
{
  "message": "Bulk check-in completed",
  "totalCount": 3,
  "successCount": 3,
  "failedCount": 0,
  "data": [
    {
      "assetId": 1,
      "assetTagId": "AST-001",
      "status": "success",
      "checkInId": 101,
      "message": "Asset checked in successfully"
    },
    {
      "assetId": 2,
      "assetTagId": "AST-002",
      "status": "success",
      "checkInId": 102,
      "message": "Asset checked in successfully"
    },
    {
      "assetId": 3,
      "assetTagId": "AST-003",
      "status": "success",
      "checkInId": 103,
      "message": "Asset checked in successfully"
    }
  ]
}
```

**Response Example (Partial Success - 207 Multi-Status):**
```json
{
  "message": "Bulk check-in completed with some failures",
  "totalCount": 3,
  "successCount": 2,
  "failedCount": 1,
  "data": [
    {
      "assetId": 1,
      "assetTagId": "AST-001",
      "status": "success",
      "checkInId": 101,
      "message": "Asset checked in successfully"
    },
    {
      "assetId": 2,
      "assetTagId": "AST-002",
      "status": "failed",
      "error": "Asset is already checked in and available"
    },
    {
      "assetId": 3,
      "assetTagId": "AST-003",
      "status": "success",
      "checkInId": 103,
      "message": "Asset checked in successfully"
    }
  ]
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
      "assetIds": "Asset IDs array is required and must contain at least one ID"
    }
  }
}
```

---

### 4. Get Check-In History

**Endpoint:** `GET /api/v1/assets/checkin/history`

**Description:** Retrieve check-in history for assets with optional filtering.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 10 | Records per page (10, 25, 50, 100) |
| `assetId` | number | No | - | Filter by asset ID |
| `assetTagId` | string | No | - | Filter by asset Tag ID |
| `checkinDateFrom` | string | No | - | Filter check-ins from date (ISO 8601) |
| `checkinDateTo` | string | No | - | Filter check-ins to date (ISO 8601) |
| `checkedInBy` | number | No | - | Filter by user ID who performed check-in |
| `condition` | string | No | - | Filter by condition: "Good", "Damaged", "Needs Repair" |
| `newStatus` | string | No | - | Filter by new status after check-in |
| `sortBy` | string | No | "checkinDate" | Sort field: "checkinDate", "assetTagId", "checkedInBy" |
| `sortOrder` | string | No | "desc" | Sort order: "asc", "desc" |

**Request Example:**
```http
GET /api/v1/assets/checkin/history?page=1&limit=10&assetId=1&checkinDateFrom=2024-01-01
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": [
    {
      "id": 101,
      "assetId": 1,
      "assetTagId": "AST-001",
      "description": "Dell Laptop XPS 15",
      "checkinDate": "2024-01-20",
      "checkedInBy": 1,
      "checkedInByName": "Admin User",
      "notes": "Returned in good condition",
      "condition": "Good",
      "previousStatus": "Checked Out",
      "newStatus": "Available",
      "assignedTo": null,
      "leaseTo": null,
      "site": "Casagrand Boulev",
      "location": "Common Area",
      "createdAt": "2024-01-20T10:30:00Z",
      "updatedAt": "2024-01-20T10:30:00Z"
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

### 5. Get Single Check-In Record

**Endpoint:** `GET /api/v1/assets/checkin/:id`

**Description:** Retrieve a single check-in record by ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Check-in record ID |

**Request Example:**
```http
GET /api/v1/assets/checkin/101
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 101,
    "assetId": 1,
    "assetTagId": "AST-001",
    "description": "Dell Laptop XPS 15",
    "checkinDate": "2024-01-20",
    "checkedInBy": 1,
    "checkedInByName": "Admin User",
    "notes": "Returned in good condition",
    "condition": "Good",
    "previousStatus": "Checked Out",
    "newStatus": "Available",
    "assignedTo": null,
    "leaseTo": null,
    "site": "Casagrand Boulev",
    "location": "Common Area",
    "createdAt": "2024-01-20T10:30:00Z",
    "updatedAt": "2024-01-20T10:30:00Z"
  }
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Check-in record with ID 101 not found"
  }
}
```

---

### 6. Update Check-In Record

**Endpoint:** `PUT /api/v1/assets/checkin/:id`

**Description:** Update an existing check-in record (e.g., to correct notes or condition).

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Check-in record ID |

**Request Body:**
```json
{
  "notes": "Updated notes",        // Optional, max 500 chars
  "condition": "Damaged"            // Optional: "Good", "Damaged", "Needs Repair"
}
```

**Request Example:**
```http
PUT /api/v1/assets/checkin/101
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "Updated: Found minor scratches",
  "condition": "Damaged"
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 101,
    "assetId": 1,
    "assetTagId": "AST-001",
    "description": "Dell Laptop XPS 15",
    "checkinDate": "2024-01-20",
    "checkedInBy": 1,
    "notes": "Updated: Found minor scratches",
    "condition": "Damaged",
    "previousStatus": "Checked Out",
    "newStatus": "Available",
    "site": "Casagrand Boulev",
    "location": "Common Area",
    "createdAt": "2024-01-20T10:30:00Z",
    "updatedAt": "2024-01-20T11:45:00Z"
  },
  "message": "Check-in record updated successfully"
}
```

---

## Validation Rules

### Asset ID
- Required for check-in operations
- Must exist in the assets table
- Asset must be in a checkable state (Checked Out, Assigned, or Leased)

### Check-In Date
- Optional (defaults to current date if not provided)
- Valid ISO 8601 date format (YYYY-MM-DD)
- Cannot be a future date
- Cannot be before the last checkout date (if available)

### Condition
- Optional
- Must be one of: "Good", "Damaged", "Needs Repair"
- Case-sensitive

### New Status
- Optional (defaults to "Available" if not provided)
- Must be one of: "Available", "Broken", "Under Maintenance"
- Case-sensitive
- Cannot be "Checked Out", "Assigned", or "Leased" (these are checkout statuses)

### Notes
- Optional
- Maximum length: 500 characters
- Can contain letters, numbers, spaces, and common punctuation

---

## Business Rules

1. **Check-In Eligibility:**
   - Only assets with status "Checked Out", "Assigned", or "Leased" can be checked in
   - Assets with status "Available", "Broken", or "Under Maintenance" cannot be checked in

2. **Status Transitions:**
   - "Checked Out" → "Available" (default) or "Broken" or "Under Maintenance"
   - "Assigned" → "Available" (default) or "Broken" or "Under Maintenance"
   - "Leased" → "Available" (default) or "Broken" or "Under Maintenance"

3. **Assignment/Lease Clearing:**
   - When an asset is checked in, any existing assignment or lease is automatically cleared
   - `assignedTo` and `leaseTo` fields are set to null

4. **Date Validation:**
   - Check-in date cannot be before the last checkout date
   - Check-in date cannot be in the future

5. **Bulk Check-In:**
   - All assets in the bulk operation must be eligible for check-in
   - Partial success is allowed (some assets checked in, some failed)
   - Each asset is processed independently

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Authentication required or invalid token |
| `FORBIDDEN` | 403 | User doesn't have permission to perform action |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `ALREADY_CHECKED_IN` | 409 | Asset is already checked in and available |
| `INVALID_STATUS` | 409 | Asset cannot be checked in due to current status |
| `INVALID_DATE` | 400 | Check-in date is invalid (future date or before checkout date) |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## Database Schema

### asset_checkins Table
```sql
CREATE TABLE asset_checkins (
  id SERIAL PRIMARY KEY,
  asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  checkin_date DATE NOT NULL,
  checked_in_by INTEGER NOT NULL REFERENCES users(id),
  notes TEXT,
  condition VARCHAR(20) CHECK (condition IN ('Good', 'Damaged', 'Needs Repair')),
  previous_status VARCHAR(50) NOT NULL,
  new_status VARCHAR(50) NOT NULL CHECK (new_status IN ('Available', 'Broken', 'Under Maintenance')),
  site VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_asset_checkins_asset_id ON asset_checkins(asset_id);
CREATE INDEX idx_asset_checkins_checkin_date ON asset_checkins(checkin_date);
CREATE INDEX idx_asset_checkins_checked_in_by ON asset_checkins(checked_in_by);
CREATE INDEX idx_asset_checkins_new_status ON asset_checkins(new_status);
```

### Assets Table (Additional Fields)
```sql
-- Add these fields to the existing assets table if not present
ALTER TABLE assets ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Available';
ALTER TABLE assets ADD COLUMN IF NOT EXISTS assigned_to INTEGER REFERENCES persons_employees(id);
ALTER TABLE assets ADD COLUMN IF NOT EXISTS lease_to INTEGER REFERENCES customers(id);
ALTER TABLE assets ADD COLUMN IF NOT EXISTS last_checkout_date DATE;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS last_checkin_date DATE;

CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);
CREATE INDEX IF NOT EXISTS idx_assets_assigned_to ON assets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_assets_lease_to ON assets(lease_to);
```

---

## Frontend Integration Example

### Get Assets for Check-In
```typescript
const getAssetsForCheckIn = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  status?: string
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) {
    params.append("search", search);
  }

  if (status) {
    params.append("status", status);
  }

  const response = await fetch(`/api/v1/assets/checkin/available?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  return response.json();
};
```

### Check-In Single Asset
```typescript
const checkInAsset = async (
  assetId: number,
  checkinDate?: string,
  condition?: string,
  newStatus?: string,
  notes?: string
) => {
  const response = await fetch("/api/v1/assets/checkin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      assetId,
      checkinDate,
      condition,
      newStatus: newStatus || "Available",
      notes,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  return response.json();
};
```

### Bulk Check-In Assets
```typescript
const bulkCheckInAssets = async (
  assetIds: number[],
  checkinDate?: string,
  condition?: string,
  newStatus?: string,
  notes?: string
) => {
  const response = await fetch("/api/v1/assets/checkin/bulk", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      assetIds,
      checkinDate,
      condition,
      newStatus: newStatus || "Available",
      notes,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  return response.json();
};
```

### Get Check-In History
```typescript
const getCheckInHistory = async (
  page: number = 1,
  limit: number = 10,
  assetId?: number,
  checkinDateFrom?: string,
  checkinDateTo?: string
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (assetId) {
    params.append("assetId", assetId.toString());
  }

  if (checkinDateFrom) {
    params.append("checkinDateFrom", checkinDateFrom);
  }

  if (checkinDateTo) {
    params.append("checkinDateTo", checkinDateTo);
  }

  const response = await fetch(`/api/v1/assets/checkin/history?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
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

### Example cURL Commands

**Get Assets for Check-In:**
```bash
curl -X GET "https://api.example.com/api/v1/assets/checkin/available?page=1&limit=10&status=Checked Out" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Check-In Single Asset:**
```bash
curl -X POST "https://api.example.com/api/v1/assets/checkin" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "assetId": 1,
    "checkinDate": "2024-01-20",
    "condition": "Good",
    "newStatus": "Available",
    "notes": "Returned in good condition"
  }'
```

**Bulk Check-In Assets:**
```bash
curl -X POST "https://api.example.com/api/v1/assets/checkin/bulk" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "assetIds": [1, 2, 3],
    "checkinDate": "2024-01-20",
    "condition": "Good",
    "newStatus": "Available",
    "notes": "Bulk check-in"
  }'
```

**Get Check-In History:**
```bash
curl -X GET "https://api.example.com/api/v1/assets/checkin/history?page=1&limit=10&assetId=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Notes

1. **Status Management:** The check-in process automatically updates the asset status and clears any assignments or leases.

2. **Audit Trail:** All check-in operations are logged in the `asset_checkins` table for audit purposes.

3. **Date Handling:** Check-in dates are stored in ISO 8601 format (YYYY-MM-DD). The system validates that check-in dates are not in the future and not before checkout dates.

4. **Bulk Operations:** Bulk check-in operations process each asset independently, allowing partial success. Failed assets are reported in the response.

5. **Condition Tracking:** The condition field helps track asset state at check-in, which is useful for maintenance scheduling and asset lifecycle management.

6. **Integration with Check-Out:** Check-in operations should integrate with the check-out system to maintain accurate asset status and assignment tracking.

7. **Notifications:** Consider implementing notifications when assets are checked in, especially for leased assets or assets assigned to employees.

8. **Reporting:** Check-in history can be used for generating reports on asset utilization, return rates, and condition tracking.

---

## Version History

- **v1.0.0** (2024-01-20): Initial API documentation for asset check-in functionality

