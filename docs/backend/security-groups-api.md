# Security Groups API Documentation

## Overview
This document describes the backend API endpoints required for the Security Groups management page (`/advanced/security-groups`).

## Base URL
```
/api/v1/security-groups
```

## Authentication
All endpoints require authentication via Bearer token:
```
Authorization: Bearer <token>
```

---

## Data Models

### SecurityGroup Model
```typescript
interface SecurityGroup {
  id: number;              // Unique identifier
  name: string;            // Group name (required, min 2 chars, max 100 chars, unique)
  description: string;     // Group description (required, max 500 chars)
  activeUsers: number;     // Number of users assigned to this group (read-only)
  permissions?: {          // Permissions object (optional, for detailed view)
    [key: string]: boolean;
  };
  isSystemGroup?: boolean; // Whether this is a system-defined group (read-only)
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
  createdBy?: number;      // User ID who created the record
  updatedBy?: number;      // User ID who last updated the record
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

### 1. Get Security Groups List

**Endpoint:** `GET /api/v1/security-groups`

**Description:** Retrieve a list of all security groups.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `includeSystemGroups` | boolean | No | true | Include system-defined groups in response |
| `includePermissions` | boolean | No | false | Include permissions object in response |

**Request Example:**
```http
GET /api/v1/security-groups?includeSystemGroups=true
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Admin. Group",
      "description": "Administrative group has complete rights.",
      "activeUsers": 5,
      "isSystemGroup": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "name": "Manager Group",
      "description": "Manager group has most rights except admin. rights.",
      "activeUsers": 12,
      "isSystemGroup": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": 3,
      "name": "Viewer Group",
      "description": "Viewer group has viewing rights only.",
      "activeUsers": 8,
      "isSystemGroup": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": 4,
      "name": "Custom Group",
      "description": "Custom security group with specific permissions.",
      "activeUsers": 3,
      "isSystemGroup": false,
      "createdAt": "2024-01-20T14:20:00Z",
      "updatedAt": "2024-01-20T14:20:00Z",
      "createdBy": 1
    }
  ]
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

### 2. Get Single Security Group

**Endpoint:** `GET /api/v1/security-groups/:id`

**Description:** Retrieve a single security group by ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Security group ID |

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `includePermissions` | boolean | No | true | Include permissions object in response |

**Request Example:**
```http
GET /api/v1/security-groups/1?includePermissions=true
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "name": "Admin. Group",
    "description": "Administrative group has complete rights.",
    "activeUsers": 5,
    "isSystemGroup": true,
    "permissions": {
      "assets.create": true,
      "assets.read": true,
      "assets.update": true,
      "assets.delete": true,
      "users.create": true,
      "users.read": true,
      "users.update": true,
      "users.delete": true,
      "settings.access": true
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Security group with ID 1 not found"
  }
}
```

---

### 3. Create Security Group

**Endpoint:** `POST /api/v1/security-groups`

**Description:** Create a new security group.

**Request Body:**
```json
{
  "name": "Custom Group",                    // Required, min 2 chars, max 100 chars, unique
  "description": "Custom security group",    // Required, max 500 chars
  "permissions": {                           // Optional, object with permission keys
    "assets.create": true,
    "assets.read": true,
    "assets.update": false,
    "assets.delete": false,
    "users.read": true
  }
}
```

**Request Example:**
```http
POST /api/v1/security-groups
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Custom Group",
  "description": "Custom security group with specific permissions",
  "permissions": {
    "assets.create": true,
    "assets.read": true,
    "assets.update": false,
    "assets.delete": false
  }
}
```

**Response Example (201 Created):**
```json
{
  "message": "Security group created successfully",
  "data": {
    "id": 4,
    "name": "Custom Group",
    "description": "Custom security group with specific permissions",
    "activeUsers": 0,
    "isSystemGroup": false,
    "permissions": {
      "assets.create": true,
      "assets.read": true,
      "assets.update": false,
      "assets.delete": false
    },
    "createdAt": "2024-01-20T14:20:00Z",
    "updatedAt": "2024-01-20T14:20:00Z",
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
      "name": "Name is required",
      "description": "Description must be at least 10 characters"
    }
  }
}

// 409 Conflict - Duplicate Name
{
  "error": {
    "code": "DUPLICATE_NAME",
    "message": "Security group with this name already exists"
  }
}
```

---

### 4. Update Security Group

**Endpoint:** `PUT /api/v1/security-groups/:id`

**Description:** Update an existing security group.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Security group ID |

**Request Body:**
```json
{
  "name": "Updated Group Name",              // Optional, min 2 chars, max 100 chars, unique
  "description": "Updated description",      // Optional, max 500 chars
  "permissions": {                          // Optional, object with permission keys
    "assets.create": true,
    "assets.read": true,
    "assets.update": true,
    "assets.delete": false
  }
}
```

**Request Example:**
```http
PUT /api/v1/security-groups/4
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Custom Group",
  "description": "Updated description for custom security group",
  "permissions": {
    "assets.create": true,
    "assets.read": true,
    "assets.update": true,
    "assets.delete": false
  }
}
```

