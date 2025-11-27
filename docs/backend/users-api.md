# Users API Documentation

## Overview
This document describes the backend API endpoints required for the Users management page (`/advanced/users`).

## Base URL
```
/api/v1/users
```

## Authentication
All endpoints require authentication via Bearer token:
```
Authorization: Bearer <token>
```

---

## Data Models

### User Model
```typescript
interface User {
  id: number;              // Unique identifier
  name: string;            // Full name (required, min 2 chars, max 255)
  email: string;           // Email address (required, unique, valid email format)
  phone: string;           // Phone number (optional, valid phone format)
  jobTitle: string;        // Job title (optional, max 100 chars)
  role: string;            // User role: "Administrator", "Manager", "Viewer", etc. (optional)
  securityGroupId: number; // Security group ID (required)
  groupName: string;       // Security group name (read-only, populated from securityGroupId)
  status: string;          // User status: "active", "inactive", "suspended" (default: "active")
  lastLogin?: string;      // Last login timestamp (ISO 8601, read-only)
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

### 1. Get Users List

**Endpoint:** `GET /api/v1/users`

**Description:** Retrieve a paginated list of users with optional search and filtering.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 10 | Records per page (10, 25, 50, 100) |
| `search` | string | No | - | Search query string |
| `searchField` | string | No | "all" | Field to search in: "all", "name", "email", "phone", "jobTitle", "groupName" |
| `status` | string | No | - | Filter by status: "active", "inactive", "suspended" |
| `securityGroupId` | number | No | - | Filter by security group ID |
| `sortBy` | string | No | "name" | Sort field: "name", "email", "createdAt", "lastLogin" |
| `sortOrder` | string | No | "asc" | Sort order: "asc", "desc" |

**Request Example:**
```http
GET /api/v1/users?page=1&limit=10&search=john&searchField=all&status=active
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Shivanya DN",
      "email": "shivanya.dn@exozen.in",
      "phone": "+1-555-123-4567",
      "jobTitle": "Software Developer",
      "role": "Administrator",
      "securityGroupId": 1,
      "groupName": "Admin. Group",
      "status": "active",
      "lastLogin": "2024-01-20T14:30:00Z",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "createdBy": 1
    },
    {
      "id": 2,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1-555-987-6543",
      "jobTitle": "Manager",
      "role": "Manager",
      "securityGroupId": 2,
      "groupName": "Manager Group",
      "status": "active",
      "lastLogin": "2024-01-19T09:15:00Z",
      "createdAt": "2024-01-10T08:00:00Z",
      "updatedAt": "2024-01-10T08:00:00Z",
      "createdBy": 1
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
```

---

### 2. Get Single User

**Endpoint:** `GET /api/v1/users/:id`

**Description:** Retrieve a single user by ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | User ID |

**Request Example:**
```http
GET /api/v1/users/1
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "name": "Shivanya DN",
    "email": "shivanya.dn@exozen.in",
    "phone": "+1-555-123-4567",
    "jobTitle": "Software Developer",
    "role": "Administrator",
    "securityGroupId": 1,
    "groupName": "Admin. Group",
    "status": "active",
    "lastLogin": "2024-01-20T14:30:00Z",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "createdBy": 1
  }
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "User with ID 1 not found"
  }
}
```

---

### 3. Create User

**Endpoint:** `POST /api/v1/users`

**Description:** Create a new user.

**Request Body:**
```json
{
  "name": "John Doe",                    // Required, min 2 chars, max 255
  "email": "john.doe@example.com",      // Required, unique, valid email format
  "password": "SecurePassword123!",      // Required, min 8 chars, must contain uppercase, lowercase, number, special char
  "phone": "+1-555-123-4567",           // Optional, valid phone format
  "jobTitle": "Software Developer",      // Optional, max 100 chars
  "role": "Manager",                     // Optional, max 50 chars
  "securityGroupId": 2,                  // Required, must be valid security group ID
  "status": "active"                     // Optional, default: "active" (active, inactive, suspended)
}
```

**Request Example:**
```http
POST /api/v1/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "phone": "+1-555-123-4567",
  "jobTitle": "Software Developer",
  "role": "Manager",
  "securityGroupId": 2,
  "status": "active"
}
```

**Response Example (201 Created):**
```json
{
  "message": "User created successfully",
  "data": {
    "id": 3,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-123-4567",
    "jobTitle": "Software Developer",
    "role": "Manager",
    "securityGroupId": 2,
    "groupName": "Manager Group",
    "status": "active",
    "lastLogin": null,
    "createdAt": "2024-01-20T16:00:00Z",
    "updatedAt": "2024-01-20T16:00:00Z",
    "createdBy": 1
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
      "email": "Email is required",
      "password": "Password must be at least 8 characters",
      "securityGroupId": "Security group ID is required"
    }
  }
}

