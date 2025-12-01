# Import API Documentation

## Overview
This document describes the backend API endpoints required for the Import Wizard page (`/tools/import`). These endpoints allow importing data from CSV or Excel files into various tables.

## Base URLs
Each table type has its own base URL:
- Assets: `/api/v1/assets`
- Persons/Employees: `/api/v1/persons-employees`
- Customers: `/api/v1/customers`
- Users: `/api/v1/users`
- Maintenance: `/api/v1/maintenance`
- Warranties: `/api/v1/warranties`
- Contracts: `/api/v1/contracts`

## Authentication
All endpoints require authentication via Bearer token:
```
Authorization: Bearer <token>
```

---

## Import Endpoints

All import endpoints follow the same pattern:
- **Endpoint:** `POST /api/v1/{table-type}/import`

### Supported Table Types

| Table Type | Endpoint | Description |
|------------|----------|-------------|
| `assets` | `/api/v1/assets/import` | Import assets data |
| `persons-employees` | `/api/v1/persons-employees/import` | Import persons/employees data |
| `customers` | `/api/v1/customers/import` | Import customers data |
| `users` | `/api/v1/users/import` | Import users data |
| `maintenance` | `/api/v1/maintenance/import` | Import maintenance records |
| `warranties` | `/api/v1/warranties/import` | Import warranties data |
| `contracts` | `/api/v1/contracts/import` | Import contracts data |

---

## Common Import Endpoint Structure

### Request

**Method:** `POST`

**Content-Type:** `multipart/form-data`

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | Yes | CSV or Excel file (.csv, .xlsx, .xls) containing data to import |

**File Requirements:**
- Maximum file size: 10MB
- Maximum records per file: 5,000
- Supported formats: CSV, Excel (.xlsx, .xls)
- File must follow the template format (downloadable from template endpoint)

**Request Example:**
```http
POST /api/v1/assets/import
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: [binary file data]
```

