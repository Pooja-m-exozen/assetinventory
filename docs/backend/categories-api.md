# Categories API Documentation

## Overview
This document describes the backend API endpoints required for the Categories management page (`/setup/categories`).

## Base URL
```
/api/v1/categories
```

## Authentication
All endpoints require authentication via Bearer token:
```
Authorization: Bearer <token>
```

---

## Data Models

### Category Model
```typescript
interface Category {
  id: number | string;              // Unique identifier
  category: string;                  // Category name (required, min 2 chars, max 255 chars, unique)
  description?: string;              // Category description (optional, max 500 chars)
  assetCount?: number;                // Number of assets using this category (read-only)
  createdAt?: string;                // ISO 8601 timestamp
  updatedAt?: string;                // ISO 8601 timestamp
  createdBy?: number | string;       // User ID who created the record
  updatedBy?: number | string;       // User ID who last updated the record
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

### 1. Get Categories List

**Endpoint:** `GET /api/v1/categories`

**Description:** Retrieve a paginated list of categories with optional search.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 10 | Records per page (10, 25, 50, 100) |
| `search` | string | No | - | Search query string (searches in category name) |

**Request Example:**
```http
GET /api/v1/categories?page=1&limit=10&search=equipment
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "category": "Asset",
      "description": "General asset category",
      "assetCount": 25,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "createdBy": 1,
      "updatedBy": 1
    },
    {
      "id": 2,
      "category": "Building improvements",
      "description": "",
      "assetCount": 5,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "createdBy": 1,
      "updatedBy": 1
    }
  ],
  "pagination": {
    "currentPage": 1,
    "recordsPerPage": 10,
    "totalRecords": 9,
    "totalPages": 1,
    "startRecord": 1,
    "endRecord": 9
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
    "message": "An error occurred while fetching categories"
  }
}
```

---

### 2. Get Single Category

**Endpoint:** `GET /api/v1/categories/:id`

**Description:** Retrieve a single category by ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Category ID |

**Request Example:**
```http
GET /api/v1/categories/1
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "category": "Asset",
    "description": "General asset category",
    "assetCount": 25,
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
    "message": "Category with ID 1 not found"
  }
}
```

---

### 3. Create Category

**Endpoint:** `POST /api/v1/categories`

**Description:** Create a new category.

**Request Body:**
```json
{
  "category": "Electronics",        // Required, min 2 chars, max 255 chars, unique
  "description": "Electronic devices and equipment"  // Optional, max 500 chars
}
```

**Request Example:**
```http
POST /api/v1/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "category": "Electronics",
  "description": "Electronic devices and equipment"
}
```

**Response Example (201 Created):**
```json
{
  "data": {
    "id": 10,
    "category": "Electronics",
    "description": "Electronic devices and equipment",
    "assetCount": 0,
    "createdAt": "2024-01-20T10:30:00Z",
    "updatedAt": "2024-01-20T10:30:00Z",
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
      "category": "Category name is required"
    }
  }
}

// 400 Bad Request - Duplicate Category
{
  "error": {
    "code": "DUPLICATE_ERROR",
    "message": "Category with this name already exists"
  }
}
```

---

### 4. Update Category

**Endpoint:** `PUT /api/v1/categories/:id`

**Description:** Update an existing category.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Category ID |

**Request Body:**
```json
{
  "category": "Electronics Updated",  // Optional, min 2 chars, max 255 chars
  "description": "Updated description"  // Optional, max 500 chars
}
```

**Request Example:**
```http
PUT /api/v1/categories/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "category": "Electronics Updated",
  "description": "Updated description"
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "category": "Electronics Updated",
    "description": "Updated description",
    "assetCount": 25,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T11:00:00Z",
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
    "message": "Category with ID 1 not found"
  }
}

// 400 Bad Request - Validation Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "category": "Category name must be at least 2 characters"
    }
  }
}
```

---

### 5. Delete Category

**Endpoint:** `DELETE /api/v1/categories/:id`

**Description:** Delete a category by ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Category ID |

**Request Example:**
```http
DELETE /api/v1/categories/1
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "message": "Category deleted successfully"
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Category with ID 1 not found"
  }
}

