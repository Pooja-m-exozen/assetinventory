# Database Tables API Documentation

## Overview
This document describes the backend API endpoints required for the Database Tables configuration pages (`/setup/databases/*`). The API manages database table field configurations for different entity types (assets, customers, persons-employees, maintenance, warranties, contracts).

## Base URL
```
/api/v1/database-tables
```

## Authentication
All endpoints require authentication via Bearer token:
```
Authorization: Bearer <token>
```

---

## Data Models

### DatabaseField Model
```typescript
interface DatabaseField {
  id: string;                        // Unique field identifier (e.g., "asset-tag-id", "full-name")
  name: string;                     // Field display name (e.g., "Asset Tag ID", "Full Name")
  required: boolean;                 // Whether this field is required
  enabled: boolean;                  // Whether this field is enabled/visible
  description?: string;              // Field description/help text
  example?: string;                  // Example value for the field
  isSystemField?: boolean;          // Whether this is a system field (cannot be disabled)
  hasNoRadioButtons?: boolean;       // Whether this field doesn't have required/optional options
  order?: number;                    // Display order (for sorting)
  isKeyField?: boolean;              // Whether this is the key/unique identifier field
}
```

### DatabaseTableConfiguration Model
```typescript
interface DatabaseTableConfiguration {
  tableType: "assets" | "customers" | "persons-employees" | "maintenance" | "warranties" | "contracts";
  fields: DatabaseField[];          // Array of database fields
  keyField?: string;                 // ID of the field that is the unique identifier
  updatedAt?: string;                // ISO 8601 timestamp
  updatedBy?: number | string;        // User ID who last updated the configuration
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

### 1. Get Database Table Configuration

**Endpoint:** `GET /api/v1/database-tables/:tableType/configuration`

**Description:** Retrieve database table configuration for a specific table type including all fields and their settings.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tableType` | string | Yes | Table type: "assets", "customers", "persons-employees", "maintenance", "warranties", or "contracts" |

**Request Example:**
```http
GET /api/v1/database-tables/assets/configuration
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": {
    "tableType": "assets",
    "keyField": "asset-tag-id",
    "fields": [
      {
        "id": "asset-tag-id",
        "name": "Asset Tag ID",
        "required": true,
        "enabled": true,
        "description": "This field holds the unique asset id number that your company assigns to identify each asset. These are generally sequentially numbered labels with barcodes.",
        "example": "A-1001",
        "isSystemField": true,
        "isKeyField": true,
        "order": 1
      },
      {
        "id": "asset-description",
        "name": "Asset Description",
        "required": true,
        "enabled": true,
        "description": "Description of the asset",
        "example": "HP - Envy Desktop - 12GB Memory - 2TB Hard Drive",
        "isSystemField": true,
        "order": 2
      },
      {
        "id": "purchase-date",
        "name": "Purchase Date",
        "required": false,
        "enabled": true,
        "description": "Date asset was purchased",
        "example": "08/22/2014",
        "isSystemField": false,
        "order": 3
      },
      {
        "id": "cost",
        "name": "Cost",
        "required": false,
        "enabled": true,
        "description": "Cost of the asset",
        "example": "₹225.75",
        "isSystemField": false,
        "order": 4
      }
    ],
    "updatedAt": "2024-01-15T10:30:00Z",
    "updatedBy": 1
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

// 404 Not Found (if configuration hasn't been set yet)
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Database table configuration not found"
  }
}

// 400 Bad Request - Invalid table type
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid table type. Must be one of: assets, customers, persons-employees, maintenance, warranties, contracts"
  }
}
```

**Note:** If database table configuration doesn't exist, the backend should return default values with predefined fields for the table type.

---

### 2. Update Database Table Configuration

**Endpoint:** `PUT /api/v1/database-tables/:tableType/configuration`

