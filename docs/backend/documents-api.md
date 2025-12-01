# Documents API Documentation

## Overview
This document describes the backend API endpoints required for the Documents Gallery management page (`/tools/documents-gallery`).

## Base URL
```
/api/v1/documents
```

## Authentication
All endpoints require authentication via Bearer token:
```
Authorization: Bearer <token>
```

---

## Data Models

### Document Model
```typescript
interface Document {
  id: number | string;              // Unique identifier
  fileName: string;                  // File name (required)
  description: string;               // Document description (required, max 500 chars)
  fileType: string;                   // File type/MIME type (e.g., "Adobe PDF", "application/pdf")
  fileSize?: number;                  // File size in bytes (optional)
  fileUrl?: string;                   // File URL for download (optional, read-only)
  uploadDate: string;                 // Upload date (ISO 8601 timestamp)
  assetsAttached: number;             // Number of assets attached to this document (read-only)
  inventoryItemsAttached: number;      // Number of inventory items attached (read-only)
  uploadBy: string;                   // Name of user who uploaded (read-only)
  uploadById?: number | string;        // ID of user who uploaded (read-only)
  createdAt?: string;                 // ISO 8601 timestamp
  updatedAt?: string;                 // ISO 8601 timestamp
}
```

### Document Details Model
```typescript
interface DocumentDetails {
  id: number | string;
  fileName: string;
  description: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  uploadDate: string;
  uploadBy: string;
  uploadById: number | string;
  assetsAttached: number;
  inventoryItemsAttached: number;
  attachedAssets?: Array<{              // Optional, included in details view
    id: number | string;
    assetId: string;
    name: string;
  }>;
  attachedInventoryItems?: Array<{      // Optional, included in details view
    id: number | string;
    itemId: string;
    name: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
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

### 1. Get Documents List

**Endpoint:** `GET /api/v1/documents`

**Description:** Retrieve a paginated list of documents with optional search and filtering.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 10 | Records per page (10, 25, 50, 100) |
| `search` | string | No | - | Search query string |
| `searchField` | string | No | "all" | Field to search in: "all", "fileName", "description" |

**Request Example:**
```http
GET /api/v1/documents?page=1&limit=10&search=invoice&searchField=all
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "fileName": "assetdetail_36985319.pdf",
      "description": "Dosing",
      "fileType": "Adobe PDF",
      "fileSize": 245760,
      "fileUrl": "https://example.com/files/assetdetail_36985319.pdf",
      "uploadDate": "2025-11-19T10:30:00Z",
      "assetsAttached": 1,
      "inventoryItemsAttached": 0,
      "uploadBy": "Shivanya DN",
      "uploadById": 1,
      "createdAt": "2025-11-19T10:30:00Z",
      "updatedAt": "2025-11-19T10:30:00Z"
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

// 500 Internal Server Error
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An error occurred while fetching documents"
  }
}
```

---

### 2. Get Single Document

**Endpoint:** `GET /api/v1/documents/:id`

**Description:** Retrieve a single document by ID with full details including attached assets and inventory items.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Document ID |

**Request Example:**
```http
GET /api/v1/documents/1
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "fileName": "assetdetail_36985319.pdf",
    "description": "Dosing",
    "fileType": "Adobe PDF",
    "fileSize": 245760,
    "fileUrl": "https://example.com/files/assetdetail_36985319.pdf",
    "uploadDate": "2025-11-19T10:30:00Z",
    "uploadBy": "Shivanya DN",
    "uploadById": 1,
    "assetsAttached": 1,
    "inventoryItemsAttached": 0,
    "attachedAssets": [
      {
        "id": 1,
        "assetId": "ASSET-001",
        "name": "Laptop Dell XPS 15"
      }
    ],
    "attachedInventoryItems": [],
    "createdAt": "2025-11-19T10:30:00Z",
    "updatedAt": "2025-11-19T10:30:00Z"
  }
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Document with ID 1 not found"
  }
}
```

---

### 3. Upload Document

**Endpoint:** `POST /api/v1/documents`

**Description:** Upload a new document file.

**Request Body:** `multipart/form-data`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | Yes | The document file to upload (PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, JPEG, PNG) |
| `description` | string | Yes | Document description (max 500 chars) |

**Request Example:**
```http
POST /api/v1/documents
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: [binary file data]
description: "Dosing"
```

**Response Example (201 Created):**
```json
{
  "data": {
    "id": 1,
    "fileName": "assetdetail_36985319.pdf",
    "description": "Dosing",
    "fileType": "Adobe PDF",
    "fileSize": 245760,
    "fileUrl": "https://example.com/files/assetdetail_36985319.pdf",
    "uploadDate": "2025-11-19T10:30:00Z",
    "assetsAttached": 0,
    "inventoryItemsAttached": 0,
    "uploadBy": "Shivanya DN",
    "uploadById": 1,
    "createdAt": "2025-11-19T10:30:00Z",
    "updatedAt": "2025-11-19T10:30:00Z"
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
      "file": "File is required",
      "description": "Description is required"
    }
  }
}