// 400 Bad Request - Category has assets
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Cannot delete category with assigned assets. Please reassign or remove assets first."
  }
}
```

---

### 6. Bulk Delete Categories

**Endpoint:** `POST /api/v1/categories/bulk-delete`

**Description:** Delete multiple categories by their IDs.

**Request Body:**
```json
{
  "ids": [1, 2, 3]  // Array of category IDs
}
```

**Request Example:**
```http
POST /api/v1/categories/bulk-delete
Authorization: Bearer <token>
Content-Type: application/json

{
  "ids": [1, 2, 3]
}
```

**Response Example (200 OK):**
```json
{
  "message": "Categories deleted successfully",
  "deletedCount": 3
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
      "ids": "At least one category ID is required"
    }
  }
}
```

---

### 7. Import Categories

**Endpoint:** `POST /api/v1/categories/import`

**Description:** Import categories from CSV or Excel file.

**Request Body:** `multipart/form-data`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | Yes | CSV or Excel file (.csv, .xlsx, .xls) containing categories to import |

**File Format:**
- CSV or Excel (.csv, .xlsx, .xls)
- Required column: `category`
- Optional column: `description`
- Maximum file size: 10MB
- Maximum records: 5,000

**Request Example:**
```http
POST /api/v1/categories/import
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: [binary file data]
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
      "category": "Electronics",
      "error": "Category already exists"
    },
    {
      "row": 7,
      "category": "",
      "error": "Category name is required"
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

### 8. Export Categories

**Endpoint:** `GET /api/v1/categories/export`

**Description:** Export categories to CSV or Excel file.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `format` | string | No | "csv" | Export format: "csv" or "xlsx" |

**Request Example:**
```http
GET /api/v1/categories/export?format=xlsx
Authorization: Bearer <token>
Accept: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
```

**Response:**
- Content-Type: `text/csv` or `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Content-Disposition: `attachment; filename="categories_export_{date}.{extension}"`
- Body: File content

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Export endpoint not found"
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Authentication required or invalid token |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `DUPLICATE_ERROR` | 400 | Category name already exists |
| `BAD_REQUEST` | 400 | Invalid request (e.g., cannot delete category with assets) |
| `INVALID_FILE_FORMAT` | 400 | Invalid file format for import |
| `FILE_TOO_LARGE` | 413 | File size exceeds maximum limit |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## Usage Examples

### Example 1: Create and update category

```javascript
// 1. Create category
const category = await createCategory({
  category: "Electronics",
  description: "Electronic devices"
});

// 2. Update category
await updateCategory(category.data.id, {
  category: "Electronics Updated",
  description: "Updated description"
});
```

### Example 2: Search categories

```javascript
const categories = await getCategories(1, 10, "equipment");
console.log(categories.data);
```

### Example 3: Import categories

```javascript
const file = fileInput.files[0];
const result = await importCategories(file);
console.log(`Imported ${result.importedCount} of ${result.totalRows} categories`);
```

---

## Notes

1. **Category Name Uniqueness:**
   - Category names must be unique
   - Case-insensitive comparison (e.g., "Electronics" and "electronics" are considered duplicates)

2. **Category Deletion:**
   - Categories with assigned assets cannot be deleted
   - Users must reassign or remove assets before deleting a category
   - The `assetCount` field indicates how many assets use the category

3. **Search Functionality:**
   - Search works on category name
   - Search is case-insensitive
   - Partial matches are supported

4. **Pagination:**
   - Default page size is 10
   - Maximum page size is 100
   - Pagination metadata is included in all list responses

5. **Import/Export:**
   - Import supports CSV and Excel formats
   - Export supports CSV and Excel formats
   - Import template should include: `category` (required), `description` (optional)

6. **Default Categories:**
   - System may have default categories pre-created
   - Default categories can be edited but may have restrictions on deletion

7. **Asset Count:**
   - The `assetCount` field shows how many assets are currently assigned to this category
   - This is a read-only field calculated by the backend
   - Categories with assets cannot be deleted

