# Export API Documentation

## Overview
This document describes the backend API endpoints required for the Export Tables page (`/tools/export`). These endpoints allow exporting data from various tables in CSV or Excel format.

## Base URLs
Each table type has its own base URL:
- Assets: `/api/v1/assets`
- Persons/Employees: `/api/v1/persons-employees`
- Customers: `/api/v1/customers`
- Maintenance: `/api/v1/maintenance`
- Warranties: `/api/v1/warranties`
- Contracts: `/api/v1/contracts`
- Users: `/api/v1/users`
- Security Groups: `/api/v1/security-groups`

## Authentication
All endpoints require authentication via Bearer token:
```
Authorization: Bearer <token>
```

---

## Export Endpoints

All export endpoints follow the same pattern:
- **Endpoint:** `GET /api/v1/{table-type}/export`
- **Alternative:** `GET /api/v1/{table-type}/export-data` (fallback if primary endpoint fails)

### Supported Table Types

| Table Type | Endpoint | Description |
|------------|----------|-------------|
| `assets` | `/api/v1/assets/export` | Export assets data |
| `persons-employees` | `/api/v1/persons-employees/export` | Export persons/employees data |
| `customers` | `/api/v1/customers/export` | Export customers data |
| `maintenance` | `/api/v1/maintenance/export` | Export maintenance records |
| `warranties` | `/api/v1/warranties/export` | Export warranties data |
| `contracts` | `/api/v1/contracts/export` | Export contracts data |
| `users` | `/api/v1/users/export` | Export users data |
| `security-groups` | `/api/v1/security-groups/export` | Export security groups data |

---

## Common Export Endpoint Structure

### Query Parameters

All export endpoints support the following query parameters:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `format` | string | No | "csv" | Export format: "csv" or "xlsx" |
| `search` | string | No | - | Search query string (applies same filters as list endpoint) |
| `searchField` | string | No | "all" | Field to search in (varies by table type) |

**Additional Parameters:**
Some table types support additional filtering parameters (same as their list endpoints):
- **Users**: `status`, `securityGroupId`
- **Assets**: `categoryId`, `siteId`, `locationId`, `status`
- **Maintenance**: `status`, `priority`, `assetId`
- **Warranties**: `status`, `assetId`
- **Contracts**: `status`, `vendorId`

### Request Headers

```
Authorization: Bearer <token>
Accept: text/csv (for CSV) or application/vnd.openxmlformats-officedocument.spreadsheetml.sheet (for Excel)
```

### Response

**Content-Type:**
- CSV: `text/csv; charset=utf-8`
- Excel: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`

**Content-Disposition:**
```
attachment; filename="{table-type}_export_{date}.{extension}"
```

**Body:** Binary file content (CSV or Excel file)

---

## Examples

### 1. Export Assets to Excel

**Endpoint:** `GET /api/v1/assets/export`

**Request Example:**
```http
GET /api/v1/assets/export?format=xlsx&search=laptop&searchField=all
Authorization: Bearer <token>
Accept: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
```

**Response:**
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Content-Disposition: `attachment; filename="assets_export_2024-01-20.xlsx"`
- Body: Excel file binary data

---

### 2. Export Customers to CSV

**Endpoint:** `GET /api/v1/customers/export`

**Request Example:**
```http
GET /api/v1/customers/export?format=csv
Authorization: Bearer <token>
Accept: text/csv
```

**Response:**
- Content-Type: `text/csv; charset=utf-8`
- Content-Disposition: `attachment; filename="customers_export_2024-01-20.csv"`
- Body: CSV file content

---

### 3. Export Users with Filters

**Endpoint:** `GET /api/v1/users/export`

**Request Example:**
```http
GET /api/v1/users/export?format=xlsx&status=active&securityGroupId=1
Authorization: Bearer <token>
Accept: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
```

**Response:**
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Content-Disposition: `attachment; filename="users_export_2024-01-20.xlsx"`
- Body: Excel file binary data (containing only active users from security group 1)

---

### 4. Export Persons/Employees with Search

**Endpoint:** `GET /api/v1/persons-employees/export`

**Request Example:**
```http
GET /api/v1/persons-employees/export?format=csv&search=john&searchField=name
Authorization: Bearer <token>
Accept: text/csv
```

**Response:**
- Content-Type: `text/csv; charset=utf-8`
- Content-Disposition: `attachment; filename="persons-employees_export_2024-01-20.csv"`
- Body: CSV file content (containing only records matching "john" in name field)

---

## Error Responses

### 401 Unauthorized
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

### 404 Not Found
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Export endpoint not found"
  }
}
```

**Note:** If the primary `/export` endpoint returns 404 with a message indicating "export" was treated as an ID, the frontend should try the alternative `/export-data` endpoint.

### 500 Internal Server Error
```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An error occurred while exporting data"
  }
}
```

