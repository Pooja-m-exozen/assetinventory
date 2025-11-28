# Table Options API Documentation

## Overview
This document describes the backend API endpoints required for the Table Options management page (`/setup/table-options`). Table options control system-wide settings for asset depreciation and contracts/licenses.

## Base URL
```
/api/v1/table-options
```

## Authentication
All endpoints require authentication via Bearer token:
```
Authorization: Bearer <token>
```

---

## Data Models

### TableOptions Model
```typescript
interface TableOptions {
  assetDepreciation: boolean;        // Whether asset depreciation is enabled
  depreciationMethod?: string;        // Default depreciation method (required if assetDepreciation is true)
                                      // Values: "straight-line", "declining-balance", "sum-of-years", "units-of-production"
  calculationFrequency?: string;      // Calculation frequency (required if assetDepreciation is true)
                                      // Values: "monthly", "quarterly", "annually"
  enableContracts: boolean;           // Whether contracts/licenses feature is enabled
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

### 1. Get Table Options

**Endpoint:** `GET /api/v1/table-options`

**Description:** Retrieve current table options settings.

**Request Example:**
```http
GET /api/v1/table-options
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": {
    "assetDepreciation": true,
    "depreciationMethod": "declining-balance",
    "calculationFrequency": "monthly",
    "enableContracts": false,
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

// 404 Not Found (if options haven't been set yet)
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Table options not found"
  }
}
```

**Note:** If table options don't exist, the backend should return default values:
```json
{
  "data": {
    "assetDepreciation": false,
    "depreciationMethod": null,
    "calculationFrequency": null,
    "enableContracts": false
  }
}
```

---

### 2. Update Table Options

**Endpoint:** `PUT /api/v1/table-options`

**Description:** Update table options settings.

**Request Body:**
```json
{
  "assetDepreciation": true,              // Optional, boolean
  "depreciationMethod": "declining-balance",  // Optional, required if assetDepreciation is true
  "calculationFrequency": "monthly",      // Optional, required if assetDepreciation is true
  "enableContracts": false                // Optional, boolean
}
```

**Request Example:**
```http
PUT /api/v1/table-options
Authorization: Bearer <token>
Content-Type: application/json

{
  "assetDepreciation": true,
  "depreciationMethod": "declining-balance",
  "calculationFrequency": "monthly",
  "enableContracts": false
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "assetDepreciation": true,
    "depreciationMethod": "declining-balance",
    "calculationFrequency": "monthly",
    "enableContracts": false,
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
      "depreciationMethod": "Depreciation method is required when asset depreciation is enabled",
      "calculationFrequency": "Calculation frequency is required when asset depreciation is enabled"
    }
  }
}

// 400 Bad Request - Invalid Value
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "depreciationMethod": "Invalid depreciation method. Must be one of: straight-line, declining-balance, sum-of-years, units-of-production",
      "calculationFrequency": "Invalid calculation frequency. Must be one of: monthly, quarterly, annually"
    }
  }
}
```

---

## Validation Rules

### Asset Depreciation
- If `assetDepreciation` is `true`:
  - `depreciationMethod` is **required**
  - `calculationFrequency` is **required**
- If `assetDepreciation` is `false`:
  - `depreciationMethod` should be set to `null` or omitted
  - `calculationFrequency` should be set to `null` or omitted

### Depreciation Method
Valid values:
- `"straight-line"` - Straight Line depreciation
- `"declining-balance"` - Declining Balance depreciation
- `"sum-of-years"` - Sum of Years depreciation
- `"units-of-production"` - Units of Production depreciation

### Calculation Frequency
Valid values:
- `"monthly"` - Calculate depreciation monthly
- `"quarterly"` - Calculate depreciation quarterly
- `"annually"` - Calculate depreciation annually

### Enable Contracts
- Boolean value (`true` or `false`)
- No additional validation required

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Authentication required or invalid token |
| `NOT_FOUND` | 404 | Table options not found (should return defaults) |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## Usage Examples

### Example 1: Get and update table options

```javascript
// 1. Get current options
const response = await getTableOptions();
console.log(response.data);

// 2. Update options
await updateTableOptions({
  assetDepreciation: true,
  depreciationMethod: "straight-line",
  calculationFrequency: "monthly",
  enableContracts: true
});
```

### Example 2: Disable asset depreciation

```javascript
await updateTableOptions({
  assetDepreciation: false,
  enableContracts: true
});
```

### Example 3: Enable only contracts

```javascript
await updateTableOptions({
  assetDepreciation: false,
  enableContracts: true
});
```

---

## Notes

1. **Default Values:**
   - When table options are first accessed, default values should be returned
   - Default: `assetDepreciation: false`, `enableContracts: false`
   - Depreciation method and frequency are `null` when depreciation is disabled

2. **Depreciation Settings:**
   - Depreciation method and frequency are only required when `assetDepreciation` is `true`
   - These settings are used as defaults when creating new assets
   - Individual assets can override these default settings

3. **Contracts/Licenses:**
   - When `enableContracts` is `true`, the contracts/licenses feature becomes available
   - This enables contract management for assets and software licenses
   - When disabled, contract-related features are hidden/disabled

4. **Partial Updates:**
   - The API supports partial updates
   - Only provided fields will be updated
   - Other fields will remain unchanged

5. **System-wide Impact:**
   - Changes to table options affect the entire system
   - These are global settings that apply to all users
   - Changes should be logged for audit purposes

6. **Depreciation Methods:**
   - **Straight Line:** Equal depreciation over asset's useful life
   - **Declining Balance:** Accelerated depreciation method
   - **Sum of Years:** Depreciation based on sum of years digits
   - **Units of Production:** Depreciation based on usage/units

7. **Calculation Frequency:**
   - Determines how often depreciation is calculated
   - Monthly: Most frequent, most accurate
   - Quarterly: Balance between accuracy and performance
   - Annually: Least frequent, best performance

