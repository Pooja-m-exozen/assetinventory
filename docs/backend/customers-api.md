# Customers API Documentation

## Overview
This document describes the backend API endpoints required for the Customers management page (`/advanced/customers`).

## Base URL
```
/api/v1/customers
```

## Authentication
All endpoints require authentication via Bearer token:
```
Authorization: Bearer <token>
```

---

## Data Models

### Customer Model
```typescript
interface Customer {
  id: number;              // Unique identifier
  name: string;            // Customer full name (required)
  email: string;           // Email address (required, unique)
  phone: string;           // Phone number (optional)
  company: string;         // Company name (optional)
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

### 1. Get Customers List

**Endpoint:** `GET /api/v1/customers`

**Description:** Retrieve a paginated list of customers with optional search and filtering.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 10 | Records per page (10, 25, 50, 100) |
| `search` | string | No | - | Search query string |
| `searchField` | string | No | "all" | Field to search in: "all", "name", "email", "phone", "company" |
| `sortBy` | string | No | "name" | Sort field: "name", "email", "createdAt" |
| `sortOrder` | string | No | "asc" | Sort order: "asc", "desc" |

**Request Example:**
```http
GET /api/v1/customers?page=1&limit=10&search=john&searchField=all
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1-555-123-4567",
      "company": "Acme Corp",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "createdBy": 1,
      "updatedBy": 1
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "phone": "+1-555-987-6543",
      "company": "Tech Solutions Inc",
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
    "message": "An error occurred while fetching customers"
  }
}
```

---

### 2. Get Single Customer

**Endpoint:** `GET /api/v1/customers/:id`

**Description:** Retrieve a single customer by ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Customer ID |

**Request Example:**
```http
GET /api/v1/customers/1
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-123-4567",
    "company": "Acme Corp",
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
    "message": "Customer with ID 1 not found"
  }
}
```

---

### 3. Create Customer

**Endpoint:** `POST /api/v1/customers`

**Description:** Create a new customer.

**Request Body:**
```json
{
  "name": "John Doe",              // Required, min 2 chars, max 255
  "email": "john.doe@example.com", // Required, valid email format, unique
  "phone": "+1-555-123-4567",      // Optional, valid phone format
  "company": "Acme Corp"           // Optional, max 255 chars
}
```

**Request Example:**
```http
POST /api/v1/customers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-123-4567",
  "company": "Acme Corp"
}
```

**Response Example (201 Created):**
```json
{
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-123-4567",
    "company": "Acme Corp",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "createdBy": 1,
    "updatedBy": 1
  },
  "message": "Customer created successfully"
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
      "email": "Invalid email format"
    }
  }
}

// 409 Conflict - Duplicate Email
{
  "error": {
    "code": "DUPLICATE_EMAIL",
    "message": "Customer with email 'john.doe@example.com' already exists"
  }
}
```

---

### 4. Update Customer

**Endpoint:** `PUT /api/v1/customers/:id`

**Description:** Update an existing customer.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Customer ID |

**Request Body:**
```json
{
  "name": "John Doe Updated",      // Optional, min 2 chars, max 255
  "email": "john.updated@example.com", // Optional, valid email format, unique
  "phone": "+1-555-999-8888",      // Optional, valid phone format
  "company": "New Company Name"    // Optional, max 255 chars
}
```

**Request Example:**
```http
PUT /api/v1/customers/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe Updated",
  "phone": "+1-555-999-8888"
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "name": "John Doe Updated",
    "email": "john.doe@example.com",
    "phone": "+1-555-999-8888",
    "company": "Acme Corp",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T15:45:00Z",
    "createdBy": 1,
    "updatedBy": 1
  },
  "message": "Customer updated successfully"
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Customer with ID 1 not found"
  }
}

// 409 Conflict - Duplicate Email
{
  "error": {
    "code": "DUPLICATE_EMAIL",
    "message": "Customer with email 'john.updated@example.com' already exists"
  }
}
```

---

### 5. Delete Customer

**Endpoint:** `DELETE /api/v1/customers/:id`

**Description:** Delete a single customer.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Customer ID |

**Request Example:**
```http
DELETE /api/v1/customers/1
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "message": "Customer deleted successfully"
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Customer with ID 1 not found"
  }
}

// 409 Conflict - Customer has active leases
{
  "error": {
    "code": "CUSTOMER_IN_USE",
    "message": "Cannot delete customer. Customer has active asset leases."
  }
}
```

---

### 6. Bulk Delete Customers

**Endpoint:** `DELETE /api/v1/customers/bulk`

**Description:** Delete multiple customers at once.

**Request Body:**
```json
{
  "ids": [1, 2, 3, 4, 5]  // Array of customer IDs
}
```

**Request Example:**
```http
DELETE /api/v1/customers/bulk
Authorization: Bearer <token>
Content-Type: application/json

{
  "ids": [1, 2, 3]
}
```

**Response Example (200 OK):**
```json
{
  "message": "3 customers deleted successfully",
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
    "3": "Customer has active asset leases"
  }
}
```

---

### 7. Import Customers

**Endpoint:** `POST /api/v1/customers/import`

**Description:** Import customers from CSV or Excel file.

**Request:**
- Content-Type: `multipart/form-data`
- Body: Form data with file field

**Request Example:**
```http
POST /api/v1/customers/import
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <CSV or Excel file>
```

**CSV Format:**
```csv
name,email,phone,company
John Doe,john.doe@example.com,+1-555-123-4567,Acme Corp
Jane Smith,jane.smith@example.com,+1-555-987-6543,Tech Solutions Inc
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
      "email": "duplicate@example.com",
      "error": "Email already exists"
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