// 409 Conflict - Duplicate Email
{
  "error": {
    "code": "DUPLICATE_EMAIL",
    "message": "User with this email already exists"
  }
}
```

---

### 4. Update User

**Endpoint:** `PUT /api/v1/users/:id`

**Description:** Update an existing user.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | User ID |

**Request Body:**
```json
{
  "name": "John Doe Updated",            // Optional, min 2 chars, max 255
  "email": "john.updated@example.com",   // Optional, unique, valid email format
  "phone": "+1-555-999-8888",           // Optional, valid phone format
  "jobTitle": "Senior Developer",       // Optional, max 100 chars
  "role": "Senior Manager",             // Optional, max 50 chars
  "securityGroupId": 1,                  // Optional, must be valid security group ID
  "status": "active"                     // Optional: "active", "inactive", "suspended"
}
```

**Note:** Password updates should use the separate password reset endpoint.

**Request Example:**
```http
PUT /api/v1/users/3
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe Updated",
  "phone": "+1-555-999-8888",
  "jobTitle": "Senior Developer",
  "securityGroupId": 1,
  "status": "active"
}
```

**Response Example (200 OK):**
```json
{
  "message": "User updated successfully",
  "data": {
    "id": 3,
    "name": "John Doe Updated",
    "email": "john.doe@example.com",
    "phone": "+1-555-999-8888",
    "jobTitle": "Senior Developer",
    "role": "Manager",
    "securityGroupId": 1,
    "groupName": "Admin. Group",
    "status": "active",
    "lastLogin": null,
    "createdAt": "2024-01-20T16:00:00Z",
    "updatedAt": "2024-01-20T17:00:00Z",
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
      "email": "Invalid email format"
    }
  }
}

// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "User with ID 3 not found"
  }
}

// 409 Conflict - Duplicate Email
{
  "error": {
    "code": "DUPLICATE_EMAIL",
    "message": "User with this email already exists"
  }
}
```

---

### 5. Delete User

**Endpoint:** `DELETE /api/v1/users/:id`

**Description:** Delete a user by ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | User ID |

**Request Example:**
```http
DELETE /api/v1/users/3
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "message": "User deleted successfully"
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "User with ID 3 not found"
  }
}

// 403 Forbidden - Cannot delete own account
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Cannot delete your own account"
  }
}

// 403 Forbidden - Cannot delete last admin
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Cannot delete the last administrator"
  }
}
```

---

### 6. Bulk Delete Users

**Endpoint:** `DELETE /api/v1/users/bulk`

**Description:** Delete multiple users at once.

**Request Body:**
```json
{
  "ids": [3, 4, 5]  // Array of user IDs to delete
}
```

**Request Example:**
```http
DELETE /api/v1/users/bulk
Authorization: Bearer <token>
Content-Type: application/json

{
  "ids": [3, 4, 5]
}
```

**Response Example (200 OK):**
```json
{
  "message": "3 users deleted successfully",
  "deletedCount": 3,
  "failedCount": 0
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
      "ids": "At least one user ID is required"
    }
  }
}
```

---

### 7. Reset User Password

**Endpoint:** `POST /api/v1/users/:id/reset-password`

**Description:** Reset a user's password. Can be used by admin or the user themselves.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | User ID |

**Request Body:**
```json
{
  "newPassword": "NewSecurePassword123!",  // Required, min 8 chars, must contain uppercase, lowercase, number, special char
  "sendEmail": true                         // Optional, default: true - Send password reset email to user
}
```

**Request Example:**
```http
POST /api/v1/users/3/reset-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "newPassword": "NewSecurePassword123!",
  "sendEmail": true
}
```

**Response Example (200 OK):**
```json
{
  "message": "Password reset successfully. Email sent to user."
}
```

**Error Responses:**
```json
// 400 Bad Request - Weak Password
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "newPassword": "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character"
    }
  }
}

// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "User with ID 3 not found"
  }
}
```

---

### 8. Activate/Deactivate User

**Endpoint:** `PUT /api/v1/users/:id/status`

**Description:** Activate or deactivate a user account.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | User ID |

**Request Body:**
```json
{
  "status": "inactive"  // Required: "active", "inactive", "suspended"
}
```

**Request Example:**
```http
PUT /api/v1/users/3/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "inactive"
}
```

**Response Example (200 OK):**
```json
{
  "message": "User status updated successfully",
  "data": {
    "id": 3,
    "status": "inactive",
    "updatedAt": "2024-01-20T18:00:00Z"
  }
}
```

**Error Responses:**
```json
// 400 Bad Request - Invalid Status
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "status": "Status must be one of: active, inactive, suspended"
    }
  }
}

// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "User with ID 3 not found"
  }
}
```

---

### 9. Assign User to Security Group

**Endpoint:** `PUT /api/v1/users/:id/security-group`

**Description:** Assign a user to a security group.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | User ID |

**Request Body:**
```json
{
  "securityGroupId": 2  // Required, must be valid security group ID
}
```

**Request Example:**
```http
PUT /api/v1/users/3/security-group
Authorization: Bearer <token>
Content-Type: application/json

{
  "securityGroupId": 2
}
```

**Response Example (200 OK):**
```json
{
  "message": "User assigned to security group successfully",
  "data": {
    "id": 3,
    "securityGroupId": 2,
    "groupName": "Manager Group",
    "updatedAt": "2024-01-20T18:30:00Z"
  }
}
```

**Error Responses:**
```json
// 404 Not Found - User
{
  "error": {
    "code": "NOT_FOUND",
    "message": "User with ID 3 not found"
  }
}