**Response Example (200 OK):**
```json
{
  "message": "Security group updated successfully",
  "data": {
    "id": 4,
    "name": "Updated Custom Group",
    "description": "Updated description for custom security group",
    "activeUsers": 3,
    "isSystemGroup": false,
    "permissions": {
      "assets.create": true,
      "assets.read": true,
      "assets.update": true,
      "assets.delete": false
    },
    "createdAt": "2024-01-20T14:20:00Z",
    "updatedAt": "2024-01-20T15:30:00Z",
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
      "name": "Name must be at least 2 characters"
    }
  }
}

// 403 Forbidden - Cannot edit system group
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Cannot modify system-defined security groups"
  }
}

// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Security group with ID 4 not found"
  }
}

// 409 Conflict - Duplicate Name
{
  "error": {
    "code": "DUPLICATE_NAME",
    "message": "Security group with this name already exists"
  }
}
```

---

### 5. Duplicate Security Group

**Endpoint:** `POST /api/v1/security-groups/:id/duplicate`

**Description:** Create a duplicate of an existing security group with a new name.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Security group ID to duplicate |

**Request Body:**
```json
{
  "name": "Copy of Admin Group"              // Required, min 2 chars, max 100 chars, unique
}
```

**Request Example:**
```http
POST /api/v1/security-groups/1/duplicate
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Copy of Admin Group"
}
```

**Response Example (201 Created):**
```json
{
  "message": "Security group duplicated successfully",
  "data": {
    "id": 5,
    "name": "Copy of Admin Group",
    "description": "Administrative group has complete rights.",
    "activeUsers": 0,
    "isSystemGroup": false,
    "permissions": {
      "assets.create": true,
      "assets.read": true,
      "assets.update": true,
      "assets.delete": true,
      "users.create": true,
      "users.read": true,
      "users.update": true,
      "users.delete": true,
      "settings.access": true
    },
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
      "name": "Name is required"
    }
  }
}

// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Security group with ID 1 not found"
  }
}

// 409 Conflict - Duplicate Name
{
  "error": {
    "code": "DUPLICATE_NAME",
    "message": "Security group with this name already exists"
  }
}
```

---

### 6. Delete Security Group

**Endpoint:** `DELETE /api/v1/security-groups/:id`

**Description:** Delete a security group. Cannot delete system groups or groups with active users.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Security group ID |

**Request Example:**
```http
DELETE /api/v1/security-groups/4
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "message": "Security group deleted successfully"
}
```

**Error Responses:**
```json
// 403 Forbidden - Cannot delete system group
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Cannot delete system-defined security groups"
  }
}

// 409 Conflict - Group has active users
{
  "error": {
    "code": "GROUP_IN_USE",
    "message": "Cannot delete security group with active users. Please reassign users first."
  }
}

// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Security group with ID 4 not found"
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Authentication required or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions or cannot modify system groups |
| `NOT_FOUND` | 404 | Security group not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `DUPLICATE_NAME` | 409 | Security group name already exists |
| `GROUP_IN_USE` | 409 | Cannot delete group with active users |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## Permission Keys Reference

The permissions object can contain the following keys (examples):

```typescript
{
  // Asset Management
  "assets.create": boolean;
  "assets.read": boolean;
  "assets.update": boolean;
  "assets.delete": boolean;
  "assets.export": boolean;
  "assets.import": boolean;
  
  // User Management
  "users.create": boolean;
  "users.read": boolean;
  "users.update": boolean;
  "users.delete": boolean;
  
  // Customer Management
  "customers.create": boolean;
  "customers.read": boolean;
  "customers.update": boolean;
  "customers.delete": boolean;
  
  // Person/Employee Management
  "persons.create": boolean;
  "persons.read": boolean;
  "persons.update": boolean;
  "persons.delete": boolean;
  
  // Reports
  "reports.view": boolean;
  "reports.export": boolean;
  
  // Settings
  "settings.access": boolean;
  "settings.securityGroups": boolean;
  
  // Advanced Features
  "advanced.access": boolean;
  "advanced.customers": boolean;
  "advanced.persons": boolean;
  "advanced.securityGroups": boolean;
}
```

---

## Usage Examples

### JavaScript/TypeScript Example

```typescript
const API_BASE_URL = 'https://digitalasset.zenapi.co.in/api';
const token = 'your-auth-token';

// Get all security groups
const getSecurityGroups = async () => {
  const response = await fetch(`${API_BASE_URL}/v1/security-groups`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return response.json();
};

// Create security group
const createSecurityGroup = async (data) => {
  const response = await fetch(`${API_BASE_URL}/v1/security-groups`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  return response.json();
};

// Update security group
const updateSecurityGroup = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/v1/security-groups/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  return response.json();
};

// Duplicate security group
const duplicateSecurityGroup = async (id, newName) => {
  const response = await fetch(`${API_BASE_URL}/v1/security-groups/${id}/duplicate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: newName }),
  });
  
  return response.json();
};

// Delete security group
const deleteSecurityGroup = async (id) => {
  const response = await fetch(`${API_BASE_URL}/v1/security-groups/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return response.json();
};
```

---

## Notes

1. **System Groups**: System-defined groups (Admin, Manager, Viewer) cannot be deleted or have their core permissions modified. Only custom groups can be fully edited.

2. **Active Users**: Groups with active users cannot be deleted. Users must be reassigned to other groups first.

3. **Permissions**: The permissions object is flexible and can be extended with new permission keys as the system grows.

4. **Name Uniqueness**: Security group names must be unique across all groups.

5. **Default Groups**: The system should always have at least the three default groups: Admin, Manager, and Viewer.

6. **Active Users Count**: The `activeUsers` field is automatically calculated and cannot be set manually.