**Description:** Update database table configuration including field visibility, required status, ordering, and key field selection.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tableType` | string | Yes | Table type: "assets", "customers", "persons-employees", "maintenance", "warranties", or "contracts" |

**Request Body:**
```json
{
  "fields": [                        // Optional, array of field updates
    {
      "id": "purchase-date",
      "enabled": true,
      "required": false,
      "order": 3
    },
    {
      "id": "cost",
      "enabled": true,
      "required": true,
      "order": 4
    }
  ],
  "keyField": "asset-tag-id"        // Optional, ID of the field to set as key field
}
```

**Request Example:**
```http
PUT /api/v1/database-tables/assets/configuration
Authorization: Bearer <token>
Content-Type: application/json

{
  "fields": [
    {
      "id": "asset-tag-id",
      "enabled": true,
      "required": true,
      "order": 1
    },
    {
      "id": "asset-description",
      "enabled": true,
      "required": true,
      "order": 2
    },
    {
      "id": "purchase-date",
      "enabled": true,
      "required": false,
      "order": 3
    },
    {
      "id": "cost",
      "enabled": true,
      "required": false,
      "order": 4
    }
  ],
  "keyField": "asset-tag-id"
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "tableType": "assets",
    "keyField": "asset-tag-id",
    "fields": [
      {
        "id": "asset-tag-id",
        "name": "Asset Tag ID",
        "required": true,
        "enabled": true,
        "description": "This field holds the unique asset id number that your company assigns to identify each asset. These are generally sequentially numbered labels with barcodes.",
        "example": "A-1001",
        "isSystemField": true,
        "isKeyField": true,
        "order": 1
      },
      {
        "id": "asset-description",
        "name": "Asset Description",
        "required": true,
        "enabled": true,
        "description": "Description of the asset",
        "example": "HP - Envy Desktop - 12GB Memory - 2TB Hard Drive",
        "isSystemField": true,
        "order": 2
      },
      {
        "id": "purchase-date",
        "name": "Purchase Date",
        "required": false,
        "enabled": true,
        "description": "Date asset was purchased",
        "example": "08/22/2014",
        "isSystemField": false,
        "order": 3
      },
      {
        "id": "cost",
        "name": "Cost",
        "required": false,
        "enabled": true,
        "description": "Cost of the asset",
        "example": "₹225.75",
        "isSystemField": false,
        "order": 4
      }
    ],
    "updatedAt": "2024-01-20T11:00:00Z",
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
      "fields[0].id": "Field ID is required",
      "fields[0].enabled": "Enabled must be a boolean value",
      "fields[0].required": "Required must be a boolean value"
    }
  }
}

// 400 Bad Request - System Field Disabled
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "fields": "Cannot disable system fields: asset-tag-id, asset-description"
    }
  }
}