### Response

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
      "assetId": "ASSET-003",
      "error": "Asset ID already exists"
    },
    {
      "row": 7,
      "name": "",
      "error": "Name is required"
    },
    {
      "row": 12,
      "email": "invalid.email",
      "error": "Invalid email format"
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

// 400 Bad Request - Too many records
{
  "error": {
    "code": "TOO_MANY_RECORDS",
    "message": "File contains more than 5,000 records. Please split into multiple files."
  }
}

// 400 Bad Request - Invalid template format
{
  "error": {
    "code": "INVALID_TEMPLATE",
    "message": "File does not match the required template format. Please download the template."
  }
}
```

---

## Template Download Endpoints

All template download endpoints follow the same pattern:
- **Endpoint:** `GET /api/v1/{table-type}/import-template`

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `format` | string | No | "xlsx" | Template format: "xlsx" or "csv" |

### Request Example

```http
GET /api/v1/assets/import-template?format=xlsx
Authorization: Bearer <token>
Accept: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
```

### Response

**Content-Type:**
- Excel: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- CSV: `text/csv; charset=utf-8`

**Content-Disposition:**
```
attachment; filename="{table-type}_import_template.{extension}"
```

**Body:** Template file (Excel or CSV) with column headers and example data

---

## Field Limits Download Endpoints

All field limits download endpoints follow the same pattern:
- **Endpoint:** `GET /api/v1/{table-type}/field-limits`

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `format` | string | No | "pdf" | Document format: "pdf", "xlsx", or "csv" |

### Request Example

```http
GET /api/v1/assets/field-limits?format=pdf
Authorization: Bearer <token>
Accept: application/pdf
```

### Response

**Content-Type:**
- PDF: `application/pdf`
- Excel: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- CSV: `text/csv; charset=utf-8`

**Content-Disposition:**
```
attachment; filename="{table-type}_field_limits.{extension}"
```

**Body:** Document containing field limits and validation rules

---

## Examples

### Example 1: Import Assets

**Request:**
```http
POST /api/v1/assets/import
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: [Excel file with asset data]
```

**Response:**
```json
{
  "message": "Import completed successfully",
  "totalRows": 50,
  "importedCount": 48,
  "failedCount": 2,
  "errors": [
    {
      "row": 5,
      "assetId": "ASSET-005",
      "error": "Asset ID already exists"
    },
    {
      "row": 12,
      "name": "",
      "error": "Name is required"
    }
  ]
}
```

### Example 2: Download Import Template

**Request:**
```http
GET /api/v1/customers/import-template?format=xlsx
Authorization: Bearer <token>
Accept: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
```

**Response:**
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Content-Disposition: `attachment; filename="customers_import_template.xlsx"`
- Body: Excel template file

### Example 3: Download Field Limits

**Request:**
```http
GET /api/v1/users/field-limits?format=pdf
Authorization: Bearer <token>
Accept: application/pdf
```

**Response:**
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="users_field_limits.pdf"`
- Body: PDF document with field limits

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Authentication required or invalid token |
| `INVALID_FILE_FORMAT` | 400 | File format not supported |
| `FILE_TOO_LARGE` | 413 | File size exceeds maximum limit (10MB) |
| `TOO_MANY_RECORDS` | 400 | File contains more than 5,000 records |
| `INVALID_TEMPLATE` | 400 | File does not match required template format |
| `VALIDATION_ERROR` | 400 | Data validation failed |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## Import Data Structure

### Assets Import Template

**Required Columns:**
- `assetId` (string, unique, max 100 chars)
- `name` (string, required, max 255 chars)
- `category` (string, optional)
- `site` (string, optional)
- `location` (string, optional)

**Optional Columns:**
- `description` (string, max 1000 chars)
- `serialNumber` (string, max 100 chars)
- `model` (string, max 100 chars)
- `manufacturer` (string, max 100 chars)
- `purchaseDate` (date, format: YYYY-MM-DD)
- `purchasePrice` (number)
- `status` (string: "active", "inactive", "maintenance", "retired")
- `notes` (string, max 2000 chars)

### Persons/Employees Import Template

**Required Columns:**
- `employeeId` (string, unique, max 50 chars)
- `name` (string, required, min 2, max 255 chars)
- `email` (string, required, unique, valid email format)
- `title` (string, required, max 100 chars)

**Optional Columns:**
- `phone` (string, max 20 chars)
- `site` (string, max 100 chars)
- `location` (string, max 100 chars)
- `department` (string, max 100 chars)
- `notes` (string, max 2000 chars)

### Customers Import Template

**Required Columns:**
- `name` (string, required, min 2, max 255 chars)
- `email` (string, required, unique, valid email format)

**Optional Columns:**
- `phone` (string, max 20 chars)
- `company` (string, max 255 chars)

### Users Import Template

**Required Columns:**
- `name` (string, required, min 2, max 255 chars)
- `email` (string, required, unique, valid email format)
- `password` (string, required, min 8 chars, must contain uppercase, lowercase, number, special char)
- `securityGroupId` (number/string, required, must exist)

**Optional Columns:**
- `phone` (string, max 20 chars)
- `jobTitle` (string, max 100 chars)
- `role` (string, max 100 chars)
- `status` (string: "active", "inactive", "suspended", default: "active")

### Maintenance Import Template

**Required Columns:**
- `assetId` (string, required, must exist)
- `maintenanceType` (string, required)
- `description` (string, required, max 1000 chars)
- `scheduledDate` (date, format: YYYY-MM-DD)

**Optional Columns:**
- `status` (string: "scheduled", "in-progress", "completed", "cancelled")
- `priority` (string: "low", "medium", "high", "urgent")
- `cost` (number)
- `technician` (string, max 100 chars)
- `completedDate` (date, format: YYYY-MM-DD)
- `notes` (string, max 2000 chars)

### Warranties Import Template

**Required Columns:**
- `assetId` (string, required, must exist)
- `warrantyType` (string, required)
- `provider` (string, required, max 255 chars)
- `startDate` (date, format: YYYY-MM-DD)
- `endDate` (date, format: YYYY-MM-DD)

**Optional Columns:**
- `status` (string: "active", "expired", "void")
- `coverageDetails` (string, max 2000 chars)
- `notes` (string, max 2000 chars)

### Contracts Import Template

**Required Columns:**
- `contractNumber` (string, required, unique, max 100 chars)
- `vendor` (string, required, max 255 chars)
- `type` (string, required)
- `startDate` (date, format: YYYY-MM-DD)
- `endDate` (date, format: YYYY-MM-DD)

**Optional Columns:**
- `status` (string: "active", "expired", "cancelled", "pending")
- `value` (number)
- `terms` (string, max 2000 chars)
- `notes` (string, max 2000 chars)

---

## Usage Examples

### JavaScript/TypeScript Example

```typescript
// Import assets from file
async function importAssets(file: File) {
  const token = localStorage.getItem("authToken");
  
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    "https://digitalasset.zenapi.co.in/api/v1/assets/import",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Import failed");
  }

  const result = await response.json();
  console.log(`Imported ${result.importedCount} of ${result.totalRows} records`);
  
  if (result.errors && result.errors.length > 0) {
    console.error("Import errors:", result.errors);
  }
  
  return result;
}

// Download template
async function downloadTemplate(tableType: string) {
  const token = localStorage.getItem("authToken");
  
  const response = await fetch(
    `https://digitalasset.zenapi.co.in/api/v1/${tableType}/import-template?format=xlsx`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Template download failed");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${tableType}_import_template.xlsx`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
```

### cURL Example

```bash
# Import assets
curl -X POST \
  "https://digitalasset.zenapi.co.in/api/v1/assets/import" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@assets_import.xlsx"

# Download template
curl -X GET \
  "https://digitalasset.zenapi.co.in/api/v1/assets/import-template?format=xlsx" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" \
  --output assets_template.xlsx
```

---

## Performance Considerations

1. **File Size Limits:**
   - Maximum file size: 10MB
   - Maximum records: 5,000 per file
   - For larger datasets, split into multiple files

2. **Processing Time:**
   - Small files (< 100 records): < 5 seconds
   - Medium files (100-1,000 records): 5-30 seconds
   - Large files (1,000-5,000 records): 30-120 seconds

3. **Validation:**
   - All records are validated before import
   - Invalid records are skipped and reported in errors
   - Valid records are imported even if some records fail

4. **Transaction Handling:**
   - Each record is imported in a separate transaction
   - Failed records don't affect successful imports
   - Partial imports are supported

---

## Security Considerations

1. **Authentication:**
   - All import endpoints require valid authentication
   - Token expiration should be handled gracefully

2. **File Validation:**
   - Files are validated for type and size before processing
   - Malicious files are rejected

3. **Data Validation:**
   - All imported data is validated against business rules
   - SQL injection and XSS attacks are prevented
   - Sensitive data is sanitized

4. **Rate Limiting:**
   - Implement rate limiting to prevent abuse
   - Suggested: 10 imports per hour per user

5. **Error Reporting:**
   - Error messages don't expose sensitive system information
   - Detailed errors are only shown to authorized users

---

## Notes

1. **Template Format:**
   - Templates include column headers in the first row
   - Templates may include example data in the second row
   - Users should follow the exact column order and names

2. **Data Types:**
   - Dates should be in YYYY-MM-DD format
   - Numbers should not include currency symbols or commas
   - Boolean values: "true"/"false" or "yes"/"no" or "1"/"0"

3. **Duplicate Handling:**
   - Duplicate unique fields (e.g., email, assetId) will cause import to fail for those rows
   - Check for duplicates before importing

4. **Required vs Optional Fields:**
   - Required fields must have values
   - Optional fields can be left empty
   - Field limits document specifies which fields are required

5. **Error Reporting:**
   - Errors include row number and specific field errors
   - First 10 errors are shown in response
   - All errors are logged for review

6. **Import Results:**
   - Response includes total rows, imported count, and failed count
   - Detailed error list helps identify and fix issues
   - Users can re-import after fixing errors

7. **Field Limits:**
   - Field limits document specifies maximum character lengths
   - Data exceeding limits will cause validation errors
   - Download field limits document before preparing import file