// 404 Not Found - Security Group
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Security group with ID 2 not found"
  }
}
```

---

### 10. Get Available Security Groups

**Endpoint:** `GET /api/v1/users/security-groups`

**Description:** Get list of available security groups for user assignment (used in dropdowns).

**Request Example:**
```http
GET /api/v1/users/security-groups
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Admin. Group",
      "description": "Administrative group has complete rights."
    },
    {
      "id": 2,
      "name": "Manager Group",
      "description": "Manager group has most rights except admin. rights."
    },
    {
      "id": 3,
      "name": "Viewer Group",
      "description": "Viewer group has viewing rights only."
    }
  ]
}
```

---

### 11. Import Users

**Endpoint:** `POST /api/v1/users/import`

**Description:** Import users from CSV or Excel file.

**Request Body:** (multipart/form-data)
```
file: <CSV or Excel file>
```

**File Format:**
- CSV or Excel (.csv, .xlsx, .xls)
- Required columns: name, email, password, securityGroupId
- Optional columns: phone, jobTitle, role, status

**Request Example:**
```http
POST /api/v1/users/import
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <binary file data>
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

// 400 Bad Request - Empty file
{
  "error": {
    "code": "EMPTY_FILE",
    "message": "Uploaded file is empty"
  }
}
```

---

### 12. Export Users

**Endpoint:** `GET /api/v1/users/export`

**Description:** Export users to CSV or Excel file.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `format` | string | No | "csv" | Export format: "csv", "xlsx" |
| `search` | string | No | - | Search query string (applies same filters as list endpoint) |
| `searchField` | string | No | "all" | Field to search in |
| `status` | string | No | - | Filter by status |
| `securityGroupId` | number | No | - | Filter by security group ID |

**Request Example:**
```http
GET /api/v1/users/export?format=xlsx&search=john&searchField=name&status=active
Authorization: Bearer <token>
```

**Response Example (200 OK):**
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (for xlsx)
- Content-Type: `text/csv` (for csv)
- Content-Disposition: `attachment; filename="users_2024-01-20.xlsx"`

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

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Authentication required or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions or operation not allowed |
| `NOT_FOUND` | 404 | User or resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `DUPLICATE_EMAIL` | 409 | Email address already exists |
| `WEAK_PASSWORD` | 400 | Password does not meet security requirements |
| `INVALID_FILE_FORMAT` | 400 | Invalid file format for import |
| `EMPTY_FILE` | 400 | Uploaded file is empty |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## Usage Examples

### JavaScript/TypeScript Example

```typescript
const API_BASE_URL = 'https://digitalasset.zenapi.co.in/api';
const token = 'your-auth-token';

// Get users list
const getUsers = async (page = 1, limit = 10, search = '', searchField = 'all') => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (search) {
    params.append('search', search);
    params.append('searchField', searchField);
  }
  
  const response = await fetch(`${API_BASE_URL}/v1/users?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return response.json();
};

// Create user
const createUser = async (data) => {
  const response = await fetch(`${API_BASE_URL}/v1/users`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  return response.json();
};

// Update user
const updateUser = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/v1/users/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  return response.json();
};

// Delete user
const deleteUser = async (id) => {
  const response = await fetch(`${API_BASE_URL}/v1/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return response.json();
};

// Reset password
const resetPassword = async (id, newPassword, sendEmail = true) => {
  const response = await fetch(`${API_BASE_URL}/v1/users/${id}/reset-password`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ newPassword, sendEmail }),
  });
  
  return response.json();
};

// Assign to security group
const assignSecurityGroup = async (id, securityGroupId) => {
  const response = await fetch(`${API_BASE_URL}/v1/users/${id}/security-group`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ securityGroupId }),
  });
  
  return response.json();
};

// Get available security groups
const getSecurityGroups = async () => {
  const response = await fetch(`${API_BASE_URL}/v1/users/security-groups`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return response.json();
};
```

---

## Notes

1. **Password Requirements**: 
   - Minimum 8 characters
   - Must contain at least one uppercase letter
   - Must contain at least one lowercase letter
   - Must contain at least one number
   - Must contain at least one special character

2. **Email Uniqueness**: Email addresses must be unique across all users in the system.

3. **Security Group Assignment**: Users must be assigned to a valid security group. The security group determines user permissions.

4. **User Status**: 
   - `active`: User can log in and access the system
   - `inactive`: User account is disabled, cannot log in
   - `suspended`: User account is temporarily suspended

5. **Role Field**: The `role` field is informational and can be used to display badges or labels. It does not affect permissions (permissions come from the security group).

6. **Last Login**: The `lastLogin` field is automatically updated when a user successfully logs in.

7. **Self-Deletion Prevention**: Users cannot delete their own account.

8. **Last Admin Protection**: The system prevents deletion of the last administrator user.

9. **Password Reset**: When resetting a password, an email can be optionally sent to the user with the new password or a password reset link.

10. **Import Format**: The import file should have columns: name, email, password, securityGroupId (required), and optionally phone, jobTitle, role, status.

