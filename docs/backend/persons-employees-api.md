# Persons/Employees API Documentation

## Overview
This document describes the backend API endpoints required for the Persons/Employees management page (`/advanced/persons-employees`).

## Base URL
```
/api/v1/persons-employees
```

## Authentication
All endpoints require authentication via Bearer token:
```
Authorization: Bearer <token>
```

---

## Data Models

### PersonEmployee Model
```typescript
interface PersonEmployee {
  id: number;              // Unique identifier
  name: string;            // Full name (required)
  employeeId: string;      // Employee ID (required, unique)
  title: string;           // Job title (required)
  phone: string;           // Phone number (optional)
  email: string;           // Email address (required, unique)
  site: string;            // Site name (optional)
  location: string;        // Location (optional)
  department: string;       // Department (optional)
  notes: string;           // Additional notes (optional)
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
  createdBy?: number;      // User ID who created the record
  updatedBy?: number;      // User ID who last updated the record
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

### 1. Get Persons/Employees List

**Endpoint:** `GET /api/v1/persons-employees`

**Description:** Retrieve a paginated list of persons/employees with optional search and filtering.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 10 | Records per page (10, 25, 50, 100) |
| `search` | string | No | - | Search query string |
| `searchField` | string | No | "all" | Field to search in: "all", "name", "employeeId", "title", "email", "phone" |
| `sortBy` | string | No | "name" | Sort field: "name", "employeeId", "title", "email", "phone", "department", "createdAt" |
| `sortOrder` | string | No | "asc" | Sort order: "asc", "desc" |

**Request Example:**
```http
GET /api/v1/persons-employees?page=1&limit=10&search=john&searchField=all
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Shivanya",
      "employeeId": "EFMS3295",
      "title": "Testing",
      "phone": "7338265989",
      "email": "shivanya.dn@exozen.in",
      "site": "",
      "location": "",
      "department": "IT",
      "notes": "",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "createdBy": 1,
      "updatedBy": 1
    },
    {
      "id": 2,
      "name": "Pooja",
      "employeeId": "EFMS3251",
      "title": "Testing",
      "phone": "7338265989",
      "email": "pooja.m@exozen.in",
      "site": "",
      "location": "",
      "department": "IT",
      "notes": "",
      "createdAt": "2024-01-16T14:20:00Z",
      "updatedAt": "2024-01-16T14:20:00Z",
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

**Response Example (Empty - 200 OK):**
```json
{
  "data": [],
  "pagination": {
    "currentPage": 1,
    "recordsPerPage": 10,
    "totalRecords": 0,
    "totalPages": 0,
    "startRecord": 0,
    "endRecord": 0
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
    "message": "An error occurred while fetching persons/employees"
  }
}
```

---

### 2. Get Single Person/Employee

**Endpoint:** `GET /api/v1/persons-employees/:id`

**Description:** Retrieve a single person/employee by ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Person/Employee ID |

**Request Example:**
```http
GET /api/v1/persons-employees/1
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "name": "Shivanya",
    "employeeId": "EFMS3295",
    "title": "Testing",
    "phone": "7338265989",
    "email": "shivanya.dn@exozen.in",
    "site": "",
    "location": "",
    "department": "IT",
    "notes": "",
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
    "message": "Person/Employee with ID 1 not found"
  }
}
```

---

### 3. Create Person/Employee

**Endpoint:** `POST /api/v1/persons-employees`

**Description:** Create a new person/employee.

**Request Body:**
```json
{
  "name": "John Doe",                    // Required, min 2 chars, max 255
  "employeeId": "EFMS3296",              // Required, unique, max 50 chars
  "title": "Software Engineer",          // Required, max 100 chars
  "phone": "7338265989",                 // Optional, valid phone format
  "email": "john.doe@exozen.in",         // Required, valid email format, unique
  "site": "Main Office",                 // Optional, max 100 chars
  "location": "Bangalore",               // Optional, max 100 chars
  "department": "IT",                    // Optional, max 100 chars
  "notes": "Senior developer"            // Optional, max 500 chars
}
```

**Request Example:**
```http
POST /api/v1/persons-employees
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "employeeId": "EFMS3296",
  "title": "Software Engineer",
  "phone": "7338265989",
  "email": "john.doe@exozen.in",
  "site": "Main Office",
  "location": "Bangalore",
  "department": "IT",
  "notes": "Senior developer"
}
```

**Response Example (201 Created):**
```json
{
  "data": {
    "id": 3,
    "name": "John Doe",
    "employeeId": "EFMS3296",
    "title": "Software Engineer",
    "phone": "7338265989",
    "email": "john.doe@exozen.in",
    "site": "Main Office",
    "location": "Bangalore",
    "department": "IT",
    "notes": "Senior developer",
    "createdAt": "2024-01-20T10:30:00Z",
    "updatedAt": "2024-01-20T10:30:00Z",
    "createdBy": 1,
    "updatedBy": 1
  },
  "message": "Person/Employee created successfully"
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
      "name": "Name is required",
      "employeeId": "Employee ID is required",
      "email": "Invalid email format"
    }
  }
}

// 409 Conflict - Duplicate Employee ID
{
  "error": {
    "code": "DUPLICATE_EMPLOYEE_ID",
    "message": "Person/Employee with employee ID 'EFMS3296' already exists"
  }
}

// 409 Conflict - Duplicate Email
{
  "error": {
    "code": "DUPLICATE_EMAIL",
    "message": "Person/Employee with email 'john.doe@exozen.in' already exists"
  }
}
```

---

### 4. Update Person/Employee

**Endpoint:** `PUT /api/v1/persons-employees/:id`

**Description:** Update an existing person/employee.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Person/Employee ID |

**Request Body:**
```json
{
  "name": "John Doe Updated",            // Optional, min 2 chars, max 255
  "employeeId": "EFMS3296",              // Optional, unique, max 50 chars
  "title": "Senior Software Engineer",   // Optional, max 100 chars
  "phone": "7338265999",                 // Optional, valid phone format
  "email": "john.updated@exozen.in",     // Optional, valid email format, unique
  "site": "New Office",                  // Optional, max 100 chars
  "location": "Mumbai",                   // Optional, max 100 chars
  "department": "Engineering",            // Optional, max 100 chars
  "notes": "Promoted to senior"          // Optional, max 500 chars
}
```

**Request Example:**
```http
PUT /api/v1/persons-employees/3
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe Updated",
  "title": "Senior Software Engineer",
  "department": "Engineering"
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 3,
    "name": "John Doe Updated",
    "employeeId": "EFMS3296",
    "title": "Senior Software Engineer",
    "phone": "7338265989",
    "email": "john.doe@exozen.in",
    "site": "Main Office",
    "location": "Bangalore",
    "department": "Engineering",
    "notes": "Senior developer",
    "createdAt": "2024-01-20T10:30:00Z",
    "updatedAt": "2024-01-25T15:45:00Z",
    "createdBy": 1,
    "updatedBy": 1
  },
  "message": "Person/Employee updated successfully"
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Person/Employee with ID 3 not found"
  }
}

// 409 Conflict - Duplicate Employee ID
{
  "error": {
    "code": "DUPLICATE_EMPLOYEE_ID",
    "message": "Person/Employee with employee ID 'EFMS3296' already exists"
  }
}

// 409 Conflict - Duplicate Email
{
  "error": {
    "code": "DUPLICATE_EMAIL",
    "message": "Person/Employee with email 'john.updated@exozen.in' already exists"
  }
}
```

---

### 5. Delete Person/Employee

**Endpoint:** `DELETE /api/v1/persons-employees/:id`

**Description:** Delete a single person/employee.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Person/Employee ID |

**Request Example:**
```http
DELETE /api/v1/persons-employees/3
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "message": "Person/Employee deleted successfully"
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Person/Employee with ID 3 not found"
  }
}

// 409 Conflict - Person/Employee has active checkouts
{
  "error": {
    "code": "PERSON_IN_USE",
    "message": "Cannot delete person/employee. Person has active asset checkouts."
  }
}
```

---

### 6. Bulk Delete Persons/Employees

**Endpoint:** `DELETE /api/v1/persons-employees/bulk`

**Description:** Delete multiple persons/employees at once.

**Request Body:**
```json
{
  "ids": [1, 2, 3, 4, 5]  // Array of person/employee IDs
}
```

**Request Example:**
```http
DELETE /api/v1/persons-employees/bulk
Authorization: Bearer <token>
Content-Type: application/json

{
  "ids": [1, 2, 3]
}
```

**Response Example (200 OK):**
```json
{
  "message": "3 persons/employees deleted successfully",
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
    "3": "Person/Employee has active asset checkouts"
  }
}
```

---

### 7. Import Persons/Employees

**Endpoint:** `POST /api/v1/persons-employees/import`

**Description:** Import persons/employees from CSV or Excel file.

**Request:**
- Content-Type: `multipart/form-data`
- Body: Form data with file field

**Request Example:**
```http
POST /api/v1/persons-employees/import
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <CSV or Excel file>
```

**CSV Format:**
```csv
name,employeeId,title,phone,email,site,location,department,notes
Shivanya,EFMS3295,Testing,7338265989,shivanya.dn@exozen.in,,,IT,
Pooja,EFMS3251,Testing,7338265989,pooja.m@exozen.in,,,IT,
John Doe,EFMS3296,Software Engineer,7338265999,john.doe@exozen.in,Main Office,Bangalore,IT,Senior developer
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
      "email": "invalid.email",
      "error": "Invalid email format"
    },
    {
      "row": 7,
      "email": "duplicate@exozen.in",
      "error": "Email already exists"
    },
    {
      "row": 12,
      "employeeId": "EFMS3295",
      "error": "Employee ID already exists"
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

// 400 Bad Request - Empty file
{
  "error": {
    "code": "EMPTY_FILE",
    "message": "Uploaded file is empty"
  }
}
```

---

### 8. Export Persons/Employees

**Endpoint:** `GET /api/v1/persons-employees/export`

**Description:** Export persons/employees to CSV or Excel file.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `format` | string | No | "csv" | Export format: "csv", "xlsx" |
| `search` | string | No | - | Search query string (applies same filters as list endpoint) |
| `searchField` | string | No | "all" | Field to search in |

**Request Example:**
```http
GET /api/v1/persons-employees/export?format=xlsx&search=john&searchField=name
Authorization: Bearer <token>
```

**Response Example (200 OK):**
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (for xlsx)
- Content-Type: `text/csv` (for csv)
- Content-Disposition: `attachment; filename="persons-employees_2024-01-20.xlsx"`

**Error Responses:**
```json
// 400 Bad Request - Invalid format
{
  "error": {
    "code": "INVALID_FORMAT",
    "message": "Export format must be 'csv' or 'xlsx'"
  }
}
```

---

### 9. Get Column Configuration

**Endpoint:** `GET /api/v1/persons-employees/columns`

**Description:** Get the column configuration for the persons/employees table.

**Request Example:**
```http
GET /api/v1/persons-employees/columns
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "columns": [
    {
      "key": "name",
      "label": "Name",
      "visible": true,
      "order": 1,
      "sortable": true
    },
    {
      "key": "employeeId",
      "label": "Employee ID",
      "visible": true,
      "order": 2,
      "sortable": true
    },
    {
      "key": "title",
      "label": "Title",
      "visible": true,
      "order": 3,
      "sortable": true
    },
    {
      "key": "phone",
      "label": "Phone",
      "visible": true,
      "order": 4,
      "sortable": true
    },
    {
      "key": "email",
      "label": "Email",
      "visible": true,
      "order": 5,
      "sortable": true
    },
    {
      "key": "site",
      "label": "Site",
      "visible": true,
      "order": 6,
      "sortable": true
    },
    {
      "key": "location",
      "label": "Location",
      "visible": true,
      "order": 7,
      "sortable": true
    },
    {
      "key": "department",
      "label": "Department",
      "visible": true,
      "order": 8,
      "sortable": true
    },
    {
      "key": "notes",
      "label": "Notes",
      "visible": true,
      "order": 9,
      "sortable": false
    }
  ]
}
```

---

### 10. Update Column Configuration

**Endpoint:** `PUT /api/v1/persons-employees/columns`

**Description:** Update the column configuration for the persons/employees table.

**Request Body:**
```json
{
  "columns": [
    {
      "key": "name",
      "visible": true,
      "order": 1
    },
    {
      "key": "employeeId",
      "visible": true,
      "order": 2
    },
    {
      "key": "title",
      "visible": false,
      "order": 3
    }
  ]
}
```

**Request Example:**
```http
PUT /api/v1/persons-employees/columns
Authorization: Bearer <token>
Content-Type: application/json

{
  "columns": [
    {
      "key": "name",
      "visible": true,
      "order": 1
    },
    {
      "key": "employeeId",
      "visible": true,
      "order": 2
    }
  ]
}
```

**Response Example (200 OK):**
```json
{
  "message": "Column configuration updated successfully"
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
| `DUPLICATE_EMPLOYEE_ID` | 409 | Employee ID already exists |
| `DUPLICATE_EMAIL` | 409 | Email address already exists |
| `PERSON_IN_USE` | 409 | Cannot delete person/employee with active checkouts |
| `INVALID_FILE_FORMAT` | 400 | Invalid file format for import |
| `EMPTY_FILE` | 400 | Uploaded file is empty |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## Usage Examples

### JavaScript/TypeScript Example

```typescript
const API_BASE_URL = 'https://digitalasset.zenapi.co.in/api';
const token = 'your-auth-token';

// Get persons/employees list
const getPersonsEmployees = async (page = 1, limit = 10, search = '', searchField = 'all') => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (search) {
    params.append('search', search);
    params.append('searchField', searchField);
  }
  
  const response = await fetch(`${API_BASE_URL}/v1/persons-employees?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return response.json();
};

// Create person/employee
const createPersonEmployee = async (data) => {
  const response = await fetch(`${API_BASE_URL}/v1/persons-employees`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  return response.json();
};

// Update person/employee
const updatePersonEmployee = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/v1/persons-employees/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  return response.json();
};

// Delete person/employee
const deletePersonEmployee = async (id) => {
  const response = await fetch(`${API_BASE_URL}/v1/persons-employees/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return response.json();
};

// Export to Excel
const exportPersonsEmployees = async (format = 'xlsx', search = '', searchField = 'all') => {
  const params = new URLSearchParams({ format });
  if (search) {
    params.append('search', search);
    params.append('searchField', searchField);
  }
  
  const response = await fetch(`${API_BASE_URL}/v1/persons-employees/export?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `persons-employees_${new Date().toISOString().split('T')[0]}.${format}`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
```

---

## Notes

1. **Employee ID Uniqueness**: The `employeeId` field must be unique across all persons/employees in the system.

2. **Email Uniqueness**: The `email` field must be unique across all persons/employees in the system.

3. **Search Functionality**: When `searchField` is set to "all", the search will look across all searchable fields (name, employeeId, title, email, phone).

4. **Sorting**: All columns except "notes" are sortable. Default sort is by "name" in ascending order.

5. **Pagination**: The pagination response includes metadata to help build pagination controls in the UI.

6. **Import Validation**: The import endpoint validates each row and returns detailed error information for failed rows while still importing valid rows.

7. **Export**: The export endpoint respects the same search and filter parameters as the list endpoint, allowing users to export filtered results.

8. **Column Configuration**: Column visibility and order are stored per user, allowing personalized table views.