// 400 Bad Request - File Type Not Allowed
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "File type not allowed. Allowed types: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, JPEG, PNG"
  }
}

// 413 Payload Too Large
{
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "File size exceeds maximum allowed size (10MB)"
  }
}
```

---

### 4. Update Document

**Endpoint:** `PUT /api/v1/documents/:id`

**Description:** Update document metadata (description only, file cannot be changed).

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Document ID |

**Request Body:**
```json
{
  "description": "Updated description"  // Optional, max 500 chars
}
```

**Request Example:**
```http
PUT /api/v1/documents/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Updated description"
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "fileName": "assetdetail_36985319.pdf",
    "description": "Updated description",
    "fileType": "Adobe PDF",
    "fileSize": 245760,
    "fileUrl": "https://example.com/files/assetdetail_36985319.pdf",
    "uploadDate": "2025-11-19T10:30:00Z",
    "assetsAttached": 1,
    "inventoryItemsAttached": 0,
    "uploadBy": "Shivanya DN",
    "uploadById": 1,
    "createdAt": "2025-11-19T10:30:00Z",
    "updatedAt": "2025-11-19T11:00:00Z"
  }
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Document with ID 1 not found"
  }
}
```

---

### 5. Delete Document

**Endpoint:** `DELETE /api/v1/documents/:id`

**Description:** Delete a document by ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Document ID |

**Request Example:**
```http
DELETE /api/v1/documents/1
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "message": "Document deleted successfully"
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Document with ID 1 not found"
  }
}

// 400 Bad Request - Document has attachments
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Cannot delete document with attached assets or inventory items. Please detach them first."
  }
}
```

---

### 6. Bulk Delete Documents

**Endpoint:** `POST /api/v1/documents/bulk-delete`

**Description:** Delete multiple documents by their IDs.

**Request Body:**
```json
{
  "ids": [1, 2, 3]  // Array of document IDs
}
```

**Request Example:**
```http
POST /api/v1/documents/bulk-delete
Authorization: Bearer <token>
Content-Type: application/json

{
  "ids": [1, 2, 3]
}
```

**Response Example (200 OK):**
```json
{
  "message": "Documents deleted successfully",
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
      "ids": "At least one document ID is required"
    }
  }
}
```

---

### 7. Download Document

**Endpoint:** `GET /api/v1/documents/:id/download`

**Description:** Download the document file.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Document ID |

**Request Example:**
```http
GET /api/v1/documents/1/download
Authorization: Bearer <token>
```

**Response Example (200 OK):**
- Content-Type: `application/octet-stream` or appropriate MIME type
- Content-Disposition: `attachment; filename="assetdetail_36985319.pdf"`
- Body: Binary file data

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Document with ID 1 not found"
  }
}

// 404 Not Found - File not found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "File not found on server"
  }
}
```

---

### 8. Attach Document to Assets

**Endpoint:** `POST /api/v1/documents/:id/attach-assets`

**Description:** Attach a document to one or more assets.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Document ID |

**Request Body:**
```json
{
  "assetIds": [1, 2, 3]  // Array of asset IDs
}
```