// 400 Bad Request - Invalid Key Field
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "keyField": "Key field must be an enabled field"
    }
  }
}
```

---

## Validation Rules

### Table Type
- Must be one of: `"assets"`, `"customers"`, `"persons-employees"`, `"maintenance"`, `"warranties"`, `"contracts"`
- Case-sensitive

### Field Updates
- Field `id` is required for each field update
- `enabled` must be a boolean if provided
- `required` must be a boolean if provided
- `order` must be a positive integer if provided
- System fields (`isSystemField: true`) cannot be disabled
- Required system fields cannot be made optional

### Key Field
- Must be the ID of an enabled field
- Only one key field can be set per table
- Key field is used as the unique identifier for the table
- Key field should have unique values across all records

### Field Order
- Must be a positive integer
- Lower order numbers appear first
- Order should be unique within a table (backend should handle conflicts)

---

## Table Types and Default Fields

### Assets Table
**System Fields (cannot be disabled):**
- `asset-tag-id` (required, typically key field)
- `asset-description` (required)

**Standard Fields:**
- `purchase-date` (optional)
- `cost` (optional)
- `purchased-from` (optional)
- `brand` (optional)
- `model` (optional)
- `serial-no` (optional)

### Customers Table
**System Fields:**
- `full-name` (required, typically key field)

**Standard Fields:**
- `email` (optional)
- `company` (optional)
- `address` (optional)
- `phone` (optional)
- `mobile-phone` (optional)
- `notes` (optional)

### Persons/Employees Table
**System Fields:**
- `full-name` (required, typically key field)

**Standard Fields:**
- `email` (optional)
- `employee-id` (optional)
- `title` (optional)
- `phone` (optional)
- `notes` (optional)
- `site` (optional, system field for linking)
- `location` (optional, system field for linking)
- `department` (optional, system field for linking)

### Maintenance Table
**System Fields:**
- `title` (required)

**Standard Fields:**
- `details` (optional)
- `due-date` (optional)
- `maintenance-by` (optional)
- `maintenance-status` (optional, system field)
- `date-completed` (optional)
- `maintenance-cost` (optional)

### Warranties Table
**System Fields:**
- `expiration-date` (required)

**Standard Fields:**
- `length` (optional)
- `notes` (optional)

### Contracts Table
**System Fields:**
- `contract-title` (required)
- `start-date` (required)
- `end-date` (required)

**Standard Fields:**
- `description` (optional)
- `hyperlink` (optional)
- `contract-no` (optional)
- `cost` (optional)
- `no-end-date` (optional, hasNoRadioButtons: true)
- `vendor` (optional)
- `contract-person` (optional)

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Authentication required or invalid token |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## Usage Examples

### Example 1: Get and update database table configuration

```javascript
// 1. Get current configuration
const response = await getDatabaseTableConfiguration("assets");
console.log(response.data);

// 2. Update configuration
await updateDatabaseTableConfiguration("assets", {
  fields: [
    { id: "purchase-date", enabled: true, required: false, order: 3 },
    { id: "cost", enabled: true, required: true, order: 4 }
  ],
  keyField: "asset-tag-id"
});
```

### Example 2: Disable a field

```javascript
await updateDatabaseTableConfiguration("assets", {
  fields: [
    { id: "brand", enabled: false }
  ]
});
```

### Example 3: Change key field

```javascript
await updateDatabaseTableConfiguration("customers", {
  keyField: "email" // Change from "full-name" to "email"
});
```

### Example 4: Reorder fields

```javascript
await updateDatabaseTableConfiguration("assets", {
  fields: [
    { id: "asset-tag-id", order: 1 },
    { id: "asset-description", order: 2 },
    { id: "cost", order: 3 },
    { id: "purchase-date", order: 4 }
  ]
});
```

---

## Notes

1. **System Fields:**
   - System fields are core fields that cannot be disabled
   - System fields are typically required fields
   - Examples: Asset Tag ID, Full Name, Contract Title

2. **Key Field:**
   - Key field is the unique identifier for the table
   - Only one key field can be set per table
   - Key field must be enabled
   - Key field values must be unique across all records
   - Changing key field may require data migration

3. **Field Ordering:**
   - Order determines display sequence in tables and forms
   - Lower order numbers appear first
   - If order is not provided, fields maintain their current order
   - Backend should handle order conflicts automatically

4. **Partial Updates:**
   - The API supports partial updates
   - Only provided fields in the `fields` array will be updated
   - Other fields will remain unchanged

5. **Default Configurations:**
   - Each table type has default field configurations
   - Defaults are returned when configuration doesn't exist (404)
   - Defaults should be stored in the backend

6. **hasNoRadioButtons:**
   - Some fields (like "No End Date" in contracts) don't have required/optional options
   - These fields are typically checkboxes or special fields
   - They can still be enabled/disabled but not marked as required/optional

7. **User-Specific vs System-wide:**
   - Database table configurations can be either user-specific or system-wide
   - If user-specific, each user can customize their own table views
   - If system-wide, changes affect all users
   - Implementation should be consistent with system architecture

8. **Key Field Selection:**
   - Key field selection is important for data integrity
   - Backend should validate that key field values are unique
   - Changing key field may require re-indexing or data migration

