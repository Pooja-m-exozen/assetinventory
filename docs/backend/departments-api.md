# Departments API Documentation

## Overview
This document describes the backend API endpoints required for the Departments management page (`/setup/departments`).

## Base URL
```
/api/v1/departments
```

## Authentication
All endpoints require authentication via Bearer token:
```
Authorization: Bearer <token>
```

---

## Data Models

### Department Model
```typescript
interface Department {
  id: number | string;              // Unique identifier
  department: string;                // Department name (required, min 2 chars, max 255 chars, unique)
  description?: string;              // Department description (optional, max 500 chars)
  employeeCount?: number;             // Number of employees in this department (read-only)
  assetCount?: number;                // Number of assets assigned to this department (read-only)
  createdAt?: string;                // ISO 8601 timestamp
  updatedAt?: string;                // ISO 8601 timestamp
  createdBy?: number | string;       // User ID who created the record
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

### 1. Get Departments List

**Endpoint:** `GET /api/v1/departments`

**Description:** Retrieve a paginated list of departments with optional search.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 10 | Records per page (10, 25, 50, 100) |
| `search` | string | No | - | Search query string (searches in department name) |

**Request Example:**
```http
GET /api/v1/departments?page=1&limit=10&search=IT
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "department": "IT",
      "description": "Information Technology Department",
      "employeeCount": 15,
      "assetCount": 45,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "createdBy": 1,
      "updatedBy": 1
    },
    {
      "id": 2,
      "department": "HR",
      "description": "Human Resources Department",
      "employeeCount": 8,
      "assetCount": 12,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
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
    "message": "An error occurred while fetching departments"
  }
}
```

---

### 2. Get Single Department

**Endpoint:** `GET /api/v1/departments/:id`

**Description:** Retrieve a single department by ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Department ID |

**Request Example:**
```http
GET /api/v1/departments/1
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "department": "IT",
    "description": "Information Technology Department",
    "employeeCount": 15,
    "assetCount": 45,
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
    "message": "Department with ID 1 not found"
  }
}
```

---

### 3. Create Department

**Endpoint:** `POST /api/v1/departments`

**Description:** Create a new department.

**Request Body:**
```json
{
  "department": "Finance",        // Required, min 2 chars, max 255 chars, unique
  "description": "Finance and Accounting Department"  // Optional, max 500 chars
}
```

**Request Example:**
```http
POST /api/v1/departments
Authorization: Bearer <token>
Content-Type: application/json

{
  "department": "Finance",
  "description": "Finance and Accounting Department"
}
```

**Response Example (201 Created):**
```json
{
  "data": {
    "id": 10,
    "department": "Finance",
    "description": "Finance and Accounting Department",
    "employeeCount": 0,
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
      "department": "Department name is required"
    }
  }
}

// 400 Bad Request - Duplicate Department
{
  "error": {
    "code": "DUPLICATE_ERROR",
    "message": "Department with this name already exists"
  }
}
```

---

### 4. Update Department

**Endpoint:** `PUT /api/v1/departments/:id`

**Description:** Update an existing department.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Department ID |

**Request Body:**
```json
{
  "department": "Finance Updated",  // Optional, min 2 chars, max 255 chars
  "description": "Updated description"  // Optional, max 500 chars
}
```

**Request Example:**
```http
PUT /api/v1/departments/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "department": "Finance Updated",
  "description": "Updated description"
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "department": "Finance Updated",
    "description": "Updated description",
    "employeeCount": 15,
    "assetCount": 45,
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
    "message": "Department with ID 1 not found"
  }
}

// 400 Bad Request - Validation Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "department": "Department name must be at least 2 characters"
    }
  }
}
```

---

### 5. Delete Department

**Endpoint:** `DELETE /api/v1/departments/:id`

**Description:** Delete a department by ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Department ID |

**Request Example:**
```http
DELETE /api/v1/departments/1
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "message": "Department deleted successfully"
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Department with ID 1 not found"
  }
}