**Request Example:**
```http
POST /api/v1/documents/1/attach-assets
Authorization: Bearer <token>
Content-Type: application/json

{
  "assetIds": [1, 2, 3]
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "fileName": "assetdetail_36985319.pdf",
    "description": "Dosing",
    "fileType": "Adobe PDF",
    "assetsAttached": 3,
    "inventoryItemsAttached": 0
  },
  "message": "Successfully attached document to 3 asset(s)"
}
```

---

### 9. Attach Document to Inventory Items

**Endpoint:** `POST /api/v1/documents/:id/attach-inventory-items`

**Description:** Attach a document to one or more inventory items.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Document ID |

**Request Body:**
```json
{
  "itemIds": [1, 2, 3]  // Array of inventory item IDs
}
```

**Request Example:**
```http
POST /api/v1/documents/1/attach-inventory-items
Authorization: Bearer <token>
Content-Type: application/json

{
  "itemIds": [1, 2, 3]
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "fileName": "assetdetail_36985319.pdf",
    "description": "Dosing",
    "fileType": "Adobe PDF",
    "assetsAttached": 1,
    "inventoryItemsAttached": 3
  },
  "message": "Successfully attached document to 3 inventory item(s)"
}
```

---

### 10. Detach Document from Assets

**Endpoint:** `POST /api/v1/documents/:id/detach-assets`

**Description:** Detach a document from one or more assets.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Document ID |

**Request Body:**
```json
{
  "assetIds": [1, 2]  // Array of asset IDs to detach
}
```

**Request Example:**
```http
POST /api/v1/documents/1/detach-assets
Authorization: Bearer <token>
Content-Type: application/json

{
  "assetIds": [1, 2]
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "fileName": "assetdetail_36985319.pdf",
    "assetsAttached": 1,
    "inventoryItemsAttached": 0
  },
  "message": "Successfully detached document from 2 asset(s)"
}
```

---

### 11. Detach Document from Inventory Items

**Endpoint:** `POST /api/v1/documents/:id/detach-inventory-items`

**Description:** Detach a document from one or more inventory items.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Document ID |

**Request Body:**
```json
{
  "itemIds": [1, 2]  // Array of inventory item IDs to detach
}
```

**Request Example:**
```http
POST /api/v1/documents/1/detach-inventory-items
Authorization: Bearer <token>
Content-Type: application/json

{
  "itemIds": [1, 2]
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "fileName": "assetdetail_36985319.pdf",
    "assetsAttached": 1,
    "inventoryItemsAttached": 1
  },
  "message": "Successfully detached document from 2 inventory item(s)"
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Authentication required or invalid token |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `BAD_REQUEST` | 400 | Invalid request (e.g., cannot delete document with attachments) |
| `FILE_TOO_LARGE` | 413 | File size exceeds maximum allowed size |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## Usage Examples

### Example 1: Upload and attach document to assets

```javascript
// 1. Upload document
const document = await uploadDocument({
  file: fileInput.files[0],
  description: "Asset documentation"
});

// 2. Attach to assets
await attachDocumentToAssets(document.data.id, [1, 2, 3]);
```

### Example 2: Search and download documents

```javascript
// 1. Search documents
const documents = await getDocuments(1, 10, "invoice", "all");

// 2. Download a document
const blob = await downloadDocument(documents.data[0].id);
// Create download link and trigger download
```

### Example 3: View document details

```javascript
// Get full document details with attachments
const details = await getDocument(1);
console.log(details.data.attachedAssets);
console.log(details.data.attachedInventoryItems);
```

---

## Notes

1. **File Upload Limits**:
   - Maximum file size: 10MB (configurable)
   - Allowed file types: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, JPEG, PNG
   - File names are sanitized to prevent security issues

2. **File Storage**:
   - Files are stored securely on the server
   - File URLs are provided for direct access (with authentication)
   - Original file names are preserved

3. **Document Attachments**:
   - A document can be attached to multiple assets and inventory items
   - Attachment counts are updated automatically
   - Detaching does not delete the document

4. **Search Functionality**:
   - Search works across file name and description fields
   - Search is case-insensitive
   - Partial matches are supported

5. **Pagination**:
   - Default page size is 10
   - Maximum page size is 100
   - Pagination metadata is included in all list responses

6. **Security**:
   - All file uploads are validated for type and size
   - File access requires authentication
   - Users can only delete documents they uploaded (unless admin)