### 400 Bad Request - Invalid Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid export format. Supported formats: csv, xlsx"
  }
}
```

---

## File Format Specifications

### CSV Format
- **Encoding:** UTF-8
- **Delimiter:** Comma (`,`)
- **Line Endings:** CRLF (`\r\n`)
- **Header Row:** First row contains column names
- **Quoting:** Fields containing commas, quotes, or newlines are quoted with double quotes
- **Date Format:** ISO 8601 (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ)

### Excel Format (XLSX)
- **Format:** Microsoft Excel 2007+ (.xlsx)
- **Sheets:** Single sheet named after the table type
- **Header Row:** First row contains column names (bold, with background color)
- **Column Width:** Auto-adjusted based on content
- **Date Format:** Excel date format (localized based on server settings)
- **Data Types:** Properly formatted (numbers, dates, text)

---

## Export Data Structure

### Assets Export
Columns included:
- Asset ID
- Name
- Category
- Site
- Location
- Status
- Purchase Date
- Purchase Price
- Serial Number
- Model
- Manufacturer
- Created Date
- Updated Date

### Persons/Employees Export
Columns included:
- ID
- Name
- Employee ID
- Title
- Email
- Phone
- Site
- Location
- Department
- Notes
- Created Date
- Updated Date

### Customers Export
Columns included:
- ID
- Name
- Email
- Phone
- Company
- Created Date
- Updated Date

### Users Export
Columns included:
- ID
- Name
- Email
- Phone
- Job Title
- Role
- Security Group
- Status
- Last Login
- Created Date
- Updated Date

### Maintenance Export
Columns included:
- ID
- Asset ID
- Asset Name
- Maintenance Type
- Description
- Status
- Priority
- Scheduled Date
- Completed Date
- Cost
- Technician
- Notes
- Created Date
- Updated Date

### Warranties Export
Columns included:
- ID
- Asset ID
- Asset Name
- Warranty Type
- Provider
- Start Date
- End Date
- Status
- Coverage Details
- Notes
- Created Date
- Updated Date

### Contracts Export
Columns included:
- ID
- Contract Number
- Vendor
- Type
- Start Date
- End Date
- Status
- Value
- Terms
- Notes
- Created Date
- Updated Date

### Security Groups Export
Columns included:
- ID
- Name
- Description
- Active Users Count
- Is System Group
- Created Date
- Updated Date

---

## Usage Examples

### JavaScript/TypeScript Example

```typescript
// Export assets to Excel
async function exportAssets() {
  const token = localStorage.getItem("authToken");
  
  const response = await fetch(
    "https://digitalasset.zenapi.co.in/api/v1/assets/export?format=xlsx",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Export failed");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `assets_export_${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
```

### cURL Example

```bash
# Export customers to CSV
curl -X GET \
  "https://digitalasset.zenapi.co.in/api/v1/customers/export?format=csv" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: text/csv" \
  --output customers_export.csv
```

---

## Performance Considerations

1. **Large Datasets:**
   - Exports may take time for large datasets (10,000+ records)
   - Consider implementing pagination or date range filters for very large exports
   - Server may timeout for extremely large exports (>100,000 records)

2. **Concurrent Exports:**
   - Limit concurrent export requests per user
   - Consider implementing a queue system for large exports

3. **File Size:**
   - CSV files are generally smaller than Excel files
   - Excel files with formatting may be 2-3x larger than CSV
   - Large exports (>50MB) may require streaming or chunked download

---

## Security Considerations

1. **Authentication:**
   - All export endpoints require valid authentication
   - Token expiration should be handled gracefully

2. **Authorization:**
   - Users should only be able to export data they have permission to view
   - Consider role-based access control for sensitive data

3. **Rate Limiting:**
   - Implement rate limiting to prevent abuse
   - Suggested: 10 exports per minute per user

4. **Data Privacy:**
   - Ensure exported files don't contain sensitive information users shouldn't access
   - Consider data masking for sensitive fields in exports

---

## Notes

1. **Alternative Endpoints:**
   - If the primary `/export` endpoint fails with a 404 error indicating "export" was treated as an ID, try the alternative `/export-data` endpoint
   - This handles cases where the routing might conflict with dynamic ID routes

2. **Search and Filters:**
   - Export endpoints respect the same search and filter parameters as their corresponding list endpoints
   - All records matching the filters will be included in the export

3. **Date Formatting:**
   - Dates in CSV are formatted as ISO 8601 strings
   - Dates in Excel are formatted as Excel date values (can be formatted by Excel)

4. **Empty Results:**
   - If no records match the filters, the export will still generate a file with only the header row

5. **Special Characters:**
   - CSV exports properly escape special characters (commas, quotes, newlines)
   - Excel exports handle special characters natively

6. **File Naming:**
   - Files are named as: `{table-type}_export_{YYYY-MM-DD}.{extension}`
   - Example: `assets_export_2024-01-20.xlsx`

