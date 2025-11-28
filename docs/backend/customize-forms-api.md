# Customize Forms API Documentation

## Overview
This document describes the backend API endpoints required for the Customize Forms pages (`/setup/customize-forms/*`). The API manages form field configurations for different entity types (assets, customers, persons-employees, inventory).

## Base URL
```
/api/v1/forms
```

## Authentication
All endpoints require authentication via Bearer token:
```
Authorization: Bearer <token>
```

---

## Data Models

### FormField Model
```typescript
interface FormField {
  id: string;                        // Unique field identifier (e.g., "asset-tag-id", "description")
  name: string;                      // Field display name (e.g., "Asset Tag ID", "Description")
  required: boolean;                 // Whether this field is required
  enabled: boolean;                  // Whether this field is enabled/visible
  description?: string;              // Field description/help text
  example?: string;                  // Example value for the field
  isSystemField?: boolean;          // Whether this is a system field (cannot be disabled)
  order?: number;                    // Display order (for sorting)
  customizeLabel?: string;           // Custom label for the field
  fieldType?: string;               // Field type (e.g., "text", "date", "number", "select")
}
```

### FormConfiguration Model
```typescript
interface FormConfiguration {
  formType: "assets" | "customers" | "persons-employees" | "inventory";
  fields: FormField[];              // Array of form fields
  updatedAt?: string;               // ISO 8601 timestamp
  updatedBy?: number | string;      // User ID who last updated the configuration
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

### 1. Get Form Configuration

**Endpoint:** `GET /api/v1/forms/:formType/configuration`

**Description:** Retrieve form configuration for a specific form type including all fields and their settings.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `formType` | string | Yes | Form type: "assets", "customers", "persons-employees", or "inventory" |

**Request Example:**
```http
GET /api/v1/forms/assets/configuration
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": {
    "formType": "assets",
    "fields": [
      {
        "id": "asset-tag-id",
        "name": "Asset Tag ID",
        "required": true,
        "enabled": true,
        "description": "This field holds the unique asset id number that your company assigns to identify each asset. These are generally sequentially numbered labels with barcodes.",
        "example": "A-1001",
        "isSystemField": true,
        "order": 1,
        "fieldType": "text"
      },
      {
        "id": "asset-description",
        "name": "Asset Description",
        "required": true,
        "enabled": true,
        "description": "Description of the asset",
        "example": "HP - Envy Desktop - 12GB Memory - 2TB Hard Drive",
        "isSystemField": true,
        "order": 2,
        "fieldType": "text"
      },
      {
        "id": "purchase-date",
        "name": "Purchase Date",
        "required": false,
        "enabled": true,
        "description": "Date asset was purchased",
        "example": "08/22/2014",
        "isSystemField": false,
        "order": 3,
        "fieldType": "date"
      },
      {
        "id": "cost",
        "name": "Cost",
        "required": false,
        "enabled": true,
        "description": "Cost of the asset",
        "example": "₹225.75",
        "isSystemField": false,
        "order": 4,
        "fieldType": "number"
      },
      {
        "id": "brand",
        "name": "Brand",
        "required": false,
        "enabled": true,
        "description": "Manufacturer of the asset",
        "example": "HP",
        "isSystemField": false,
        "order": 5,
        "fieldType": "text"
      },
      {
        "id": "model",
        "name": "Model",
        "required": false,
        "enabled": true,
        "description": "Model name of the asset",
        "example": "Envy",
        "isSystemField": false,
        "order": 6,
        "fieldType": "text"
      },
      {
        "id": "serial-no",
        "name": "Serial No",
        "required": false,
        "enabled": true,
        "description": "Manufacturer's serial number",
        "example": "HG9C3X",
        "isSystemField": false,
        "order": 7,
        "fieldType": "text"
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
    "message": "Form configuration not found"
  }
}

// 400 Bad Request - Invalid form type
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid form type. Must be one of: assets, customers, persons-employees, inventory"
  }
}
```

**Note:** If form configuration doesn't exist, the backend should return default values with predefined fields for the form type.

---

### 2. Update Form Configuration

**Endpoint:** `PUT /api/v1/forms/:formType/configuration`

**Description:** Update form configuration including field visibility, required status, and ordering.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `formType` | string | Yes | Form type: "assets", "customers", "persons-employees", or "inventory" |

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
  ]
}
```

**Request Example:**
```http
PUT /api/v1/forms/assets/configuration
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
    },
    {
      "id": "brand",
      "enabled": true,
      "required": false,
      "order": 5
    },
    {
      "id": "model",
      "enabled": true,
      "required": false,
      "order": 6
    },
    {
      "id": "serial-no",
      "enabled": true,
      "required": false,
      "order": 7
    }
  ]
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "formType": "assets",
    "fields": [
      {
        "id": "asset-tag-id",
        "name": "Asset Tag ID",
        "required": true,
        "enabled": true,
        "description": "This field holds the unique asset id number that your company assigns to identify each asset. These are generally sequentially numbered labels with barcodes.",
        "example": "A-1001",
        "isSystemField": true,
        "order": 1,
        "fieldType": "text"
      },
      {
        "id": "asset-description",
        "name": "Asset Description",
        "required": true,
        "enabled": true,
        "description": "Description of the asset",
        "example": "HP - Envy Desktop - 12GB Memory - 2TB Hard Drive",
        "isSystemField": true,
        "order": 2,
        "fieldType": "text"
      },
      {
        "id": "purchase-date",
        "name": "Purchase Date",
        "required": false,
        "enabled": true,
        "description": "Date asset was purchased",
        "example": "08/22/2014",
        "isSystemField": false,
        "order": 3,
        "fieldType": "date"
      },
      {
        "id": "cost",
        "name": "Cost",
        "required": false,
        "enabled": true,
        "description": "Cost of the asset",
        "example": "₹225.75",
        "isSystemField": false,
        "order": 4,
        "fieldType": "number"
      },
      {
        "id": "brand",
        "name": "Brand",
        "required": false,
        "enabled": true,
        "description": "Manufacturer of the asset",
        "example": "HP",
        "isSystemField": false,
        "order": 5,
        "fieldType": "text"
      },
      {
        "id": "model",
        "name": "Model",
        "required": false,
        "enabled": true,
        "description": "Model name of the asset",
        "example": "Envy",
        "isSystemField": false,
        "order": 6,
        "fieldType": "text"
      },
      {
        "id": "serial-no",
        "name": "Serial No",
        "required": false,
        "enabled": true,
        "description": "Manufacturer's serial number",
        "example": "HG9C3X",
        "isSystemField": false,
        "order": 7,
        "fieldType": "text"
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
```

