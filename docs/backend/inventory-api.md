# Inventory API Documentation

## Overview
This document describes the backend API endpoints required for the Inventory management page (`/setup/inventory`). Inventory settings control inventory feature enablement and field configurations.

## Base URL
```
/api/v1/inventory
```

## Authentication
All endpoints require authentication via Bearer token:
```
Authorization: Bearer <token>
```

---

## Data Models

### InventoryField Model
```typescript
interface InventoryField {
  id: string;                        // Unique field identifier (e.g., "inventory-tag-id", "description")
  name: string;                      // Field display name (e.g., "Inventory Tag ID", "Description")
  isRequired: boolean;                // Whether this field is required (cannot be disabled)
  isKey?: boolean;                   // Whether this is a key field (primary identifier)
  enabled: boolean;                  // Whether this field is enabled
  customizeLabel: string;             // Custom label for the field
  labelSuggestions: string;          // Suggested alternative labels
  dataExample: string;               // Example data for this field
  dataRequired: "yes" | "optional";   // Whether data is required for this field
}
```

### InventorySettings Model
```typescript
interface InventorySettings {
  inventoryEnabled: boolean;          // Whether inventory feature is enabled
  fields: InventoryField[];          // Array of inventory fields
  updatedAt?: string;                 // ISO 8601 timestamp
  updatedBy?: number | string;        // User ID who last updated the record
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

### 1. Get Inventory Settings

**Endpoint:** `GET /api/v1/inventory/settings`

**Description:** Retrieve current inventory settings including enabled status and field configurations.

**Request Example:**
```http
GET /api/v1/inventory/settings
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": {
    "inventoryEnabled": true,
    "fields": [
      {
        "id": "inventory-tag-id",
        "name": "Inventory Tag ID",
        "isRequired": true,
        "isKey": true,
        "enabled": true,
        "customizeLabel": "Inventory",
        "labelSuggestions": "Tag ID, SKU",
        "dataExample": "INV-1001",
        "dataRequired": "yes"
      },
      {
        "id": "description",
        "name": "Description",
        "isRequired": true,
        "enabled": true,
        "customizeLabel": "Description",
        "labelSuggestions": "Title",
        "dataExample": "Heavy-Duty Metal Asset Tags",
        "dataRequired": "yes"
      },
      {
        "id": "unit",
        "name": "Unit",
        "isRequired": true,
        "enabled": true,
        "customizeLabel": "Unit",
        "labelSuggestions": "Unit of Measurement",
        "dataExample": "pcs",
        "dataRequired": "yes"
      },
      {
        "id": "stock",
        "name": "Stock",
        "isRequired": false,
        "enabled": false,
        "customizeLabel": "Stock",
        "labelSuggestions": "Stock-in-hand",
        "dataExample": "The total quantity in stock is calculated",
        "dataRequired": "optional"
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

// 404 Not Found (if settings haven't been set yet)
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Inventory settings not found"
  }
}
```

**Note:** If inventory settings don't exist, the backend should return default values with predefined fields.

---

### 2. Update Inventory Settings

**Endpoint:** `PUT /api/v1/inventory/settings`

**Description:** Update inventory settings including enable/disable and field configurations.

**Request Body:**
```json
{
  "inventoryEnabled": true,          // Optional, boolean
  "fields": [                        // Optional, array of field updates
    {
      "id": "inventory-tag-id",
      "enabled": true
    },
    {
      "id": "stock",
      "enabled": false,
      "dataRequired": "optional"
    }
  ]
}
```

**Request Example:**
```http
PUT /api/v1/inventory/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "inventoryEnabled": true,
  "fields": [
    {
      "id": "inventory-tag-id",
      "enabled": true
    },
    {
      "id": "description",
      "enabled": true
    },
    {
      "id": "unit",
      "enabled": true
    },
    {
      "id": "stock",
      "enabled": false,
      "dataRequired": "optional"
    }
  ]
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "inventoryEnabled": true,
    "fields": [
      {
        "id": "inventory-tag-id",
        "name": "Inventory Tag ID",
        "isRequired": true,
        "isKey": true,
        "enabled": true,
        "customizeLabel": "Inventory",
        "labelSuggestions": "Tag ID, SKU",
        "dataExample": "INV-1001",
        "dataRequired": "yes"
      },
      {
        "id": "description",
        "name": "Description",
        "isRequired": true,
        "enabled": true,
        "customizeLabel": "Description",
        "labelSuggestions": "Title",
        "dataExample": "Heavy-Duty Metal Asset Tags",
        "dataRequired": "yes"
      },
      {
        "id": "unit",
        "name": "Unit",
        "isRequired": true,
        "enabled": true,
        "customizeLabel": "Unit",
        "labelSuggestions": "Unit of Measurement",
        "dataExample": "pcs",
        "dataRequired": "yes"
      },
      {
        "id": "stock",
        "name": "Stock",
        "isRequired": false,
        "enabled": false,
        "customizeLabel": "Stock",
        "labelSuggestions": "Stock-in-hand",
        "dataExample": "The total quantity in stock is calculated",
        "dataRequired": "optional"
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
      "fields[0].enabled": "Enabled must be a boolean value"
    }
  }
}