### 8. Export Customers

**Endpoint:** `GET /api/v1/customers/export`

**Description:** Export customers to CSV or Excel file.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `format` | string | No | "csv" | Export format: "csv", "xlsx" |
| `search` | string | No | - | Search query (same as list endpoint) |
| `searchField` | string | No | "all" | Search field (same as list endpoint) |

**Request Example:**
```http
GET /api/v1/customers/export?format=csv&search=john
Authorization: Bearer <token>
```

**Response:**
- Content-Type: `text/csv` or `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Content-Disposition: `attachment; filename="customers_export_2024-01-20.csv"`
- Body: File content

---

### 9. Get Column Configuration

**Endpoint:** `GET /api/v1/customers/columns`

**Description:** Get configurable table columns for the customers table.

**Request Example:**
```http
GET /api/v1/customers/columns
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
      "key": "email",
      "label": "Email",
      "visible": true,
      "order": 2,
      "sortable": true
    },
    {
      "key": "phone",
      "label": "Phone",
      "visible": true,
      "order": 3,
      "sortable": false
    },
    {
      "key": "company",
      "label": "Company",
      "visible": true,
      "order": 4,
      "sortable": true
    },
    {
      "key": "createdAt",
      "label": "Created At",
      "visible": false,
      "order": 5,
      "sortable": true
    }
  ]
}
```

---

### 10. Update Column Configuration

**Endpoint:** `PUT /api/v1/customers/columns`

**Description:** Update table column visibility and order.

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
      "key": "email",
      "visible": true,
      "order": 2
    },
    {
      "key": "phone",
      "visible": false,
      "order": 3
    }
  ]
}
```

**Request Example:**
```http
PUT /api/v1/customers/columns
Authorization: Bearer <token>
Content-Type: application/json

{
  "columns": [
    { "key": "name", "visible": true, "order": 1 },
    { "key": "email", "visible": true, "order": 2 },
    { "key": "phone", "visible": false, "order": 3 },
    { "key": "company", "visible": true, "order": 4 }
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

## Validation Rules

### Customer Name
- Required
- Minimum length: 2 characters
- Maximum length: 255 characters
- Pattern: Letters, numbers, spaces, hyphens, apostrophes

### Email
- Required
- Valid email format (RFC 5322)
- Must be unique across all customers
- Maximum length: 255 characters
- Case-insensitive

### Phone
- Optional
- Valid phone format (international format preferred)
- Maximum length: 20 characters
- Pattern: `^\+?[1-9]\d{1,14}$` (E.164 format)

### Company
- Optional
- Maximum length: 255 characters
- Can contain letters, numbers, spaces, and common punctuation

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Authentication required or invalid token |
| `FORBIDDEN` | 403 | User doesn't have permission to perform action |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `DUPLICATE_EMAIL` | 409 | Email already exists |
| `CUSTOMER_IN_USE` | 409 | Customer cannot be deleted (has active leases) |
| `INVALID_FILE_FORMAT` | 400 | Invalid file format for import |
| `FILE_TOO_LARGE` | 400 | File size exceeds limit |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## Rate Limiting

- **Standard endpoints:** 100 requests per minute per user
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

### customers Table
```sql
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  company VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id),
  updated_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_name ON customers(name);
CREATE INDEX idx_customers_company ON customers(company);
```

---

## Frontend Integration Example

### Fetch Customers List
```typescript
const fetchCustomers = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  searchField: string = "all"
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search, searchField }),
  });

  const response = await fetch(`/api/v1/customers?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch customers");
  }

  return response.json();
};
```

### Create Customer
```typescript
const createCustomer = async (customerData: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
}) => {
  const response = await fetch("/api/v1/customers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(customerData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  return response.json();
};
```

### Delete Customer
```typescript
const deleteCustomer = async (id: number) => {
  const response = await fetch(`/api/v1/customers/${id}`, {
    method: "DELETE",
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

### Postman Collection
A Postman collection is available at: `/docs/postman/customers-api.json`

### Example cURL Commands

**Get Customers:**
```bash
curl -X GET "https://api.example.com/api/v1/customers?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Create Customer:**
```bash
curl -X POST "https://api.example.com/api/v1/customers" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-123-4567",
    "company": "Acme Corp"
  }'
```

**Import Customers:**
```bash
curl -X POST "https://api.example.com/api/v1/customers/import" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@customers.csv"
```

---

## Notes

1. **Soft Delete:** Consider implementing soft delete (mark as deleted) instead of hard delete to maintain data integrity and audit trails.

2. **Audit Logging:** All create, update, and delete operations should be logged for audit purposes.

3. **Email Uniqueness:** Email uniqueness check should be case-insensitive.

4. **Lease Validation:** Before deleting a customer, check if they have active asset leases. If yes, prevent deletion or provide option to transfer leases.

5. **Bulk Operations:** For bulk delete, consider implementing a background job for large datasets to avoid timeout issues.

6. **File Upload Limits:**
   - Maximum file size: 10MB
   - Maximum rows per import: 10,000
   - Supported formats: CSV, XLSX, XLS

7. **Caching:** Consider implementing caching for the customers list endpoint to improve performance.

---

## Version History

- **v1.0.0** (2024-01-20): Initial API documentation