---

### 3. Update Form Field Label

**Endpoint:** `PUT /api/v1/forms/:formType/fields/:fieldId/label`

**Description:** Update the custom label for a specific form field.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `formType` | string | Yes | Form type: "assets", "customers", "persons-employees", or "inventory" |
| `fieldId` | string | Yes | Field ID (e.g., "asset-tag-id", "description") |

**Request Body:**
```json
{
  "customizeLabel": "Custom Label Name"  // Required, string, max 100 chars
}
```

**Request Example:**
```http
PUT /api/v1/forms/assets/fields/asset-tag-id/label
Authorization: Bearer <token>
Content-Type: application/json

{
  "customizeLabel": "Asset ID"
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": "asset-tag-id",
    "name": "Asset Tag ID",
    "required": true,
    "enabled": true,
    "description": "This field holds the unique asset id number that your company assigns to identify each asset. These are generally sequentially numbered labels with barcodes.",
    "example": "A-1001",
    "isSystemField": true,
    "order": 1,
    "customizeLabel": "Asset ID",
    "fieldType": "text"
  }
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Field with ID 'asset-tag-id' not found"
  }
}

// 400 Bad Request - Validation Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "customizeLabel": "Custom label is required and must be less than 100 characters"
    }
  }
}
```

---

## Validation Rules

### Form Type
- Must be one of: `"assets"`, `"customers"`, `"persons-employees"`, `"inventory"`
- Case-sensitive

### Field Updates
- Field `id` is required for each field update
- `enabled` must be a boolean if provided
- `required` must be a boolean if provided
- `order` must be a positive integer if provided
- System fields (`isSystemField: true`) cannot be disabled
- Required system fields cannot be made optional

### Customize Label
- Required when updating field label
- Maximum 100 characters
- Cannot be empty

### Field Order
- Must be a positive integer
- Lower order numbers appear first
- Order should be unique within a form (backend should handle conflicts)

---

## Form Types and Default Fields

### Assets Form
**System Fields (cannot be disabled):**
- `asset-tag-id` (required)
- `asset-description` (required)

**Standard Fields:**
- `purchase-date` (optional)
- `cost` (optional)
- `purchased-from` (optional)
- `brand` (optional)
- `model` (optional)
- `serial-no` (optional)

### Customers Form
**System Fields:**
- `name` (required)
- `email` (required)

**Standard Fields:**
- `phone` (optional)
- `company` (optional)
- `address` (optional)

### Persons/Employees Form
**System Fields:**
- `name` (required)
- `email` (required)
- `employeeId` (required)

**Standard Fields:**
- `title` (optional)
- `phone` (optional)
- `site` (optional)
- `location` (optional)
- `department` (optional)

### Inventory Form
**System Fields:**
- `inventory-tag-id` (required)
- `description` (required)
- `unit` (required)

**Standard Fields:**
- `stock` (optional)

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

### Example 1: Get and update form configuration

```javascript
// 1. Get current configuration
const response = await getFormConfiguration("assets");
console.log(response.data);

// 2. Update configuration
await updateFormConfiguration("assets", {
  fields: [
    { id: "purchase-date", enabled: true, required: false, order: 3 },
    { id: "cost", enabled: true, required: true, order: 4 }
  ]
});
```

### Example 2: Disable a field

```javascript
await updateFormConfiguration("assets", {
  fields: [
    { id: "brand", enabled: false }
  ]
});
```

### Example 3: Update field label

```javascript
await updateFormFieldLabel("assets", "asset-tag-id", "Asset ID");
```

### Example 4: Reorder fields

```javascript
await updateFormConfiguration("assets", {
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
   - Examples: Asset Tag ID, Description, Name, Email

2. **Field Ordering:**
   - Order determines display sequence in forms
   - Lower order numbers appear first
   - If order is not provided, fields maintain their current order
   - Backend should handle order conflicts automatically

3. **Partial Updates:**
   - The API supports partial updates
   - Only provided fields in the `fields` array will be updated
   - Other fields will remain unchanged

4. **Default Configurations:**
   - Each form type has default field configurations
   - Defaults are returned when configuration doesn't exist (404)
   - Defaults should be stored in the backend

5. **Field Types:**
   - Common field types: "text", "date", "number", "select", "textarea", "email", "phone"
   - Field type affects validation and UI rendering
   - Field type cannot be changed via API (defined in system)

6. **Custom Labels:**
   - Custom labels allow users to rename fields for their organization
   - Custom labels are displayed in forms instead of default field names
   - If no custom label is set, default name is used

7. **User-Specific vs System-wide:**
   - Form configurations can be either user-specific or system-wide
   - If user-specific, each user can customize their own forms
   - If system-wide, changes affect all users
   - Implementation should be consistent with system architecture