// 400 Bad Request - Required Field Disabled
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "fields": "Cannot disable required fields: inventory-tag-id, description, unit"
    }
  }
}
```

---

### 3. Update Inventory Field Label

**Endpoint:** `PUT /api/v1/inventory/fields/:fieldId/label`

**Description:** Update the custom label for a specific inventory field.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `fieldId` | string | Yes | Field ID (e.g., "inventory-tag-id", "description") |

**Request Body:**
```json
{
  "customizeLabel": "Custom Label Name"  // Required, string, max 100 chars
}
```

**Request Example:**
```http
PUT /api/v1/inventory/fields/inventory-tag-id/label
Authorization: Bearer <token>
Content-Type: application/json

{
  "customizeLabel": "Inventory Tag"
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": "inventory-tag-id",
    "name": "Inventory Tag ID",
    "isRequired": true,
    "isKey": true,
    "enabled": true,
    "customizeLabel": "Inventory Tag",
    "labelSuggestions": "Tag ID, SKU",
    "dataExample": "INV-1001",
    "dataRequired": "yes"
  }
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Field with ID 'inventory-tag-id' not found"
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

### Inventory Enabled
- Boolean value (`true` or `false`)
- When disabled, inventory features are hidden/disabled throughout the system

### Field Updates
- Field `id` is required for each field update
- `enabled` must be a boolean if provided
- `dataRequired` must be either `"yes"` or `"optional"` if provided
- Required fields (`isRequired: true`) cannot be disabled
- Key fields (`isKey: true`) cannot be disabled

### Customize Label
- Required when updating field label
- Maximum 100 characters
- Cannot be empty

### Data Required
- Must be either `"yes"` or `"optional"`
- `"yes"` means data is required when the field is enabled
- `"optional"` means data is optional even when the field is enabled

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

### Example 1: Get and update inventory settings

```javascript
// 1. Get current settings
const response = await getInventorySettings();
console.log(response.data);

// 2. Update settings
await updateInventorySettings({
  inventoryEnabled: true,
  fields: [
    { id: "stock", enabled: true, dataRequired: "optional" }
  ]
});
```

### Example 2: Disable inventory

```javascript
await updateInventorySettings({
  inventoryEnabled: false
});
```

### Example 3: Update field label

```javascript
await updateInventoryFieldLabel("inventory-tag-id", "Inventory Tag");
```

### Example 4: Bulk update fields

```javascript
await updateInventorySettings({
  fields: [
    { id: "inventory-tag-id", enabled: true },
    { id: "description", enabled: true },
    { id: "unit", enabled: true },
    { id: "stock", enabled: false, dataRequired: "optional" }
  ]
});
```

---

## Notes

1. **Default Fields:**
   - The system should have predefined inventory fields
   - Required fields: `inventory-tag-id`, `description`, `unit`
   - Optional fields: `stock` and others as configured
   - Required fields cannot be disabled

2. **Field IDs:**
   - Field IDs are predefined strings (e.g., "inventory-tag-id", "description")
   - These IDs are used as unique identifiers and should not be changed
   - Field IDs are case-sensitive

3. **Required Fields:**
   - Fields with `isRequired: true` must always be enabled
   - Attempting to disable required fields will result in a validation error
   - Required fields typically include: Inventory Tag ID, Description, Unit

4. **Key Fields:**
   - Fields with `isKey: true` are primary identifiers
   - Key fields cannot be disabled
   - Typically only "inventory-tag-id" is a key field

5. **Partial Updates:**
   - The API supports partial updates
   - Only provided fields in the `fields` array will be updated
   - Other fields will remain unchanged

6. **System-wide Impact:**
   - Changes to inventory settings affect the entire system
   - When `inventoryEnabled` is false, inventory features are hidden
   - Field enable/disable affects which fields appear in inventory forms

7. **Label Customization:**
   - Custom labels allow users to rename fields for their organization
   - Label suggestions provide alternative naming options
   - Custom labels are displayed in the UI instead of default field names

8. **Data Required:**
   - `"yes"`: Data must be provided when the field is enabled
   - `"optional"`: Data can be left empty even when the field is enabled
   - This setting affects form validation in inventory entry forms