// 400 Bad Request - Department has employees or assets
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Cannot delete department with employees or assets. Please reassign or remove employees/assets first."
  }
}
```

---

### 6. Bulk Delete Departments

**Endpoint:** `POST /api/v1/departments/bulk-delete`

**Description:** Delete multiple departments by their IDs.

**Request Body:**
```json
{
  "ids": [1, 2, 3]  // Array of department IDs
}
```

**Request Example:**
```http
POST /api/v1/departments/bulk-delete
Authorization: Bearer <token>
Content-Type: application/json

{
  "ids": [1, 2, 3]
}
```

**Response Example (200 OK):**
```json
{
  "message": "Departments deleted successfully",
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
      "ids": "At least one department ID is required"
    }
  }
}
```

---

### 7. Import Departments

**Endpoint:** `POST /api/v1/departments/import`

**Description:** Import departments from CSV or Excel file.

**Request Body:** `multipart/form-data`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | Yes | CSV or Excel file (.csv, .xlsx, .xls) containing departments to import |

**File Format:**
- CSV or Excel (.csv, .xlsx, .xls)
- Required column: `department`
- Optional column: `description`
- Maximum file size: 10MB
- Maximum records: 5,000

**Request Example:**
```http
POST /api/v1/departments/import
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
      "department": "IT",
      "error": "Department already exists"
    },
    {
      "row": 7,
      "department": "",
      "error": "Department name is required"
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

### 8. Export Departments

**Endpoint:** `GET /api/v1/departments/export`

**Description:** Export departments to CSV or Excel file.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `format` | string | No | "csv" | Export format: "csv" or "xlsx" |

**Request Example:**
```http
GET /api/v1/departments/export?format=xlsx
Authorization: Bearer <token>
Accept: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
```

**Response:**
- Content-Type: `text/csv` or `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Content-Disposition: `attachment; filename="departments_export_{date}.{extension}"`
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
| `DUPLICATE_ERROR` | 400 | Department name already exists |
| `BAD_REQUEST` | 400 | Invalid request (e.g., cannot delete department with employees/assets) |
| `INVALID_FILE_FORMAT` | 400 | Invalid file format for import |
| `FILE_TOO_LARGE` | 413 | File size exceeds maximum limit |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## Usage Examples

### Example 1: Create and update department

```javascript
// 1. Create department
const department = await createDepartment({
  department: "Finance",
  description: "Finance and Accounting Department"
});

// 2. Update department
await updateDepartment(department.data.id, {
  department: "Finance Updated",
  description: "Updated description"
});
```

### Example 2: Search departments

```javascript
const departments = await getDepartments(1, 10, "IT");
console.log(departments.data);
```

### Example 3: Import departments

```javascript
const file = fileInput.files[0];
const result = await importDepartments(file);
console.log(`Imported ${result.importedCount} of ${result.totalRows} departments`);
```

---

## Notes

1. **Department Name Uniqueness:**
   - Department names must be unique
   - Case-insensitive comparison (e.g., "IT" and "it" are considered duplicates)

2. **Department Deletion:**
   - Departments with employees or assets cannot be deleted
   - Users must reassign or remove employees/assets before deleting a department
   - The `employeeCount` and `assetCount` fields indicate how many employees/assets use the department

3. **Search Functionality:**
   - Search works on department name
   - Search is case-insensitive
   - Partial matches are supported

4. **Pagination:**
   - Default page size is 10
   - Maximum page size is 100
   - Pagination metadata is included in all list responses

5. **Import/Export:**
   - Import supports CSV and Excel formats
   - Export supports CSV and Excel formats
   - Import template should include: `department` (required), `description` (optional)

6. **Employee and Asset Counts:**
   - The `employeeCount` field shows how many employees are currently assigned to this department
   - The `assetCount` field shows how many assets are currently assigned to this department
   - These are read-only fields calculated by the backend
   - Departments with employees or assets cannot be deleted

7. **Department Usage:**
   - Departments are typically used to organize employees and assets
   - Departments can be assigned to persons/employees and assets
   - This helps with reporting and filtering by organizational structure

